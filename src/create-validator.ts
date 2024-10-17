export type Validator = {
  error: string;
  message: string;
  resolve: (value: unknown, fields?: object) => Promise<boolean> | boolean;
};

type CreateValidator = <T extends object>(
  error: string,
  resolver: (
    value: unknown,
    options?: T,
    fields?: object
  ) => Promise<boolean> | boolean
) => (message: string, options?: T) => Validator;

const createValidator: CreateValidator = function (error, resolver) {
  return function (message, options?) {
    return {
      error,
      message,
      resolve: (value, fields?) => resolver(value, options, fields),
    };
  };
};

export default createValidator;
