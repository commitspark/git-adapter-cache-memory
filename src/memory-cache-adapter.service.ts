import {
  Commit,
  CommitDraft,
  Entry,
  GitAdapter,
} from '@commitspark/git-adapter'
import { MemoryCacheAdapterOptions } from './index'
import { GitHashValidatorService } from './git-hash-validator.service'

export class MemoryCacheAdapterService implements GitAdapter {
  private gitRepositoryOptions: MemoryCacheAdapterOptions | undefined
  private entryCache: Record<string, EntryCacheRecord> = {}
  private schemaCache: Record<string, SchemaCacheRecord> = {}

  constructor(private gitHashValidator: GitHashValidatorService) {}

  public async setRepositoryOptions(
    repositoryOptions: MemoryCacheAdapterOptions,
  ): Promise<void> {
    this.gitRepositoryOptions = repositoryOptions
  }

  public async getEntries(commitHash: string): Promise<Entry[]> {
    if (this.gitRepositoryOptions === undefined) {
      throw new Error('Repository options must be set before reading')
    }

    if (!this.gitHashValidator.hasHashFormat(commitHash)) {
      throw new Error(
        `Only commit hashes must be used for querying but "${commitHash}" does not look like a commit hash`,
      )
    }

    const cachedSha = this.entryCache[commitHash] ?? undefined
    if (cachedSha) {
      return cachedSha.entries
    }

    const entries =
      await this.gitRepositoryOptions.childAdapter.getEntries(commitHash)

    this.entryCache[commitHash] = {
      entries: entries,
    }

    return entries
  }

  public async getSchema(commitHash: string): Promise<string> {
    if (this.gitRepositoryOptions === undefined) {
      throw new Error('Repository options must be set before reading')
    }

    if (!this.gitHashValidator.hasHashFormat(commitHash)) {
      throw new Error(
        `Only commit hashes must be used for querying but "${commitHash}" does not look like a commit hash`,
      )
    }

    const cachedSha = this.schemaCache[commitHash] ?? undefined
    if (cachedSha) {
      return cachedSha.schema
    }

    const schema =
      await this.gitRepositoryOptions.childAdapter.getSchema(commitHash)

    this.schemaCache[commitHash] = {
      schema: schema,
    }

    return schema
  }

  public async getLatestCommitHash(ref: string): Promise<string> {
    if (this.gitRepositoryOptions === undefined) {
      throw new Error('Repository options must be set before reading')
    }

    if (this.gitHashValidator.hasHashFormat(ref)) {
      return ref
    }

    if (this.gitRepositoryOptions.getLatestCommitHash !== undefined) {
      return this.gitRepositoryOptions.getLatestCommitHash(ref)
    }

    return this.gitRepositoryOptions.childAdapter.getLatestCommitHash(ref)
  }

  public async createCommit(commitDraft: CommitDraft): Promise<Commit> {
    if (this.gitRepositoryOptions === undefined) {
      throw new Error('Repository options must be set before committing')
    }

    return this.gitRepositoryOptions.childAdapter.createCommit(commitDraft)
  }
}

interface EntryCacheRecord {
  entries: Entry[]
}

interface SchemaCacheRecord {
  schema: string
}
