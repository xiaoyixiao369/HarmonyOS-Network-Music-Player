'use strict';

import utils from '@package:pkg_modules/.ohpm/@ohos+axios@2.2.0/pkg_modules/@ohos/axios/src/main/ets/components/lib/utils';
/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 *
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */

export default function isAxiosError(payload) {
  return utils.isObject(payload) && payload.isAxiosError === true;
}