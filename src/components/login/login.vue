<template>
    <div class="box">
        <div class="content">
            <h2>用户登录</h2>
            <!-- element 中的表单组件 -->
            <!-- 
                                el-form：表单组件
                                    model：绑定数据源
                                    status-icon：验证结果的状态图片
                                    rules：表单验证的规则
                                    ref: vue 中的操作 dom 的方式
                                    label-width：表头文件的宽度
                                    label-position：设置表头文件的位置
                                el-form-item：表单组件中的表单选项
                                    label：标题
                                    prop：表单验证的属性
                                 el-input：表单组件的 input 元素

                             -->
            <el-form label-position="top" :rules="rules" :model="loginObj" status-icon ref="loginRule" label-width="100px" class="demo-ruleForm">
                <el-form-item label="用户名" prop="username">
                    <el-input type="text" v-model="loginObj.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="loginObj.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="mybtn" type="primary" @click="login()">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loginObj: {
                username: '',
                password: ''
            },
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        login() {
            this.$refs.loginRule.validate( async (valid) => {
                if (valid) {
                    var res = await this.$http.post('/login', this.loginObj)
                    var { meta, data} = res.data
                    if (meta.status === 200) {
                       this.$message({
                           message: meta.msg,
                           type: 'success'
                       })
                       // 保存登录信息可以使用 localstorage
                       // 保存 token
                       window.localStorage.setItem('token', data.token)
                       // 跳转到首页
                       this.$router.push('/home')
                    } else {
                        this.$message.error(meta.msg)
                    }
                } else {
                   this.$message.error('参数不合法')
                }
            } )

            // // 进行数据的验证
            // this.$refs.loginRule.validate((valid) => {
            //     if (valid) {
            //         // 直接发送请求
            //         this.$http.post('/login', this.loginObj)
            //             .then(data => {
            //                 var { meta, data } = data.data
            //                 if (meta.status === 200) {
            //                     alert('登录成功')
            //                 } else {
            //                     alert('登录失败')
            //                 }
            //             })
            //     } else {
            //         alert('参数不合法')
            //     }
            // })
        }
    }
}
</script>

<style>
.box {
    width: 100%;
    height: 100%;
    background: #2C3742;
    position: relative;
}

.content {
    width: 500px;
    padding: 40px;
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 10px;
}

.mybtn {
    width: 100%;
}
</style>
