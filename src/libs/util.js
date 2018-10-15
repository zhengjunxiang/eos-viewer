/* eslint-disable */
import miment from 'miment'
import { apiHost } from 'src/libs/config';
import formatABI from './formatABI'

let util = {};
const pattern = new RegExp("[`~!#$^&*()=|{}':;',\\[\\]<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]");

util.formatABI = formatABI;

util.mapScript = str => pattern.test(str)

util.title = function(title) {
  if (title) window.document.title = title;
};

util.checkLan = () => {
  const naLan = navigator.language, loLan = localStorage.getItem('language');
  if (loLan) return loLan;
  else if (naLan) return (naLan === 'zh-CN' || naLan === 'zh') ? 'zh' : 'en';
  else return 'zh';
}

util.getApiHost = () => localStorage.getItem('apiHost') || Object.keys(apiHost)[0] || '';

util.getYear = (time) => {
  let date = time ? new Date(time) : new Date(), year = date.getFullYear();
  return year;
}

util.fNum = (s, n) => {
  /*
   * 参数说明：
   * s：要格式化的数字
   * n：保留几位小数
   * */
  let isMinus = false
  if (!s && s !== 0) return 0;
  if (s < 0) {
    isMinus = true
    s *= -1;
  }
  n = n > -1 && n <= 20 ? n : 2;
  s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
  var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1] || '', t = "";
  for (var i = 0; i < l.length; i++) t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
  return (isMinus ? '-' : '') + (t.split("").reverse().join("") + (r ? ("." + r) : ''));
}

util.fDate = (date, f) => {
  if (date) return miment(date).format(f || 'YYYY-MM-DD hh:mm:ss')
  else return miment().format(f || 'YYYY-MM-DD hh:mm:ss')
}

util.utcToLa = date => {
  const zone = new Date().getTimezoneOffset()/60;
  if (/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)) return miment(new Date(date)).format('YYYY/MM/DD hh:mm:ss');
  return miment(new Date(date)).add(-zone, 'hh').format('YYYY/MM/DD hh:mm:ss');
};

util.deepCopy = source => {
  if (!source || typeof source !== 'object')
    throw new Error('error arguments', 'shallowClone');
  var targetObj = source.constructor === Array ? [] : {};
  for (var keys in source) {
    if (source.hasOwnProperty(keys)) {
      if (source[keys] && typeof source[keys] === 'object') {
        targetObj[keys] = source[keys].constructor === Array ? [] : {};
        targetObj[keys] = util.deepCopy(source[keys]);
      } else targetObj[keys] = source[keys];
    }
  }
  return targetObj;
}

util.vByte = (rule, value, callback) => {
  if (!value) return callback(new Error(vm.$root.$t('error.entry')));
  if (util.mapScript(value)) return callback(new Error(vm.$root.$t('error.offend')));
  if (util.getByteLen(value) > 50) return callback(new Error(vm.$root.$t('error.NoMore25B')));
  callback();
}

util.vDesc = (rule, value, callback) => {
  if (util.mapScript(value)) return callback(new Error(vm.$root.$t('error.offend')));
  if (util.getByteLen(value + '') > 100) return callback(new Error(vm.$root.$t('error.NoMore50B')));
  callback();
}

util.getByteLen = str => str.replace(/[^\u0000-\u00ff]/g, "aa").length;

util.votes2eos = (votes) => {
  const date = Date.now() / 1000 - 946684800000 / 1000;
  const weight = Math.floor(date / (24 * 3600 * 7)) / 52;
  return (votes / Math.pow(2, weight)) / 10000
}

util.pageScrollY = top => {
  if (top || Number(top) == 0) window.scrollTo(0, Number(top))
  else return document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop || 0;
}

export default util;
