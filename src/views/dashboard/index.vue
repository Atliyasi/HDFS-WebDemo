<template>
  <div class="dashboard-container">
    <div class="dashboard-text" >欢迎: {{ nicheng }}
      <p>本产品目前处于开发阶段</p>
    </div>
  </div>
</template>

<script>
import Axios from 'axios';
import store from '@/store/index';
import { mapGetters } from 'vuex';
export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters(
      ['name','passwd']
      )
  },
  data(){
    return{
      nicheng: '',
    };
  },
  created: function(){
            Axios.post("http://172.16.4.224:8080/info/select",{
                uname: store.getters.name,
            }).then((response)=>{
                this.nicheng = response.data.name
            })
        },
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
