import { hasHashFormat } from '../../src/git-hash-validator'

describe('GitHashValidator', () => {
  it('should return true for a valid lowercase Git commit hash', () => {
    const hash = '530e15fdc5f0275f593b6df19054a0cc0e1a5ad3'
    expect(hasHashFormat(hash)).toBe(true)
  })

  it('should return true for a valid uppercase Git commit hash', () => {
    const hash = '530E15FDC5F0275F593B6DF19054A0CC0E1A5AD3'
    expect(hasHashFormat(hash)).toBe(true)
  })

  it('should return false for an empty string', () => {
    const hash = ''
    expect(hasHashFormat(hash)).toBe(false)
  })

  it('should return false for a string of less than 40 characters', () => {
    const hash = '4da27ca5dc8469f19b1524a5dd381aad76f96c6'
    expect(hasHashFormat(hash)).toBe(false)
  })

  it('should return false for a string of more than 40 characters', () => {
    const hash = '4da27ca5dc8469f19b1524a5dd381aad76f96c690'
    expect(hasHashFormat(hash)).toBe(false)
  })

  it('should return false for a string that contains non-hexadecimal characters', () => {
    const hash = '4da27ca5dc8469f19b1524a5dd381aad76f96c6g'
    expect(hasHashFormat(hash)).toBe(false)
  })
})
