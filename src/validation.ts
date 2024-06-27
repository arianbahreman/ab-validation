import { ValidatorSchema } from "./create-validator"

export default function Validation(
  name: string,
  validators: ValidatorSchema[]
) {
  const subscribers: CallableFunction[] = []

  /**
   * Validate
   */
  const validate = (value: unknown) => {
    const resolved = validators.map(
      (validator: ValidatorSchema) =>
        new Promise<void>(async (resolve, reject) => {
          const valid = validator.resolve(value)
          const state = {
            name,
            error: validator.error,
            message: validator.message,
          }
          if (valid instanceof Promise) {
            valid.then(() => resolve()).catch(() => reject(state))
          } else {
            valid ? resolve() : reject(state)
          }
        })
    )

    return new Promise<{ name: string; errors?: [] } | void>(
      (resolve, reject) => {
        Promise.all(resolved)
          .then(() => {
            subscribers.forEach((subscriber) => subscriber({ valid: true }))
            resolve()
          })
          .catch((state) => {
            subscribers.forEach((subscriber) =>
              subscriber({ valid: false, ...state })
            )
            reject(state)
          })
      }
    )
  }

  /**
   * Subscribe
   */
  const subscribe = (callback: (result: any) => void) => {
    subscribers.push(callback)
    return function unsubscribe() {
      const index = subscribers.indexOf(callback)
      if (index !== -1) {
        subscribers.splice(index, 1)
      }
    }
  }

  return { name, validate, subscribe }
}
