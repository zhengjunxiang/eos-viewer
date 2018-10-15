const formatABI = (that, params, h, structs) => {
  const arr = [], data = params.row.action_trace.act.data, name = params.row.action_trace.act.name;
  let isStructsItem = false;
  if (name === 'buyrambytes' || name === 'buyram') {
    arr.push(temRouterLink(h, data.payer))
    arr.push(h('b', ` bought ${data.quant || data.bytes + ' bytes'} RAM for `));
    arr.push(temRouterLink(h, data.receiver))
    return arr;
  }
  if (name === 'sellram') {
    arr.push(temRouterLink(h, data.account))
    arr.push(h('b', ` sold ${data.bytes + ' bytes'} RAM`));
    return arr;
  }
  if (name === 'delegatebw') {
    arr.push(temRouterLink(h, data.from))
    arr.push(h('b', ' delegated to the account '));
    arr.push(temRouterLink(h, data.receiver))
    arr.push(h('b', `: ${data.stake_net_quantity} for NET, and ${data.stake_cpu_quantity} for CPU`));
    return arr;
  }
  if (name === 'undelegatebw') {
    arr.push(temRouterLink(h, data.receiver))
    arr.push(h('b', ' undelegated from '));
    arr.push(temRouterLink(h, data.from))
    arr.push(h('b', `: ${data.unstake_net_quantity} for NET, and ${data.unstake_cpu_quantity} for CPU`));
    return arr;
  }
  if (name === 'voteproducer') {
    arr.push(temRouterLink(h, data.voter))
    arr.push(h('b', ' voted for block producers: '));
    data.producers.forEach((item, i) => {
      arr.push(temRouterLink(h, item))
      if (i === data.producers.length - 1) arr.push(h('b', '.'))
      else arr.push(h('b', ', '))
    })
    return arr;
  }
  if (name === 'newaccount') {
    arr.push(temRouterLink(h, data.creator))
    arr.push(h('b', ' created a new account of '));
    arr.push(temRouterLink(h, data.name))
    return arr;
  }
  if (name === 'claimrewards') {
    arr.push(temRouterLink(h, data.owner))
    arr.push(h('b', ' claimed block producer rewards.'));
    return arr;
  }
  if (name === 'transfer') {
    if (data.from === that.account || data.to === that.account) {
      arr.push(temRouterLink(h, data.from))
      arr.push(h('b', ` -> `));
      arr.push(temRouterLink(h, data.to))
      arr.push(h('b', { style: { marginLeft: '20px' } }, `${data.quantity}`));
      arr.push(h('br', ''));
      arr.push(h('b', `Memo: ${data.memo}.`));
      return arr;
    }
  }
  Object.keys(data).forEach(key => {
    structs.some(item => {
      if (item.name === name) {
        item.fields.some(it => {
          if (it.name === key) {
            arr.push(h('b', `${key}: `))
            if (it.type === 'account_name') arr.push(temRouterLink(h, data[key]))
            else arr.push(h('span', JSON.stringify(data[key])))
            arr.push(h('br', ''))
            return true;
          }
        })
        isStructsItem = true;
        return true;
      }
    });
  });
  if (isStructsItem === false) {
    arr.push(h('a', {
      class: 'text-overflow',
      on: {
        click() {
          that.$Modal.info({
            title: 'Action Data',
            render: h => {
              return h('div', [
                  h('i', {
                    attrs: {
                      class: 'ivu-icon ivu-icon-ios-copy'
                    },
                    style: { fontSize: '18px', cursor: 'pointer' },
                    on: {
                      click: () => {
                        that.onCopy(JSON.stringify(data, null, 2))
                      }
                    }
                  }, ''),
                  h('pre', JSON.stringify(data, null, 2))
              ])
            }
          });
        }
      }
    }, JSON.stringify(data)))
  }
  return arr;
}

function temRouterLink(h, data) {
  return h('router-link', {
    style: 'font-weight: 500',
    props: { to: { name: 'account', params: {account: data} } },
    class: 'text-overflow link'
  }, data)
}

export default formatABI;
