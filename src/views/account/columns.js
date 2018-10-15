import abi from 'src/libs/abi';

const structs = [...abi.token.structs, ...abi.system.structs]

export default function(that) {
  return ($root) => {
    return [
      {
        title: $root.$t('account.blockID'),
        width: 120,
        render: (h, params) => {
          const block = params.row.block_num;
          return h('router-link', {
            props: {
              to: {
                name: 'block',
                params: {block}
              }
            },
            class: 'text-overflow link'
          }, $root.$U.fNum(block, 0));
        }
      }, {
        title: $root.$t('account.transactionID'),
        width: 220,
        render: (h, params) => {
          const id = params.row.action_trace.trx_id;
          return h('router-link', {
            props: {
              to: {
                name: 'txs',
                params: {txs: id}
              }
            },
            class: 'text-overflow link'
          }, id);
        }
      }, {
        title: $root.$t('account.time'),
        width: 200,
        render: (h, params) => {
          const time = params.row.block_time;
          return h('span', that.$U.utcToLa(time));
        }
      }, {
        title: $root.$t('account.name'),
        width: 160,
        align: 'center',
        render: (h, params) => {
          const name = params.row.action_trace.act.name, data = params.row.action_trace.act.data;
          let n = '';
          n = name
          if (name === 'transfer') {
            if (data.from === that.account) n = 'sent';
            else if (data.to === that.account) n = 'received';
          }
          return h('Tag', { props: { type: 'border' } }, n);
        }
      }, {
        title: $root.$t('account.data'),
        render: (h, params) => {
          return h('div', that.$U.formatABI(that, params, h, structs));
        }
      }
    ]
  }
}
