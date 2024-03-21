'use strict';

import utils from '@package:pkg_modules/.ohpm/@ohos+axios@2.2.0/pkg_modules/@ohos/axios/src/main/ets/components/lib/utils';
import bind from '@package:pkg_modules/.ohpm/@ohos+axios@2.2.0/pkg_modules/@ohos/axios/src/main/ets/components/lib/helpers/bind';
import Axios from '@package:pkg_modules/.ohpm/@ohos+axios@2.2.0/pkg_modules/@ohos/axios/src/main/ets/components/lib/core/Axios';
import mergeConfig from '@package:pkg_modules/.ohpm/@ohos+axios@2.2.0/pkg_modules/@ohos/axios/src/main/ets/components/lib/core/mergeConfig';
import defaults from '@package:pkg_modules/.ohpm/@ohos+axios@2.2.0/pkg_modules/@ohos/axios/src/main/ets/components/lib/defaults/index';
import formDataToJSON from '@package:pkg_modules/.ohpm/@ohos+axios@2.2.0/pkg_modules/@ohos/axios/src/main/ets/components/lib/helpers/formDataToJSON';
import CanceledError from '@package:pkg_modules/.ohpm/@ohos+axios@2.2.0/pkg_modules/@ohos/axios/src/main/ets/components/lib/cancel/CanceledError';
import CancelToken from '@package:pkg_modules/.ohpm/@ohos+axios@2.2.0/pkg_modules/@ohos/axios/src/main/ets/components/lib/cancel/CancelToken';
import isCancel from '@package:pkg_modules/.ohpm/@ohos+axios@2.2.0/pkg_modules/@ohos/axios/src/main/ets/components/lib/cancel/isCancel';
import { VERSION } from '@package:pkg_modules/.ohpm/@ohos+axios@2.2.0/pkg_modules/@ohos/axios/src/main/ets/components/lib/env/data';
import toFormData from '@package:pkg_modules/.ohpm/@ohos+axios@2.2.0/pkg_modules/@ohos/axios/src/main/ets/components/lib/helpers/toFormData';
import AxiosError from '@package:pkg_modules/.ohpm/@ohos+axios@2.2.0/pkg_modules/@ohos/axios/src/main/ets/components/lib/core/AxiosError';
import spread from '@package:pkg_modules/.ohpm/@ohos+axios@2.2.0/pkg_modules/@ohos/axios/src/main/ets/components/lib/helpers/spread';
import isAxiosError from '@package:pkg_modules/.ohpm/@ohos+axios@2.2.0/pkg_modules/@ohos/axios/src/main/ets/components/lib/helpers/isAxiosError';
import AxiosHeaders from "@package:pkg_modules/.ohpm/@ohos+axios@2.2.0/pkg_modules/@ohos/axios/src/main/ets/components/lib/core/AxiosHeaders";
import HttpStatusCode from '@package:pkg_modules/.ohpm/@ohos+axios@2.2.0/pkg_modules/@ohos/axios/src/main/ets/components/lib/helpers/HttpStatusCode';
import FormData from '@package:pkg_modules/.ohpm/@ohos+axios@2.2.0/pkg_modules/@ohos/axios/src/main/ets/components/lib/env/classes/FormData';
/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 *
 * @returns {Axios} A new instance of Axios
 */

function createInstance(defaultConfig) {
  const context = new Axios(defaultConfig);
  const instance = bind(Axios.prototype.request, context); // Copy axios.prototype to instance

  utils.extend(instance, Axios.prototype, context, {
    allOwnKeys: true
  }); // Copy context to instance

  utils.extend(instance, context, null, {
    allOwnKeys: true
  }); // Factory for creating new instances

  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };

  return instance;
} // Create the default instance to be exported


const axios = createInstance(defaults); // Expose Axios class to allow class inheritance

axios.Axios = Axios; // Expose Cancel & CancelToken

axios.CanceledError = CanceledError;
axios.CancelToken = CancelToken;
axios.isCancel = isCancel;
axios.VERSION = VERSION;
axios.toFormData = toFormData; // Expose AxiosError class

axios.AxiosError = AxiosError; // alias for CanceledError for backward compatibility

axios.Cancel = axios.CanceledError; // Expose all/spread

axios.all = function all(promises) {
  return Promise.all(promises);
};

axios.spread = spread; // Expose isAxiosError

axios.isAxiosError = isAxiosError; // Expose mergeConfig

axios.mergeConfig = mergeConfig;
axios.AxiosHeaders = AxiosHeaders;

axios.formToJSON = thing => formDataToJSON(utils.isHTMLForm(thing) ? new FormData(thing) : thing);

axios.HttpStatusCode = HttpStatusCode;
axios.default = axios;
axios.FormData = FormData; // this module should only have a default export

export default axios;