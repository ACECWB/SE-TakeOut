<template>
  <div>
<!--  面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
<!--  卡片区  -->
    <el-card shadow="hover">
<!--   搜索与添加     -->
      <el-row :gutter="40">
        <el-col :span="8">
          <el-input placeholder="请输入用户名" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

<!--   用户列表   -->
      <el-table :data="userlist" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="账户ID" prop="userid"></el-table-column>
        <el-table-column label="用户地址" prop="address"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
                v-model="scope.row.state"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="stateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="修改用户信息" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)"></el-button>
            </el-tooltip>

            <el-tooltip effect="dark" content="删除用户" placement="top" :enterable="false">
              <el-button @click="removeUserById(scope.row.userid)" type="danger" icon="el-icon-delete"></el-button>
            </el-tooltip>
<!--            <el-button type="primary" icon="el-icon-edit"></el-button>-->

          </template>
        </el-table-column>

      </el-table>

<!--   分页   -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>
<!--  添加用户  -->
    <el-dialog
        title="添加用户"
        :visible.sync="dialogVisible"
        width="50%"
        @close="dialogClosed"
        >
<!--   内容   -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px" >
        <el-form-item label="用户ID" prop="userid">
          <el-input v-model="addForm.userid"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="addForm.address"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
      </el-form>
        <!--   按钮   -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
<!--  修改用户  -->
    <el-dialog
        title="修改用户信息"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed">
      <el-form ref="editFormRef" :model="editForm" rules="editFormRules" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.userid" disabled></el-input>
        </el-form-item>

        <el-form-item label="地址" prop="address">
          <el-input v-model="editForm.address" disabled></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password" disabled></el-input>
        </el-form-item>

      </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Users",
  data() {
    return {
      dialogVisible: false,  //控制添加用户框的显示
      editDialogVisible: false, //控制用户修改框的显示
      editForm: {},  // 查询的用户信息
      editFormRules: {
        address: [{ required: true, message: '请输入地址', trigger:'blur'}],

        password: [{ required: true, message: '请输入密码', trigger:'blur'},
          { min: 6, max: 20, message: '密码长度在6-20之间', trigger: "blur"}],

      }, //修改表单的验证规则对象
      queryInfo: {
        query: '',
        pagenum: 1,  //当前页数
        pagesize: 2
      },
      userlist: [
        {
          userid: '456',
          address: 'zucc',
          state: true

        },
        {
          userid: '789',
          address: 'zju',
          state: false
        }
      ],
      total: 2,
      // 添加用户的表单
      addForm: {
        userid: '',
        address: '',
        password: ''
      },
      // 添加表单的验证规则
      addFormRules: {
        userid: [{ required: true, message: '请输入用户ID', trigger:'blur'},
                 { min: 3, max: 10, message: '用户ID长度在3-10之间', trigger: "blur"}],

        address: [{ required: true, message: '请输入地址', trigger:'blur'}],

        password: [{ required: true, message: '请输入密码', trigger:'blur'},
                    { min: 6, max: 20, message: '密码长度在6-20之间', trigger: "blur"}],

      },
    }
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      // const { data: res } = await this.$http.get('users', {
      //   params: this.queryInfo
      // })
      // console.log(res);
      // if (res.meta.status !== 200){
      //   return this.$message.error('获取用户列表失败!')
      // }
      // this.userlist = res.data.users;
      // this.total = res.data.total;

    },
    // 监听 pagesize的改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 监听页码改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    async stateChanged(userinfo) {  //监听state switch
      // const { data: res} = await this.$http.put('users/${userinfo.id}/state/${userinfo.statue}' )
      // if(res.meta.status !== 200){
      //   return this.$message.error("更新用户状态失败！")
      // }
      // this.message.success("成功更新用户状态！")
    },
    // 关闭添加用户窗口时重置里面的表单
    dialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    addUser() { //点击确定后添加用户
      this.$refs.addFormRef.validate(async valid => {
        // if(!valid) return
        // //添加请求
        // const {data: res} = await this.$http.post('users', this.addForm);
        // if(res.meta.status !== 201){
        //   this.$message.error('添加用户失败！');
        // }
        // this.$message.success('成功添加用户！');
        // this.dialogVisible = false;
        // this.getUserList();

      })
    },
    async showEditDialog(id) {
      // this.editDialogVisible = true;
      // const {data: res} = await this.$http.get('users/' + id)
      //
      // if (res.meta.status !== 200){
      //   return this.$message.error('查询用户信息失败！');
      // }
      // this.$message.success('成功查询用户信息！');
      // this.editForm = res.data;
      // this.editDialogVisible = true;
    },
    editDialogClosed() { //监听修改用户对话框的关闭事件
      this.$refs.editFormRef.resetFields();
    },
    editUserInfo() { //修改用户信息并提交
      // this.$refs.editFormRef.validate(async valid => {
      //   if (!valid) return;
      //   const {data: res} = await this.$http.put('users/' + this.editForm.userid, {
      //     address: this.editForm.address,
      //     password: this.editForm.password
      //   })
      //   if (res.meta.status != 200){
      //     return this.$message.error('更新用户信息失败！');
      //   }
      //   this.editDialogVisible = false;  //关闭对话框
      //   this.getUserList(); //刷新列表
      //   this.$message.success("成功更新用户信息！");
      // })
    },
    async removeUserById(userid) {
      // const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).catch(error => error)
      // //取消删除返回cancel，确认返回confirm
      // if (confirmResult !== 'confirm') { //取消
      //   return this.$message.info('已取消删除');
      // }
      // const {data: res} = this.$http.delete('users/' + userid);
      // if (res.meta.status !== 200){
      //   return this.$message.error('删除用户失败！');
      // }
      // this.$message.success('成功删除用户！');
      // this.getUserList();
    }

  },

}
</script>

<style lang="less" scoped>

</style>