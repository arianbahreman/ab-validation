import subscription from "ab-subscription";
import Validation from "./validation";

/**
 * Creates a form validation object.
 *
 * @param validations - An array of validation objects for each field.
 * @returns An object with a `validate` method that checks all fields.
 */
export default function FormValidation(validations: ReturnType<typeof Validation>[]) {
  const form = new Map<string, ReturnType<typeof Validation>>();
  const { subscribe, dispatch } = subscription();

  for (const validation of validations) {
    form.set(validation.name, validation);
  }

  /**
   * Validates the provided fields against the corresponding form validations.
   *
   * Each field in the `fields` object is validated using its associated
   * validation object (which contains validators). If the field has no
   * associated validation, it is skipped.
   *
   * The method collects promises from the `validate` method of each validation,
   * resolving them all together to determine whether the form is valid.
   *
   * @param fields - An object containing field names as keys and their values as properties.
   *                 The keys should match the names of the validations.
   *
   * @returns A Promise that resolves if all fields pass their validations,
   *          or rejects with an array of errors (name, error, and message for each failed field).
   */
  const validate = (fields: { [key: string]: unknown }) => {
    const resolved: any = [];
    const errors: Array<{ name: string; errors: [] }> = [];

    for (const name in fields) {
      const validation = form.get(name);
      validation && resolved.push(validation.validate(fields[name], fields));
    }

    /**
     * Waits for all validation promises to settle.
     *
     * - `Promise.allSettled` ensures that all promises are accounted for, regardless of
     *   whether they resolve or reject.
     * - Once all promises have settled, the results are processed to see if there are any errors.
     *
     * If any field's validation fails (i.e., the promise is rejected), it collects the error
     * information (including `name`, `error`, and `message`) and pushes it into the `errors` array.
     *
     * Finally, if no errors are found, the validation resolves, otherwise it rejects with the
     * collected errors.
     */
    const promise = new Promise<void>((resolve, reject) => {
      Promise.allSettled(resolved).then((result) => {
        result.forEach((field) => field.status === "rejected" && errors.push(field.reason));

        if (errors.length === 0) {
          dispatch({ status: "valid" });
          resolve();
        } else {
          const state = { status: "invalid", errors };
          dispatch(state);
          reject(state);
        }
      });
    });
    promise.catch(() => {});

    return promise;
  };

  return { validate, subscribe };
}
