import React, { StrictMode } from 'react';
import type { FC, PropsWithChildren } from 'react';

export function wrapWithStrictModeComponent<P extends object>(InnerComponent: FC<P>): FC<P> {
  return function StrictModeWrapper(props: PropsWithChildren<P>) {
    return (
      <StrictMode>
        <InnerComponent {...props} />
      </StrictMode>
    );
  };
}
