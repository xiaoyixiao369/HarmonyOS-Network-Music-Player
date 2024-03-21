import utils from '@package:pkg_modules/.ohpm/@ohos+axios@2.2.0/pkg_modules/@ohos/axios/src/main/ets/components/lib/utils'; //import httpAdapter from './http.js';
//import xhrAdapter from './xhr.js';

import ohosAdapter from '@package:pkg_modules/.ohpm/@ohos+axios@2.2.0/pkg_modules/@ohos/axios/src/main/ets/components/lib/adapters/ohos/index';
import AxiosError from "@package:pkg_modules/.ohpm/@ohos+axios@2.2.0/pkg_modules/@ohos/axios/src/main/ets/components/lib/core/AxiosError";
const knownAdapters = {
  //  http: httpAdapter,
  //  xhr: xhrAdapter,
  ohos: ohosAdapter
};
utils.forEach(knownAdapters, (fn, value) => {
  if (fn) {
    try {
      Object.defineProperty(fn, 'name', {
        value
      });
    } catch (e) {// eslint-disable-next-line no-empty
    }

    Object.defineProperty(fn, 'adapterName', {
      value
    });
  }
});
export default {
  getAdapter: adapters => {
    adapters = utils.isArray(adapters) ? adapters : [adapters];
    const {
      length
    } = adapters;
    let nameOrAdapter;
    let adapter;

    for (let i = 0; i < length; i++) {
      nameOrAdapter = adapters[i];

      if (adapter = utils.isString(nameOrAdapter) ? knownAdapters[nameOrAdapter.toLowerCase()] : nameOrAdapter) {
        break;
      }
    }

    if (!adapter) {
      if (adapter === false) {
        throw new AxiosError(`Adapter ${nameOrAdapter} is not supported by the environment`, 'ERR_NOT_SUPPORT');
      }

      throw new Error(utils.hasOwnProp(knownAdapters, nameOrAdapter) ? `Adapter '${nameOrAdapter}' is not available in the build` : `Unknown adapter '${nameOrAdapter}'`);
    }

    if (!utils.isFunction(adapter)) {
      throw new TypeError('adapter is not a function');
    }

    return adapter;
  },
  adapters: knownAdapters
};