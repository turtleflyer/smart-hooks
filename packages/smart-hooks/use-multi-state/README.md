# useMultiState

There may be a lot of reasons to use multiple instances of React hook `useState` in a single
component. There may also be too much repetition in those cases when you define all needed states.
`useMultiState` provides a way to wrap all of these `useState`'s into one hook that will act exactly
way but without to be such verbose and messy.

## Install

```bash
npm install @smart-hooks/use-multi-state --save
```

## Usage

Giving the following example where we use ordinary `useState`:

```jsx
function Component() {
  const [color, setColor] = useState('blue');
  const [theme, setTheme] = useState({ textSize: 'medium', hyphenations: true });
  const [density, setDensity] = useState(() => {
    // calculate init value
  });

  return (
    <>
      <ControlComponent color={setColor} theme={setTheme} density={setDensity} />
      <DisplayComponent {...{ color, theme, density }} />
    </>
  );
}
```

We can rewrite this logic by using `useMultiState` in less repetitive and readable way:

```jsx
import { useMultiState } from '@smart-hooks/use-multi-state';

function Component() {
  const [state, setState] = useMultiState({
    color: 'blue',
    theme: { textSize: 'medium', hyphenations: true },
    density: () => {
      // calculate init value
    },
  });

  return (
    <>
      <ControlComponent {...setState} />
      <DisplayComponent {...state} />
    </>
  );
}
```

As in the case of using `useState` when you get setter that is [guaranteed stable and
immutable](https://reactjs.org/docs/hooks-reference.html#usestate), with `usMultiState`, you have an
object that alone has a stable identity, and its properties on their turn effectively are setters
emitted by `useState` calls hence stable and immutable. You can use numbers, strings, and symbols
for properties names.
