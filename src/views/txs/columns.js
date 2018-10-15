import abi from 'src/libs/abi';

const structs = [...abi.token.structs, ...abi.system.structs]

export default function(that) {
  return ($root) => {
    return [
      {
        title: $root.$t('txs.name'),
        render: (h, params) => {
          const name = params.row.name;
          return h('Tag', {
            props: {
              type: 'border'
            }
          }, name);
        }
      }, {
        title: $root.$t('txs.account'),
        render: (h, params) => {
          const account = params.row.account;
          return h('router-link', {
            props: {
              to: {
                name: 'account',
                params: {account}
              }
            },
            class: 'text-overflow link'
          }, account);
        }
      }, {
        title: $root.$t('txs.aut'),
        render: (h, params) => {
          const actor = params.row.authorization[0].actor;
          const permission = params.row.authorization[0].permission
          return h('router-link', {
            props: {
              to: {
                name: 'account',
                params: {account: actor}
              }
            },
            class: 'text-overflow link'
          }, `${actor}@${permission}`);
        }
      }, {
        title: $root.$t('txs.data'),
        render: (h, params) => {
          const arr = [], data = params.row.data, name = params.row.name;
          let isStructsItem = false;
          Object.keys(data).forEach(key => {
            structs.some(item => {
              if (item.name === name) {
                item.fields.some(it => {
                  if (it.name === key) {
                    if (it.type === 'account_name') {
                      arr.push(h('b', `${key}: `))
                      arr.push(h('router-link', {
                        style: 'font-weight: 500',
                        props: {
                          to: {
                            name: 'account',
                            params: {account: data[key]}
                          }
                        },
                        class: 'text-overflow link'
                      }, data[key]))
                      arr.push(h('br', ''))
                    } else {
                      arr.push(h('b', `${key}: `))
                      arr.push(h('span', JSON.stringify(data[key])))
                      arr.push(h('br', ''))
                    }
                    return true;
                  }
                })
                isStructsItem = true;
                return true;
              }
            });
          });
          if (isStructsItem === false) {
            return h('a', {
              class: 'text-overflow',
              on: {
                click() {
                  that.$Modal.info({
                    title: 'Action Data',
                    content: `<pre>${JSON.stringify(data, null, 2)}</pre>`
                  });
                }
              }
            }, JSON.stringify(data));
          }
          return h('div', arr);
        }
      }
    ]
  }
}
