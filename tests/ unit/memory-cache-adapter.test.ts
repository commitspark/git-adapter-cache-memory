import { mock } from 'jest-mock-extended'
import { createAdapter, MemoryCacheAdapterOptions } from '../../src'
import { hasHashFormat } from '../../src/git-hash-validator'
import {
  Commit,
  CommitDraft,
  Entry,
  GitAdapter,
} from '@commitspark/git-adapter'

jest.mock('../../src/git-hash-validator', () => ({
  hasHashFormat: jest.fn(),
}))

const mockedHasHashFormat = hasHashFormat as jest.MockedFunction<
  typeof hasHashFormat
>

describe('MemoryCacheAdapter', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })
  const makeAdapter = (childAdapter?: GitAdapter) => {
    const adapterOptions = {
      childAdapter: childAdapter ?? mock<GitAdapter>(),
    } as MemoryCacheAdapterOptions
    return createAdapter(adapterOptions)
  }

  describe('getContentEntries', () => {
    it('should fail when argument is not a commit hash', async () => {
      const adapter = makeAdapter()

      const notAHash = 'notAHash'

      mockedHasHashFormat.mockReturnValue(false)

      await expect(() => adapter.getEntries(notAHash)).rejects.toThrow()
      expect(mockedHasHashFormat).toHaveBeenCalled()
    })

    it('should query child adapter on cache miss', async () => {
      const childAdapter = mock<GitAdapter>()
      const adapter = makeAdapter(childAdapter)

      const isAHash = 'abcd'
      const queryResult: Entry[] = [
        { id: '1', data: {}, metadata: { type: 'MyType' } },
      ]

      mockedHasHashFormat.mockReturnValue(true)
      childAdapter.getEntries.calledWith(isAHash).mockResolvedValue(queryResult)

      const result = await adapter.getEntries(isAHash)

      expect(childAdapter.getEntries).toHaveBeenCalled()
      expect(result).toBe(queryResult)
    })

    it('should query child adapter once on subsequent queries', async () => {
      const childAdapter = mock<GitAdapter>()
      const adapter = makeAdapter(childAdapter)

      const isAHash = 'abcd'
      const queryResult: Entry[] = [
        { id: '1', data: {}, metadata: { type: 'MyType' } },
      ]

      mockedHasHashFormat.mockReturnValue(true)
      childAdapter.getEntries.calledWith(isAHash).mockResolvedValue(queryResult)

      const result1 = await adapter.getEntries(isAHash)
      const result2 = await adapter.getEntries(isAHash)

      expect(childAdapter.getEntries).toHaveBeenCalledTimes(1)
      expect(result1).toBe(queryResult)
      expect(result2).toBe(queryResult)
    })
  })

  describe('getSchema', () => {
    it('should fail when argument is not a commit hash', async () => {
      const childAdapter = mock<GitAdapter>()
      const adapter = makeAdapter(childAdapter)

      const notAHash = 'notAHash'
      mockedHasHashFormat.mockReturnValue(false)

      await expect(() => adapter.getSchema(notAHash)).rejects.toThrow()
      expect(mockedHasHashFormat).toHaveBeenCalled()
    })

    it('should query child adapter on cache miss', async () => {
      const childAdapter = mock<GitAdapter>()
      const adapter = makeAdapter(childAdapter)

      const isAHash = 'abcd'
      const queryResult: string = 'schema'

      mockedHasHashFormat.mockReturnValue(true)
      childAdapter.getSchema.calledWith(isAHash).mockResolvedValue(queryResult)

      const result = await adapter.getSchema(isAHash)

      expect(childAdapter.getSchema).toHaveBeenCalled()
      expect(result).toBe(queryResult)
    })

    it('should query child adapter once on subsequent queries', async () => {
      const childAdapter = mock<GitAdapter>()
      const adapter = makeAdapter(childAdapter)

      const isAHash = 'abcd'
      const queryResult: string = 'schema'

      mockedHasHashFormat.mockReturnValue(true)
      childAdapter.getSchema.calledWith(isAHash).mockResolvedValue(queryResult)

      const result1 = await adapter.getSchema(isAHash)
      const result2 = await adapter.getSchema(isAHash)

      expect(childAdapter.getSchema).toHaveBeenCalledTimes(1)
      expect(result1).toBe(queryResult)
      expect(result2).toBe(queryResult)
    })
  })

  describe('getLatestCommitHash', () => {
    it('should return argument when argument is already a commit hash', async () => {
      const childAdapter = mock<GitAdapter>()
      const adapter = makeAdapter(childAdapter)

      const isAHash = 'isAHash'
      mockedHasHashFormat.mockReturnValue(true)

      const result = await adapter.getLatestCommitHash(isAHash)
      expect(mockedHasHashFormat).toHaveBeenCalled()
      expect(childAdapter.getLatestCommitHash).toHaveBeenCalledTimes(0)
      expect(result).toBe(isAHash)
    })

    it('should query the custom hash retrieval function when provided', async () => {
      const childAdapter = mock<GitAdapter>()
      const myHash = 'myHash'

      const customGetLatestCommitHash = jest.fn().mockResolvedValue(myHash)

      const adapter = createAdapter({
        childAdapter,
        getLatestCommitHash: customGetLatestCommitHash,
      })

      mockedHasHashFormat.mockReturnValue(false)

      const result = await adapter.getLatestCommitHash(myHash)

      expect(childAdapter.getLatestCommitHash).toHaveBeenCalledTimes(0)
      expect(result).toBe(myHash)
    })

    it('should query the child adapter when no custom hash retrieval function is provided', async () => {
      const childAdapter = mock<GitAdapter>()
      const adapter = makeAdapter(childAdapter)

      const notAHash = 'notAHash'
      const latestHash: string = 'latestHash'

      mockedHasHashFormat.mockReturnValue(false)

      childAdapter.getLatestCommitHash
        .calledWith(notAHash)
        .mockResolvedValue(latestHash)

      const result = await adapter.getLatestCommitHash(notAHash)

      expect(childAdapter.getLatestCommitHash).toHaveBeenCalledTimes(1)
      expect(result).toBe(latestHash)
    })
  })

  describe('createCommit', () => {
    it('should forward calls to the child adapter', async () => {
      const childAdapter = mock<GitAdapter>()
      const adapter = makeAdapter(childAdapter)

      const commitDraft: CommitDraft = {
        ref: 'myBranch',
        message: 'My message',
        parentSha: 'parentSha',
        entries: [],
      }
      const commit: Commit = {
        ref: 'newSha',
      }

      childAdapter.createCommit
        .calledWith(commitDraft)
        .mockResolvedValue(commit)

      const result = await adapter.createCommit(commitDraft)

      expect(result).toBe(commit)
    })
  })
})
