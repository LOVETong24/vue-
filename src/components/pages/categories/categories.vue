<template>
    <el-card>
        <!-- 面包屑导航 -->
        <MyBread firstnav="商品管理" lastnav="商品分类" />
        <!-- 添加分类按钮 -->
        <el-row>
            <el-col :span="24">
                <el-button>添加分类</el-button>
            </el-col>
        </el-row>
        <!-- 表格区域 -->
        <!-- 
                                data： 数据源
                                file-icon：文件图标
                                folder-icon：文件夹图片
                                prop： 设置数据源中显示的属性
                                label：列的标题
                             -->
        <el-table :data="cateList" border max-height="400">
            <el-table-tree-column levelKey="cat_level" treeKey="cat_id" parentKey="cat_pid" file-icon="icon icon-file" folder-icon="icon icon-folder" prop="cat_name" label="分类名称" width="320"></el-table-tree-column>
            <el-table-column label="级别">
                <template slot-scope="scope">
                    <span v-if="scope.row.cat_level === 0">一级</span>
                    <span v-else-if="scope.row.cat_level === 1">二级</span>
                    <span v-else>三级</span>
                </template>
            </el-table-column>
            <el-table-column prop="cat_deleted" label="是否有效">
                
                <template slot-scope="scope">
                    <span v-if="scope.row.cat_deleted === false">有效</span>
                    <span v-else-if="scope.row.cat_deleted === true">无效</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot="scope">
                    <el-button plain size="mini" type="primary" icon="el-icon-edit"></el-button>
                    <el-button plain size="mini" type="danger" icon="el-icon-delete"></el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script>
export default {
    data() {
        return {
            cateList: []
        }
    },
    methods: {
        // 获取商品分类
        async getCateList() {
            var res = await this.$http.get('categories?type=3')
            var { meta, data } = res.data
            if (meta.status === 200) {
                this.cateList = data
            } else {
                this.$message.error(meta.msg)
            }
        }
    },
    mounted() {
        this.getCateList()
    }
}
</script>

<style>

</style>
