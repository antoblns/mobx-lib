import {
    action,
    makeAutoObservable,
    observable,
    runInAction,
    flow,
    reaction,
    autorun,
    extendObservable,
} from "mobx";
import { useLocalObservable, useObserver, observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
const store = {};
export function useLib(
    kw,
    startup?: (libApi: any) => Promise<any>,
    options = { dispose: true },
    vars = []
): any {
    function Return(ret) {
        extendObservable(store[kw], ret);
    }
    const disposables = [];
    function onDispose(cb) {
        disposables.push(cb);
    }
    const [, forceRender] = useState(0);
    if (!store[kw] && startup) {
        store[kw] = observable(
            { loading: true, vars: [...vars] },
            {},
            { deep: false }
        );
    }
    function createReactiveVar(param = {}) {
        const new_var = observable(param);
        store[kw].vars.push(new_var); // for further cleanup
        return new_var;
    }
    const start = flow(function* () {
        if (startup) {
            yield action(startup)({
                Return,
                store,
                createReactiveVar,
                onDispose,
            });
            store[kw].loading = false;
        }
    });
    start();
    useEffect(() => {
        return () => {
            // dispose();
            disposables.forEach((cb) => cb());
            if (startup && options.dispose) {
                delete store[kw];
            }
        };
    }, []);
    return store[kw];
}
