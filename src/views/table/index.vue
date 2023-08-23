<template>
  <div class="index-container" >
      <el-table
            :data="fileList"
            style="width: 100%"
            :row-class-name="tableRowClassName" >
            <el-table-column prop="id" label="序号"></el-table-column>
            <el-table-column prop="date" label="上传日期"></el-table-column>
            <el-table-column prop="filename" label="文件名"></el-table-column>
            <el-table-column prop="size" label="文件大小"></el-table-column>
            <el-table-column fixed="right" label="操作" width="350">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-download" @click="open1(scope.$index)"  size="small">下载</el-button>
                <el-button type="primary" icon="el-icon-delete" @click="open2(scope.$index)"  size="small">删除</el-button>
                <el-button type="primary" icon="el-icon-s-promotion" size="small" @click="open3(scope.$index)" >分享</el-button>
                <el-button type="primary" icon="el-icon-share" size="small" @click="open4(scope.$index)" >共享</el-button>
              </template>
            </el-table-column>
        </el-table>
      <el-upload
      class="upload-demo"
      ref="upload"
      action="http://172.16.4.224:8080/file/Upload"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :file-list="upfile"
      :auto-upload="false">
      <el-button slot="trigger" size="small" type="primary" @click="open5()">选取文件</el-button>
      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
      <el-button type="primary" size="small" @click="openFullScreen1" v-loading.fullscreen.lock="fullscreenLoading">刷新列表</el-button>
      <div slot="tip" class="el-upload__tip">单次上传不超过5GB</div>
    </el-upload>
  </div>
</template>

<script>
import Axios from 'axios';
import store from '@/store/index';
export default{
  methods: {
      tableRowClassName({row, rowIndex}) {
        if (rowIndex % 4 === 1) {
          return 'warning-row';
        } else if (rowIndex % 4 === 3) {
          return 'success-row';
        }
        return '';
      },
      submitUpload() {
        this.$refs.upload.submit();
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      openFullScreen1() {
        this.fullscreenLoading = true;
        setTimeout(() => {
          this.fullscreenLoading = false;
        }, 2000);
        Axios.post("http://172.16.4.224:8080/file/list",{
          uname: store.getters.name,
          passwd: store.getters.passwd
        }).then((response)=>{
          this.fileList = response.data.data
        })
      },
      openFullScreen2() {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        setTimeout(() => {
          loading.close();
        }, 2000);
 
      },
      open1(index) {
          Axios.post("http://172.16.4.224:8080/file/Download",{
          hname : this.fileList[index].filename,
          uid : this.UID
        },{responseType: "blob"}).then(res => {
            let fileName = this.fileList[index].filename;
            this.endfilename = fileName.split(".");
            let blob = new Blob([res.data],{type: this.blobJson[this.endfilename[1]]});  
            if ('download' in document.createElement("a")) {
                const link = document.createElement("a");
                link.download = fileName;
                link.style.display = 'none';
                const url = window.URL || window.webkitURL || window.moxURL;
                link.href = url.createObjectURL(blob);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);  //  下载完成移除元素
                url.revokeObjectURL(link.href);  // 释放掉blob对象
            } else {
                navigator.msSaveBlob(blob, fileName);
            }            
            this.$notify({
              title: '成功',
              type: 'success',
              message: this.fileList[index].filename+'==>创建下载链接成功',
            });
            }).catch(err=>{
              this.$notify.error({
              title: '错误',
              message: this.fileList[index].filename+'=/=>创建下载链接失败'
            });
            });
      },
      open2(index) {
          Axios.post("http://172.16.4.224:8080/file/Delete",{
          hname : this.fileList[index].filename,
          uid : this.UID,
        })
          this.$notify({
            title: '成功',
            type: 'success',
            message: this.fileList[index].filename+'删除成功',
          });
      },
      open3(index) {
        this.Hname = this.fileList[index].filename
        this.$prompt('请输入被分享者的UID', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          Axios.post("http://172.16.4.224:8080/stare/sf",{
              hname : this.Hname,
              pid : value,
              uid : this.UID
        })
          this.$notify({
              title: '成功',
              type: 'success',
              message: '分享成功',
            });
        }).catch(() => {
          this.$notify.info({
            title: '取消',
            message: '取消分享',
          });       
        })
      },
      open4(index) {
        this.Hname = this.fileList[index].filename
          Axios.post("http://172.16.4.224:8080/public/Upload",{
              hname : this.Hname,
              uname : store.getters.name
        })
        this.$notify({
              title: '成功',
              type: 'success',
              message: '共享成功',
              position: 'bottom-right'
            });
      },
      open5(){
        Axios.post("http://172.16.4.224:8080/file/setUID",{
          uid: this.UID,
        })
      }
    },
  created: function(){
      Axios.post("http://172.16.4.224:8080/file/list",{
        uname: store.getters.name,
        passwd: store.getters.passwd
      }).then((response)=>{
        this.fileList = response.data.data
      }),
      Axios.post("http://172.16.4.224:8080/public/getUID",{
            uname: store.getters.name,
        }).then((response)=>{
            this.UID = response.data.uid
        })
    },
  data(){
      return{
        dialogFormVisible: false,
        fileList:[],
        endfilename:[],
        upfile:[],
        fullscreenLoading: false,
        Hname:'',
        UID:'',
        blobJson:{
            aac:"audio/aac",
            abw:"application/x-abiword",
            arc:"application/x-freearc",
            avi:"video/x-msvideo",
            azw:"application/vnd.amazon.ebook",
            bin:"application/octet-stream",
            bmp:"image/bmp",
            bz:"application/x-bzip",
            bz2:"application/x-bzip2",
            csh:"application/x-csh",
            css:"text/css",
            csv:"text/csv",
            doc:"application/msword",
            docx:"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            eot:"application/vnd.ms-fontobject",
            epub:"application/epub+zip",
            gif:"image/gif",
            htm:"text/html",
            html:"text/html",
            ico:"image/vnd.microsoft.icon",
            ics:"text/calendar",
            jar:"application/java-archive",
            jpeg:"image/jpeg",
            jpg:"image/jpeg",
            js:"text/javascript",
            json:"application/json",
            jsonld:"application/ld+json",
            mid:"audio/midi audio/x-midi",
            midi:"audio/midi audio/x-midi",
            mjs:"text/javascript",
            mp3:"audio/mpeg",
            mpeg:"video/mpeg",
            mpkg:"application/vnd.apple.installer+xml",
            odp:"application/vnd.oasis.opendocument.presentation",
            ods:"application/vnd.oasis.opendocument.spreadsheet",
            odt:"application/vnd.oasis.opendocument.text",
            oga:"audio/ogg",
            ogv:"video/ogg",
            ogx:"application/ogg",
            otf:"font/otf",
            png:"image/png",
            pdf:"application/pdf",
            ppt:"application/vnd.ms-powerpoint",
            pptx:"application/vnd.openxmlformats-officedocument.presentationml.presentation",
            rar:"application/x-rar-compressed",
            rtf:"application/rtf",
            sh:"application/x-sh",
            svg:"image/svg+xml",
            swf:"application/x-shockwave-flash",
            tar:"application/x-tar",
            tif:"image/tiff",
            tiff:"image/tiff",
            ttf:"font/ttf",
            txt:"text/plain",
            vsd:"application/vnd.visio",
            wav:"audio/wav",
            weba:"audio/webm",
            webm:"video/webm",
            woff:"font/woff",
            woff2:"font/woff2",
            xhtml:"application/xhtml+xml",
            xls:"application/vnd.ms-excel",
            xlsx:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            xml:"text/xml",
            xul:"application/vnd.mozilla.xul+xml",
            zip:"application/zip",
            "3gp":"video/3gpp、audio/3gpp",
            "3g2":"video/3gpp2、audio/3gpp2",
            "7z":"application/x-7z-compressed",
          },
      }  
  },
}
</script>

<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
  .index-container {
      text-align: center;
    }
</style>
