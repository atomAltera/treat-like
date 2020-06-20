

# treat-like

Simple, flexible and types safe framework for validation, sanitization and transformation of JavaScript values.



## Primary features

- Zero dependencies
- Works in browser and NodeJS environments
- TypeScript support and complete types inference
- Support of scalar values, objects, arrays and tuples



## Installation

**Using npm** `npm install treat-like`
**Using yarn** `yarn install treat-like`



## Introduction



### Defining basic validation chains

`treat-like` package is very minimalistic so it provides only essential building blocks an leaves it up to you to define event simple validation chains.

So, let's define two basic chains to work with strings:

```typescript
import {string, check, byDefault} from "treat-like";

const requiredString = string.pipe(check(s => s.length > 0, "required"));
const optionalString = byDefault("").pipe(string);
```

Why not to predefine this chains in package? Well, we think that in different cases the term "required string" can mean different things. Some time you may need a _required string_ be a non zero length JavaScipt string object. Some times you need to avoid null/undefined values and zero length string is perfectly fine for you.

The same reasoning can be applied to "optional strings": if `x` is defined as _optional string_, will _null_ be ok value to pass? Or I always need to pass `typeof x === "string"` values but it can be zero length?

In current example `requiredString` var contains a chain that is built from predefined `string` chain which checks incoming value is _typeof_ string and returns error otherwice. Then it followed by step built with stepbuilding `check` function which accepts predicate and error value and returns a new chain.

`optionalString` in current example starts from `byDefault` chain, this is a function that takes a value (called default value) and returns such chain that takes an input value and if it is `null` or `undefined` returns _default value_ and stops chain execution. Otherwise it returns prestine input value and chain continues execution to next step. The next step is `string` that as we already know checks input value is typeof string.



Ok. Now we can use these chains like regular funcitons. Pass value to it and thee return value will indicate validation status.

```typescript
console.log(requiredString("Hello")); // {ok: true, stop: false, output: "Hello"}
console.log(requiredString("")); // {ok: false, stop: true, error: "required"}
console.log(requiredString(null)); // {ok: false, stop: true, error: "not_a_string"}
console.log(requiredString(123)); // {ok: false, stop: true, error: "not_a_string"}

console.log(optionalString("World")); // {ok: true, stop: false, output: "World"}
console.log(optionalString("")); // {ok: true, stop: false, output: ""}
console.log(optionalString(null)); // {ok: true, stop: true, output: ""}
console.log(optionalString(123)); // {ok: false, stop: true, error: "not_a_string"}
```



### Talking about results

There are three validations of result object that is returnd from chain:



#### `ContinueResult`

Indicates that chain processed input value successfully and output value is stored in _output_ field. Also this type means that output value can be passed to next step in chain.

```typescript
export interface ContinueResult<CO> {
    ok: true;
    stop: false;
    output: CO;
    error: undefined;
}
```
This is a most common used result type.



#### `StopResult`

indicates that chain processed input value successfully and output value is stored in _output_ field but execution but be halted and not continue to next chain.

```typescript
export interface StopResult<SO> {
    ok: true;
    stop: true;
    output: SO;
    error: undefined;
}
```
This return type can be returned by already known `byDefault` step which wraps a default value in it. Look at example:

```typescript
import {string, check, byDefault} from "treat-like";

function isPhoneValid(phone: string): boolean {
	// Do some validaiton here
}

const checkPhone = check(isPhoneValid, "invalid_format")

const optioinalPhone = byDefault("-").pipe(string).pipe(checkPhone);

optioinalPhone("444 222 444") // {ok: true, stop: false, output: "444 222 444"}
optioinalPhone(null) // {ok: true, stop: true, output: "-"}
optioinalPhone("123 432") // {ok: false, stop: true, error: "invalid_format"}
```
As you can see, the second call to _optioinalPhone_ returns a `StopResult` than indicates that chain execution have to be stopped.



#### `ErrorResult`

Indicates that some error happened during chain execution. This result does not countain output value, instead it contains error.

```typescript
export interface ErrorResult<E> {
    ok: false;
    stop: true;
    output: undefined;
    error: E;
}
```



#### United `Result`

All this three types are united to single `Result` type.

```typescript
type Result<CO, SO = never, E = never> = ContinueResult<CO> | StopResult<SO> | ErrorResult<E>;
```



## Defining chain using other validating libraries

`treat-like` perfectly comatible with other validating libraries. Let use a very popular https://www.npmjs.com/package/validator as examle and create a email validating chain:

```typescript
import {check, string} from "treat-like";
import v from "validator";

const email = string.pipe(check(v.isEmail, "not_a_email"));

console.log(email("atomaltera@gmail.com")) // {ok: true, stop: false, output: 'atomaltera@gmail.com' }
console.log(email("atomaltera")) // { ok: false, stop: true, error: 'not_a_email' }
console.log(email("")) // { ok: false, stop: true, error: 'not_a_email' }
console.log(email(null)) // { ok: false, stop: true, error: 'not_a_string' }
console.log(email(123)) // { ok: false, stop: true, error: 'not_a_string' }

```



## Validating objects

You can use `shape` functino to create an object validation chain from a sheme:

```typescript
import {check, string, byDefault, shape} from "treat-like";
import v from "validator";

function isStrongPassword(pass: string): boolean {
    // some logic to validate password strength
    return pass.length >= 8;
}

const requiredString = string.pipe(check(s => s.length > 0, "required"));
const optionalString = byDefault("").pipe(string);
const requiredEmail = string.pipe(check(v.isEmail, "not_a_email"))
const strongPassword = string.pipe(check(isStrongPassword, "to_simple"));
const optionalPhone = optionalString.pipe(check(v.isMobilePhone, "invalid_format"))

const registrationForm = shape({
    email: requiredEmail,
    password: strongPassword,
    fullName: optionalString,
    phone: optionalPhone,
})
```

Here we define some `isStrongPassword` function to validate password strenght. Also here as an optional phone number validator.

Let's look at validation results:

For valid input the result is of type `ContinueResult`:

```typescript
const vr = registrationForm({
    email: "atomaltera@gmail.com",
    password: "aqu6aopah7Voo8sa",
    fullName: "Konstantin Alikhanov",
    phone: "123 456 789"
})

console.log(vr);
// {
//   ok: true,
//   stop: false,
//   output: {
//     email: 'atomaltera@gmail.com',
//     password: 'aqu6aopah7Voo8sa',
//     fullName: 'Konstantin Alikhanov',
//     phone: '123 456 789'
//   },
//   error: undefined
// }
```

Let's check what happens with invalid phone number and to simple password:

```typescript
const vr = registrationForm({
    email: "atomaltera@gmail.com",
    password: "1234",
    fullName: "Konstantin Alikhanov",
    phone: "123"
})

console.log(vr);
// {
//   ok: false,
//   stop: true,
//   output: undefined,
//   error: { password: 'to_simple', phone: 'invalid_format' }
// }
```



## Validating arrays

There is an array chain builder to work with arrays:

```typescript
import {check, string, array} from "treat-like";
import v from "validator";

const phone = string.pipe(check(v.isMobilePhone, "invalid_format"))

const phoneNumberList = array(phone.pipe(check(x => x.length > 0, "no_phones_provided"));
```

Let's see results

```typescript
console.log(phoneNumberList(["123 456 789"])) // valid
// { ok: true, stop: false, output: [ '123 456 789' ], error: undefined }

console.log(phoneNumberList(["123 456 789", "987 654 321"])) // valid
// {
//   ok: true,
//   stop: false,
//   output: [ '123 456 789', '987 654 321' ],
//   error: undefined
// }

console.log(phoneNumberList(["123 456 789", "123"])) // second phone is invalid
// {
//   ok: false,
//   stop: true,
//   output: undefined,
//   error: [ undefined, 'invalid_format' ]
// }

console.log(phoneNumberList([])) // invalid: empty array
// {
//   ok: false,
//   stop: true,
//   output: undefined,
//   error: 'no_phones_provided'
// }
```

As you can see here, _error_ field can be a `string` or an array of `string | undefiend`

If you ommit part `.pipe(check(x => x.length > 0, "no_phones_provided"));` then error type will be an array of `string | undefiend`:

```typescript
import {check, string, array} from "treat-like";
import v from "validator";

const phone = string.pipe(check(v.isMobilePhone, "invalid_format"))

const phoneNumberList = array(phone)

console.log(phoneNumberList([]))
// { ok: true, stop: false, output: [], error: undefined }
```



## Validating tuples

Tuples validation is supported too. Use `tuple` funciton to build tuple processing chain:

```typescript
import {check, string, tuple} from "treat-like";
import v from "validator";

const phone = string.pipe(check(v.isMobilePhone, "invalid_phone"));
const email = string.pipe(check(v.isEmail, "invalid_email"));

const phoneEmailTuple = tuple(phone, email);
```



Here is how results look like:

```typescript
console.log(phoneEmailTuple(["123 456 789", "atomaltera@gmail.com"])) // valid
// {
//   ok: true,
//   stop: false,
//   output: [ '123 456 789', 'atomaltera@gmail.com' ],
//   error: undefined
// }

console.log(phoneEmailTuple(["123", "atomaltera@gmail.com"])) // invalid phone
// {
//   ok: false,
//   stop: true,
//   output: undefined,
//   error: [ 'invalid_phone', undefined ]
// }

console.log(phoneEmailTuple(["123 456 789", "atomaltera"])) // invalid email
// {
//   ok: false,
//   stop: true,
//   output: undefined,
//   error: [ undefined, 'invalid_email' ]
// }

console.log(phoneEmailTuple(["123 456 789"])) // too short tuple
// {
//   ok: false,
//   stop: true,
//   output: undefined,
//   error: 'invalid_array_length'
// }

console.log(phoneEmailTuple(["123 456 789", "atomaltera@gmail.com", 123])) // extra value in tuple
// {
//   ok: false,
//   stop: true,
//   output: undefined,
//   error: 'invalid_array_length'
// }
```



## Complex shape chains

Ofcource you can combine all chains together in any fashion you need (I'll ommit imports and definitions here as well as results):

```typescript
const complexModel = shape({
    name: requiredString,
    description: optionalText,
    subModels: array(shape({
        point: tuple(number, number),
        active: byDefault(true).pipe(boolean),
    }))
})
```

`number` and `boolean` are provided by `treat-like` just like a `string`



## Linking styles

You can join three steps (say `A`, `B` and `C`) to chain by folloing styles:

### Flat style

```javascript
chain1 = A.pipe(B).pipe(C)
```

### Nested style

```javascript
chain2 = A.pipe(B.pipe(C))
```

The final chains would be the same.



## In plans

- promises  support
