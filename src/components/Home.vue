<template>

    <el-container class="home-container">
      <el-header>
        <div>
          <img src="../assets/小干.jpg" alt="" >
          <span>饭了-干宝！商家后台管理系统</span>
        </div>
<!--        <el-button type="info" @click="logout">退出</el-button>-->
        <el-dropdown>
          <div class="avatar-wrap" >
            <img class="avatar" src="../assets/正经.jpg" alt="">
            <span style="color: #ffffff">{{userName}}</span>
            <i class="el-icon-arrow-down el-icon--right" style="color: #ffffff"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="nowShopId !== 'Admin'" @click.native="showEditDialog">信息修改</el-dropdown-item>
            <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

      </el-header>
      <el-container>
<!--   侧边栏菜单     -->
        <el-aside :width="isCollapse? '64px' : '200px'">
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <el-menu active-text-color="#409EFF" :unique-opened="true" :collapse="isCollapse" :collapse-transition="false" :router="true" :default-active="activePath">

<!--       一级菜单     -->
            <el-submenu :index="item.id" v-for="item in menulist" :key="item.id">
              <template slot="title">
                <i :class="iconsObj[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>

<!--         二级菜单     -->
              <el-menu-item :index="subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState(subItem.path)">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{subItem.authName}}</span>
                </template>
              </el-menu-item>


            </el-submenu>

          </el-menu>
        </el-aside>

        <el-dialog
            title="修改店铺信息"
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

            <el-form-item label-width="100px" label="折扣(小数)" >
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


        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>

</template>

<script>

export default {
  name: 'Home',
  data() {
    return {
      nowShopId: window.sessionStorage.getItem('token'),
      editForm: {shopid: this.nowShopId},
      editFormRules: {
        shopname: [{ required: true, message: '请输入商家名称', trigger:'blur'},],
        address: [{ required: true, message: '请输入地址', trigger:'blur'}],

        password: [{ required: true, message: '请输入密码', trigger:'blur'},
          { min: 6, max: 20, message: '密码长度在6-20之间', trigger: "blur"}],
        shopinfo: [{ required: true, message: '请输入商家描述', trigger:'blur'},],
        discount: [{ required: true, message: '请输入折扣', trigger:'blur'},]

      },
      isCollapse: false,
      username: '',
      activePath: '',  //激活的地址
      //左侧菜单
      iconsObj: {
        '125': 'el-icon-user-solid',
        '103': 'el-icon-s-opportunity',
        '101': 'el-icon-s-goods',
        '102': 'el-icon-s-order',
        '145': 'el-icon-s-marketing'
      },
      menulist: [
        {
          authName: '用户管理',
          id: '125',
          children:[
              {
                authName: '用户列表',
                id: '110',
                path: '/users'
              },
            {
              authName: '商家列表',
              id: '210',
              path: '/shops'
            }
          ]
        },
        // {
        //   authName: '权限管理',
        //   id: '103',
        //   children: [
        //     {
        //       authName: '角色列表',
        //       id: '201',
        //       path: '/roles'
        //
        //     },
        //     {
        //       authName: '权限列表',
        //       id: '202',
        //       path: '/rights'
        //     }
        //   ]
        // },
        {
          authName: '商品管理',
          id: '101',
          children: [
            {
              authName: '商品列表',
              id: '203',
              path: '/goods'
            },
            // {
            //   authName: '分类参数',
            //   id: '204',
            //   path: '/categories'
            // },
            // {
            //   authName: '商品分类',
            //   id: '205',
            //   path: '/categories'
            // }
          ]
        },
        {
          authName: '订单管理',
          id: '102',
          children: [
            {
              authName: '订单列表',
              id: '206',
              path: '/orders'
            }
          ]
        },
        // {
        //   authName: '数据统计',
        //   id: '145',
        //   children: [
        //     {
        //
        //     }
        //   ]
        // }
      ],
      editDialogVisible: false,
    }
  },
  created() {
    this.activePath = window.sessionStorage.getItem('activePath')
    // this.getMenuList();
    this.userName = window.sessionStorage.getItem('token')
    if (this.userName != 'Admin') {
      this.changeToShopMenu()
    }
  },
  methods: {
    editShopInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        console.log(this.editForm.shopid);
        const {data: res} = await this.$http.put('shops/' + this.editForm.shopid, this.editForm)

        console.log('editShopInfo');
        console.log(res);
        if (res.meta.status != true){
          return this.$message.error('更新信息失败！');
        }
        this.editDialogVisible = false;  //关闭对话框
        console.log(res);
        this.$message.success("成功更新信息！");
      })
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    async showEditDialog() {
      const {data: res} = await this.$http.get('shops/' + this.nowShopId)

      if (res.meta.status !== true){
        return this.$message.error('查询商家信息失败！');
      }
      this.$message.success('成功查询商家信息！');
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    changeToShopMenu() {
      this.menulist = [
        {
          authName: '商品管理',
          id: '101',
          children: [
            {
              authName: '商品列表',
              id: '203',
              path: '/goodslist'
            },
          ]
        },
        {
          authName: '订单管理',
          id: '102',
          children: [
            {
              authName: '订单列表',
              id: '206',
              path: '/orders'
            }
          ]
        },
        {
          authName: '数据统计',
          id: '145',
          children: [
            {
              authName: '收入统计',
              id: '211',
              path: '/statistic'
            }
          ]
        }
      ]
    },
    logout() {
      console.log('logout');
      window.sessionStorage.clear();
      this.$router.push('/login')
    },

    // getMenuList() { //获取菜单
    //
    // }
    toggleCollapse() { //点击按钮，菜单展开或折叠
      this.isCollapse = !this.isCollapse;
    },
    saveNavState(activePath) {  // 保存链接激活状态，哪个二级菜单被点击后激活icon和文字
      window.sessionStorage.setItem('activePath', activePath);
      this.activePath = activePath;
    }
  },


}
</script>

<style lang="less" scoped>
  .el-header {
    background-color: #409EFF;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    padding-top: 2px;
    align-items: center;
    color: #fff;
    font-size: 20px;
    > div {
      display: flex;
      align-items: center;
      span {
        margin-left: 10px;
      }
    }
  }
  .el-aside {
    //background-color: #9AC0E8;
    background-color: #ffffff;
    //background-color: #606266;
    .el-menu {
      border-right: none;
    }
  }
  .el-main {
    background-color: #EDF4FC;
  }
  .home-container {
    height: 100%;
  }
  .toggle-button {
    background-color: #909399;
    font-size: 15px;
    line-height: 24px;
    color: #ffffff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
  .avatar-wrap {
    display: flex;
    align-items: center;
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
</style>
