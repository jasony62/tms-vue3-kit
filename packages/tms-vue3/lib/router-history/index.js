const HISTORY_STACK = Symbol('history_stack');
const WATCHED_ROUTER = Symbol('watched_router');
const ROUTER_IS_BACK = Symbol('router_is_back');
class TmsRouterHistory {
    constructor() {
        this[HISTORY_STACK] = [];
    }
    get history() {
        return this[HISTORY_STACK];
    }
    get router() {
        return this[WATCHED_ROUTER];
    }
    push(path) {
        this.history.push(path);
    }
    pop() {
        this.history.pop();
    }
    canBack() {
        return this.history.length > 1;
    }
    watch(router) {
        this[WATCHED_ROUTER] = router;
        // afterEach记录历史记录
        router.afterEach((to) => {
            if (router[ROUTER_IS_BACK]) {
                // 后退
                this.pop();
                router[ROUTER_IS_BACK] = false;
            }
            else {
                this.push(to.path);
            }
        });
        router = new Proxy(router, {
            get: function (target, property) {
                if (property === 'back') {
                    target[ROUTER_IS_BACK] = true;
                }
                return target[property];
            },
        });
        return router;
    }
}
export { TmsRouterHistory };
export default function install(app, { router }) {
    let routerHistory = new TmsRouterHistory();
    if (router)
        routerHistory.watch(router);
        console.log('app', app)
    app.config.globalProperties.$tmsRouterHistory = routerHistory;
}
