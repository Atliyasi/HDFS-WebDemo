<template>
    <div class="user-add">
        <el-form ref="form" :model="form" label-width="40%">
            <el-form-item label="头像">
                <el-upload
                class="avatar-uploader"
                action="http://172.16.4.224:8080/info/posts/"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="form.imageUrl" :size="70" :src="form.imageUrl" class="avatar">
                <i v-else  class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="昵称" >
                <el-input v-model="form.nicheng"></el-input>
            </el-form-item>
            <el-form-item label="性别">
                <el-select v-model="form.sex" placeholder="请选择性别">
                    <el-option label="男" value="男"></el-option>
                    <el-option label="女" value="女"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="年龄" >
                <el-input v-model="form.age"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" >
                <el-input v-model="form.mail" type="email"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit" round>保 存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import Axios from 'axios';
import store from '@/store/index';
import { request } from 'http';
    export default {
      data() {
        return {
            form: {
                nicheng:'',
                sex: '',
                age: '',
                mail: '',
                imageUrl: 'https://img.ixintu.com/download/jpg/20210209/9e842a3dbf66252db019066904662f47_512_512.jpg!bg',
            }
        }
      },
      methods: {
        handleAvatarSuccess(res, file) {
            this.form.imageUrl = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            Axios.post("http://172.16.4.224:8080/info/Uname",{
                uname : store.getters.name,
            })
            return isJPG && isLt2M;
        },
        onSubmit() {
            Axios.post("http://172.16.4.224:8080/info/insert",{
                uname : store.getters.name,
                nicheng : this.form.nicheng,
                sex: this.form.sex,
                age: this.form.age,
                mail: this.form.mail
            }),
            alert('保存成功!');
        },
      },
      created: function(){
            Axios.post("http://172.16.4.224:8080/info/select",{
                uname: store.getters.name,
            }).then((response)=>{
                this.form.nicheng = response.data.name,
                this.form.age = response.data.age,
                this.form.sex = response.data.sex,
                this.form.mail = response.data.mail
            }),
            Axios.post("http://172.16.4.224:8080/info/getImg",{
                uname: store.getters.name,
            },{responseType: "blob"}).then((response)=>{
                let blob = new Blob([response.data],{type: "image/jpeg"});
                if(blob.size != 0){
                    let url = window.URL.createObjectURL(blob);
                    this.form.imageUrl = url;  
                }
            })
        },
    }
</script>
<style lang="scss" scoped>
    .user{
        &-add{
            height: 10vh;
            width: 100%;
            margin: 7% auto auto auto;
            .el-input {
                width: 300px;
            }
            .el-select{
                width: 300px;
            }
        }
    }
    .avatar {
    width: 100px;
    height: 100px;
    Border-radius: 50%;
    display: block;
  }
</style>