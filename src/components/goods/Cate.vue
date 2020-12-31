<template>
  <div>
    <!--  面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!--  卡片区  -->
    <el-card shadow="hover">
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加商品分类</el-button>
        </el-col>
      </el-row>

<!--   表格   -->
    <tree-table class="treeTable" :data="catelist" :columns="columns" :show-index="true" index-text="#" border :expand-type="false" :selection-type="false">
      <template slot="isok" slot-scope="scope">
        <i class="el-icon-success"
           v-if="scope.row.cat_deleted === false"
           style="color: lightgreen;"></i>
        <i class="el-icon-error" v-else style="color: red;"></i>
      </template>
      <template slot="order" slot-scope="scope">
        <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
        <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
        <el-tag size="mini" type="warning" v-else>三级</el-tag>
      </template>
      <template slot="opt" slot-scope="scope">
<!--        <el-button icon="el-icon-edit" type="primary" size="mini">编辑</el-button>-->
<!--        <el-button icon="el-icon-delete" type="danger" size="mini">删除</el-button>-->
        <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
          <el-button type="primary" icon="el-icon-edit" @click="showEditCateDialog(scope.row.cat_id)"></el-button>
        </el-tooltip>

        <el-tooltip effect="dark" content="删除分类" placement="top" :enterable="false">
          <el-button @click="removeCateById(scope.row.cat_id)" type="danger" icon="el-icon-delete"></el-button>
        </el-tooltip>
      </template>
    </tree-table>

<!--  分页    -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[3, 5, 10, 15]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total   ">
      </el-pagination>

    </el-card>
    <el-dialog
        title="添加商品分类"
        :visible.sync="addCateDialogVisible"
        width="50%"
        @close="addCateDialogClose"
        >
<!--   添加分类的表单   -->
      <el-form :rules="addCateFormRules" ref="addCateFormRef" :model="addCateForm" label-width="80px">
        <el-form-item label="分类名称: " prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类: ">
<!--    options: 指定的数据源, props: 指定配置对象      -->
          <el-cascader
              v-model="selectedKeys"
              :options="parentCateList"
              :props="cascaderProps"
              @change="parentCateChanged"
              clearable
              change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>

        <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="编辑分类" :visible.sync="editCateDialogVisible" width="50%">
      <el-form
          :model="editCateForm"
          :rules="editCateFormRules"
          ref="editCateFormRef"
          label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "Cate",
  data() {
    return {
      queryInfo: { //查询数据
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      addCateDialogVisible: false,
      total: 0,
      catelist: [],
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',

        },
        {
          label: '是否有效',
          type: 'template', // 将当前列定义为模板列
          template: 'isok'  // 当前这一列使用的模板名称
        },
        {
          label: '排序',
          type: 'template',
          template: 'order',
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      addCateForm: {
        cat_name: '',
        cat_pid: 0, //父类分类ID
        cat_level: 0  // 当前分类级别
      },
      addCateFormRules: {
        cat_name: [{required: true, message: "请输入分类名称", trigger: 'blur'}],

      },
      parentCateList: [],
      // 级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedKeys: [], //选中的父级分类ID数组
      editCateForm: {},
      editCateDialogVisible: false,
      editCateFormRules: {
        cat_name: [{required: true, message:'请输入分类名称', trigger:'blur'}]
      },

    }
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const {data: res} = this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！');
      }
      this.$message.success("成功获取商品分类！");
      this.catelist = res.data.result; // 商品分类数据
      this.total = res.data.total; //总数据条数
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    handleCurrentChange(newPageNum) {
      this.queryInfo.pagenum = newPageNum;
      this.getCateList();
    },
    showAddCateDialog() {
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    async getParentCateList() {
      const {data: res} = await this.$http.get('categories', {
        params:{type:2}
      });
      if (res.meta.status !== 200){
        return this.$message.error("获取父级分类数据失败！");
      }
      this.$message.success('成功获取父级列表！');
      this.parentCateList = res.data;
    },
    parentCateChanged() {
      if(this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1];
        this.addCateForm.cat_level = this.selectedKeys.length;
        return
      }else{
        this.addCateForm.cat_level = 0;
        this.addCateForm.cat_pid = 0;
      }
    },
    addCateDialogClose() {
      this.$refs.addCateFormRef.resetField();
      this.selectedKeys = [];
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    },
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return;
        const {data: res} = this.$http.post('categories', this.addCateForm);
        if (res.meta.status !== 200){
          return this.$message.error('添加分类失败！');
        }
        this.$message.success('成功添加分类！');
        this.getCateList();
        this.addCateDialogVisible = false;
      })
    },
    async showEditCateDialog(cat_id) {
      const {data: res} = this.$http.get('categories', cat_id);
      if (res.meta.status !== 200){
        return this.$message.error('获取分类信息失败！')
      }
      this.editCateForm = res.data
      this.editCateDialogVisible = true
    },
    editCate() {
      this.$refs.editCateForm.validate(async vaild => {
        if (!valid) return
        const {data: res} = this.$http.put('categories', this.editCateForm.cat_id,
            {
                cat_name: this.editCateForm.cat_name
            });
        if (res.meta.status !== 200){
          return this.$message.error('修改分类信息失败！')
        }
        this.$message.success('成功修改分类信息！')
        this.getCateList();
        this.showEditCateDialog = false;


      })
    },
    async removeCateById(cat_id){
      const conirmResult = await this.$confirm('此操作将永久删除该分类并且删除该类下的所有类，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm'){
        return this.$message.info('已取消删除！')
      }
      const {data: res} = await this.$http.delete('categories/' + cat_id);
      if (res.meta.status !== 200){
        return this.$message.error('删除商品分类失败！')
      }
      this.$message.success('成功删除商品分类！')
      this.getCateList()
    }

  }
}
</script>

<style lang="less" scoped>
  .treeTable {
    margin-top: 15px;
  }
  .el-cascader {
    width: 100%;
  }
</style>