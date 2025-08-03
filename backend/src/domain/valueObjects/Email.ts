import { ValidationError } from '../../shared/errors/AppError'

export class Email {
  private readonly value: string

  constructor(value: string) {
    if (!this.isValid(value)) {
      throw new ValidationError('無効なメールアドレス形式です')
    }
    this.value = value.toLowerCase()
  }

  private isValid(email: string): boolean {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
    return emailRegex.test(email)
  }

  toString(): string {
    return this.value
  }

  equals(other: Email): boolean {
    return this.value === other.value
  }
}