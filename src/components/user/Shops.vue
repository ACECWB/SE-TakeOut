<template>
  <div>
    <!--  面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>商家列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  卡片区  -->
    <el-card shadow="hover">
      <!--   搜索与添加     -->
      <el-row :gutter="40">
        <el-col :span="8">
          <el-input placeholder="请输入商家名" v-model="queryInfo.query" clearable @clear="getShopList">
            <el-button slot="append" icon="el-icon-search" @click="getShopList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加商家</el-button>
        </el-col>
      </el-row>

      <!--   用户列表   -->

        <el-table :data="shoplist" border stripe @row-click="showDrawer">
          <el-table-column label="#" type="index" ></el-table-column>
          <el-table-column label="商家ID" prop="shopid"></el-table-column>
          <el-table-column label="商家名称" prop="shopname"></el-table-column>
          <el-table-column label="商家地址" prop="address"></el-table-column>
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
              <el-tooltip  effect="dark" content="修改商家信息" placement="top" :enterable="false">
                <el-button type="primary" icon="el-icon-edit" @click.stop="showEditDialog(scope.row.shopid)"></el-button>
              </el-tooltip>

              <el-tooltip effect="dark" content="删除商家" placement="top" :enterable="false">
                <el-button @click.stop="removeShopById(scope.row.shopid)" type="danger" icon="el-icon-delete"></el-button>
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
    <!--  添加商家  -->
    <el-dialog
        title="添加商家"
        :visible.sync="dialogVisible"
        width="50%"
        @close="dialogClosed"
    >
      <!--   内容   -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px" >
        <el-form-item label="商家ID" prop="shopid">
          <el-input v-model="addForm.shopid"></el-input>
        </el-form-item>
        <el-form-item label="商家名称" prop="shopname">
          <el-input v-model="addForm.shopname"></el-input>
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
        <el-button type="primary" @click="addShop">确 定</el-button>
      </span>
    </el-dialog>
    <!--  修改商家信息  -->
    <el-dialog
        title="修改商家信息"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed">
      <el-form ref="editFormRef" :model="editForm" rules="editFormRules" label-width="70px">
        <el-form-item label="商家ID">
          <el-input v-model="editForm.shopid" disabled></el-input>
        </el-form-item>

        <el-form-item label="商家名称">
          <el-input v-model="editForm.shopname" disabled></el-input>
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
        <el-button type="primary" @click="editShopInfo">确 定</el-button>
      </span>
    </el-dialog>
<!-- 添加商品 -->
    <el-dialog
        title="添加商品"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addGoodsDialogClosed">
      <el-form ref="addGoodsFormRef" :model="addGoodsForm" :rules="addGoodsFormRules" label-width="70px">


        <el-form-item label="商品名称" prop="goodsname">
          <el-input v-model="addGoodsForm.goodsname"></el-input>
        </el-form-item>


        <el-form-item label="价格" prop="goodsprice">
          <el-input v-model="addGoodsForm.goodsprice" oninput = "value=value.replace(/[^\d.]/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="商品描述" prop="goodsdescribe">
          <el-input type="textarea" v-model="addGoodsForm.goodsdescribe"></el-input>
        </el-form-item>
        <el-form-item label="上传图片">
          <!--      action: 图片上传到后台的地址        -->

          <el-upload
            :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture-card"
              :headers="headerObj"
              :on-success="handleSuccess">
            <i class="el-icon-plus"></i>

            <!--            <el-button size="small" type="primary">上传商品图片</el-button>-->
          </el-upload>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addGoods">确 定</el-button>
      </span>
    </el-dialog>
<!-- 商家的商品列表 -->
    <el-drawer
        :title="drawerTitle"
        :visible.sync="drawer"
        :direction="direction"
        size="40%">

      <el-row :gutter="340">
        <el-col :span="8">
          <el-input style="margin-left: 15px; width: 300px" placeholder="请输入商品名" v-model="queryGoodsName" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加商品</el-button>
        </el-col>
      </el-row>

      <el-scrollbar style="height: 100%">
      <el-table :data="goodsList" border stripe max-height="600">
        <el-table-column label="商品ID" prop="goodsid" width="70%"></el-table-column>
        <el-table-column label="名称" prop="goodsname" ></el-table-column>
        <el-table-column label="价格" prop="goodsprice" width="70%"></el-table-column>
        <el-table-column label="商品描述" prop="goodsdescribe"></el-table-column>
        <el-table-column label="状态" width="70%">
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
            <el-tooltip effect="dark" content="修改商品信息" placement="top" :enterable="false" >
              <el-button type="primary" icon="el-icon-edit" @click="showEditGoodsDialog(scope.row.goodsid)" size="mini"></el-button>
            </el-tooltip>

            <el-tooltip effect="dark" content="删除商品" placement="top" :enterable="false">
              <el-button @click="removeGoodsById(scope.row.goodsid)" type="danger" icon="el-icon-delete" size="mini"></el-button>
            </el-tooltip>
            <!--            <el-button type="primary" icon="el-icon-edit"></el-button>-->

          </template>
        </el-table-column>

      </el-table>
      </el-scrollbar>
    </el-drawer>
<!-- 图片预览 -->
    <el-dialog
        title="图片预览"
        :visible.sync="previewVisible"
        width="50%"
        >
      <img :src="previewPath" alt="" class="previewImg">

    </el-dialog>
<!-- 添加商品 -->
    <el-dialog
        title="添加商品"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="editDialogClosed">
      <el-form ref="addGoodsFormRef" :model="addGoodsForm" :rules="addGoodsFormRules" label-width="70px">
        <el-form-item label="商品名称" prop="goodsname">
          <el-input v-model="addGoodsForm.goodsname"></el-input>
        </el-form-item>

        <el-form-item label="价格" prop="goodsprice">
          <el-input v-model="addGoodsForm.goodsprice" oninput = "value=value.replace(/[^\d.]/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="商品描述" prop="goodsdescribe">
          <el-input type="textarea" v-model="addGoodsForm.goodsdescribe"></el-input>
        </el-form-item>
        <el-form-item label="上传图片">
          <!--      action: 图片上传到后台的地址        -->

          <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture-card"
              :headers="headerObj"
              :on-success="handleSuccess">
            <i class="el-icon-plus"></i>

            <!--            <el-button size="small" type="primary">上传商品图片</el-button>-->
          </el-upload>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addGoods">确 定</el-button>
      </span>
    </el-dialog>
<!-- 修改商品信息 -->
    <el-dialog
        title="修改商品信息"
        :visible.sync="editGoodsDialogVisible"
        width="50%"
        @close="editGoodsDialogClosed">
      <el-form ref="editGoodsFormRef" :model="editGoodsForm" :rules="addGoodsFormRules" label-width="70px">
        <el-form-item label="商品名称" prop="goodsname">
          <el-input v-model="editGoodsForm.goodsname"></el-input>
        </el-form-item>

        <el-form-item label="价格" prop="goodsprice">
          <el-input v-model="editGoodsForm.goodsprice" oninput = "value=value.replace(/[^\d.]/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="商品描述" prop="goodsdescribe">
          <el-input type="textarea" v-model="editGoodsForm.goodsdescribe"></el-input>
        </el-form-item>
        <el-form-item label="上传图片">
          <!--      action: 图片上传到后台的地址        -->

          <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture-card"
              :headers="headerObj"
              :on-success="handleSuccess">
            <i class="el-icon-plus"></i>

            <!--            <el-button size="small" type="primary">上传商品图片</el-button>-->
          </el-upload>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addGoods">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "Shops",
  data() {
    return {
      dialogVisible: false,  //控制添加用户框的显示
      editDialogVisible: false, //控制用户修改框的显示
      editForm: {},  // 查询的用户信息
      editFormRules: {
        shopname: [{ required: true, message: '请输入商家名称', trigger:'blur'},
        ],
        address: [{ required: true, message: '请输入地址', trigger:'blur'}],

        password: [{ required: true, message: '请输入密码', trigger:'blur'},
          { min: 6, max: 20, message: '密码长度在6-20之间', trigger: "blur"}],

      }, //修改表单的验证规则对象
      queryInfo: {
        query: '',
        pagenum: 1,  //当前页数
        pagesize: 2
      },
      queryGoodsName: '',
      shoplist: [
        {
          shopid: '456',
          shopname: '一食堂',
          address: 'zucc',
          state: true

        },
        {
          shopid: '789',
          shopname: '二食堂',
          address: 'zju',
          state: false
        }
      ],
      total: 2,
      drawer: false,
      direction: 'rtl',
      drawerTitle: '',
      // 添加用户的表单
      addForm: {
        shopid: '',
        shopname: '',
        address: '',
        password: ''
      },
      // 添加表单的验证规则
      addFormRules: {
        shopid: [{ required: true, message: '请输入商家ID', trigger:'blur'},
          { min: 3, max: 10, message: '商家ID长度在3-10之间', trigger: "blur"}],
        shopname: [{ required: true, message: '请输入商家名称', trigger:'blur'},
          ],

        address: [{ required: true, message: '请输入地址', trigger:'blur'}],

        password: [{ required: true, message: '请输入密码', trigger:'blur'},
          { min: 6, max: 20, message: '密码长度在6-20之间', trigger: "blur"}],

      },
      addGoodsFormRules: {
        goodsname: [{ required: true, message: '请输入商品名称',trigger:'blur'}],
        goodsprice: [{ required: true, message: '请输入商品价格', trigger:'blur'}],

      },
      addGoodsForm:{
        goodsname: '',
        goodsprice: 0,
        goodsdescribe: '',
        pics: [
          { pic: ""}
        ]
      },
      goodsList: [
        {
          goodsid: 1,
          goodsname:'牛肉',
          goodsprice: 20,
          goodsdescribe:'牛肉牛肉牛肉牛肉牛肉牛肉',
          state: true

        },
        {
          goodsid: 1,
          goodsname:'牛肉',
          goodsprice: 20,
          goodsdescribe:'牛肉牛肉牛肉牛肉牛肉牛肉',
          state: true

        },
        {
          goodsid: 1,
          goodsname:'牛肉',
          goodsprice: 20,
          goodsdescribe:'牛肉牛肉牛肉牛肉牛肉牛肉',
          state: true

        },
        {
          goodsid: 1,
          goodsname:'牛肉',
          goodsprice: 20,
          goodsdescribe:'牛肉牛肉牛肉牛肉牛肉牛肉',
          state: true

        },
        {
          goodsid: 1,
          goodsname:'牛肉',
          goodsprice: 20,
          goodsdescribe:'牛肉牛肉牛肉牛肉牛肉牛肉',
          state: true

        },
        {
          goodsid: 1,
          goodsname:'牛肉',
          goodsprice: 20,
          goodsdescribe:'牛肉牛肉牛肉牛肉牛肉牛肉',
          state: true

        },
        {
          goodsid: 1,
          goodsname:'牛肉',
          goodsprice: 20,
          goodsdescribe:'牛肉牛肉牛肉牛肉牛肉牛肉',
          state: true

        },
        {
          goodsid: 1,
          goodsname:'牛肉',
          goodsprice: 20,
          goodsdescribe:'牛肉牛肉牛肉牛肉牛肉牛肉',
          state: true

        },
        {
          goodsid: 1,
          goodsname:'牛肉',
          goodsprice: 20,
          goodsdescribe:'牛肉牛肉牛肉牛肉牛肉牛肉',
          state: true

        },
        {
          goodsid: 1,
          goodsname:'牛肉',
          goodsprice: 20,
          goodsdescribe:'牛肉牛肉牛肉牛肉牛肉牛肉',
          state: true

        },
        {
          goodsid: 1,
          goodsname:'牛肉',
          goodsprice: 20,
          goodsdescribe:'牛肉牛肉牛肉牛肉牛肉牛肉',
          state: true

        },
        {
          goodsid: 1,
          goodsname:'牛肉',
          goodsprice: 20,
          goodsdescribe:'牛肉牛肉牛肉牛肉牛肉牛肉',
          state: true

        },

      ],
      nowShopId: -1,
      addDialogVisible: false,
      uploadURL: "www.gkjerry.xyz:3170/upload",
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '',
      previewVisible: false,
      editGoodsDialogVisible: false,
      editGoodsForm: {},

    }
  },
  created() {
    this.getShopList();
  },
  methods: {
    async getShopList() {
      // const { data: res } = await this.$http.get('shops', {
      //   params: this.queryInfo
      // })
      // console.log(res);
      // if (res.meta.status !== 200){
      //   return this.$message.error('获取商家列表失败!')
      // }
      // this.shoplist = res.data.shops;
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
    async stateChanged(shopinfo) {  //监听state switch
      // const { data: res} = await this.$http.put('shops/${shopinfo.shopid}/state/${shopinfo.statue}' )
      // if(res.meta.status !== 200){
      //   return this.$message.error("更新商家状态失败！")
      // }
      // this.message.success("成功更新商家状态！")
    },
    // 关闭添加用户窗口时重置里面的表单
    dialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    addShop() { //点击确定后添加用户
      this.$refs.addFormRef.validate(async valid => {
        // if(!valid) return
        // //添加请求
        // const {data: res} = await this.$http.post('shops', this.addForm);
        // if(res.meta.status !== 201){
        //   this.$message.error('添加商家失败！');
        // }
        // this.$message.success('成功添加商家！');
        // this.dialogVisible = false;
        // this.getUserList();

      })
    },
    async showEditDialog(id) {
      // this.editDialogVisible = true;
      // const {data: res} = await this.$http.get('shops/' + id)
      //
      // if (res.meta.status !== 200){
      //   return this.$message.error('查询商家信息失败！');
      // }
      // this.$message.success('成功查询商家信息！');
      // this.editForm = res.data;
      // this.editDialogVisible = true;
    },
    editDialogClosed() { //监听修改用户对话框的关闭事件
      this.$refs.editFormRef.resetFields();
    },
    editGoodsDialogClosed() {
      this.$refs.editGoodsFormRef.resetFields()
    },
    addGoodsDialogClosed() {
      this.$refs.addGoodsFormRef.resetFields()
    },
    editShopInfo() { //修改用户信息并提交
      // this.$refs.editFormRef.validate(async valid => {
      //   if (!valid) return;
      //   const {data: res} = await this.$http.put('shops/' + this.editForm.shopid, {
      //     shopname: this.editForm.shopname,
      //     address: this.editForm.address,
      //     password: this.editForm.password
      //   })
      //   if (res.meta.status != 200){
      //     return this.$message.error('更新商家信息失败！');
      //   }
      //   this.editDialogVisible = false;  //关闭对话框
      //   this.getShopList(); //刷新列表
      //   this.$message.success("成功更新商家信息！");
      // })
    },
    async removeShopById(shopid) {
      // const confirmResult = await this.$confirm('此操作将永久删除该商家, 是否继续?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).catch(error => error)
      // //取消删除返回cancel，确认返回confirm
      // if (confirmResult !== 'confirm') { //取消
      //   return this.$message.info('已取消删除');
      // }
      // const {data: res} = this.$http.delete('shops/' + shopid);
      // if (res.meta.status !== 200){
      //   return this.$message.error('删除商家失败！');
      // }
      // this.$message.success('成功删除商家！');
      // this.getShopList();
    },
    showDrawer(row) {
      console.log(row)
      this.drawerTitle = row.shopid + ' ' + row.shopname
      this.drawer = true
      this.nowShopId = row.shopid
      this.getGoodsList(row.shopid)


    },
    async getGoodsList(shopid){
      const {data: res} = await this.$http.get('shops/' + shopid + '/goods', this.queryGoodsName)
      if (res.meta.status !== 200) {
        this.$message.error('搜索商品信息失败！')
      }
      this.$message.success('成功搜索商品信息！')
      this.goodsList = res.data.goodsList
    },
    async showEditGoodsDialog(goodsid) {
      const {data: res} = await this.$http.get('shops/' + this.nowShopId + '/' + goodsid)
      if (res.meta.status !== 200)
        return this.$message.error('查询商品信息失败！')
      this.$message.success('成功查询用户信息！')
      this.editGoodsForm = res.data
      this.editGoodsDialogVisible = true
    },
    async removeGoodsById(goodsid) {
      const {data: res} = await this.$http.delete('shops/' + this.nowShopId + '/' + goodsid)
      if (res.meta.status !== 200) {
        this.$message.error('搜索商品信息失败！')
      }
      this.$message.success('成功搜索商品信息！')
      this.getGoodsList()
    },
    handlePreview(file) { // 处理图片预览
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    handleRemove(file) { // 处理图片移除
      const filePath = file.response.data.tmp_path
      const i = this.addGoodsForm.pics.findIndex(x => x.pic === filePath)
      this.addGoodsForm.pics.splice(i, 1)
    },
    handleSuccess(response) { // 监听图片上传成功的事件
      console.log(response);
      const picInfo = {pic: response.data.tmp_path}
      this.addGoodsForm.pics.push(picInfo)
    },
    addGoods() {
      this.$refs.addGoodsFormRef.validate( async valid => {
        if (!valid) return this.$message.error('请填写必要的表单项')
        const { data: res} = await this.$http.post('goods', this.addGoodsForm)
        if (res.meta.status !== 200) return this.$message.error('添加商品失败！')
        this.$message.success('成功添加商品！')
        this.addDialogVisible = false
        this.getGoodsList()
      })
    },


  },

}
</script>

<style lang="less" scoped>
  .previewImg {
    width: 100%;
  }
</style>