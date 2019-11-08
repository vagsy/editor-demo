<style>
    .contract-modal {
        position: absolute;
        right: 15%;
        width: 1000px;
        height: 500px;
        overflow: scroll;
        background: #3e3e3e;
        padding: 20px 0 0;
        z-index: 900;
    }
    .contract-modal .contract-detail {
        margin: 0 auto;
        max-width: 96%;
        height: auto;
    }
    .contract-btns{
        height: 50px;
        background-color:  #fff;
        text-align: center;
        padding-bottom:44px;
        padding-top:10px;
    }
    #mycanvas {
        min-height: 50vh;
        background: #fff;
    }
    canvas{
        margin: 0 auto;
        display: block;
        border-bottom:2px solid #aaa;
    }
    .close-btn{
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

<template>
    <div>
        <div class="contract-modal">
            <div class="contract-detail" id="contractDetail">
                <div id="pdfcanvas" ref="pdfcanvas"></div>
            </div>
        </div>
        <!-- <div class="close-btn" @click="closeModal">
            <span style="font-weight: bold; margin-top: 2px;display: inline-block;">X</span>
        </div> -->
    </div>
</template>

<script>
    import pdf from '../../static/pdf/build/pdf'
    import axios from 'axios'
    export default {
        name: 'md-contract',
        props: {
        },
        data () {
            return {}
        },
        mounted () {
            this.getPdf()
        },
        methods: {
            handleError (status) { //  合同有误
                this.contractError = status
            },
            closeModal () {
                this.$emit('handleModal')
            },
            confirm () { //  我已确认合同内容
                alert('success')
            },
            commit () { //  提交错误消息
                alert('error')
            },
            getPage (pdf, pageNumber, container, numPages) { //获取pdf
                let _this = this

                pdf.getPage(pageNumber).then(function(page) {
                    let scale = (container.offsetWidth/page.view[2])
                    let viewport = page.getViewport(scale)
                    let canvas = document.createElement("canvas")
                    canvas.width= viewport.width
                    canvas.height= viewport.height
                    container.appendChild(canvas)
                    let ctx = canvas.getContext('2d');
                    var renderContext = {
                        canvasContext: ctx,
                        viewport: viewport
                    };
                    page.render(renderContext).then(() => {
                        pageNumber +=1
                        if(pageNumber <= numPages) {
                            _this.getPage(pdf, pageNumber, container, numPages)
                        }
                    })
                });
            },
            blobToDataURI: function (blob, callback) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    callback(e.target.result);
                }
                reader.readAsDataURL(blob);
            },
            getPdf () {
                let _this = this
                // 此中方式接受流形式返回
                axios({
                    method: 'post',
                    url: '/api/pdf',
                    data: {},
                    responseType: 'arraybuffer'
                }).then(res => {
                    let blob = new Blob([res.data], { type: 'application/pdf' })
                    // let blob = new Blob([res.data], { type: 'application/octet-stream' });
                    this.blobToDataURI(blob, data => {
                        this.$refs.pdfcanvas.scrollTop = 0
                        data = data.replace('data:application/pdf;base64,', '')
                        let pdfjsLib = pdf;
                        pdfjsLib.GlobalWorkerOptions.workerSrc = '/service/static/pdf/build/pdf.worker.js';
                        let loadingTask = pdfjsLib.getDocument({data: atob(data)})
                        
                        loadingTask.promise.then(function(pdf) {
                            let numPages = pdf.numPages
                            let container = document.getElementById('pdfcanvas')
                            let pageNumber = 1
                            _this.getPage(pdf, pageNumber, container, numPages)
                        }, function (reason) {
                            console.error(reason);
                        });
                    })

                })
            }
        }
    }
</script>
