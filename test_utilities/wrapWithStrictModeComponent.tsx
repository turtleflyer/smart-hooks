import React, { StrictMode } from 'react';

export function wrapWithStrictModeComponent<P>(
  InnerComponent: React.FunctionComponent<P>
): React.FunctionComponent<P> {
  return (props: React.PropsWithChildren<P>) => (
    <StrictMode>
      <InnerComponent {...props} />
    </StrictMode>
  );
}
