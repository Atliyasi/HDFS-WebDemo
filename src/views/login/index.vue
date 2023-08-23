<template>
  <div class="login-container">
    <div class="div0">
      <div class="img">
      <img src="./image/yun1.png">
    </div>
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">基于Hadoop的数据共享云平台</h3>
        <h3 class="title">登陆界面</h3>
      </div>
      <el-form-item prop="username">
        <el-input
          id="input1"
          ref="uname"
          v-model="loginForm.uname"
          placeholder="请输入账号"
          name="uname"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="passwd">
        <el-input
          id="input1"
          :key="passwdType"
          ref="passwd"
          v-model="loginForm.passwd"
          :type="passwdType"
          placeholder="请输入密码"
          name="passwd"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
          show-password
        />        
      </el-form-item>
      <el-button class="button1" :loading="loading" type="danger" style="width:75%;margin-bottom:30px; background: transparent;" @click.native.prevent="handleLogin" plain>登 陆</el-button>
      <div class="tips">
        <el-button class="button1" type="success" style="margin-right:20px;background: transparent;" @click="dialogFormVisible = true" plain>注册账号</el-button>
      </div>
      </el-form>
        <div class="zhuce">
            <el-dialog class="dialog1" title="注册账号" :visible.sync="dialogFormVisible" width="30%" >
              <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="账号" prop="checkName">
                <el-input v-model="ruleForm.checkName"
                style="background: rgba(20%, 50%, 60%, 0.1);"
                ></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="pass">
                <el-input type="password" v-model="ruleForm.pass" autocomplete="off" 
                style="background: rgba(20%, 50%, 60%, 0.1); "
                ></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="checkPass">
                <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"
                style="background: rgba(20%, 50%, 60%, 0.1);"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
              </el-form-item>
              </el-form>
          </el-dialog>
        </div>
    </div>
    <div class="ivu-global-footer i-copyright">
       <div class="ivu-global-footer-links">
          <a>感谢您的使用</a>
       </div>
       <div class="ivu-global-footer-copyright">{{copyright}}</div>
    </div>
  </div>
</template>

<script>
import { validuname } from '@/utils/validate'
import Axios from 'axios';
export default {
  name: 'Login',
  data() {
    const validateuname = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatepasswd = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码长度需要大于6位'))
      } else {
        callback()
      }
    }
    var checkname = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('账号不能为空'));
        }
        setTimeout(() => {
            if (value.length > 18) {
              callback(new Error('账号长度不能超过18'));
            } else {
              this.checkName = value,
              callback()
            }
          }, 1000);
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (value.length < 6){
            callback(new Error('密码长度需要大于6位'));
          } else{
            if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
          }
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          this.checkPass = value,
          callback()
        }
      };
    return {
      copyright: '版权所属 © 2023 | 果粒橙团队',
      dialogFormVisible: false,
      loginForm: {
        uname: '',
        passwd: '',
      },
      ruleForm: {
          pass: '',
          checkPass: '',
          checkName: ''
        },
      rules: {
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
          checkName: [
            { validator: checkname, trigger: 'blur' }
          ]
        },
      loginRules: {
        uname: [{ required: true, trigger: 'blur', validator: validateuname }],
        passwd: [{ required: true, trigger: 'blur', validator: validatepasswd }]
      },
      loading: false,
      passwdType: 'passwd',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwdType === 'passwd') {
        this.passwdType = ''
      } else {
        this.passwdType = 'passwd'
      }
      this.$nextTick(() => {
        this.$refs.passwd.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            console.log("loginForm--->"+this.loginForm["passwd"]);
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            Axios.post("http://172.16.4.224:8080/usr/save",{
                uname : this.checkName,
                passwd : this.checkPass
            })
            alert('注册成功!');
          } else {
            console.log('注册失败!!');
            return false;
          }
        });
      },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
}
</script>

<style lang="scss">
$bg:#010305;
$light_gray: #0400ff;
$cursor: #2e2727;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}
.login-container 
    .el-input__inner::placeholder {
      color: #151736;
      opacity: 0.5;
    }
  #input1 {
    width: 400px;
    height: 100%;
    margin-bottom: 20px;
    font-weight: bold;
    outline: none;
    border: 0;
    padding: 10px;
    background-color: transparent;
    border-bottom: 3px solid rgb(150, 150, 240);
    font: 900 16px '';
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
</style>

<style lang="scss" scoped>
$bg:#8bb6ee; //背景颜色
$dark_gray:#2a84b4;  //头像颜色
$light_gray:rgb(38, 152, 197);  //标题颜色
.login-container {
  padding: 0;
  margin: 0;
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  min-height: 100%;
  min-width: 100%;
  background-image: linear-gradient(to right bottom, #0f2a45, #413a5a, #6d4a67, #945d6c, #b2776f, #bc826f, #c48f70, #ca9c71, #cc986c, #ce9467, #d09063, #d28b5f);;
  background-size:100% 100%;
  overflow: hidden;
  .div0{
    display: flex ;
    flex-direction: row;
    box-shadow: 0 0 20px #ccc9f8;
  }
  .login-form {
      position: relative;
      overflow: hidden;
      z-index: 6;
      width: 550px;
      height: 753px;
      display: flex ;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: linear-gradient(
          to right bottom,
          rgba(255,255,255,.7),
          rgba(255,255,255,.5),
          rgba(255,255,255,.4)
      );
            /* 使背景模糊化 */
      backdrop-filter: blur(10px);
      // box-shadow: 0 0 20px #ccc9f8;
      // border-radius: 15px; 
  }
  .tips {
    font-size: 14px;
    color: #0de61f;
    margin-bottom: 10px;
    justify-content:flex-start;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .button1 {
    padding: 1em 2em;
    border: none;
    border-radius: 5px;
    font-weight: bold;
    letter-spacing: 5px;
    text-transform: uppercase;
    color: #2c9caf;
    transition: all 1000ms;
    font-size: 15px;
    position: relative;
    overflow: hidden;
    outline: 2px solid #2c9caf;
  }
  .button1:hover {
    color: #ffffff;
    transform: scale(1.1);
    outline: 2px solid #70bdca;
    box-shadow: 4px 5px 17px -4px #268391;
  }

  .button1::before {
    content: "";
    position: absolute;
    left: -50px;
    top: 0;
    width: 0;
    height: 100%;
    background-color: #2c9caf;
    transform: skewX(45deg);
    z-index: -1;
    transition: width 1000ms;
  }

  .button1:hover::before {
    width: 250%;
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
.ivu-global-footer {
      margin: 5px 0px;
      text-align: center;
      box-sizing: border-box;
      position:fixed;
      bottom:0;
    }
     .i-copyright {
       flex: 0 0 auto;
     }
    .ivu-global-footer-links {
      margin-bottom: 5px;
    }
    .ivu-global-footer-links a:not(:last-child) {
      margin-right: 40px;
    }
     .ivu-global-footer-links a {
       font-size: 14px;
       color: #808695;
       transition: all .2s ease-in-out;
     }
    .ivu-global-footer-copyright {
      color: #808695;
      font-size: 14px;
    }
</style>