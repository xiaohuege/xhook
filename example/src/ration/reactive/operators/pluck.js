import { map } from './map';
import _ from 'underscore';
import { getMutliLevelProperty } from '../../helper/property';

export function pluck(props, defaultVal) {
  if (!_.isString(props)) {
    throw new Error('属性[properties]必须为非空字符串');
  }
  return map(item => getMutliLevelProperty(item, props, defaultVal));
}
