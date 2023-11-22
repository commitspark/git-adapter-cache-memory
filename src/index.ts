import { GitAdapter, GitRepositoryOptions } from '@commitspark/git-adapter'
import { memoryCacheAdapterService } from './container'

export { MemoryCacheAdapterService } from './memory-cache-adapter.service'

export interface MemoryCacheAdapterOptions extends GitRepositoryOptions {
  childAdapter: GitAdapter
  getLatestCommitHash?: (ref: string) => Promise<string>
}

export function createAdapter(): GitAdapter {
  return memoryCacheAdapterService
}
