<template>
    <el-table :data="fileList" style="width: 100%" :row-class-name="tableRowClassName">
      <el-table-column  prop="id" label="序号"></el-table-column>
      <el-table-column prop="uname" label="分享者UID"></el-table-column>
      <el-table-column prop="date" label="上传日期"></el-table-column>
      <el-table-column prop="filename" label="文件名"></el-table-column>
      <el-table-column prop="size" label="文件大小"></el-table-column>
      <el-table-column label="操作" width="300">
      <template slot-scope="scope">
          <el-button @click="open1(scope.$index)" type="primary" size="small">下载</el-button>
          <el-button @click="open2(scope.$index)" type="primary" size="small">删除分享</el-button>
      </template>
      </el-table-column>
    </el-table>
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
        open1(index) {
            Axios.post("http://172.16.4.224:8080/stare/Download",{
            hname : this.fileList[index].filename,
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
            Axios.post("http://172.16.4.224:8080/stare/Delete",{
            uid : this.fileList[index].uname,
            hname : this.fileList[index].filename,
          })
          this.$notify({
              title: '成功',
              type: 'success',
              message: '文件：'+this.fileList[index].filename+', 从好友分享列表移除',
            });
        },
      },
    created: function(){
        Axios.post("http://172.16.4.224:8080/stare/view",{
          uname: store.getters.name,
          passwd: store.getters.passwd
        }).then((response)=>{
          this.fileList = response.data.data
        })
      },
    data(){
        return{
          fileList:[],
          upfile:[],
          endfilename:[],
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
        };
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
    .add-container {
      text-align: center;
    }

  </style>
  