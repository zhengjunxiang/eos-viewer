<template>
  <div class="footer">
    <div class="container">
      <div class="container-inner">
        <div>
          <span style="font-size: 14px;padding-right: 10px;">{{$t('footer.apiSelect')}}:</span>
          <Dropdown trigger="click" @on-click="handleChangeHost">
            <Button type="primary">
              <span class="text">{{apiHost}}</span>
              <Icon type="md-arrow-dropdown" />
            </Button>
            <DropdownMenu slot="list">
              <DropdownItem v-for="api in apis" :name="api" :key="api">{{api}}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div class="records">
          <p style="color: #ccc;">Copyright © {{year}} Created by EOS AntPool</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {apiHost} from 'src/libs/config';
export default {
  name: "ant-footer",
  data() {
    return {
      year: '0', apis: Object.keys(apiHost)
    }
  },
  computed: {
    ...mapGetters(['apiHost']),
  },
  created() {
    this.year = this.$U.getYear();
  },
  methods: {
    handleChangeHost(api) {
      localStorage.setItem('apiHost', api);
      this.$store.commit('setApiHost', api);
    }
  }
}
</script>
<style lang="less">
.footer {
  color: #fff;
  background: #333;
  .container {
    padding-top: 20px;
    padding-bottom: 20px;
  }
  .records {
    padding-top: 10px;
    text-align: center;
    a {
      color: #2d8cf0;
    }
  }
}
</style>
