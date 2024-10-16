import createValidator from "../create-validator";

interface ListOptions {
  items: unknown[];
}

const List = createValidator<ListOptions>("list", (value, options) => {
  return options ? options?.items.includes(value) : false;
});

export default List;
