import isEqual from 'lodash/isEqual';
import { useRef } from 'react';

export function useDeepMemo<T, D>(value: T, dependencies: D): T {
    const ref = useRef<T>(value);
    const prevDeps = useRef<D>(dependencies);

    if (!isEqual(dependencies, prevDeps.current)) {
        ref.current = value;
        prevDeps.current = dependencies;
    }

    return ref.current;
}
