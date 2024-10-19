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

const validators = new Set<string>();

const createValidator: CreateValidator = function <T extends object>(
  error: string,
  resolver: (
    value: unknown,
    options?: T,
    fields?: object
  ) => Promise<boolean> | boolean
) {
  if (validators.has(error)) {
    throw new Error(`Validator with error "${error}" already exists.`);
  }

  validators.add(error);

  return function (message: string, options?: T): Validator {
    return {
      error,
      message,
      resolve: (value, fields?) => {
        return resolver(value, options, fields);
      },
    };
  };
};

export default createValidator;
