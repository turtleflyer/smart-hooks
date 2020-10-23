## 5.0.0 (Oct 22, 2020)

### Change

- Add support React 17.

## 4.1.1 (Oct 8, 2020)

### Fix

- Fix update the state with no subscribers results in an error.

## 4.1.0 (Oct 3, 2020)

### Fix

- Fix create-react-app uses UMD module for bundling.

### Change

- Add an enhanced interface to `useInterstate` returning the state value and the setter.

## 4.0.0 (Sep 29, 2020)

### Breaking change

- Rewrite type definitions to improve integrity and make the use of the library clearer.

### Change

- Format the polyfilled code and type definitions for better readability.
- Limit included files in the final bundle by counting only those ones whose export effectively
  contributes type definitions.

### Fix

- Polyfill the code in accordance with create-react-app requirements.
- Fix trying to update a state record with an old value second time results in an error.

## 3.1.0 (Sep 8, 2020)

### Change

- Improve `UseInterstate` interface having more consistent typing.

## 3.0.0 (Sep 6, 2020)

### Breaking change

- The library's target for polyfill of CommonJS and ES Modules is changed to the last versions of
  browsers that is aligned with development mode of React.

### Change

- Add @types/react to dependencies.
- Add Typescript interfaces to `getUseInterstate` and `useInterstate` allowing to manage massive
  complex states.

## 2.1.4 (Aug 7, 2020)

### Fix

- Fix typescript compiler has a bug emitting type declarations

### Change

- Rearrange the test suites to have types checked in the compiled bundle.

## 2.1.3 (Aug 7, 2020)

### Fix

- Fix redundant type in useInterstate definition.

## 2.1.2 (Aug 3, 2020)

### Fix

- Fix lerna does not add UNLICENSE to package.

## 2.1.0 (Aug 3, 2020)

### Added

- getUseInterstate method.
- Multi state call interface.

### Changed

- Add dependency on a helper shared package @smart-hooks/helper-traverse-scheme-keys.
- Update the documentation.

## 2.0.0 (Jun 27, 2020)

Publish stable release.
