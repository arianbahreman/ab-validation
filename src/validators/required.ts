import createValidator from "../create-validator";

const Required = createValidator("required", (value) => {
  return value !== "";
});

export default Required;
