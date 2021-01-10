<template>
  <div>


<!--  登陆Card  -->
  <transition name="bounce">
    <div v-show="showLogin">
    <el-card class="box-card" shadow="hover">
    <div class="imgBox1" style="display: inline-block; vertical-align: middle">
      <center><img src="@/assets/干.jpg" alt="" width="90%" ></center>
    </div>

    <div class="page-title-login">
      <b>User Login</b>
    </div>
    <el-divider><i class="el-icon-postcard"></i></el-divider>
    <div class="form-box">
        <el-switch
            class="switchState"
            v-model="isAdmin"
            active-text="Admin?"
            active-color="#13ce66"
            inactive-color="#ff4949">
        </el-switch>

      <el-form :model="loginForm" status-icon :rules="loginRules" ref="loginFormRef" class="demo-ruleForm">
        <el-form-item prop="shopid">
          <el-input
              v-model="loginForm.shopid"
              placeholder="Please enter your shopId"
              prefix-icon="el-icon-user">
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password"
              v-model="loginForm.password"
              placeholder="Please enter your password"
              prefix-icon="el-icon-key">
          </el-input>
        </el-form-item>
        <el-form-item>
          <div class="submitBox">
            <el-button @click="login" class="submitButton" type="primary">Login</el-button>
          </div>
          <el-divider></el-divider>
<!--          <div class="signUpBox">-->
<!--            <el-button class="signUpButton" type="success">Create New Account</el-button>-->
<!--          </div>-->
          <div>
            <el-link :underline="false" type="primary" @click="changeShow" style="position: absolute; bottom: -10px; right: 10px">No Account? Sign Up Now!</el-link>
          </div>

        </el-form-item>
      </el-form>
    </div>
  </el-card>
    </div>
  </transition>

<!-- 注册 Card -->
    <transition name="bounce">
      <div v-show="showReister">
        <el-card class="box-card-register" shadow="hover">
          <div class="imgBox2">
<!--            <img src="@/assets/cat.jpg" alt="" width="100%">-->
            <center><img src="@/assets/干.jpg" alt="" width="80%" height="80%" ></center>

          </div>

          <div class="page-title-register">
            <b>Register</b>
          </div>
          <el-divider><i class="el-icon-postcard"></i></el-divider>
          <div class="form-box">
            <el-form ref="registerFormRef" :model="registerForm" status-icon :rules="rules" class="demo-ruleForm">
<!--              <el-form-item prop="userid">-->
<!--                <el-input-->
<!--                    v-model="registerForm.userid"-->
<!--                    placeholder="Please enter your userId"-->
<!--                    prefix-icon="el-icon-user">-->
<!--                </el-input>-->
<!--              </el-form-item>-->


              <el-form-item prop="shopid">
                <el-input
                    v-model="registerForm.shopid"
                    placeholder="Please enter your shopId"
                    prefix-icon="el-icon-user">
                </el-input>
              </el-form-item>

              <el-form-item prop="shopname">
                <el-input
                    v-model="registerForm.shopname"
                    placeholder="Please enter your shopName"
                    prefix-icon="el-icon-s-shop">
                </el-input>
              </el-form-item>

              <el-form-item prop="address">
                <el-input
                    v-model="registerForm.address"
                    placeholder="Please enter your address"
                    prefix-icon="el-icon-map-location">
                </el-input>
              </el-form-item>

            <el-form-item prop="password">
              <el-input type="password"
                        v-model="registerForm.password"
                        placeholder="Please enter your password"
                        prefix-icon="el-icon-key">
              </el-input>
            </el-form-item>

            <el-form-item prop="confirmpassword">
              <el-input type="password"
                        v-model="registerForm.confirmpassword"
                        placeholder="Please confirm your password"
                        prefix-icon="el-icon-key">
              </el-input>
            </el-form-item>

              <el-form-item>
                <div class="submitBox">
                  <el-button class="submitButton" type="primary" @click="register">Register</el-button>
                </div>
                <el-divider></el-divider>
                <!--          <div class="signUpBox">-->
                <!--            <el-button class="signUpButton" type="success">Create New Account</el-button>-->
                <!--          </div>-->
                <div>
                  <el-link :underline="false" type="primary" @click="changeShow" style="position: absolute; bottom: -10px; right: 10px">Already have an account? Login now!</el-link>
                </div>

              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
name: "Login",
  data(){

    let validatePassword = (rule, value, callback) => {
      if (value != this.registerForm.password){
        callback(new Error("两次密码不一致！"))
      }else{
        callback();
      }
    };
    return{
      isAdmin: false,
      imagePath: '../assets/cloe.png',
      // 登陆表单数据绑定对象
      loginForm: {
        shopid: '',
        password: ''
      },
      registerForm: {

        password: '',
        shopid: '',
        address: '',
        confirmpassword: '',
        shopname: ''
      },
      loginRules: {
        shopid: [{required: true, message: 'Please enter your userId!', trigger: 'blur'}],
        password: [{required: true, message: 'Please enter your password!', trigger: 'blur'}],

      },
      rules: {
        shopid: [{required: true, message: 'Please enter your userId!', trigger: 'blur'},
                  {min: 2, max: 30, message: 'length should between 2 and 30', trigger: 'change'}],
        password: [{required: true, message: 'Please enter your password!', trigger: 'blur'},
                  {min: 6, max: 30, message: 'length should between 6 and 30', trigger: 'blur'}],
        address: [{required: true, message: 'Please enter your address!', trigger: 'blur'}],
        confirmpassword: [{required: true, message: 'Please confirm your password!', trigger: 'blur'},
                          {min: 6, max: 30, message: 'length should between 6 and 30', trigger: 'blur'},
                          {validator: validatePassword, trigger: 'blur'}],
        shopname: [{required: true, message: 'Please enter your shopName!', trigger: 'blur'}],

      },
      showLogin: true,
      showReister: false,
      nowLogin: false,

    }
  },
  methods: {
    changeShow() {
      let _this = this;
      if(this.showReister){
        this.nowLogin = true;
        this.showReister = !this.showReister;
      }else{
        this.showLogin = !this.showLogin;
      }

      setTimeout(function (){
        if(_this.nowLogin){
          _this.showLogin = true;
        }else{
          _this.showReister = true;
        }
        _this.nowLogin = !_this.nowLogin;
      }, 800);

    },
    async login() {
      this.$refs.loginFormRef.validate(async valid => {
        // console.log("here", valid);
        if (!valid){
          swal({
            type: 'error',
            title: '登陆失败',
            icon: 'error',
            showCloseButton: true,

          })
          return false;
        }
      })
      // 登陆成功判断是管理员还是商家
      let url = ''
      let loginForm
      console.log('isAdmin')
      console.log(this.isAdmin);
      if (this.isAdmin){
        url = 'login/?usertype=administrator'
        loginForm = {
          administratorid: this.loginForm.shopid,
          password: this.loginForm.password
        }
      }else{
        url = 'login/?usertype=shop'
        loginForm = this.loginForm
      }

      const {data: res} = await this.$http.put(url, loginForm)
      console.log('login:');
      console.log(res);
      console.log(url);
      console.log(loginForm);
      if (res.meta.status == true){
        swal({
          title: '登陆成功',
          icon: 'success',
        })
        console.log('LoginSuccess');
        console.log(res.data);
        console.log(res.data.address)
        if (res.data.shopid == null){
          window.sessionStorage.setItem('token', 'Admin');
          this.$store.state.isAdmin = true
        }
        else{
          window.sessionStorage.setItem('token', res.data.shopid);
          this.$store.state.shopName = res.data.shopname
          this.$store.state.shopId = res.data.shopid
        }

        // console.log(this.loginForm);
        this.$router.push({
          path:'/home',
        })

      }else{
        swal({
          title: '登陆失败, 账号或密码错误!',
          icon: 'error'
        })
        return false;
      }
    },
    register() {
      let _this = this
      this.$refs.registerFormRef.validate(async valid => {
        if (!valid) {
          swal({
            type: 'error',
            title: '注册失败，请认真填写注册表信息！',
            icon: 'error',
          })
          return;
        }else{
          let {data: res} = await this.$http.put('register/?usertype=shop', this.registerForm)

          console.log(res);
          if (res.meta.status != true) {
            swal({
              type: 'error',
              title: '注册失败, 此商家ID已存在！',
              icon: 'error',
            })
            return
          }

          swal({
            type: 'success',
            title: '注册成功',
            icon: 'success',
            confirmButtonText: '确定',
            closeOnConfirm: false,
          }).then(function () {
            console.log(_this, res.data._id)
            window.sessionStorage.setItem('token', res.data._id);
            _this.$router.push('/home')
          });

          // this.$http.put('register/?usertype=shop', this.registerForm).then(res => {
          //   console.log(res);
          //   let _this = this;
          //   if(res.data.meta == true){
          //     swal({
          //       type: 'success',
          //       title: '注册成功',
          //       icon: 'success',
          //       confirmButtonText: '确定',
          //       closeOnConfirm: false,
          //     }).then(function () {
          //       console.log(_this, res.data._id)
          //       window.sessionStorage.setItem('token', res.data._id);
          //       _this.$router.push('/home')
          //     });
          //   }else{
          //     swal({
          //       type: 'error',
          //       title: '注册失败, 此商家ID已存在！',
          //       icon: 'error',
          //     })
          //   }



          }



      })
    }

  }
}
</script>

<style scoped>
.box-card-register {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  height:700px;
  border-radius: 5%;
}
.box-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height:560px;
  border-radius: 5%;
}
.imgBox1 {
  position: absolute;
  margin-top: 40px;
  margin-bottom: 10px;
  left: 50%;
  /*right: 50%;*/
  transform: translate(-50%, -20%);
  /*justify-content: center;*/

}

.imgBox2 {
  position: absolute;
  margin-top: 50px;
  margin-bottom: 10px;
  left: 50%;
  transform: translate(-50%, -30%);
}

.form-box {
  width: 80%;
  float: left;
  transform: translate(12%, 0);
}
.page-title-login {
  position: relative;
  width: 100%;
  margin-top: 55%;
  margin-bottom: 20px;
  text-align: center;
  font-size: 30px;
  z-index: 99;
}
.page-title-register {
  position: relative;
  width: 100%;
  margin-top: 43%;
  margin-bottom: 15px;
  text-align: center;
  font-size: 30px;
  z-index: 99;
}

.submitBox {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
}
.submitButton {
  width: 100%;
  height: auto;

}
.registerButton {
  width: 100%;
  height: auto;

}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.bounce-enter-active {
  position: absolute;
  top: 50%;
  left: 50%;
  animation: bounce-in .5s;
}
.bounce-leave-active {
  position: absolute;
  top: 50%;
  left: 50%;
  animation: bounce-in .5s reverse;
}
.switchState {
  margin-top: -20px;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>