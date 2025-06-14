import { validate, ValidationError, } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { RequestHandler } from 'express';
import ErrorResponse from '../utils/errorResponse';

const validationMiddleware = (
  type: any,
  value: 'body' | 'query' | 'params' = 'body',
  skipMissingProperties = false
): RequestHandler => {
  return async (req, res, next) => {
    try {
      const errors = await validate(
        plainToInstance(type, req[value]),
        {
          skipMissingProperties
        });

      if (errors.length >= 1) {

        const errorContexts = errors.map((item) => {
          return { property: item.property, constraints: item.constraints }
        })

        throw new ErrorResponse(400, JSON.stringify(errorContexts))

      }
      else {
        next()
      }

    } catch (error) {
      next(error)
    }
  };
};

export default validationMiddleware;
