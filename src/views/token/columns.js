export default function(that) {
  return ($root) => {
    return [
      {
        type: 'index',
        width: 50,
      }, {
        title: $root.$t('token.name'),
        width: 240,
        key: 'name',
        render: (h, params) => {
          return h('div', [
            h('img', {
              attrs: {
                src: params.row.logo, width: 32, height: 32
              },
              style: { float: 'left' }
            }),
            h('span', {
              style: {
                lineHeight: '36px',
                marginLeft: '25px',
                fontWeight: 500
              }
            }, params.row.name),
            h('span', {
              style: {
                lineHeight: '36px',
                fontWeight: 500
              }
            }, `(${params.row.symbol})`)
          ])
        }
      }, {
        title: `${$root.$t('token.marketCap')}(USD)`,
        align: 'right',
        width: 180,
        render: (h, params) => {
          const p = params.row.marketPrice;
          return h('div', p ? `$${$root.$U.fNum(p, 2)}` : '--')
        }
      }, {
        title: `${$root.$t('token.price')}(USD)`,
        width: 150,
        align: 'right',
        render: (h, params) => {
          const p = params.row.priceUSD;
          return h('div', p ? `$${$root.$U.fNum(p, 4)}` : '--')
        }
      }, {
        title: `${$root.$t('token.price')}(EOS)`,
        width: 150,
        align: 'right',
        render: (h, params) => {
          const p = params.row.priceEOS;
          return h('div', p ? `${$root.$U.fNum(p, 4)} EOS` : '--')
        }
      }, {
        title: $root.$t('token.supply'),
        align: 'center',
        key: 'supply'
      }, {
        title: $root.$t('token.contract'),
        align: 'center',
        width: 160,
        render: (h, params) => {
          const account = params.row.account;
          return h('router-link', {
            props: {
              to: {
                name: 'account',
                params: {account: account}
              }
            },
            class: 'text-overflow link'
          }, account)
        }
      }
    ]
  }
}
