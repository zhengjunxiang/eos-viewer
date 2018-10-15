export default function(that) {
  return ($root) => {
    return [
      {
        title: 'ID',
        render: (h, params) => {
          const id = params.row.id;
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
        title: $root.$t('block.expiration'),
        width: 190,
        align: 'center',
        render: (h, params) => {
          const time = params.row.expiration;
          return h('span', time ? that.$U.utcToLa(time) : '--');
        }
      }, {
        title: $root.$t('block.upcUsage') + '(μs)',
        width: 160,
        align: 'center',
        render: (h, params) => {
          const name = params.row.CPU_Usage;
          return h('span', $root.$U.fNum(name, 0));
        }
      }, {
        title: $root.$t('block.netUsage') + '(Bytes)',
        width: 160,
        align: 'center',
        render: (h, params) => {
          const name = params.row.NET_Usage;
          return h('span', $root.$U.fNum(name*8, 0));
        }
      }, {
        title: $root.$t('block.nOfA'),
        width: 160,
        align: 'center',
        render: (h, params) => {
          const actions = params.row.actions;
          return h('span', actions ? $root.$U.fNum(actions, 0) : '--');
        }
      }
    ]
  }
}
