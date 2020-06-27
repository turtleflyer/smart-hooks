# smart-hooks

Collection of React hooks that supplements a set of standard hooks of React library extending their
logic.

- ### [useInterstate](https://github.com/turtleflyer/smart-hooks/blob/master/packages/smart-hooks/use-interstate#readme)

  <img src='./packages/smart-hooks/use-interstate/use-interstate.png' height='100px'
  alt='useInterstate' />

`useInterstate` is a simple, lightweight, and powerful global state management solution for React
projects designed to stick as close as possible to a natural usage pattern found in the standard
hook [`useState`](https://reactjs.org/docs/hooks-reference.html#usestate). It is minimalistic and
does not require too much to start using. No special boilerplates. No big learning curve. The hook
`useInterstate` is just working familiarly out-of-box. Also, it should work in the upcoming
[concurrent mode](https://reactjs.org/docs/concurrent-mode-intro.html) as we can judge assuming from
information that is available now and based on our tries with the experimental build of React.

The library is written in TypeScript and nicely typed. The test coverage is solid and embraces
various complex use cases. More than that, its name sounds cool.

- ### [useSmartRef](https://github.com/turtleflyer/smart-hooks/blob/master/packages/smart-hooks/use-smart-ref#readme)

`useSmartRef` attaches a callback to the event when the element is creating inside the component.
This callback returns a clean-up function having a chance to fire up when the component gets rid of
the element, or the entire component loses its existence.

- ### [useSmartMemo](https://github.com/turtleflyer/smart-hooks/blob/master/packages/smart-hooks/use-smart-memo#readme)

There is a temptation to use the standard React hook `useMemo` not only for the sake of performance
optimization. But in the official documentation, it says clearly: [**You may rely on `useMemo` as a
performance optimization, not as a semantic
guarantee**](https://reactjs.org/docs/hooks-reference.html#usememo). `useSmartMemo` is for the
control over the execution of some part of code skipping it if values passed to a dependencies list
do not change.
