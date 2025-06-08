import { useState, useMemo, useCallback } from "react";
import Validation from "../validation";
import { FormValidation } from "../index";

type ValidationErrors = Record<string, string>;

export function useFormValidation(validations: ReturnType<typeof Validation>[]) {
  let [status, setStatus] = useState({
    errors: {} as ValidationErrors,
    isPending: false,
    isValid: false,
    isError: false,
  });

  const form = useMemo(() => FormValidation(validations), [validations]);
  const validate = useCallback(
    (fields: Record<string, unknown>) => {
      setStatus({
        errors: {},
        isPending: true,
        isValid: false,
        isError: false,
      });

      form
        .validate(fields)
        .then(() => {
          setStatus({
            errors: {},
            isPending: false,
            isError: false,
            isValid: true,
          });
        })
        .catch((result) => {
          setStatus({
            errors: result.errors,
            isPending: false,
            isError: true,
            isValid: false,
          });
        });
    },
    [form]
  );

  return {
    ...status,
    validate,
  };
}
