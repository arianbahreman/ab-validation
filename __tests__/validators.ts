import Email from "../src/validators/email";
import List from "../src/validators/list";
import Pattern from "../src/validators/pattern";
import Required from "../src/validators/required";
import Text from "../src/validators/text";

test("required", () => {
  expect(Required("").resolve("")).toBe(false);
  expect(Required("").resolve("Test")).toBe(true);
});

test("email", () => {
  expect(Email("").resolve("test@test")).toBe(false);
  expect(Email("").resolve("test@test.test")).toBe(true);
});

test("list", () => {
  expect(List("", { items: [1, 2, 3] }).resolve(5)).toBe(false);
  expect(List("", { items: [1, 2, 3] }).resolve(1)).toBe(true);
});

test("pattern", () => {
  expect(Pattern("", { regex: /^hello$/ }).resolve("helloo")).toBe(false);
  expect(Pattern("", { regex: /^hello$/ }).resolve("hello")).toBe(true);
});

test("text", () => {
  expect(Text("", { maxLength: 5 }).resolve("helloooo")).toBe(false);
  expect(Text("", { maxLength: 5 }).resolve("hello")).toBe(true);
});
