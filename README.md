# Validation

Lightweight, flexible and typesafe form validator.

## Install

```
npm i ab-validation
```

## Import

```javascript
import { Validation, FormValidation, createValidator } from "ab-validation"
```

## Usage: Validate a single input

```javascript
import { Validation, Required } from "ab-validation"

const name = Validation("name", [Require("Name is required")])

name
  .validate("John")
  .then(() => console.log("Valid"))
  .catch((result) => console.log(result))
// { name: "name", error: "required", message: "Name is required" }
```

## Usage: Validate a form

```javascript
import { FormValidation, Validation, Required, Email } from "ab-validation"

const form = FormValidation([
  Validation("name", [Required("Please enter the name.")]),
  Validation("email", [
    Required("Please enter the email."),
    Email("Email is incorrect."),
  ]),
])

form
  .validate({
    name: "John",
    email: "john@gmail",
  })
  .then(() => console.log("Valid"))
  .catch((result) => console.log(result))
// [{name: "email", error: "pattern", message: "Email is incorrect."}]
```

## Usage: Subscribe to a validation

```javascript
const { validate, subscribe } = Validation("name", [
  Required("Name is required."),
])

const unsubscribe = subscribe((state) => {
  console.log(state)
})

validate("John")
unsubscribe()
```

## Async validator

```javascript
import { Validation, createValidator } from "ab-validation"

const CheckUsername = createValidator()

const { validate } = Validation("username", [Required("Name is required.")])

const unsubscribe = subscribe((state) => {
  console.log(state)
})

validate("John")
unsubscribe()
```
