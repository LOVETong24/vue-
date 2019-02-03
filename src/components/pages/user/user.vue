<template>
  <el-card>
    <!-- 面包屑导航 -->
    <!-- 
                                                            el-breadcrumb
                                                                separator-class：设置面包屑导航之间的分隔符号
                                                            el-breadcrumb-item：导航
                                                                to: 跳转的路径
    -->
    <!-- <el-breadcrumb separator-class="el-icon-more">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>-->
    <MyBread firstnav="用户管理" lastnav="用户列表"/>
    <!-- 搜索框 -->
    <!-- 
                                                            el-input：
    -->
    <el-row class="search">
      <el-col :span="8">
        <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="serachData"></el-button>
        </el-input>
      </el-col>
      <el-col :span="16">&nbsp;&nbsp;
        <el-button type="success" plain @click="addDialog=true">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格区域 -->
    <!-- 
                                                            el-table:
                                                                data: 绑定的数据源
                                                                border：设置边框
                                                            el-table-column：表格中的一列 
                                                                prop: 从数据源中得到 date 属性
    -->
    <el-table :data="dataList" border style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          {{ scope.row.id }}
          <el-switch
            @change="change(scope.row.id, scope.row.mg_state)"
            v-model="scope.row.mg_state"
          ></el-switch>
          <!-- scope.row: 当前行的数据源对象 -->
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            @click="openEidt(scope.row.id)"
            plain
            size="mini"
            type="primary"
            icon="el-icon-edit"
          ></el-button>
          <el-button
            @click="del(scope.row.id)"
            plain
            size="mini"
            type="danger"
            icon="el-icon-delete"
          ></el-button>
          <el-button
            @click="role(scope.row.id)"
            plain
            size="mini"
            type="success"
            icon="el-icon-check"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <!-- 
                                                            el-pagination：
                                                                size-change事件：当页容器改变时触发
                                                                current-change事件：当从一页跳转到另一页时触发
                                                                current-page：当前页
                                                                page-sizes：页容器
                                                                page-size: 页容量
                                                                layout：分页组件的布局
                                                                total：数据总条数
    -->
    <el-pagination
      @current-change="currentChange"
      @size-change="sizeChange"
      :current-page="pagenum"
      :page-sizes="[5, 10]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 新增的弹框区域 -->
    <!-- 
                                                    el-dialog：弹出的对话框
                                                        title：标题
                                                        visible.sync：控制对话框是否显示
                                                    
    -->
    <el-dialog title="新增用户" :visible.sync="addDialog">
      <el-form ref="myform" :model="addObj" label-position="right">
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="addObj.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="100px">
          <el-input v-model="addObj.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="addObj.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="addObj.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancle">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改的弹框区域 -->
    <el-dialog title="修改用户" :visible.sync="editDialog">
      <el-form ref="myform" :model="editObj" label-position="right">
        <el-form-item label="用户名" label-width="100px">
          <el-input :disabled="true" v-model="editObj.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="editObj.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="editObj.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editcancle">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色的弹框区域 -->
    <el-dialog title="分配角色" :visible.sync="roleDialog">
      <el-form ref="myform" :model="roleObj" label-position="right">
        <el-form-item label="用户名" label-width="100px">
          <el-input :disabled="true" v-model="roleObj.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色设置" label-width="100px">
          {{roleObj.rid}}
          <el-select v-model="roleObj.rid" placeholder="请选择">
            <el-option :disabled="true" label="请选择角色" :value="-1"></el-option>
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialog=false">取 消</el-button>
        <el-button type="primary" @click="setRole">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      // 搜索信息
      search: "",
      // 页容量
      pagesize: 5,
      // 当前页
      pagenum: 1,
      // 数据源
      dataList: [],
      // 数据的总条数
      total: 0,
      // 控制新增对话框
      addDialog: false,
      // 控制修改对话框
      editDialog: false,
      // 控制角色对话框
      roleDialog: false,
      addObj: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      editObj: {},
      roleObj: {},
      // 下拉框中的数据源
      rolesList: []
    };
  },
  methods: {
    // 定义一个获取列表数据的方法
    async getAllList() {
      var res = await this.$http.get(
        `/users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${
          this.search
        }`,
        {
          headers: {
            Authorization: window.localStorage.getItem("token")
          }
        }
      );
      var { meta, data } = res.data;
      if (meta.status === 200) {
        this.dataList = data.users;
        this.total = data.total;
      }
    },
    // 当页容量发生改变时会触发
    sizeChange(size) {
      this.pagesize = size;
      // 重新请求数据
      this.getAllList();
    },
    currentChange(num) {
      this.pagenum = num;
      // 重新请求数据
      this.getAllList();
    },
    // 搜索数据
    serachData() {
      this.getAllList();
    },
    // 将新增的数据提交到服务器
    async add() {
      var res = await this.$http.request({
        url: "/users",
        method: "post",
        data: {
          ...this.addObj
        },
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      });
      var { meta } = res.data;
      if (meta.status === 201) {
        // 更新页面
        this.getAllList();
        this.$message({
          message: meta.msg,
          type: "success"
        });
      } else {
        this.$message.error(meta.msg);
      }
      this.addDialog = false;
      this.clearDate(this.addObj);
    },
    // 专门清除对象中的属性：
    clearDate(obj) {
      for (var item in obj) {
        obj[item] = "";
      }
    },
    // 点击面板中取消按钮时执行
    cancle() {
      this.addDialog = false;
      this.clearDate(this.addObj);
    },
    // 当改变开关的状态时会触发
    async change(id, statu) {
      // 发送请求到服务器，修改状态
      var res = await this.$http.request({
        url: `/users/${id}/state/${statu}`,
        method: "put",
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      });
      var { meta } = res.data;
      if (meta.status === 200) {
        this.$message({
          message: meta.msg,
          type: "success"
        });
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 打开修改面板
    async openEidt(id) {
      this.editDialog = true;

      // 根据 id 发送请求，得到数据，渲染到页面上
      var res = await this.$http.request({
        url: `/users/${id}`,
        method: "get",
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      });
      var { meta, data } = res.data;
      if (meta.status === 200) {
        this.editObj = data;
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 提交修改的数据
    async edit() {
      var res = await this.$http.request({
        url: `/users/${this.editObj.id}`,
        method: "put",
        data: {
          email: this.editObj.email,
          mobile: this.editObj.mobile
        },
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      });
      var { meta } = res.data;
      if (meta.status === 200) {
        this.$message({
          message: meta.msg,
          type: "success"
        });
      } else {
        this.$message.error(meta.msg);
      }
      this.editDialog = false;
      this.editObj = {};
      this.getAllList();
    },
    // 修改取消按钮事件
    editcancle() {
      this.editDialog = false;
      this.editObj = {};
    },
    // 删除数据
    del(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          var res = await this.$http.request({
            url: `/users/${id}`,
            method: "delete",
            headers: {
              Authorization: window.localStorage.getItem("token")
            }
          });
          var { meta } = res.data;
          if (meta.status === 200) {
            this.$message({
              message: meta.msg,
              type: "success"
            });
            this.getAllList();
          } else {
            this.$message.error(meta.msg);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 根据id得到用户的信息，填充到面板中
    async role(id) {
      this.getRoleList();
      this.roleDialog = true;
      var res = await this.$http.request({
        url: `/users/${id}`,
        method: "get",
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      });
      var { meta, data } = res.data;
      if (meta.status === 200) {
        this.roleObj = data;
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 动态得到下拉框中的数据
    async getRoleList() {
      var res = await this.$http.request({
        url: `/roles`,
        method: "get",
        headers: {
          Authorization: window.localStorage.getItem("token")
        }
      });
      var { meta, data } = res.data;
      if (meta.status === 200) {
        this.rolesList = data;
      } else {
        this.$message.error("数据查询失败");
      }
    },
    // 提交用户设置的角色
    async setRole() {
      var res = await this.$http.request({
        url: `users/${this.roleObj.id}/role`,
        method: "put",
        headers: {
          Authorization: window.localStorage.getItem("token")
        },
        data: {
          rid: this.roleObj.rid
        }
      });
      var { meta } = res.data;
      if (meta.status === 200) {
        this.$message({
          message: meta.msg,
          type: "success"
        });
        this.roleDialog = false;
        this.getAllList();
      } else {
        this.$message.error(meta.msg);
      }
    }
  },
  mounted() {
    this.getAllList();
  }
};
</script>

<style>
.search {
  margin: 15px 0;
}
</style>
