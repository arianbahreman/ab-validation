import Validation from "./validation"

export default function FormValidation(
  validations: ReturnType<typeof Validation>[]
) {
  const subscribers: CallableFunction[] = []
  const validationsMap = new Map()

  for (const validation of validations) {
    validationsMap.set(validation.name, validation)
  }

  const validate = (inputs: { [key: string]: unknown }) => {
    return new Promise<void | boolean>((reselove, reject) => {
      const fields = []
      const errors: { name: string; errors: [] }[] = []

      for (const name in inputs) {
        const validation = validationsMap.get(name)
        validation && fields.push(validation.validate(inputs[name]))
      }

      Promise.allSettled(fields)
        .then((result) => {
          result.forEach((field) => {
            if (field.status === "rejected") {
              errors.push(field.reason)
            }
          })

          const valid = errors.length === 0

          subscribers.forEach((subscriber) =>
            valid
              ? subscriber({ valid: true })
              : subscriber({ valid: false, errors })
          )

          valid ? reselove() : reject(errors)
        })
        .catch(() => {})
    })
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

  return { validate, subscribe }
}
