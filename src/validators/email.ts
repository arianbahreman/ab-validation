import createValidator from "../create-validator";

const Email = createValidator("email", (value) => {
  return /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim.test(
    String(value)
  );
});

export default Email;
