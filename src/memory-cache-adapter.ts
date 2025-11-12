import { Commit, CommitDraft, Entry } from '@commitspark/git-adapter'
import { MemoryCacheAdapterOptions } from './index'
import { hasHashFormat } from './git-hash-validator'

export interface EntryCacheRecord {
  entries: Entry[]
}

export interface SchemaCacheRecord {
  schema: string
}

export async function getEntries(
  repositoryOptions: MemoryCacheAdapterOptions,
  entryCache: Record<string, { entries: Entry[] }>,
  commitHash: string,
): Promise<Entry[]> {
  if (!hasHashFormat(commitHash)) {
    throw new Error(
      `Only commit hashes must be used for querying but "${commitHash}" does not look like a commit hash`,
    )
  }

  const cached = entryCache[commitHash] ?? undefined
  if (cached) {
    return cached.entries
  }

  const entries = await repositoryOptions.childAdapter.getEntries(commitHash)
  entryCache[commitHash] = { entries }
  return entries
}

export async function getSchema(
  repositoryOptions: MemoryCacheAdapterOptions,
  schemaCache: Record<string, { schema: string }>,
  commitHash: string,
): Promise<string> {
  if (!hasHashFormat(commitHash)) {
    throw new Error(
      `Only commit hashes must be used for querying but "${commitHash}" does not look like a commit hash`,
    )
  }

  const cached = schemaCache[commitHash] ?? undefined
  if (cached) {
    return cached.schema
  }

  const schema = await repositoryOptions.childAdapter.getSchema(commitHash)
  schemaCache[commitHash] = { schema }
  return schema
}

export async function getLatestCommitHash(
  repositoryOptions: MemoryCacheAdapterOptions,
  ref: string,
): Promise<string> {
  if (hasHashFormat(ref)) {
    return ref
  }

  if (repositoryOptions.getLatestCommitHash !== undefined) {
    return repositoryOptions.getLatestCommitHash(ref)
  }

  return repositoryOptions.childAdapter.getLatestCommitHash(ref)
}

export async function createCommit(
  repositoryOptions: MemoryCacheAdapterOptions,
  commitDraft: CommitDraft,
): Promise<Commit> {
  return repositoryOptions.childAdapter.createCommit(commitDraft)
}
