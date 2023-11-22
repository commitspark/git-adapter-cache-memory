export class GitHashValidatorService {
  public hasHashFormat(ref: string): boolean {
    return new RegExp('^[a-fA-F0-9]{40}$').test(ref)
  }
}
