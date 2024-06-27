export type ValidatorResolver<T> = (
  value: any,
  options?: T
) => boolean | Promise<void | boolean>

export type ValidatorSchema = {
  error: string
  message: string
  resolve: ValidatorResolver<object>
}

type CreateValidatorType = <T>(
  error: string,
  resolver: ValidatorResolver<T>
) => (
  message: string,
  options?: T
) => {
  error: string
  message: string
  resolve: ValidatorResolver<T>
}

const createValidator: CreateValidatorType = function <T>(
  error: string,
  resolver: ValidatorResolver<T>
) {
  return function (message: string, options?: T) {
    return {
      error,
      message,
      resolve: (value) => resolver(value, options),
    }
  }
}

export default createValidator
