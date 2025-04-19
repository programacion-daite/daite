import { useRef } from 'react';
import isEqual from 'lodash/isEqual';

export function useDeepMemo<T, D>(value: T, dependencies: D): T {
    const ref = useRef<T>(value);
    const prevDeps = useRef<D>(dependencies);

    if (!isEqual(dependencies, prevDeps.current)) {
        ref.current = value;
        prevDeps.current = dependencies;
    }

    return ref.current;
}
