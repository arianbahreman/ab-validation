import createValidator from "../create-validator";

interface TextOptions {
  minLength?: number;
  maxLength?: number;
}

const Text = createValidator<TextOptions>("text", (value, options) => {
  const text = String(value);
  return (
    text.length >= (options?.minLength ?? 0) &&
    text.length <= (options?.maxLength ?? Number.MAX_SAFE_INTEGER)
  );
});

export default Text;
