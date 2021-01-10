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
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="70px">
        <el-form-item label="商家ID">
          <el-input v-model="editForm.shopid" disabled></el-input>
        </el-form-item>

        <el-form-item label="商家名称">
          <el-input v-model="editForm.shopname"></el-input>
        </el-form-item>

        <el-form-item label-width="90px" label="折扣(小数)" >
          <el-input v-model="editForm.discount" oninput = "value=value.replace(/[^\d.]/g,'')"></el-input>
        </el-form-item>

        <el-form-item label="商家描述">
          <el-input type="textarea" v-model="editForm.shopinfo"></el-input>
        </el-form-item>

        <el-form-item label="地址" prop="address">
          <el-input v-model="editForm.address"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password"></el-input>
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

        <el-form-item label-width="90px" label="商品名称" prop="dishname">
          <el-input v-model="addGoodsForm.dishname"></el-input>
        </el-form-item>

        <el-form-item type="number" label="价格" prop="price">
          <el-input v-model="addGoodsForm.price" oninput = "value=value.replace(/[^\d.]/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="商品描述" prop="dishinfo">
          <el-input type="textarea" v-model="addGoodsForm.dishinfo"></el-input>
        </el-form-item>
        <el-form-item label="上传图片">
          <!--      action: 图片上传到后台的地址        -->
          <el-upload
              ref="addUpload"
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture-card"
              :headers="headerObj"
              :on-success="handleAddSuccess">
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
        size="50%">

      <el-row :gutter="340">
        <el-col :span="8">
          <el-input style="margin-left: 15px; width: 300px" placeholder="请输入商品名" v-model="queryGoodsInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加商品</el-button>
        </el-col>
      </el-row>

      <el-scrollbar style="height: 100%">
      <el-table :data="goodsList" border stripe max-height="600">
        <el-table-column label="商品ID" prop="_id" width="200%"></el-table-column>
        <el-table-column label="照片"  width="130%">
          <template slot-scope="scope">
            　　　　<img :src="scope.row.coverlink" width="100" height="100"/>
            　　</template>
        </el-table-column>
        <el-table-column label="名称" prop="dishname" ></el-table-column>
        <el-table-column label="价格" prop="price" width="100%"></el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="修改商品信息" placement="top" :enterable="false" >
              <el-button type="primary" icon="el-icon-edit" @click="showEditGoodsDialog(scope.row._id)" ></el-button>
            </el-tooltip>

            <el-tooltip effect="dark" content="删除商品" placement="top" :enterable="false">
              <el-button @click="removeGoodsById(scope.row._id)" type="danger" icon="el-icon-delete" ></el-button>
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
<!-- 修改商品信息 -->
    <el-dialog
        title="修改商品信息"
        :visible.sync="editGoodsDialogVisible"
        width="50%"
        @close="editGoodsDialogClosed">
      <el-form ref="editGoodsFormRef" :model="editGoodsForm" :rules="addGoodsFormRules" label-width="70px">
        <el-form-item label="商品名称" prop="dishname" label-width="100px">
          <el-input  v-model="editGoodsForm.dishname"></el-input>
        </el-form-item>

        <el-form-item label="价格" prop="price">
          <el-input v-model="editGoodsForm.price" oninput = "value=value.replace(/[^\d.]/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="商品描述" prop="dishinfo">
          <el-input type="textarea" v-model="editGoodsForm.dishinfo"></el-input>
        </el-form-item>
        <el-form-item label="上传图片">
          <el-upload
              ref="editUpload"
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture-card"
              :headers="headerObj"
              :on-success="handleEditSuccess"
              :file-list="imgUrl">
            <i class="el-icon-plus"></i>

          </el-upload>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editGoodsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGoodsInfo">确 定</el-button>
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
      editForm: {},
      editFormRules: {
        shopname: [{ required: true, message: '请输入商家名称', trigger:'blur'},],
        address: [{ required: true, message: '请输入地址', trigger:'blur'}],

        password: [{ required: true, message: '请输入密码', trigger:'blur'},
          { min: 6, max: 20, message: '密码长度在6-20之间', trigger: "blur"}],
        shopinfo: [{ required: true, message: '请输入商家描述', trigger:'blur'},],
        discount: [{ required: true, message: '请输入折扣', trigger:'blur'},]

      }, //修改表单的验证规则对象
      queryInfo: {
        query: '',
        pagenum: 1,  //当前页数
        pagesize: 10
      },
      queryGoodsInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      shoplist: [],
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
        dishname: [{ required: true, message: '请输入商品名称',trigger:'blur'}],
        price: [{ required: true, message: '请输入商品价格', trigger:'blur'}],

      },
      addGoodsForm:{
        dishname: '',
        price: 0,
        dishinfo: '',
        link: ''
      },
      goodsList: [],
      nowShopId: -1,
      addDialogVisible: false,
      uploadURL: "https://www.gkjerry.xyz:3171/rest-api/v1/image/upload",
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '',
      previewVisible: false,
      editGoodsDialogVisible: false,
      editGoodsForm: {},
      imgUrl: [{url: ''}],
    }
  },
  created() {
    this.getShopList();
  },
  methods: {
    async getShopList() {
      console.log(this.queryInfo);
      const { data: res } = await this.$http.get('shops', {
        params: this.queryInfo
      })
      console.log('getShopList');
      console.log(res);
      if (res.meta.status !== true){
        return this.$message.error('获取商家列表失败!')
      }
      this.shoplist = res.data.shops;
      this.total = res.data.total;

    },
    // 监听 pagesize的改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      console.log('handleSizeChange(newSize)');
      console.log(newSize);
      this.getShopList();
    },
    // 监听页码改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      console.log('handleCurrentChange(newPage)');
      console.log(newPage);
      this.getShopList();
    },
    async stateChanged(shopinfo) {  //监听state switch
      // const { data: res} = await this.$http.put('shops/${shopinfo.shopid}/state/${shopinfo.statue}' )
      // if(res.meta.status !== 200){
      //   return this.$message.error("更新商家状态失败！")
      // }
      // this.message.success("成功更新商家状态！")
    },
    // 表单重置
    dialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    addShop() {
      this.$refs.addFormRef.validate(async valid => {
        if(!valid) return
        //添加请求
        const {data: res} = await this.$http.put('register?usertype=shop', this.addForm);
        console.log('addShop');
        console.log(res);
        if(res.meta.status !== true){
          this.$message.error('添加商家失败！');
        }
        this.$message.success('成功添加商家！');
        this.dialogVisible = false;
        this.getShopList();

      })
    },
    async showEditDialog(id) { // 显示修改商家信息框
      this.editDialogVisible = true;
      const {data: res} = await this.$http.get('shops/' + id)

      if (res.meta.status !== true){
        return this.$message.error('查询商家信息失败！');
      }
      this.$message.success('成功查询商家信息！');
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    editDialogClosed() { // 修改商家信息框重置
      this.$refs.editFormRef.resetFields();
    },
    editGoodsDialogClosed() { // 修改商品信息框重置
      this.$refs.editGoodsFormRef.resetFields()
      this.$refs.editUpload.clearFiles()

    },
    addGoodsDialogClosed() { // 添加商品信息框重置
      this.$refs.addGoodsFormRef.resetFields()
      this.$refs.addUpload.clearFiles()
    },
    editShopInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        console.log(this.editForm.shopid);
        const {data: res} = await this.$http.put('shops/' + this.editForm.shopid, this.editForm)

        console.log('editShopInfo');
        console.log(res);
        if (res.meta.status != true){
          return this.$message.error('更新商家信息失败！');
        }
        this.editDialogVisible = false;  //关闭对话框
        this.getShopList(); //刷新列表
        console.log(res);
        this.$message.success("成功更新商家信息！");
      })
    },
    editGoodsInfo() {
      this.$refs.editGoodsFormRef.validate(async valid => {
        if (!valid) return;
        console.log(this.editGoodsForm._id);
        console.log('editGoodsInfo');
        this.editGoodsForm.price = parseFloat(this.editGoodsForm.price)

        console.log(this.editGoodsForm);
        const {data: res} = await this.$http.put('shops/' + this.editGoodsForm.shopid + '/' + this.editGoodsForm._id, {
          dishname: this.editGoodsForm.dishname,
          dishinfo: this.editGoodsForm.dishinfo,
          price: this.editGoodsForm.price,
          link: this.editGoodsForm.link,
        })
        console.log('editGoodsInfo');
        console.log(this.editGoodsForm.link);
        console.log(res);
        if (res.meta.status != true){
          return this.$message.error('更新商品信息失败！');
        }
        this.editGoodsDialogVisible = false;  //关闭对话框
        this.getGoodsList() //刷新列表
        console.log(res);
        this.$message.success("成功更新商品信息！");
      })
    },
    async removeShopById(shopid) {
      const confirmResult = await this.$confirm('此操作将永久删除该商家, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      //取消删除返回cancel，确认返回confirm
      if (confirmResult !== 'confirm') { //取消
        return this.$message.info('已取消删除');
      }
      const {data: res} = await this.$http.delete('shops/' + shopid);
      console.log(res);
      if (res.meta.status !== true){
        return this.$message.error('删除商家失败！');
      }
      this.$message.success('成功删除商家！');
      this.getShopList();
    },
    showDrawer(row) { // 显示商家商品前的数据传递
      console.log(row)
      this.drawerTitle = row.shopid + ' ' + row.shopname
      this.drawer = true
      this.nowShopId = row.shopid
      this.getGoodsList(row.shopid)
    },
    async getGoodsList(shopid){
      const {data: res} = await this.$http.get('shops/' + this.nowShopId + '/goodlist',
      {
        params: this.queryGoodsInfo
      })
      console.log('shops/' + this.nowShopId + '/goodlist');
      console.log('getGoodsList:' );
      console.log(this.queryGoodsInfo);
      console.log(res);

      if (res.meta.status !== true) {
        return this.$message.error('搜索商品信息失败！')
      }
      this.$message.success('成功搜索商品信息！')
      this.goodsList = res.data.dishes
    },
    async showEditGoodsDialog(goodsid) {
      const {data: res} = await this.$http.get('shops/' + this.nowShopId + '/' + goodsid)
      console.log(res);
      if (res.meta.status !== true)
        return this.$message.error('查询商品信息失败！')
      this.$message.success('成功查询商品信息！')

      this.editGoodsForm = res.data
      this.imgUrl = [{url: res.data.coverlink}]
      console.log('EditImgUrl');
      console.log(this.imgUrl);
      this.editGoodsForm.link = res.data.coverlink
      this.editGoodsDialogVisible = true
    },
    async removeGoodsById(goodsid) {
      const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      //取消删除返回cancel，确认返回confirm
      if (confirmResult !== 'confirm') { //取消
        return this.$message.info('已取消删除');
      }
      const {data: res} = await this.$http.delete('shops/' + this.nowShopId + '/' + goodsid)
      console.log(goodsid);
      if (res.meta.status !== true) {
        return this.$message.error('删除商品信息失败！')
      }
      this.$message.success('成功删除商品信息！')
      this.getGoodsList()
    },
    handlePreview(file) { // 处理图片预览
      console.log(file);
      this.previewPath = file.url
      this.previewVisible = true
    },
    handleRemove(file) { // 处理图片移除
      const filePath = file.url
      // const i = this.addGoodsForm.pics.findIndex(x => x.pic === filePath)
      this.addGoodsForm.link = ''
    },
    handleAddSuccess(response) { // 监听图片上传成功的事件
      console.log('handleAddSuccess');
      console.log(response);
      this.addGoodsForm.link = response.data.url;


    },
    handleEditSuccess(response) { // 监听图片上传成功的事件
      console.log('handleSuccess');
      console.log(response);
      this.editGoodsForm.link = response.data.url;
    },
    addGoods() {
      this.$refs.addGoodsFormRef.validate( async valid => {
        if (!valid) return this.$message.error('请填写必要的表单项')
        console.log(this.addGoodsForm);
        this.addGoodsForm.price = parseFloat(this.addGoodsForm.price)

        const { data: res} = await this.$http.post('shops/' + this.nowShopId + '/addgood', this.addGoodsForm)
        console.log(res);
        if (res.meta.status !== true) return this.$message.error('添加商品失败！')
        this.$message.success('成功添加商品！')
        this.addDialogVisible = false
        this.$refs.addGoodsFormRef.resetFields()
        console.log(this.addGoodsForm);
        this.getGoodsList()
        this.$refs.addUpload.clearFiles()

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