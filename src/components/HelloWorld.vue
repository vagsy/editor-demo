<template>
  <div class="hello">
    <vue-ueditor-wrap v-model="msg" :config="myConfig"></vue-ueditor-wrap>
    <button @click="save">提交</button>
    <!-- <iframe id='previewPdf' :src="pdfUrl" height="560" width="100%"></iframe> -->
    <pdf-view :initPdf="loadPdf"></pdf-view>
    <!-- <pdf-view1></pdf-view1> -->
    <div v-html="editorContent"></div>
    <editor v-model="editorContent"></editor>
  </div>
</template>

<script>
import VueUeditorWrap from 'vue-ueditor-wrap'
import PdfView from './PdfView.vue'
import PdfView1 from './PdfView1.vue'
import Editor from './Editor'
import axios from 'axios'
export default {
  name: 'HelloWorld',
  components: {
    VueUeditorWrap,
    PdfView,
    PdfView1,
    Editor
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      myConfig: {
        toolbars: [
          [
            'source', // 源代码
            'anchor', // 锚点
            'undo', // 撤销
            'redo', // 重做
            'bold', // 加粗
            'indent', // 首行缩进
            'italic', // 斜体
            'underline', // 下划线
            'strikethrough', // 删除线
            'subscript', // 下标
            'fontborder', // 字符边框
            'superscript', // 上标
            'formatmatch', // 格式刷
            'blockquote', // 引用
            'pasteplain', // 纯文本粘贴模式
            'selectall', // 全选
            'preview', // 预览
            'horizontal', // 分隔线
            'removeformat', // 清除格式
            'time', // 时间
            'date', // 日期
            'unlink', // 取消链接
            'insertrow', // 前插入行
            'insertcol', // 前插入列
            'mergeright', // 右合并单元格
            'mergedown', // 下合并单元格
            'deleterow', // 删除行
            'deletecol', // 删除列
            'splittorows', // 拆分成行
            'splittocols', // 拆分成列
            'splittocells', // 完全拆分单元格
            'deletecaption', // 删除表格标题
            'inserttitle', // 插入标题
            'mergecells', // 合并多个单元格
            'deletetable', // 删除表格
            'cleardoc', // 清空文档
            'insertparagraphbeforetable', // 表格前插入行
            'fontfamily', // 字体
            'fontsize', // 字号
            'paragraph', // 段落格式
            'edittable', // 表格属性
            'edittd', // 单元格属性
            'searchreplace', // 查询替换
            'help', // 帮助
            'justifyleft', // 居左对齐
            'justifyright', // 居右对齐
            'justifycenter', // 居中对齐
            'justifyjustify', // 两端对齐
            'forecolor', // 字体颜色
            'backcolor', // 背景色
            'insertorderedlist', // 有序列表
            'insertunorderedlist', // 无序列表
            'fullscreen', // 全屏
            'directionalityltr', // 从左向右输入
            'directionalityrtl', // 从右向左输入
            'rowspacingtop', // 段前距
            'rowspacingbottom', // 段后距
            'pagebreak', // 分页
            'imagenone', // 默认
            'imageleft', // 左浮动
            'imageright', // 右浮动
            'attachment', // 附件
            'imagecenter', // 居中
            'lineheight', // 行间距
            'edittip ', // 编辑提示
            'customstyle', // 自定义标题
            'autotypeset', // 自动排版
            'touppercase', // 字母大写
            'tolowercase', // 字母小写
            'background', // 背景
            'inserttable', // 插入表格
            'charts' // 图表
          ]
        ],
        wordCount: false, // 是否开启字数统计
        maximumWords: 1000000, // 允许的最大字符数 [默认值：10000]
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 240,
        // 初始容器宽度
        initialFrameWidth: '100%',
        // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
        serverUrl: '',
        // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
        UEDITOR_HOME_URL: '/service/static/UEditor/'
      },
      pdfUrl: '1',
      editorContent: '1'
    }
  },
  mounted () {
    // this.openPdf()
  },
  methods: {
    save () {
      console.log(this.msg)
    },
    openPdf () {
      axios.get('/api/pdf').then(res => {
        let blob = new Blob([res.data], {
          type: 'application/pdf'
        })
        this.pdfUrl = '/service/static/pdf/web/viewer.html?file=' + encodeURIComponent(URL.createObjectURL(blob)) + '.pdf'
      })
    },
    loadPdf () {
      return axios({
        method: 'post',
        url: '/api/pdf',
        data: {},
        responseType: 'arraybuffer'
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
