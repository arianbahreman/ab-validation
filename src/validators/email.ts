import createValidator from "../create-validator"

const Email = createValidator("email", (value) => {
  return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,20}$/g.test(String(value))
})

export default Email
