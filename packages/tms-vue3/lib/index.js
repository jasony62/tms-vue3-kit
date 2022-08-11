// HTTP请求
import TmsAxiosPlugin, { TmsAxios } from './axios';
import { Batch, startBatch } from './batch';
import TmsErrorPlugin, { TmsIgnorableError } from './error';
// 用promise实现锁机制
import { TmsLockPromise } from './lock-promise';
// 路由历史
import TmsRouterHistoryPlugin, { TmsRouterHistory } from './router-history';
export { TmsAxiosPlugin, TmsAxios, Batch, startBatch, TmsRouterHistoryPlugin, TmsRouterHistory, TmsErrorPlugin, TmsIgnorableError, TmsLockPromise };
