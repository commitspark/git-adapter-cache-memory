import { MemoryCacheAdapterService } from './memory-cache-adapter.service'
import { GitHashValidatorService } from './git-hash-validator.service'

const gitHashValidatorService = new GitHashValidatorService()
export const memoryCacheAdapterService = new MemoryCacheAdapterService(
  gitHashValidatorService,
)
