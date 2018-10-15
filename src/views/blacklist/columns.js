export default function(that) {
  return ($root) => {
    return [
      {
        title: 'ID',
        key: 'id',
        width: 50,
      }, {
        title: $root.$t('blacklist.action'),
        width: 100,
        key: 'action'
      }, {
        title: $root.$t('blacklist.type'),
        width: 160,
        key: 'type'
      }, {
        title: $root.$t('blacklist.accounts'),
        width: 160,
        render: (h, params) => {
          const accounts = params.row.accounts;
          return h('div', accounts.map(item => {
            return h('div', item)
          }))
        }
      }, {
        title: $root.$t('blacklist.count'),
        width: 80,
        align: 'center',
        render: (h, params) => {
          const accounts = params.row.accounts;
          return h('div', accounts.length)
        }
      }, {
        title: $root.$t('blacklist.orderURL'),
        width: 130,
        render: (h, params) => {
          const url = params.row.order_url;
          return h('a', {
            attrs: { href: url, download: 'help' },
            class: 'download-btn'
          }, 'PDF File')
        }
      }, {
        title: $root.$t('blacklist.orderName'),
        width: 400,
        key: 'order_name'
      }, {
        title: $root.$t('blacklist.orderHash'),
        width: 520,
        key: 'order_hash'
      }
    ]
  }
}
