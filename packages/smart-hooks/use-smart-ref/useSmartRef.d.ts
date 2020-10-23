import type { MutableRefObject } from 'react';
export declare type SmartRefEffect<T extends HTMLElement = HTMLElement> = (el: T) => (() => void) | undefined | void;
export declare type CallbackRef<T extends HTMLElement = HTMLElement> = (el: T | null) => void;
export declare function useSmartRef<T extends HTMLElement = HTMLElement>(effect: SmartRefEffect<T>, ref?: MutableRefObject<T | null | undefined>): CallbackRef<T>;
