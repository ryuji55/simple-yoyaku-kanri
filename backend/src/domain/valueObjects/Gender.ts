import { ValidationError } from '../../shared/errors/AppError'

export type GenderValue = 'male' | 'female' | 'other'

export class Gender {
  private readonly value: GenderValue

  constructor(value: string) {
    if (!this.isValid(value)) {
      throw new ValidationError('無効な性別です')
    }
    this.value = value as GenderValue
  }

  private isValid(gender: string): boolean {
    return ['male', 'female', 'other'].includes(gender)
  }

  toString(): string {
    return this.value
  }

  equals(other: Gender): boolean {
    return this.value === other.value
  }
}