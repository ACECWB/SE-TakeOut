<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入商品名称" v-model="queryGoodsInfo.query" clearable @clear="getGoodsList">

            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格数据 -->
      <el-table style="text-align: center !important" :data="goodsList" border stripe max-height="600">
        <el-table-column label="商品ID" prop="_id" width="200%"></el-table-column>
        <el-table-column label="照片"  width="150%">
          <template slot-scope="scope">
            　　　　<img :src="scope.row.coverlink" width="100" height="100"/>
            　　</template>
        </el-table-column>
        <el-table-column label="名称" prop="dishname" ></el-table-column>
        <el-table-column label="价格" prop="price" width="150%"></el-table-column>
        <!--        <el-table-column label="商品描述" prop="dishinfo"></el-table-column>-->
        <!--        <el-table-column label="状态" width="70%">-->
        <!--          <template slot-scope="scope">-->
        <!--            <el-switch-->
        <!--                v-model="scope.row.state"-->
        <!--                active-color="#13ce66"-->
        <!--                inactive-color="#ff4949"-->
        <!--                @change="stateChanged(scope.row)">-->
        <!--            </el-switch>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
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
      <!-- 分页区域 -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryGoodsInfo.pagenum"
          :page-sizes="[2, 4, 10, 15]"
          :page-size="queryGoodsInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background
      ></el-pagination>

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
                ref="upload"
                :action="uploadURL"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                list-type="picture-card"
                :headers="headerObj"
                :on-success="handleAddSuccess">
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addGoods">确 定</el-button>
      </span>
      </el-dialog>

      <el-dialog
          title="修改商品信息"
          :visible.sync="editGoodsDialogVisible"
          width="50%"
          @close="editGoodsDialogClosed">
        <el-form ref="editGoodsFormRef" :model="editGoodsForm" :rules="addGoodsFormRules" label-width="70px">
          <el-form-item label-width="90px" label="商品名称" prop="dishname">
            <el-input v-model="editGoodsForm.dishname"></el-input>
          </el-form-item>

          <el-form-item label="价格" prop="price">
            <el-input v-model="editGoodsForm.price" oninput = "value=value.replace(/[^\d.]/g,'')"></el-input>
          </el-form-item>
          <el-form-item label="商品描述" prop="dishinfo">
            <el-input type="textarea" v-model="editGoodsForm.dishinfo"></el-input>
          </el-form-item>
          <el-form-item label="上传图片">
            <!--      action: 图片上传到后台的地址        -->

            <el-upload
                :action="uploadURL"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                list-type="picture-card"
                :headers="headerObj"
                :on-success="handleEditSuccess"
                :file-list="imgUrl">
              <i class="el-icon-plus"></i>

              <!--            <el-button size="small" type="primary">上传商品图片</el-button>-->
            </el-upload>
          </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="editGoodsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGoodsInfo">确 定</el-button>
      </span>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
export default {
  name: "List",
  data() {
    return {
      // queryInfo: {
      //   queryGoods: '',
      //   queryShopers: '',
      //   pagenum: 1,
      //   pagesize: 2
      // },
      goodsList: [],
      total: 0,
      queryGoodsInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      addDialogVisible: false,
      uploadURL: "https://www.gkjerry.xyz:3171/rest-api/v1/image/upload",
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      addGoodsForm:{
        dishname: '',
        price: 0,
        dishinfo: '',
        link: ''
      },
      addGoodsFormRules: {
        dishname: [{ required: true, message: '请输入商品名称',trigger:'blur'}],
        price: [{ required: true, message: '请输入商品价格', trigger:'blur'}],

      },
      nowShopId: -1,
      imgUrl: [{url: ''}],
      editGoodsDialogVisible: false,
      editGoodsForm: {},



    }
  },
  created() {
    this.nowShopId = window.sessionStorage.getItem('token');
    this.getGoodsList()
  },
  methods: {
    editGoodsInfo() {
      this.$refs.editGoodsFormRef.validate(async valid => {
        if (!valid) return;
        console.log(this.editGoodsForm._id);
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
        return this.$message.error('搜索商品信息失败！')
      }
      this.$message.success('成功搜索商品信息！')
      this.getGoodsList()
    },
    async showEditGoodsDialog(goodsid) {
      const {data: res} = await this.$http.get('shops/' + this.nowShopId + '/' + goodsid)
      console.log(res);
      if (res.meta.status !== true)
        return this.$message.error('查询商品信息失败！')
      this.$message.success('成功查询商品信息！')

      this.editGoodsForm = res.data
      this.imgUrl[0].url = res.data.coverlink
      this.editGoodsForm.link = res.data.coverlink
      this.editGoodsDialogVisible = true
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
        console.log('addGoods');
        console.log(res);
        if (res.meta.status !== true) return this.$message.error('添加商品失败！')
        this.$message.success('成功添加商品！')
        this.addDialogVisible = false
        this.$refs.addGoodsFormRef.resetFields()
        this.$refs.upload.clearFiles()
        this.getGoodsList()
      })
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
      this.$refs.upload.clearFiles()
    },
    handleAddSuccess(response) { // 监听图片上传成功的事件
      console.log('handleAddSuccess');
      console.log(response);
      this.addGoodsForm.link = response.data.url;
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    editGoodsDialogClosed() {
      this.$refs.editGoodsFormRef.resetFields()
    },
    addGoodsDialogClosed() {
      this.$refs.addGoodsFormRef.resetFields()
      this.$refs.upload.clearFiles()

    },
    async getGoodsList(){
      console.log('getGoodsList');
      console.log(this.nowShopId);
      console.log(this.queryGoodsInfo);
      const {data: res} = await this.$http.get('shops/' + this.nowShopId + '/goodlist',
          {
            params: this.queryGoodsInfo
          })
      console.log('shops/' + this.nowShopId + '/goodlist');
      console.log('getGoodsList(goodList.vue):' );
      console.log(this.queryGoodsInfo);
      console.log(res);

      if (res.meta.status !== true) {
        return this.$message.error('搜索商品信息失败！')
      }
      this.$message.success('成功搜索商品信息！')

      this.goodsList = res.data.dishes
      this.total = res.data.total
    },
    handleSizeChange(newSize) {  // 监听页面大小改变
      this.queryGoodsInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newSize) {  // 监听当前页面位置改变
      this.queryGoodsInfo.pagenum = newSize
      this.getGoodsList()
    },
    async removeById(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该商品，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除该商品!')
      }
      const { data: res} = await this.$http.delete('goods/' + id)
      if(res.meta.status !== true){
        return this.$message.error('删除商品失败！')
      }
      this.$message.success('成功删除商品!')
      this.getGoodsList()
    },

  }
}
</script>

<style lang="less" scoped>
  ///deep/.el-tab th> .cell {
  //  text-align: center;
  //}
  ///deep/.el-tab .cell {
  //  text-align: center;
  //}
</style>