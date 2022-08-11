declare class TmsLockPromise {
    lockGetter: Function;
    waitingPromises: any;
    constructor(fnLockGetter: any);
    isRunning(): boolean;
    wait(): Promise<unknown>;
}
export { TmsLockPromise };
