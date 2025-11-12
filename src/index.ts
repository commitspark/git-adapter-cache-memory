import {
  GitAdapter,
  Entry,
  Commit,
  CommitDraft,
} from '@commitspark/git-adapter'
import {
  createCommit,
  EntryCacheRecord,
  getEntries,
  getLatestCommitHash,
  getSchema,
  SchemaCacheRecord,
} from './memory-cache-adapter'

export interface MemoryCacheAdapterOptions {
  childAdapter: GitAdapter
  getLatestCommitHash?: (ref: string) => Promise<string>
}

export function createAdapter(options: MemoryCacheAdapterOptions): GitAdapter {
  const entryCache: Record<string, EntryCacheRecord> = {}
  const schemaCache: Record<string, SchemaCacheRecord> = {}

  return {
    async getEntries(commitHash: string): Promise<Entry[]> {
      return getEntries(options, entryCache, commitHash)
    },

    async getSchema(commitHash: string): Promise<string> {
      return getSchema(options, schemaCache, commitHash)
    },

    async getLatestCommitHash(ref: string): Promise<string> {
      return getLatestCommitHash(options, ref)
    },

    async createCommit(commitDraft: CommitDraft): Promise<Commit> {
      return createCommit(options, commitDraft)
    },
  }
}
