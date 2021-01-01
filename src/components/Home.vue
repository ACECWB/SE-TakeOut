<template>

    <el-container class="home-container">
      <el-header>
        <div>
          <img src="../assets/小干.jpg" alt="" >
          <span>饭了-干宝！商家后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>

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
      isCollapse: false,
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
        {
          authName: '数据统计',
          id: '145',
          children: [
            {

            }
          ]
        }
      ]
    }
  },
  created() {
    this.activePath = window.sessionStorage.getItem('activePath')
    // this.getMenuList();
  },
  methods: {
    logout() {
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
</style>
