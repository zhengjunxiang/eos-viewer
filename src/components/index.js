import { Button, Table, i18n, Page, Modal, Input, Dropdown, DropdownItem, Icon,
 Row, Card, Spin, Col, DropdownMenu, BackTop, Message, Tag, Progress, Tooltip } from 'iview';

const iview = {
  install: function(Vue) {
    Vue.config.productionTip = false

    Vue.component('Button', Button);
    Vue.component('Table', Table);
    Vue.component('Page', Page);
    Vue.component('Modal', Modal);
    Vue.component('Input', Input);
    Vue.component('Dropdown', Dropdown);
    Vue.component('DropdownItem', DropdownItem);
    Vue.component('Icon', Icon);
    Vue.component('Row', Row);
    Vue.component('Card', Card);
    Vue.component('Spin', Spin);
    Vue.component('Col', Col);
    Vue.component('DropdownMenu', DropdownMenu);
    Vue.component('BackTop', BackTop);
    Vue.component('Tag', Tag)
    Vue.component('Progress', Progress)
    Vue.component('Tooltip', Tooltip)
    Vue.prototype.$Message = Message
    Vue.prototype.$Modal = Modal
  }
}

export default iview
