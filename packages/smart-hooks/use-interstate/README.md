# useInterstate

> ---
>
> _NEW._ We added an [enhanced interface](#enhanced-interface) allowing to obtain a setter along
> with the value of the state in the easiest way.
>
> The [support of TypeScript](#typescript-and-managing-complicated-state-structures) in the library
> is strong.
>
> ---

[![use-interstate](use-interstate.png)](#useinterstate)

`useInterstate` is a simple, lightweight, and powerful global state management solution for React
projects designed to stick as close as possible to a natural usage pattern found in the standard
hook [`useState`](https://reactjs.org/docs/hooks-reference.html#usestate). It is minimalistic and
does not require too much to start using. No special boilerplates. No big learning curve. The hook
`useInterstate` is just working familiarly out-of-box. Also, it should work in the upcoming
[concurrent mode](https://reactjs.org/docs/concurrent-mode-intro.html) as we can judge assuming from
information available now and based on our tries with the experimental build of React.

The library is written in TypeScript and nicely typed. The test coverage is solid and embraces
various complex use cases. More than that, its name sounds cool.

## Install

```bash
npm install @smart-hooks/use-interstate --save
```

## Usage

There area two call interfaces for `useInterstate`.

### `useInterstate(key, initValue)`

The first one is very close to the interface by which the standard React hook `useState` is managing
the state.

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

You must keep in mind two notable differences from `useState`.

1. It needs to give a unique key to handle the state related to that key. It must be a `number`,
   `string`, or `symbol`. Of course, we guarantee that a mutable value linked to the key that
   constitutes the part of the global state will be the same in any part of an application at the
   same moment. The returned method provides the way how to pass changes to the global state. And
   any components that have subscribed to the pair key and value will be aware of the changes
   transmitted to the global state related to this key virtually with no delay.

2. One more step is needed to subscribe to the state. Just compare:

   ```js
   const [state, setState] = useState(initValue);
   ```

   and

   ```js
   const [useSubscribe, setState] = useInterstate(key, initValue);
   const state = useSubscribe();
   ```

   `useInterstate` will not give a stored value just after calling the hook. Instead, it returns
   another hook that, being called, for its part returns a requested value of the state. The
   returned subscription function is considered a standard hook, so it must obey [the rules of
   hooks](https://reactjs.org/docs/hooks-rules.html) from the very moment of birth. It may not be in
   a conditional clause, for example. Exactly this hook will listen to state changes and trigger
   re-rendering the component when the change occurs. Indeed, we broke up the subscribing process
   onto two separate steps because we aimed to create a tool that has a number of words in the
   vocabulary as small as possible but still gets a choice to opt-in subscribing on demand.
   Otherwise, as performing a subscription to the state in a body of a React component has its own
   performance cost you would get forced to assume it whenever using the hook even if the only thing
   you need is to have a setter to manipulate the state not listening to it.

   The default value passed to the hook can be a function. It will run only once, and its return
   will provide an actual initialization value. If the specific key has been initialized earlier in
   a different part of the application the provided init value will be ignored as it is for the
   further calls in the same component after each re-rendering. (It is how standard `useState`
   behaves.)

### `useInterstate({key1: initValue1, key2: initValue2})`

The second call interface is similar to what is using in our other hook
[`useMultiState`](https://github.com/turtleflyer/smart-hooks/blob/master/packages/smart-hooks/use-multi-state#readme).
And as in the case of `useMultiState`, this call interface replaces multiple uses of the hook in one
component.

```jsx
function Component1() {
  const [, setState] = useInterstate({
    color: 'blue',
    theme: { textSize: 'medium', hyphenations: true },
    density: 100,
  });

  return <ControlComponent {...setState} />;
}

function Component2() {
  const [useSubscribe] = useInterstate({
    color: 'blue',
    theme: { textSize: 'medium', hyphenations: true },
    density: 100,
  });
  const state = useSubscribe();

  return <DisplayComponent {...state} />;
}
```

Notable differences with `useMultiState`:

- The properties' names are global and corresponding to the global state keys.

- `useInterstate` does not return the object with the values of the state in its relevant
  properties. Instead, it returns a hook whose call provides such an object. It means you need one
  more step to subscribe as it was described for [the first call
  interface](#useinterstatekey-initvalue).

  Effectively, instead of the construction:

  ```js
  const [useSubscribeToKey1, setStateForKey1] = useInterstate(key1, initValue1);
  const state1 = useSubscribeToKey1();

  const [useSubscribeToKey2, setStateForKey2] = useInterstate(key2, initValue1);
  const state2 = useSubscribeToKey1();
  ```

  you can write:

  ```js
  const [useSubscribe, { key1: setStateForKey1, key2: setStateForKey2 }] = useInterstate({
    key1: initValue1,
    key2: initValue2,
  });
  const { key1: state1, key2: state2 } = useSubscribe();
  ```

If you need to have setters for one set of keys and subscribe to another one, it is better to use
the hook twice with different init objects aiming performance optimization.

```js
const [, state] = useInterstate({
  key1: initValue1,
  key2: initValue2,
});
const [useSubscribe] = useInterstate({
  key2: initValue2,
  key3: initValue3,
  key4: initValue4,
});
const state = useSubscribe();
```

### Enhanced interface

We add an enhanced interface allowing us to obtain a setter along with the value of the state in the
easiest way. It adds methods `get`, `set`, and `both` to the returned value. Let us take a look at
different scenarios.

If we only need to have a function to update the sate:

```js
const [, setState] = useInterstate('size', 9);
```

It is equivalent to the following:

```js
const setState = useInterstate('size', 9).set();
```

Now we want to subscribe to changes in the state (that will cause re-rendering the component):

```js
const [useSubscribe] = useInterstate('size', 9);
const state = useSubscribe();
```

That is the same as:

```js
const state = useInterstate('size', 9).get();
```

Both:

```js
const [useSubscribe, setState] = useInterstate('size', 9);
const state = useSubscribe();
```

Now write it in a compacter way:

```js
const [state, setState] = useInterstate('size', 9).both();
```

It also works with [the multi-state call interface](#useinterstatekey1-initvalue1-key2-initvalue2).

## Important notes

There are some limitations to using `useInterstate` that, when being broken, may lead to errors.
Also, some advanced use cases may add power and resilience to your code.

- One of the powerful abilities of useInterstate is that it can resubscribe to different keys of the
  global state dynamically.

  ```js
  const [useSubscribeReceivedKey] = useInterstate({ passKey: 'city', initVForReceivedKey: 'NY' });
  const received = useSubscribeReceivedKey();
  // Subscribe to a pair key and default value for the second useInterstate. If they change the
  // second hook will dynamically resubscribe to a new key.

  const [useSubscribe, setState] = useInterstate(received.passKey, received.initVForReceivedKey);
  ```

  Every time a key value that is passed to `useInterstate` changes the hook goes back to the stage
  where it sees whether the record for the new key has not been initialized, so `useInterstate`
  tries to initialize the record using a provided argument. After that, you become subscribed to the
  new key of the state and can manipulate it.

  It is true for [the first call interface](#useinterstatekey-initvalue). When you pass a
  multi-state object for the first time the hook will memoize it and use it throughout the life of
  the component regardless you change it later. If you switch from one interface to another it will
  cause an error.

- Before accessing the value of a particular key of the state it must be initialized with a provided
  default value.

  ```js
  const [useSubscribe, setState] = useInterstate('name');
  // A default value is not provided in the hook and other parts of the code for this key

  const state = useSubscribe();
  // Accessing to the state, but it was not initialized, so an error occurs
  ```

  ```js
  setState('Vincent van Gogh');
  // Calling setState is reckoned as access to the state, so still error
  ```

- It is not possible to initialize the key by omitting the default value or explicitly passing
  `undefined`. If you need to have the default value being `undefined`, then passing a function
  returning `undefined` as an init argument is required. If you omit any default value or pass
  `undefined`, it will mean skipping the initializing step.

  ```js
  const [useSubscribe, setState] = useInterstate('color', () => undefined);
  // Initializing the state of a key with undefined value

  const [useSubscribe, setState] = useInterstate('color');
  // Skip initializing
  ```

- If you need to initialize the key with a function value, you pass a function returning the desired
  function.

  ```js
  const [useSubscribe, setState] = useInterstate('getLink', () => () => {
    // ...
  });
  // Initializing with a function value
  ```

- You might run into trouble if you try to initialize a key giving differing default values in
  various parts of the application concurrently.

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

- If a state for a key has already been initialized, a default value passed to `useInterstate` will
  be ignored.

- If you try to change the value of the same key in different parts of the application at the same
  moment it will lead to an error.

  ```js
  setState(1);
  setState(2);
  // If they are called both, it will throw an error
  ```

- A setter function returned by `useInterstate` will not change during the component life and always
  has a stable identity similar to the standard hook
  [`useState`](https://reactjs.org/docs/hooks-reference.html#usestate).

## Scope

The notable distinction of `useInterstate` comparing with other global state management solutions is
it does not require wrapping the whole tree into a specific context provider component. The library
is working with no additional requirements. It is especially important when you prototyping as you
do not need to get interrupted by annoying duties to make specific time-consuming prerequisites.
Unique keys are in use broadly within the boundaries of the entire application with the same values
for any given key right after the first component with `useInterstate` taking this key as an
argument has been rendered. But what if we want to use the identical keys in different parts of the
code in isolation? The library provides a special wrapping component `Scope`. It cuts a branch of
components tree giving it a separate space where you have an isolated state. It is useful when you
need to make a reusable component driven by `useInterstate` state management. You have to wrap the
component with the `Scope` tag, otherwise, multiple instances of this component in the common
components tree will interfere with each other sharing the same state.

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

if (isUseInterstateError(error)) {
  // ...
})
```

To clean up after an error occurred you call `getUseInterstateErrorsHandleMethods` receiving a
method `flushValueOfKey`. It removes inconsistency in the records linked to a key where the error
occurred. The method accepts a boolean flag that orders to revert a value of the key to an old state
if it is `true`.

```js
import { getUseInterstateErrorsHandleMethods } from '@smart-hooks/use-interstate';

// ...

const methods = getUseInterstateErrorsHandleMethods(error);

if (methods && methods.flushValueOfKey) {
  methods.flushValueOfKey(true);
}
```

## Security remarks

When you use third-party components there is a risk that they may have unrestricted access to the
state of the entire application being able to use the same keys names. The state management provided
by `useInterstate` could be isolated from ancestors in the components tree structure by
[`Scope`](#scope). But it is annoying to wrap every imported component in `Scope` to prevent its
access to the app state.

There are two approaches to avoid this scenario:

1. You can use unique `Symbols` as keys in your state structure.

2. There is an alternative way to import `useInterstate` that will guarantee a separate space for
   the entire application restricting access from outer components.

   ```js
   // useInterstate.js
   import { getUseInterstate } from '@smart-hooks/use-interstate';

   const { Scope, useInterstate } = getUseInterstate();

   export { Scope, useInterstate };
   ```

   ```js
   import { Scope, useInterstate } from './useInterstate.js';
   ```

   Just remember to use the same instances of the hook and `Scope` component across the entire app.

## Typescript and managing complicated state structures

When using `useInterstate` as a JavaScript function it feels much handier in situations where a
developer wants a rapid simple solution. Drafting and prototyping are such examples. But when it
comes to a need for managing a complicated various state structure `useInterstate` becomes weak and
not so useful. JavaScript developer must trace every key name and its relation to the meaning of the
particular state record on their own. It is a significant limitation of using this hook in big
projects.

The good news is we have cared about the capabilities of `useInterstate` to put its powerful
potential and resilience into projects of any grade of sophistication. And it is with no sacrifice
in terms of simplicity of use. Everything you need is to provide a state interface to
get`UseInterstate` within the framework of Typescript. On its return, you will have a
`useInterstate` hook that remembers the interface so you will never get lost.

```ts
interface State {
  activeUser: UserRecord;
  permissions: string[];
  premiumStatus: boolean;
  cart: CartState;
}

const { useInterstate } = getUseInterstate<State>();

const [useSubscribe01] = useInterstate('activeUser', undefined);
const activeUser01 = useSubscribe01(); // UserRecord

declare const rememberActiveUser: UserRecord;
const [useSubscribe02] = useInterstate('activeUser', rememberActiveUser);
const activeUser02 = useSubscribe02(); // UserRecord

const [useSubscribe03] = useInterstate<'permissions' | 'premiumStatus'>('permissions', undefined);
const activeUser03 = useSubscribe03(); // boolean | string[]

const [useSubscribe04] = useInterstate({ activeUser: undefined, cart: undefined });
const activeUser04 = useSubscribe04();
// { readonly activeUser: UserRecord; readonly cart: CartState }

const [useSubscribe05] = useInterstate('activeUser', 'John Doe');
// Error: "activeUser" property is not a string

const [useSubscribe06] = useInterstate({ activeUser: 'John Doe', cart: undefined });
// Error: "activeUser" property is not a string

const [useSubscribe07] = useInterstate({ premiumStatus: true, subscriptionDate: undefined });
// Error: "subscriptionDate" property is missing in State interface

const [useSubscribe08] = useInterstate('gender', 'female');
// Error: "gender" property is missing in State interface
```

It is also fine to use `getUseInterstate` without providing a state interface. In this case, it is
the responsibility of a developer to maintain the soundness of data types.

```ts
const { useInterstate } = getUseInterstate();

const [useSubscribe01] = useInterstate('activeUser', undefined);
const activeUser01 = useSubscribe01(); // unknown

declare const rememberActiveUser: UserRecord;
const [useSubscribe02] = useInterstate('activeUser', rememberActiveUser);
const activeUser02 = useSubscribe02(); // UserRecord

const [useSubscribe03] = useInterstate<UserRecord>('activeUser', 'John Doe'); // Error

const [useSubscribe04] = useInterstate<string[]>('permissions', undefined);
const activeUser04 = useSubscribe04(); // string[]

const [useSubscribe05] = useInterstate<{ activeUser: UserRecord; cart: CartState }>({
  activeUser: undefined,
  cart: undefined,
});
const activeUser05 = useSubscribe05();
// { readonly activeUser: UserRecord; readonly cart: CartState }

const [useSubscribe06] = useInterstate<{ activeUser: UserRecord; cart: CartState }>({
  activeUser: 'John Doe',
  cart: undefined,
});
// Error: activeUser is not a string
```
