declare class TmsRouterHistory {
    constructor();
    get history(): any;
    get router(): any;
    push(path: any): void;
    pop(): void;
    canBack(): boolean;
    watch(router: any): any;
}
export { TmsRouterHistory };
export default function install(app: any, { router }: {
    router: any;
}): void;
