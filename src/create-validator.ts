export type Validator = {
  error: string;
  message: string;
  resolve: (value: unknown, fields?: Record<string, unknown>) => Promise<boolean> | boolean;
};

type CreateValidator = <T extends object>(
  error: string,
  resolver: (
    value: unknown,
    options?: T,
    fields?: Record<string, unknown>
  ) => Promise<boolean> | boolean
) => (message: string, options?: T) => Validator;

const validators = new Set<string>();

const createValidator: CreateValidator = <T extends object>(
  error: string,
  resolver: (
    value: unknown,
    options?: T,
    fields?: Record<string, unknown>
  ) => Promise<boolean> | boolean
) => {
  if (validators.has(error)) {
    throw new Error(`Validator with error "${error}" already exists.`);
  }

  validators.add(error);

  return (message: string, options?: T): Validator => ({
    error,
    message,
    resolve: (value, fields) => resolver(value, options, fields),
  });
};

export default createValidator;
