import countrys from 'src/libs/countryCodeList.js';

export default function(that) {
  return ($root) => {
    return [
      {
        title: $root.$t('home.rank'),
        type: 'index',
        width: 60,
      }, {
        title: $root.$t('home.name'),
        align: 'center',
        width: 160,
        render: (h, params) => {
          const owner = params.row.owner;
          return h('router-link', {
            props: {
              to: {
                name: 'account',
                params: {account: owner}
              }
            },
            class: 'text-overflow link'
          }, owner);
        }
      }, {
        title: $root.$t('home.status'),
        align: 'center',
        width: 120,
        render: (h, params) => {
          const isTop = params.index <= 20;
          const isP = params.row.owner === that.blockInfo.head_block_producer;
          return h('Tag', {
            class: isP ? 'producing' : (isTop ? 'top' : 'noTop'),
            props: {
              type: 'border'
            }
          }, isP ? 'Producing' : (isTop ?  'Top 21' : 'Standby'));
        }
      }, {
        title: $root.$t('home.location'),
        align: 'center',
        width: 160,
        render: (h, params) => {
          let country = '';
          countrys.forEach(item => {
            if (params.row.location+'' === item.code) country = item.country;
          });
          return h('div', country);
        }
      }, {
        title: 'URL',
        width: 200,
        align: 'center',
        render: (h, params) => {
          return h('a', {
            attrs: {
              href: params.row.url,
              target: '_black'
            },
            class: 'link',
          }, params.row.url);
        }
      }, {
        title: $root.$t('home.totalV'),
        align: 'right',
        render: (h, params) => {
          return h('div', that.$U.fNum(that.$U.votes2eos(params.row.total_votes), 0));
        }
      }, {
        title: $root.$t('home.votes'),
        align: 'right',
        render: (h, params) => {
          return h('div', (params.row.total_votes / that.totalVoteRows[0].total_producer_vote_weight * 100).toFixed(3)+'%');
        }
      }, {
        title: $root.$t('home.RD'),
        align: 'right',
        render: (h, params) => {
          const continuous_rate = 0.0487,
            useconds_per_year = 3144960000000, // 52 * 7 * 24 * 360 * 1000000
            supply = parseFloat(that.currencyStatsSupply),
            usecs_since_last_fill = 86400*1000000,
            new_tokens = continuous_rate * supply * usecs_since_last_fill / useconds_per_year,
            to_producers = new_tokens / 5,
            to_per_block_pay = to_producers / 4,
            to_per_vote_pay = to_producers - to_per_block_pay,
            pervote_bucket = that.totalVoteRows[0].pervote_bucket + to_per_vote_pay,
            perblock_bucket = that.totalVoteRows[0].perblock_bucket + to_per_block_pay,
            voteReward = Math.floor(pervote_bucket * params.row.total_votes) / that.totalVoteWeight / 10000,
            isTop21 = params.index < 21 ? true : false,
            blockReward = (perblock_bucket * (isTop21 ? 86400*2/21 : 0)) / that.totalVoteRows[0].total_unpaid_blocks / 10000,
            allReward = (voteReward + blockReward).toFixed(4);
          return h('div', allReward >= 100 ? allReward : 0);
        }
      }
    ]
  }
}
