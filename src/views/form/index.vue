<template>
  <form class="bootstrap-frm" ref="form" @submit.prevent="sendEmail">
    <legend></legend>
    <label>您可以留下邮箱方便我们联系</label>
    <input type="email" name="nicheng"><br>
    <label>类型</label>
    <select name="type">
        <option value="" selected>请选择您提交信息的类型</option>
        <option value="bug">bug</option>
        <option value="建议">建议</option>
    </select><br>
    <label>内容</label>
    <textarea name="content" required></textarea><br>
    <input class="button" type="submit" value="发送">
  </form>
</template>

<script>
import Axios from 'axios';
import store from '@/store/index';
import emailjs from '@emailjs/browser';
export default {
  data() {
    return {
      site: '',
      form: {
        nicheng: '',
        type: '',
        content: ''
      }
    }
  },
  methods: {
    sendEmail() {
      emailjs.sendForm('Gmail', 'my-amazing-template', this.$refs.form, '0n2Xh_9gGls385ohp')
      .then((result) => {
          this.$notify({
              title: '成功',
              type: 'success',
              message: '提交成功感谢您的反馈',
            });
      }, (error) => {
        this.$error({
              title: '失败',
              type: 'success',
              message: '服务器可能在维护中',
            });
      });
    },
    },
  created: function(){
    Axios.post("http://172.16.4.224:8080/info/select",{
      uname: store.getters.name,
    }).then((response)=>{
      this.form.nicheng = response.data.name,
      this.site = "感谢"+response.data.name+"对我们进行建议或bug的提交"
    })
  },
}
</script>
<style  lang="scss" scoped>
.bootstrap-frm {
    // margin: 7%;
    max-width: 500px;
    // background: #FFF;
    padding: 20px 30px 20px 30px;
    color: #888;
    text-shadow: 1px 1px 1px #FFF;
    border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
}

.bootstrap-frm h1 {
    font: 25px "Helvetica Neue", Helvetica, Arial, sans-serif;
    padding: 0px 0px 10px 40px;
    display: block;
    border-bottom: 1px solid #DADADA;
    margin: -10px -30px 30px -30px;
    color: #888;
}

.bootstrap-frm h1>span {
    display: block;
    font-size: 11px;
}

.bootstrap-frm label {
    display: block;
    margin: 0px 0px 5px;
}

.bootstrap-frm label>span {
    float: left;
    width: 20%;
    text-align: right;
    padding-right: 10px;
    margin-top: 10px;
    color: #333;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-weight: bold;
}

.bootstrap-frm input[type="text"], .bootstrap-frm input[type="email"], .bootstrap-frm textarea, .bootstrap-frm select{
    font: 12px "Helvetica Neue", Helvetica, Arial, sans-serif;
    border: 1px solid #CCC;
    color: #888;
    height: 40px;
    line-height:15px;
    margin-bottom: 16px;
    margin-right: 6px;
    margin-top: 2px;
    outline: 0 none;
    padding: 5px 0px 5px 5px;
    width: 70%;
    border-radius: 4px;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
    -moz-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
}

.bootstrap-frm select {
    appearance:none;
    -webkit-appearance:none;
    -moz-appearance: none;
    text-indent: 0.01px;
    text-overflow: '';
    width: 70%;
    height: 35px;
    line-height:15px;
}

.bootstrap-frm textarea{
    height:100px;
    padding: 5px 0px 0px 5px;
    width: 70%;
}

.bootstrap-frm .button {
    text-align: right;
    background: #FFF;
    border: 1px solid #CCC;
    padding: 10px 25px 10px 25px;
    color: #333;
    border-radius: 4px;
}

.bootstrap-frm .button:hover {
    color: #333;
    background-color: #EBEBEB;
    border-color: #ADADAD;
}
</style>

