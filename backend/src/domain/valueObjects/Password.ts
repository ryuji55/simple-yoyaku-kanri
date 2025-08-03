import { ValidationError } from '../../shared/errors/AppError'

export class Password {
  private readonly value: string

  constructor(value: string) {
    if (!this.isValid(value)) {
      throw new ValidationError('パスワードは6文字以上で入力してください')
    }
    this.value = value
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
}