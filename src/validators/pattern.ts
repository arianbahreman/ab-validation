import createValidator from "../create-validator";

interface PatternOptions {
  regex: RegExp;
}

const Pattern = createValidator<PatternOptions>("pattern", (value, options) => {
  return options ? options.regex.test(String(value)) : false;
});

export default Pattern;
