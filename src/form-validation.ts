import Validation from "./validation"

export default function FormValidation(
  validations: ReturnType<typeof Validation>[]
) {
  const validationsMap = new Map()

  for (const validation of validations) {
    validationsMap.set(validation.name, validation)
  }

  const validate = (inputs: { [key: string]: unknown }) => {
    return new Promise<void>((reselove, reject) => {
      const fields = []
      const errors: { name: string; errors: [] }[] = []

      for (const name in inputs) {
        const validation = validationsMap.get(name)
        fields.push(validation.validate(inputs[name]))
      }

      Promise.allSettled(fields).then((result) => {
        result.forEach((field) => {
          if (field.status === "rejected") {
            errors.push(field.reason)
          }
        })

        errors.length > 0 ? reject(errors) : reselove()
      })
    })
  }

  return { validate }
}
