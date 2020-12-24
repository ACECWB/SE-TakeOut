<template>
  <div class="home">
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>

export default {
  name: 'Home',
  components: {

  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push('/login')
    }
  }
}
</script>
