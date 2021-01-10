<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-input v-if="isAdmin" placeholder="请输入商家名称" v-model="queryInfo.shopname" clearable @clear="getOrderList">
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-input placeholder="请输入用户名" v-model="queryInfo.userid" clearable @clear="getOrderList">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表 -->
      <el-table :data="orderList" border stripe @row-click="showDrawer">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="_id"></el-table-column>
        <el-table-column v-if="isAdmin" label="商家名称" prop="shopname"></el-table-column>
        <el-table-column label="用户ID" prop="userid"></el-table-column>
        <el-table-column label="订单价格" prop="cost"></el-table-column>
        <el-table-column label="状态" prop="state"></el-table-column>

        <el-table-column label="下单时间" prop="orderdate">
          <template slot-scope="scope">
            {{scope.row.orderdate}}
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
      ></el-pagination>


    </el-card>
    <el-drawer
        :title="drawerTitle"
        :visible.sync="drawer"
        :direction="direction"
        size="40%">
      <el-scrollbar style="height: 100%">
        <el-table :data="detailsList" border stripe max-height="600">
          <el-table-column label="商品ID" prop="dishid" width="200%"></el-table-column>
          <el-table-column label="名称" prop="dishname" ></el-table-column>
          <el-table-column label="数量" prop="amount" width="70%"></el-table-column>
          <el-table-column label="价格" prop="price" width="70%"></el-table-column>
        </el-table>
      </el-scrollbar>
    </el-drawer>

  </div>
</template>

<script>

export default {
  data () {
    return {
      // 订单列表查询参数
      queryInfo: {
        queryOrderNumber: '',
        userid: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      isAdmin: window.sessionStorage.getItem('token') == 'Admin'? true: false,
      nowShopId: window.sessionStorage.getItem('token'),
      // 订单列表
      orderList: [],
      drawerTitle: '',
      nowOrderNumber: '',
      drawer: false,
      detailsList: [],
      totalPrice: 0,
      totalgoods: 0,
      direction: 'rtl',

    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    async getOrderList () {
      let url = 'orders'
      if (!this.isAdmin){
        url = 'shops/' + this.nowShopId + '/orders'
      }
      console.log('getOrderList');
      console.log(url);
      console.log(this.queryInfo);
      const { data: res } = await this.$http.get(url, {
        params: this.queryInfo
      })
      console.log(res);
      if (res.meta.status !== true) {
        return this.$message.error('获取订单列表失败！')
      }
      this.total = res.data.total
      this.orderList = res.data.orders
    },
    // 分页
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange (newSize) {
      this.queryInfo.pagenum = newSize
      this.getOrderList()
    },
    // async sendStateChanged(row) {
    //   const { data: res} = await this.$http.put('orders/${row.order_id}/sendState/${row.send_state}')
    //   if (res.meta.status !== 200) {
    //     return this.$message.error('更新订单发货状态失败！')
    //   }
    //   this.$message.success('成功更新订单发货状态！')
    // },
    // async payStateChanged(row) {
    //   const { data: res} = await this.$message.put('orders/${row.order_id}/payState/${row.pay_state}')
    //   if (res.meta.status !== 200)
    //     return this.$message.error('更新订单付款状态失败！')
    //   this.$message.success('成功更新订单付款状态！')
    // },
    // async arriveStateChanged(row) {
    //   const { data: res} = await this.$message.put('orders/${row.order_id}/arriveState/${row.arrive_state}')
    //   if (res.meta.status !== 200)
    //     return this.$message.error('更新订单送达状态失败！')
    //   this.$message.success('成功更新订单送达状态！')
    // },
    showDrawer(row) { // 显示订单详情前数据的传递
      console.log(row)
      this.drawerTitle = row._id
      this.drawer = true
      this.nowOrderNumber = row._id
      console.log('lets getdetails');
      this.getDetailsList(row._id)
    },
    async getDetailsList(order_number) {
      const {data: res} = await this.$http.get('orders/' + order_number + '/orderdetail')
      console.log('getDetailList');
      console.log(res);
      if (res.meta.status !== true) return this.$message.error('获取详细订单信息失败！')
      this.$message.success('成功获取订单信息！')
      this.detailsList = res.data.orderdetail
      // this.totalgoods = res.data.total
      // this.totalPrice = res.data.totalprice

    }

  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>