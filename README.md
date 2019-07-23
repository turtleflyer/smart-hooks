# smart-hooks
Collections of React hooks that fill some gaps in the
originally provided set of hooks extending or improving
their logic.

### Why?
The Hooks presented in React is a big step forward in the
evolution of the library. The standard set of hooks allows
you to design components of any degree of complexity.
Moreover, combining the logic of standard hooks, it became
possible to create custom hooks that complement the basic
features of React. And this logic is now reusable, as before
the React components have been reusable. Some React hooks
partially overlap the same functions. For example, `useRef`,
`useMemo`, and `useCallback` basically imply the duty of
preserving the data that you want them to survive the
components lifecycles. At the same time, there is a lack of
tools that solve the problem of taming mutable variables
such as refs in elements of components. Such non-obvious
situations as, for example, described in the
[article](https://medium.com/@teh_builder/ref-objects-inside-useeffect-hooks-eb7c15198780).
The solutions of many of them require fitting to specific
conditions, boilerplates are very often needed. The library
of hooks ***smart-hooks*** is conceived and is designed to
fill such gaps.

### Hooks

* [useSmartRef](https://github.com/turtleflyer/smart-hooks/blob/master/packages/smart-hooks/use-smart-ref#readme)
