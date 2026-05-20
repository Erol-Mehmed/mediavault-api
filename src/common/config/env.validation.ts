import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),

  JWT_SECRET: Joi.string().required(),
  JWT_ISSUER: Joi.string().required(),
  JWT_AUDIENCE: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('900'),
});
