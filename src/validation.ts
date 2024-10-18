import subscription from "ab-subscription";
import type { Validator } from "./create-validator";

/**
 * Creates a validation object for a field.
 *
 * @param name - The field name.
 * @param validators - An array of validators, each with `error`, `message`, and a `resolve` function.
 * @returns An object
 */
export default function Validation(name: string, validators: Validator[]) {
  const { subscribe, dispatch } = subscription();
  /**
   * Validates a given value against a list of validators.
   *
   * Each validator has an `error`, a `message`, and a `resolve` method.
   * The `resolve` method may return either a boolean (synchronous validation)
   * or a Promise<boolean> (asynchronous validation).
   *
   * The method maps through the validators and creates a Promise for each,
   * which resolves when the validation passes or rejects with the status
   * (including the `name`, `error`, and `message`) if validation fails.
   *
   * @param value - The value to be validated. Can be of any type.
   * @returns A Promise that resolves if all validators pass, or rejects if
   *          any validator fails. Rejection includes an object with the
   *          `name`, `error`, and `message` from the failing validator.
   */
  const validate = (value: unknown, fields?: object) => {
    const resolved = validators.map(
      (validator) =>
        new Promise<void>((resolve, reject) => {
          const result = validator.resolve(value, fields);
          const response = {
            name,
            error: validator.error,
            message: validator.message,
          };

          /**
           * Result might be a Promise returned by an async resolver
           */
          if (result instanceof Promise) {
            result.then(() => resolve()).catch(() => reject(response));
            /**
             * Sync result should be a boolean
             */
          } else {
            result ? resolve() : reject(response);
          }
        })
    );

    return new Promise<void>((resolve, reject) => {
      Promise.all(resolved)
        .then(() => {
          dispatch({ status: "valid" });
          resolve();
        })
        .catch((response) => {
          const state = { status: "invalid", ...response };
          dispatch(state);
          reject(state);
        });
    });
  };

  return { name, validate, subscribe };
}
