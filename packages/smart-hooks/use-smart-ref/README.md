# useSmartRef

A `ref` attribute of a DOM element inside a React component gives a familiar way to get aware of
when the element is being created and provide control over it. The attribute may receive a special
object ([`RefObject`](https://reactjs.org/docs/hooks-reference.html#useref)) as a value whose
purpose is to keep the node reference in its mutable `current` property starting from the moment the
DOM element has been created. Besides, the `ref` attribute may also contain [_callback
ref_](https://reactjs.org/docs/refs-and-the-dom.html#callback-refs), which is a callback that runs
when the DOM element has become a part of the structure of the component. The standard hook
[`useRef`](https://reactjs.org/docs/hooks-reference.html#useref) provides creating such a holder
object that survives after every render of the component, so its `current` member can carry a
reference to the element consistently while it is staying mounted in the DOM tree. Alongside using
_callback ref_ coupled with other hooks, `useRef` allows managing many use cases regarding DOM
elements inside the component. But the hook itself does not provide the common universal approach to
that managing.

How can we have control over phases of creating a new DOM element inside a component? We can view
them as events or specific life cycles (

1. The DOM element has been created and attached to the inner DOM structure of the component.
2. The element has been removed from it).

It would help a lot if we could attach a callback to the event when the element is creating inside
the component and a clean-up callback having a chance to fire up when the component gets rid of the
element, or the entire component loses its existence.

That is where `useSmartRef` comes in.

## Install

```bash
npm install @smart-hooks/use-smart-ref --save
```

## Usage

```jsx
import React, { useRef } from 'react';
import { useSmartRef } from '@smart-hooks/use-smart-ref';

function Component() {
  refRecord = useRef();

  callbackRef = useSmartRef((el) => {
    // The code will get invoked at the moment when the DOM element gets ready

    return () => {
      // Clean-up routine
    };
  }, refRecord);

  return <div ref={callbackRef}>{/* ... */}</div>;
}
```

`callbackRef` is a _callback ref_ passed to an attribute `ref` of a target DOM element. It gets
received from the hook `useSmartRef`. The first argument of the hook is a function that runs at the
time when the DOM element has been created and attached to the parent component. It optionally
returns another function that has a clean-up role and runs once the element has got removed or the
whole component has been unmounted. It is pretty the same scheme that we are familiar with using the
standard hook `useEffect`. The second argument in `useSmartRef` is optional. It is a `RefObject`
created by the hook `useRef`. So it will keep a reference to the corresponding DOM element in its
`current` property as if we directly pass it to the `ref` attribute of the element.

## Digging Deep

In the case of using a state or props of a component as a selector determining what jsx element to
activate, it is possible to attach the same emitted _callback ref_ to each alternative. Whenever an
element has been substituted with another one, a clean-up procedure runs first, and the callback
gets invoked, having the reference to the newly activated element as an argument, memoizing a new
clean-up callback prepared for the next switch or complete component removal.

```jsx
function TestUseSmartRef({ choice }) {
  callbackRef = useSmartRef((el) => {
    // ...
  });

  return choice === 0 ? (
    <div ref={callbackRef}>{/* ... */}</div>
  ) : (
    <img ref={callbackRef} src={imageSource}>
      {/* ... */}
    </img>
  );
}
```

The callback passed to `useSmartRef` is being memoized on every state or props change with new
values of variables from the outer scope. And meanwhile, the returned _callback ref_ itself is not
changing in the course of the life of the component.
