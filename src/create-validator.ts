type CreateValidatorType = <T>(
  error: string,
  resolver: (value?: unknown, options?: T) => boolean | Promise<void>
) => (
  message: string,
  options?: T
) => {
  error: string
  message: string
  resolve: (value?: unknown) => boolean | Promise<void>
}

const createValidator: CreateValidatorType = function <T>(
  error: string,
  resolver: (value?: unknown, options?: T) => boolean | Promise<void>
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
