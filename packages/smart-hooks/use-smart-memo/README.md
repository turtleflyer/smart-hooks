# useSmartMemo

There is a temptation to use the standard React hook `useMemo` not only for the sake of performance
optimization. But in the official documentation, it says clearly: [**You may rely on `useMemo` as a
performance optimization, not as a semantic
guarantee**](https://reactjs.org/docs/hooks-reference.html#usememo). `useSmartMemo` is for the
control over the execution of some part of code skipping it if values passed to a dependencies list
do not change. Most often, the execution of `useSmartMemo` is relying upon the original `useMemo`
and doing nothing more than just invoking it. But since _React may choose to “forget” some
previously memoized values and recalculate them on next render_, `useSmartMemo` has an additional
barrier inside `useMemo` that prevents such recalculations.

## Install

```bash
npm install @smart-hooks/use-smart-memo --save
```

## Usage

```js
import { useSmartMemo } from '@smart-hooks/use-smart-memo';

useSmartMemo(() => {
  // conditional code
}, [v1, v2]);
// As long as the values of v1, v2 are not changing, the code inside the function will not
// re-execute
```
