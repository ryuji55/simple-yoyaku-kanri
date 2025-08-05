import * as Joi from 'joi';

export class ValidationService {
  static adminRegistrationSchema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'メールアドレスの形式が正しくありません',
      'any.required': 'メールアドレスは必須です',
    }),
    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/)
      .required()
      .messages({
        'string.min': 'パスワードは8文字以上である必要があります',
        'string.pattern.base':
          'パスワードは大文字、小文字、数字、特殊文字を含む必要があります',
        'any.required': 'パスワードは必須です',
      }),
  });

  static loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'メールアドレスの形式が正しくありません',
      'any.required': 'メールアドレスは必須です',
    }),
    password: Joi.string().required().messages({
      'any.required': 'パスワードは必須です',
    }),
  });

  static validate<T>(schema: Joi.Schema, data: unknown): T {
    const { error, value } = schema.validate(data);
    if (error) {
      throw new Error(error.details[0].message);
    }
    return value as T;
  }
}
