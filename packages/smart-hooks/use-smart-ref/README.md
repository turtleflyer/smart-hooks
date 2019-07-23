Allows mutable ref to be handled similarly as if you wanted to use it in `useEffect`.

### Install
```bash
npm install @smart-hooks/use-smart-ref --save
```

### Usage

```javascript
import { useRef } from 'react';
import useSmartRef from '@smart-hooks/use-smart-ref';

const Component = () => {
  refRecord = useRef();

  ref = useSmartRef((el) => {
    // el treated as a reference to the element.
    // Inside the function, perform operations with el.
    // For example, attach event listeners,
    // make measurements, and so on.
    
    return () => {
      // It will be executed at the same phase of component
      // life cycle as in the case of executing a function
      // returned by a function provided to useEffect.
    }
  },

  // If pass a variable that is taken from useRef
  // its 'current' property will always contain
  // a reference to the element.
  refRecord,
  [...deps])

  return (
    <div ref={ref} >
      {/* .... */}
    </div>
  )
}
```



