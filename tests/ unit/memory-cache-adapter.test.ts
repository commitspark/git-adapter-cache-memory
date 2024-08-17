import { mock } from 'jest-mock-extended'
import { MemoryCacheAdapterOptions, MemoryCacheAdapterService } from '../../src'
import { GitHashValidatorService } from '../../src/git-hash-validator.service'
import {
  Commit,
  CommitDraft,
  Entry,
  GitAdapter,
} from '@commitspark/git-adapter'

describe('MemoryCacheAdapter', () => {
  describe('getContentEntries', () => {
    it('should fail when no adapter options are set', async () => {
      const gitHashValidator = mock<GitHashValidatorService>()

      const cacheAdapter = new MemoryCacheAdapterService(gitHashValidator)
      await expect(() => cacheAdapter.getEntries('abc')).rejects.toThrow()
    })

    it('should fail when argument is not a commit hash', async () => {
      const gitHashValidator = mock<GitHashValidatorService>()
      const childAdapter = mock<GitAdapter>()

      const adapterOptions = { childAdapter } as MemoryCacheAdapterOptions
      const cacheAdapter = new MemoryCacheAdapterService(gitHashValidator)
      await cacheAdapter.setRepositoryOptions(adapterOptions)

      const notAHash = 'notAHash'

      gitHashValidator.hasHashFormat.calledWith(notAHash).mockReturnValue(false)

      await expect(() => cacheAdapter.getEntries(notAHash)).rejects.toThrow()
      expect(gitHashValidator.hasHashFormat).toHaveBeenCalled()
    })

    it('should query child adapter on cache miss', async () => {
      const gitHashValidator = mock<GitHashValidatorService>()
      const childAdapter = mock<GitAdapter>()

      const adapterOptions = { childAdapter } as MemoryCacheAdapterOptions
      const cacheAdapter = new MemoryCacheAdapterService(gitHashValidator)
      await cacheAdapter.setRepositoryOptions(adapterOptions)

      const isAHash = 'abcd'
      const queryResult: Entry[] = [
        { id: '1', data: {}, metadata: { type: 'MyType' } },
      ]

      gitHashValidator.hasHashFormat.calledWith(isAHash).mockReturnValue(true)

      childAdapter.getEntries.calledWith(isAHash).mockResolvedValue(queryResult)

      const result = await cacheAdapter.getEntries(isAHash)

      expect(childAdapter.getEntries).toHaveBeenCalled()
      expect(result).toBe(queryResult)
    })

    it('should query child adapter once on subsequent queries', async () => {
      const gitHashValidator = mock<GitHashValidatorService>()
      const childAdapter = mock<GitAdapter>()

      const adapterOptions = { childAdapter } as MemoryCacheAdapterOptions
      const cacheAdapter = new MemoryCacheAdapterService(gitHashValidator)
      await cacheAdapter.setRepositoryOptions(adapterOptions)

      const isAHash = 'abcd'
      const queryResult: Entry[] = [
        { id: '1', data: {}, metadata: { type: 'MyType' } },
      ]

      gitHashValidator.hasHashFormat.calledWith(isAHash).mockReturnValue(true)

      childAdapter.getEntries.calledWith(isAHash).mockResolvedValue(queryResult)

      const result1 = await cacheAdapter.getEntries(isAHash)
      const result2 = await cacheAdapter.getEntries(isAHash)

      expect(childAdapter.getEntries).toHaveBeenCalledTimes(1)
      expect(result1).toBe(queryResult)
      expect(result2).toBe(queryResult)
    })
  })

  describe('getSchema', () => {
    it('should fail when no adapter options are set', async () => {
      const gitHashValidator = mock<GitHashValidatorService>()

      const cacheAdapter = new MemoryCacheAdapterService(gitHashValidator)
      await expect(() => cacheAdapter.getEntries('abc')).rejects.toThrow()
    })

    it('should fail when argument is not a commit hash', async () => {
      const gitHashValidator = mock<GitHashValidatorService>()
      const childAdapter = mock<GitAdapter>()

      const adapterOptions = { childAdapter } as MemoryCacheAdapterOptions
      const cacheAdapter = new MemoryCacheAdapterService(gitHashValidator)
      await cacheAdapter.setRepositoryOptions(adapterOptions)

      const notAHash = 'notAHash'

      gitHashValidator.hasHashFormat.calledWith(notAHash).mockReturnValue(false)

      await expect(() => cacheAdapter.getSchema(notAHash)).rejects.toThrow()
      expect(gitHashValidator.hasHashFormat).toHaveBeenCalled()
    })

    it('should query child adapter on cache miss', async () => {
      const gitHashValidator = mock<GitHashValidatorService>()
      const childAdapter = mock<GitAdapter>()

      const adapterOptions = { childAdapter } as MemoryCacheAdapterOptions
      const cacheAdapter = new MemoryCacheAdapterService(gitHashValidator)
      await cacheAdapter.setRepositoryOptions(adapterOptions)

      const isAHash = 'abcd'
      const queryResult: string = 'schema'

      gitHashValidator.hasHashFormat.calledWith(isAHash).mockReturnValue(true)

      childAdapter.getSchema.calledWith(isAHash).mockResolvedValue(queryResult)

      const result = await cacheAdapter.getSchema(isAHash)

      expect(childAdapter.getSchema).toHaveBeenCalled()
      expect(result).toBe(queryResult)
    })

    it('should query child adapter once on subsequent queries', async () => {
      const gitHashValidator = mock<GitHashValidatorService>()
      const childAdapter = mock<GitAdapter>()

      const adapterOptions = { childAdapter } as MemoryCacheAdapterOptions
      const cacheAdapter = new MemoryCacheAdapterService(gitHashValidator)
      await cacheAdapter.setRepositoryOptions(adapterOptions)

      const isAHash = 'abcd'
      const queryResult: string = 'schema'

      gitHashValidator.hasHashFormat.calledWith(isAHash).mockReturnValue(true)

      childAdapter.getSchema.calledWith(isAHash).mockResolvedValue(queryResult)

      const result1 = await cacheAdapter.getSchema(isAHash)
      const result2 = await cacheAdapter.getSchema(isAHash)

      expect(childAdapter.getSchema).toHaveBeenCalledTimes(1)
      expect(result1).toBe(queryResult)
      expect(result2).toBe(queryResult)
    })
  })

  describe('getLatestCommitHash', () => {
    it('should fail when no adapter options are set', async () => {
      const gitHashValidator = mock<GitHashValidatorService>()

      const cacheAdapter = new MemoryCacheAdapterService(gitHashValidator)
      await expect(() => cacheAdapter.getEntries('abc')).rejects.toThrow()
    })

    it('should return argument when argument is already a commit hash', async () => {
      const gitHashValidator = mock<GitHashValidatorService>()
      const childAdapter = mock<GitAdapter>()

      const adapterOptions = { childAdapter } as MemoryCacheAdapterOptions
      const cacheAdapter = new MemoryCacheAdapterService(gitHashValidator)
      await cacheAdapter.setRepositoryOptions(adapterOptions)

      const isAHash = 'isAHash'

      gitHashValidator.hasHashFormat.calledWith(isAHash).mockReturnValue(true)

      const result = await cacheAdapter.getLatestCommitHash(isAHash)
      expect(gitHashValidator.hasHashFormat).toHaveBeenCalled()
      expect(childAdapter.getLatestCommitHash).toHaveBeenCalledTimes(0)
      expect(result).toBe(isAHash)
    })

    it('should query the custom hash retrieval function when provided', async () => {
      const gitHashValidator = mock<GitHashValidatorService>()
      const childAdapter = mock<GitAdapter>()

      const myHash = 'myHash'
      const customGetLatestCommitHash = (_: string): Promise<string> => {
        return new Promise((resolve) => {
          resolve(myHash)
        })
      }

      const adapterOptions = {
        childAdapter,
        getLatestCommitHash: customGetLatestCommitHash,
      } as MemoryCacheAdapterOptions

      const cacheAdapter = new MemoryCacheAdapterService(gitHashValidator)
      await cacheAdapter.setRepositoryOptions(adapterOptions)

      gitHashValidator.hasHashFormat.calledWith(myHash).mockReturnValue(false)

      const result = await cacheAdapter.getLatestCommitHash(myHash)

      expect(childAdapter.getLatestCommitHash).toHaveBeenCalledTimes(0)
      expect(result).toBe(myHash)
    })

    it('should query the child adapter when no custom hash retrieval function is provided', async () => {
      const gitHashValidator = mock<GitHashValidatorService>()
      const childAdapter = mock<GitAdapter>()

      const adapterOptions = { childAdapter } as MemoryCacheAdapterOptions
      const cacheAdapter = new MemoryCacheAdapterService(gitHashValidator)
      await cacheAdapter.setRepositoryOptions(adapterOptions)

      const notAHash = 'notAHash'
      const latestHash: string = 'latestHash'

      gitHashValidator.hasHashFormat.calledWith(notAHash).mockReturnValue(false)

      childAdapter.getLatestCommitHash
        .calledWith(notAHash)
        .mockResolvedValue(latestHash)

      const result = await cacheAdapter.getLatestCommitHash(notAHash)

      expect(childAdapter.getLatestCommitHash).toHaveBeenCalledTimes(1)
      expect(result).toBe(latestHash)
    })
  })

  describe('createCommit', () => {
    it('should fail when no adapter options are set', async () => {
      const gitHashValidator = mock<GitHashValidatorService>()

      const cacheAdapter = new MemoryCacheAdapterService(gitHashValidator)
      await expect(() =>
        cacheAdapter.createCommit({
          ref: 'myBranch',
          message: 'My message',
          parentSha: 'parentSha',
          entries: [],
        }),
      ).rejects.toThrow()
    })

    it('should forward calls to the child adapter', async () => {
      const gitHashValidator = mock<GitHashValidatorService>()
      const childAdapter = mock<GitAdapter>()

      const adapterOptions = { childAdapter } as MemoryCacheAdapterOptions
      const cacheAdapter = new MemoryCacheAdapterService(gitHashValidator)
      await cacheAdapter.setRepositoryOptions(adapterOptions)

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

      const result = await cacheAdapter.createCommit(commitDraft)

      expect(result).toBe(commit)
    })
  })
})
