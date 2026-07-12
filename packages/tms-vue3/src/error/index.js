/* eslint-disable no-console */
// 全局异常
if (window) {
    window.onerror = function (message, source, line, column, error) {
        console.log(`window.onerror(message=${message}, source=${source}, line=${line}, column=${column})`, error);
    };
    window.onunhandledrejection = function (evt) {
        if (evt.promise) {
            evt.promise.then(undefined, (err) => {
                if (err instanceof TmsIgnorableError) {
                    console.log("可忽略。。。");
                }
                else {
                    console.error("err rejection", err);
                }
            });
        }
        evt.preventDefault();
    };
}
// 可忽略错误
class TmsIgnorableError extends Error {
}
/**
 *
 */
class VueErrorHandler {
    outerHandler;
    beforeHandler;
    afterHandler;
    /**
     *
     * @param {object} options
     * @param {function} options.handler 指定的错误处理方式，替代默认处理
     */
    constructor(options) {
        if (typeof options === "object") {
            if (typeof options.handler === "function") {
                this.outerHandler = options.handler;
            }
            if (typeof options.before === "function") {
                this.beforeHandler = options.before;
            }
            if (typeof options.after === "function") {
                this.afterHandler = options.after;
            }
        }
    }
    /**
     * 处理Vue全局异常
     *
     * @param {*} error
     * @param {*} vm
     * @param {*} info Vue 特定的错误信息，比如错误所在的生命周期钩子
     */
    async handle(error, vm, info) {
        if (!error || error instanceof TmsIgnorableError)
            return;
        try {
            if (this.beforeHandler)
                await this.beforeHandler(error, vm, info);
            if (this.outerHandler) {
                await this.outerHandler(error, vm, info);
            }
            else {
                console.error(`异常: ${error.message}\nVue信息: ${info}`);
            }
            if (this.afterHandler)
                await this.afterHandler(error, vm, info);
        }
        catch (e) {
            console.error("处理错误时发生异常！", e);
        }
    }
}
export { TmsIgnorableError };
export default function install(app, options) {
    const handler = new VueErrorHandler(options);
    app.config.errorHandler = function (...args) {
        handler.handle(...args);
    };
}
