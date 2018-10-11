/* eslint-disable */
let util = {};
const pattern = new RegExp("[`~!#$^&*()=|{}':;',\\[\\]<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]");
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

export default util;
