# treat-like

This package allows you to validate and sanitize JSON.

## Simple example

First you need to declare scheme:

```
import {treat, lowercased, gte, sanitize} from 'treat-like';

const string = treat<string>();

const userSchema = {
    username:  string.as(lowercased).mu(gt(4), 'Must be at least 4 symbols long'),
    name:  {
        first: string,
        last: string,
    }
}
```


Then you can validate some data:

```
const input = JSON.parse(getInput());

sanitize(userSchema, input)
    .then(report => {
        if (report.ok) {
            console.log('User is valid, fields:', report.values);
        } else {
            console.log('User has errors:', report.errors);
        }
    })
```