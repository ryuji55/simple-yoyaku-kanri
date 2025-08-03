import { ValidationError } from '../../shared/errors/AppError'

export class Password {
  private readonly value: string
  private readonly isHashed: boolean

  constructor(value: string, isHashed: boolean = false) {
    if (!isHashed && !this.isValid(value)) {
      throw new ValidationError('パスワードは6文字以上で入力してください')
    }
    this.value = value
    this.isHashed = isHashed
  }

  private isValid(password: string): boolean {
    return password.length >= 6
  }

  toString(): string {
    return this.value
  }

  equals(other: Password): boolean {
    return this.value === other.value
  }

  static fromHash(hash: string): Password {
    return new Password(hash, true)
  }
}