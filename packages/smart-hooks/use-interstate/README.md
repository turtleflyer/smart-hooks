# useInterstate

![use-interstate](use-interstate.png)

`useInterstate` is a simple, lightweight, and powerful global state management solution for React
projects designed to stick as close as possible to a natural usage pattern found in the standard
hook [`useState`](https://reactjs.org/docs/hooks-reference.html#usestate). It is minimalistic and
does not require too much to start using. No special boilerplates. No big learning curve. The hook
`useInterstate` is just working familiarly out-of-box. Also, it should work in the upcoming
[concurrent mode](https://reactjs.org/docs/concurrent-mode-intro.html) as we can judge assuming from
information that is available now and based on our tries with the experimental build of React.

The library was written in TypeScript and nicely typed. The test coverage is solid and embraces
various real-life use cases. More than that, its name sounds cool.

## Install

```bash
npm install @smart-hooks/use-interstate --save
```

## Usage

```jsx
import React from 'react';
import { useInterstate } from '@smart-hooks/use-interstate';

const STATE_KEY = 'STATE_KEY';

const Component1 = () => {
  const [useSubscribe, setInterstate] = useInterstate(STATE_KEY, '');
  const state = useSubscribe();

  return (
    <form>
      <label>
        Type a text:
        <input type="text" value={state} onChange={(e) => setInterstate(e.target.value)} />
      </label>
    </form>
  );
};

const Component2 = () => {
  const [useSubscribe] = useInterstate(STATE_KEY);
  const state = useSubscribe();

  return <p>Here is what you are typing: {state}</p>;
};

const InterstateExample = () => (
  <>
    <Component1 />
    <Component2 />
  </>
);
```

As was said, the use of `useInterstate` is very close to the interface by which the standard React
hook `useState` is managing the state. There are two notable differences, though. The first thing is
that to handle a particular state needs to provide a unique key coupled with that state. It must be
a `number`, `string`, or `symbol`. Of course, we guarantee that a mutable value linked to the key
will be the same in any part of an application at the same moment. The way how to pass changes to
the global state will be provided. And any components that have subscribed to the pair key and value
will be aware of the changes transmitted to the global state regarding this key virtually with no
delay. The second, one more step is needed to subscribe to the state. Just compare:

```js
const [state, setState] = useState(initValue);
```

and

```js
const [useSubscribe, setState] = useInterstate(KEY, initValue);
const state = useSubscribe();
```

`useInterstate` is not giving a value just after calling the hook. Instead, it returns a new hook
that, being called, for its part returns an actual value of the state. It is because subscribing to
updates in the state has its own performance cost and it is not doing automatically. Let us take a
look at different scenarios. If we only need to have a way to update the sate:

```js
const [, setState] = useInterstate('size', 9);
```

Now we just want to mirror changes in the state (that will cause rerendering the component):

```js
const [useSubscribe] = useInterstate('size', 9);
const state = useSubscribe();
```

Both:

```js
const [useSubscribe, setState] = useInterstate('size', 9);
const state = useSubscribe();
```

The default value passed to the hook can be a function. In this case the state of the key will be
initialized by the value returned from this function that is running only once.

## Important notes

There are some limitations to using `useInterstate` that, when being broken, may lead to errors. The
first thing worth mentioning is that before accessing the value of a particular key of the state it
must be initialized with a provided default value.

```js
const [useSubscribe, setState] = useInterstate('name');
// A default value is not provided in the hook and in other parts of the code for this key

const state = useSubscribe();
// Accessing to the state, but it was not initialized, so an error is caused
```

```js
setState('Vincent van Gogh');
// Calling setState is reckoned as an access to the state
```

It is not possible to initialize the key by omitting the default value or explicitly passing
`undefined`. If you need the default value to be `undefined`, then passing a function returning
`undefined` as a default statement is required. If you omit any default value or pass `undefined`,
it will mean skipping the initializing step in that part of the code.

```js
const [useSubscribe, setState] = useInterstate('color', () => undefined);
// Initializing the state of key with undefined value

const [useSubscribe, setState] = useInterstate('color');
// Skipping the initializing
```

If you need to initialize the key with a function value, you pass a function returning the desired
function.

```js
const [useSubscribe, setState] = useInterstate('getLink', () => () => {
  // ...
});
// Initializing the state of key by function value
```

You might run into trouble if you try to initialize the particular key giving differing default
values in various parts of the application concurrently.

```js
useInterstate('pitch', 'C');

// ...

useInterstate('pitch', 'D');
// If you initialize concurrently in another part of the code with a different default value,
// it causes an error
```

```js
useInterstate('pitch', 'A');

// ...

useInterstate('pitch', 'A');
// It's Ok
```

If a state for a key has already been initialized, a default value passed to `useInterstate` is
being ignored in any following statements.

If you try to change the value of the same key in different parts of the application at the same
moment it will lead to an error.

```js
setState(1);
setState(2);
// If they are called both it will throw an error
```

A setter returned by `useInterstate` itself is not changing in the course of the component life as
it is for the standard hook [`useState`](https://reactjs.org/docs/hooks-reference.html#usestate).
The hook that allows us to subscribe to the key's state and that we received as a result of
`useInterstate` execution must be handled following [the common hooks
rules](https://reactjs.org/docs/hooks-rules.html).

## Scope

The notable distinction of `useInterstate` is it does not require wrapping the whole tree into a
specific context provider component. The library is working with no additional requirements. Unique
keys are using broadly within the borders of the entire application with identical values for any
given key. But what if you want to use the equivalent keys in different parts of the code in
isolation? The library provides a special wrapping component `Scope`. It slices a branch of
components tree giving it a separate space where an isolated state takes a place. It is useful when
you need to make a reusable component driven by the `useInterstate` state management. You have to
wrap the component with the `Scope` tag, unless, multiple instances of this component will interfere
with each other sharing the same state.

```jsx
import { Scope } from '@smart-hooks/use-interstate';

const Component = () => (
  <Scope>
    <ComponentWitUseInterstate />
  </Scope>
);
```

## Error handling

If you plan using Error Boundaries (and you should), you have two functions handy. To determine
whether an error occurs from the misuse `useInterstate`, there is a function `isUseInterstateError`.

```js
import { isUseInterstateError } from '@smart-hooks/use-interstate';

// ...

if (isUseInterstateError(e)) {
  // ...
})

```

To clean up after an error occurred you use `getUseInterstateErrorsHandleMethods` receiving a method
`flushValueOfKey`. It removes inconsistency in the records linked to a key where the error had a
place. The method accepts a boolean flag that orders to revert a value of the key to an old state if
it is `true`.

```js
import { getUseInterstateErrorsHandleMethods } from '@smart-hooks/use-interstate';

// ...

const methods = getUseInterstateErrorsHandleMethods(e);

if (methods) {
  methods.flushValueOfKey(true);
}
```

## Security remarks

The state management provided by `useInterstate` could be isolated only from ancestors in the
component tree structure (by `Scope`). That means if you use third-party components there is a risk
that they may have unrestricted access to the state of the entire application being able to use the
same keys names. The recommended way to avoid it is by using `symbols` as keys.
