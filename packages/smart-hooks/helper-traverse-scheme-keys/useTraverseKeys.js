import { useRef, useState } from 'react';
export function useTraverseKeys(scheme, eachKeyProceed) {
    const [[memScheme, enumKeys]] = useState(() => [
        scheme,
        [
            ...Object.keys(scheme),
            ...Object.getOwnPropertySymbols(scheme).filter((key) => Object.prototype.propertyIsEnumerable.call(scheme, key)),
        ],
    ]);
    const stateSide = {};
    const { current: settersSide } = useRef({});
    enumKeys.forEach((key) => {
        const fulfillStateSide = (p) => {
            stateSide[key] = p;
        };
        const fulfillSettersSide = (p) => {
            settersSide[key] = p;
        };
        eachKeyProceed(key, memScheme, fulfillStateSide, fulfillSettersSide);
    });
    return [stateSide, settersSide, enumKeys];
}
