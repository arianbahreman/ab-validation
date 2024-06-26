import { ValidatorResolver } from "./validation"

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
      resolve: (value?: unknown) => resolver(value, options),
    }
  }
}

export default createValidator
