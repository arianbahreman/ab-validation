# Validation

Lightweight, flexible and typesafe form validator.

## Install

```
npm i ab-validation
```

## Import

```javascript
import { Validation, FormValidation, createValidator } from "ab-validation";
```

## Validation

Validate a single input.

**Parameters:**  
name: string
validators: Validator[]

**Return:**  
{ validate, subscribe }

validate: (value: unknown) => Promise<void | ValidationState>  
subscribe: ((state: ValidationState) => void) => () => void

### Example

```javascript
import { Validation, Required } from "ab-validation";

const name = Validation("name", [Require("Name is required")]);

name
  .validate("")
  .then(() => console.log("valid"))
  .catch((result) => console.log(result));
// { name: "name", error: "required", message: "Name is required" }
```

### Subscribe to a Validation

```javascript
const { validate, subscribe } = Validation("name", [
  Required("Name is required."),
]);

const unsubscribe = subscribe((state) => {
  console.log(state);
});

validate("John").catch(() => {});
unsubscribe();
```

## FormValidation

Validate multiple inputs.

**Parameters:**  
validations: Validation[]

**Return:**  
{ validate, subscribe }

validate: (value: unknown) => Promise<void | FormValidationState>  
subscribe: ((state: FormValidationState) => void) => () => void

### Example

```javascript
import { FormValidation, Validation } from "ab-validation";
import { Required, Email } from "ab-validation/validators";

const form = FormValidation([
  Validation("name", [Required("Please enter the name.")]),
  Validation("email", [
    Required("Please enter the email."),
    Email("Email is incorrect."),
  ]),
]);

form
  .validate({
    name: "John",
    email: "john@gmail",
  })
  .then(() => console.log("valid"))
  .catch((state) => console.log(state.errors));
// [{name: "email", error: "email", message: "Email is incorrect."}]
```

## createValidator

It's a higher order function to create a validator.

createValidator\<OptionsType\>(error, resolver)

**Parameters:**  
error: string
resolver: (value?: unknown, options?: object, fields?: object) => boolean | Promise<void | boolean>

**Return:**  
Validator

## Built-in Validators

| Validator | Description                                                       | Options                                    |
| --------- | ----------------------------------------------------------------- | ------------------------------------------ |
| Required  | Return true if value is not empty.                                | {}                                         |
| Text      | Valid if the text's length is between minimum and maximum length. | { minLength?: number, maxLength?: number } |
| Email     | Check if the value is a valid email address.                      | {}                                         |
| List      | Valid if the list includes the value.                             | { items: unknown[] }                       |
| Pattern   | Matchs RegEx pattern with the value                               | { regex: RegExp }                          |

### Access form fields from resolver

In some cases, you might need to access other values from the form. For example, when validating a password confirmation, you may need to know the value of the password.

```javascript
const ConfirmPassword = createValidator(
  "confirm-password",
  (value, options, fields) => {
    return value === fields?.password;
  }
);
```

### Custom and async Validator

```javascript
import { Validation, createValidator } from "ab-validation";

interface UsernameExistsOptions {}

const UsernameExists =
  createValidator <
  UsernameExistsOptions >
  ("username-exists",
  async (value: string) => {
    const data = await fetch(`api/user/${value}`).then((response) =>
      response.json()
    );

    return !data.user;
  });

const username = Validation("username", [
  UsernameExists("Username already exists."),
]);
username.validate("arian");
```
