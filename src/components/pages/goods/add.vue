<template>
    <el-card>
        <!-- 面包屑导航 -->
        <MyBread firstnav="商品管理" lastnav="商品列表" />
        <!-- 消息提示 -->
        <el-alert class="myalert" title="添加商品信息" type="info" center show-icon>
        </el-alert>
        <!-- 步骤条 -->
        <!-- 
                                                    active：当前步骤条进度
                                                 -->
        <el-steps class="mystep" :active="active" align-center finish-status="success">
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
        </el-steps>
        <!-- tab 栏 -->
        <!-- 
                                                tab-position：tab 栏标题的位置
                                                tab-click事件：
                                             -->
        <el-tabs @tab-click="tabclick" tab-position="left">
            <el-tab-pane label="基本信息">
                <el-form label-position="top" :model="addObj" status-icon class="demo-ruleForm">
                    <el-form-item label="商品名称">
                        <el-input type="text" v-model="addObj.goods_name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格">
                        <el-input type="text" v-model="addObj.goods_price" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量">
                        <el-input v-model="addObj.goods_weight"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量">
                        <el-input v-model="addObj.goods_number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类">
                        {{ cascaderValue }}
                        <!-- 
                                                    expand-trigger：设置扩展子元素的方式
                                                    options：设置数据源
                                                    v-model：绑定选中的值（数组）
                                                 -->
                        <el-cascader :props="props" expand-trigger="hover" :options="cateList" v-model="cascaderValue">
                        </el-cascader>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="商品参数">
                <div v-for="item in manyParams" :key="item.attr_id">
                    <p>{{item.attr_name}}</p>
                    <div>
                        <el-checkbox v-model="check" v-for="(item1,index) in item.attr_vals.split(',')" :key="index" :label="item1" border></el-checkbox>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="商品属性">
                <div class="my-form" v-for="item in onlyParams" :key="item.attr_id">
                    <p>{{item.attr_name}}</p>
                    <div>
                        <input type="text" v-model="item.attr_vals">
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="商品图片">
                <!-- 
                                el-upload: 上传图片框
                                    action：当前上传框上传图片的路径
                                    on-preview：点击已经上传的文件时会触发的钩子函数
                                    on-remove： 点击已经上传的文件右上角的关闭按钮时会触发的钩子函数
                                    file-list：上传的文件列表
                                    
                             -->
                {{ addObj.pics }}
                <el-upload :on-preview="uploadpreview" :on-remove="uploadremove" :on-success="uploadsuccess" :headers="headers" class="upload-demo" action="http://localhost:8888/api/private/v1/upload" list-type="picture">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
            </el-tab-pane>
            <el-tab-pane label="商品内容">
                <el-button @click="add">新增数据</el-button>
                <quill-editor v-model="goods_introduce" ref="myQuillEditor">
                </quill-editor>
            </el-tab-pane>
        </el-tabs>
        <!-- 预览图片 -->
        <el-dialog title="图片预览" :visible.sync="previewDialog">
            <img class="myimg" ref="myImg" src="#" />
        </el-dialog>
    </el-card>
</template>

<script>
export default {
    data() {
        return {
            check: true,
            // 步骤条默认的状态
            active: 0,
            // 要添加元素的信息
            addObj: {
                goods_name: '',
                goods_cat: '',
                goods_price: '',
                goods_number: '',
                goods_weight: '',
                goods_introduce: '',
                pics: []
            },
            // 级联框中选中值的 value 的集合
            cascaderValue: [],
            // 分类参数的数据源
            cateList: [],
            // 设置级联框中的选项
            props: {
                label: 'cat_name',
                value: 'cat_id'
            },
            // 保存动态参数（商品参数）
            manyParams: [],
            // 保存静态参数（商品属性）
            onlyParams: [],
            // 设置上传请求头
            headers: {
                'Authorization': window.localStorage.getItem('token')
            },
            // 图片的预览框
            previewDialog: false
        }
    },
    methods: {
        // 提交商品数据
        async add() {
            // 将 分类得到：
            var cates = this.cascaderValue.join(',')
            this.addObj.goods_cat = cates
            var res = await this.$http.post('/goods', this.addObj)
            var meta = res.data.meta
            if (meta.status === 201) {
                this.$router.push('/goods')
                this.$message({
                    message: meta.msg,
                    type: 'success'
                })
            } else {
                this.$message.error(meta.msg)
            }
        },
        // 上传文件成功后的回调函数
        uploadsuccess(response, file, fileList) {
            // response:服务器响应回来的数据
            //  data
            //      tmp_path：临时目录
            //      url：网络地址
            // file: 图片相关信息
            // fileList: 图片上传集合
            if (file.status === 'success') {
                // 将图片信息保存到 fileList 中
                this.addObj.pics.push(response.data.tmp_path)
                this.$message({
                    message: file.response.meta.msg,
                    type: 'success'
                })
            } else {
                this.$message.error('上传出错啦')
            }
        },
        // 删除上传文件
        uploadremove(file, fileList) {
            // 将移除的图片从数组中删除
            // console.log(file.response.data.tmp_path)
            for (var i = 0; i < this.addObj.pics.length; i++) {
                if (this.addObj.pics[i] === file.response.data.tmp_path) {
                    this.addObj.pics.splice(i, 1)
                    this.$message({
                        message: '移除成功',
                        type: 'success'
                    })
                    break
                }
            }
        },
        // 预览图片
        uploadpreview(file) {
            // 1.0 打开预览面板
            this.previewDialog = true
            // 2.0 显示图片
            // 这段代码应该在渲染前面之前执行
            // $nextTick 如果调用这个方法，会再次生成 dom
            this.$nextTick(function() {
                this.$refs.myImg.src = file.response.data.url
            })
        },
        tabclick(ev) {
            // ev.index 被点击 tab 的索引
            this.active = Number(ev.index)
            if (ev.index === '1') {
                this.getParams('many')
            }
            if (ev.index === '2') {
                this.getParams('only')
            }
        },
        // 得到所有的分类数据
        async getAllCate() {
            var res = await this.$http.get('/categories?type=3')
            var { meta, data } = res.data
            if (meta.status === 200) {
                this.cateList = data
            } else {
                this.$message.error(meta.msg)
            }
        },
        async getParams(sel) {
            if (this.cascaderValue.length != 0) {
                var id = this.cascaderValue[this.cascaderValue.length - 1]
                var res = await this.$http.get(`/categories/${id}/attributes?sel=${sel}`)
                var { meta, data } = res.data
                if (meta.status === 200) {
                    if (sel === 'many') {
                        this.manyParams = data
                    } else {
                        this.onlyParams = data
                    }
                } else {
                    this.$message.error(meta.msg)
                }
            } else {
                this.$message.error('参数不能为空')
            }
        }
        // // 得到分类的动态参数（商品参数）
        // async getManyData() {
        //     if (this.cascaderValue.length != 0) {
        //         var id = this.cascaderValue[this.cascaderValue.length - 1]
        //         var res = await this.$http.get(`/categories/${id}/attributes?sel=many`)
        //         var { meta, data } = res.data
        //         if (meta.status === 200) {
        //             this.manyParams = data
        //         } else {
        //             this.$message.error(meta.msg)
        //         }
        //     } else {
        //         this.$message.error('参数不能为空')
        //     }
        // },
        // // 得到分类的静态参数（商品属性）
        // async getOnlyData() {
        //     var id = this.cascaderValue[this.cascaderValue.length - 1]
        //     var res = await this.$http.get(`categories/${id}/attributes?sel=only`)
        //     var {meta, data} = res.data
        //     if (meta.status === 200) {
        //         this.onlyParams = data
        //         console.log(data)
        //     } else {
        //         this.$message.error(meta.msg)
        //     }
        // }
    },
    mounted() {
        this.getAllCate()
    }
}
</script>

<style>
.myalert {
    margin-top: 15px;
    margin-bottom: 15px;
}

.el-step__title {
    font-size: 12px;
}

.my-form {
    margin: 10px 0px;
}

.my-form input {
    width: 99%;
    height: 25px;
    margin-top: 10px;
}

.myimg {
    width: 100%;
}
div#pane-4 {
    height: 500px;
}
.quill-editor {
    height: 400px;
}
</style>
