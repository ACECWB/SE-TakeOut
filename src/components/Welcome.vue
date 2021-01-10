<template>
<div>
  <div v-if="nowShopId !== 'Admin'">
    <el-card shadow="hover" body-style="height: 250px">
      <ve-line height="300px"  :data="chartData" :settings="chartSettings"></ve-line>
    </el-card>

    <el-card shadow="hover" style="margin-top: 10px">
      <el-row style="margin-top: 10px; margin-left: 10px" :gutter="40">
        <el-col :span="70" style="margin-left: 50px">
          <ve-ring :extend="amountExtend" width="500px" height="300px"  :title="amountTitle" :data="dishAmountData" :settings="dishAmountSetting" ></ve-ring>
        </el-col>
        <el-col :span="70" style="margin-right: 50px;">
          <ve-ring :extend="incomeExtend" width="500px" height="300px" :title="incomeTitle" :data="dishIncomeData" :settings="dishIncomeSetting" ></ve-ring>
        </el-col>
      </el-row>
    </el-card>
  </div>
  <div v-else>
    <h3> Welcome! Admin!</h3>
  </div>
</div>


</template>

<script>
export default {
  name: "welcome",
  created() {
    this.getChartInfo()
    this.getDishAmountInfo()
    this.getDishIncomeInfo()
  },
  data() {
    return {
      incomeExtend: {
        legend: {
          bottom: "0%"
        }
      },
      amountExtend: {
        legend: {
          bottom: "0%"
        }
      },
      // chartInfo:{},
      // dishAmountInfo: {},
      // dishIncomeInfo: {},
      nowShopId: window.sessionStorage.getItem('token'),

      // 商品-销售量
      dishAmountSetting: {
        offsetY: 150,
        dimension: '菜品',
        metrics: '销售额',
      },
      dishAmountData: {
        columns: ['菜品', '销售额'],
        rows: []
      },
      amountTitle: {
        text: '菜品-销售量占比',
        x: 'center'
      },
      // 商品-收入
      dishIncomeSetting: {
        offsetY: 150,
        roseType: 'radius',
      },
      dishIncomeData: {
        columns: ['菜品', '销售量'],
        rows: []
      },
      // 时间-订单数/总收入
      chartSettings: {
        axisSite: { right: ['订单数'] },
        yAxisType: ['KMB', 'KMB'],
        yAxisName: ['总收入', '订单数']
      },
      chartData: {
        columns: ['日期', '总收入', '订单数'],
        rows: []
      },
      chartTitle: {
        text: '时间-总收入/总订单数',
        // x: 'center'
      },
      incomeTitle: {
        text: '菜品-总收入占比',
        x: 'center'
      }
    }
  },
  methods: {
    compare(property) {
      return function (a, b){
        let v1 = a[property]
        let v2 = b[property]
        if (v1 > v2) {
          return 1
        }else{
          return -1
        }
        // return v1 > v2
      }
    },
    // sortDownDate(a, b) {
    //   return Date.parse(a['日期'])
    // },
    sortChartData() {
      console.log('look');
      console.log(this.chartData.rows);
      this.chartData.rows =  this.chartData.rows.sort(this.compare('日期'))
      console.log(this.chartData.rows);
    },
    async getChartInfo() {
      const {data: res} = await this.$http.get('/statistic/sales/' + this.nowShopId)
      if (res.meta.status != true) return
      console.log('getChartInfo');
      console.log(res);
      this.chartData.rows = res.data
      console.log('=================================');
      console.log(this.chartData.rows);
      // this.sortChartData()
      this.chartData.rows =  this.chartData.rows.sort(this.compare('日期'))

    },
    async getDishAmountInfo() {
      const {data: res} = await this.$http.get('/statistic/profitrank/' + this.nowShopId)
      if (res.meta.status != true) return
      console.log('getDishAmountInfo');
      console.log(res);
      this.dishAmountData.rows = res.data

    },
    async getDishIncomeInfo() {
      const {data: res} = await this.$http.get('/statistic/salerank/' + this.nowShopId)
      if (res.meta.status != true) return
      console.log('getDishIncomeInfo');
      console.log(res);
      this.dishIncomeData.rows = res.data

    }
  }

}
</script>

<style scoped>

</style>