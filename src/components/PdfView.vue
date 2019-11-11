<template>
  <div>
    <div class="pdf-view">
      <div class="pdf-view-detail">
        <div id="pdfcanvas" ref="pdfcanvas"></div>
      </div>
    </div>
    <!-- <div class="close-btn" @click="closeModal">
      <span style="font-weight: bold; margin-top: 2px;display: inline-block;">X</span>
    </div>-->
  </div>
</template>

<script>
import pdf from '../../static/pdf/build/pdf';
import axios from 'axios';
export default {
  name: 'PdfView',
  props: {
    initPdf: {
      type: Function,
      require: true
    }
  },
  data () {
    return {};
  },
  mounted () {
    this.getPdf();
  },
  methods: {
    closeModal () {
      this.$emit("handleModal");
    },
    getPage (pdf, pageNumber, container, numPages) {
      //获取pdf
      let _this = this;

      pdf.getPage(pageNumber).then(page => {
        let scale = container.offsetWidth / page.view[2];
        let viewport = page.getViewport(scale);
        let canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        container.appendChild(canvas);
        let ctx = canvas.getContext('2d');
        var renderContext = {
          canvasContext: ctx,
          viewport: viewport
        };
        page.render(renderContext).then(() => {
          pageNumber += 1;
          if (pageNumber <= numPages) {
            _this.getPage(pdf, pageNumber, container, numPages);
          }
        });
      });
    },
    blobToDataURI (blob, callback) {
      var reader = new FileReader();
      reader.onload = function(e) {
        callback(e.target.result);
      };
      reader.readAsDataURL(blob);
    },
    getPdf() {
      let _this = this;
      // 此中方式接受流形式返回
      _this.initPdf().then(res => {
        let blob = new Blob([res.data], { type: "application/pdf" });
        // let blob = new Blob([res.data], { type: 'application/octet-stream' });
        this.blobToDataURI(blob, data => {
          this.$refs.pdfcanvas.scrollTop = 0;
          data = data.replace('data:application/pdf;base64,', '');
          let pdfjsLib = pdf;
          pdfjsLib.GlobalWorkerOptions.workerSrc = '/service/static/pdf/build/pdf.worker.js';
          let loadingTask = pdfjsLib.getDocument({
            data: atob(data)
          });

          loadingTask.promise.then(pdf => {
              let numPages = pdf.numPages;
              let container = document.getElementById('pdfcanvas');
              let pageNumber = 1;
              _this.getPage(pdf, pageNumber, container, numPages);
            }, reason => {
              console.error(reason);
            }
          );
        });
      });
    }
  }
};
</script>

<style scoped>
.pdf-view {
  right: 15%;
  width: 1000px;
  height: 700px;
  overflow: scroll;
  background: #3e3e3e;
  padding: 20px 0 0;
  z-index: 900;
}

.pdf-view .pdf-view-detail {
  margin: 0 auto;
  max-width: 96%;
  height: auto;
}

.pdf-view canvas {
  margin: 0 auto;
  display: block;
  border-bottom: 2px solid #aaa;
}

.close-btn {
  position: absolute;
  right: 15%;
  width: 26px;
  height: 26px;
  z-index: 999;
  background-color: #666;
  border-radius: 50%;
  cursor: pointer;
}
</style>
