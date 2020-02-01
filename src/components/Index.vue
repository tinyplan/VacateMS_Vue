<template>
  <div id="index">
    <el-container>
      <!-- header -->
      <el-header>
        <i class="el-icon-date"></i>
        {{message}}
      </el-header>
      <el-container>
        <!-- 侧边 -->
        <el-aside width="200px">
          <el-menu
            router
            :default-active="this.$route.path"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
            <!-- 首页 -->
            <el-menu-item index="/home">
              <i class="el-icon-menu"></i>
              <span slot="title">首页</span>
            </el-menu-item>
            <!-- 查询 -->
            <el-submenu index="/search/-1">
              <template slot="title">
                <i class="el-icon-search"></i>
                <span>条件查询</span>
              </template>
              <el-menu-item index="/search/0">按学期</el-menu-item>
              <el-menu-item index="/search/1">按时间段</el-menu-item>
              <el-menu-item index="/search/2">按类型</el-menu-item>
            </el-submenu>
            <!-- 教务其他功能 -->
            <el-menu-item index="/feature" v-if="identity === '2'">
              <i class="el-icon-edit"></i>
              <span slot="title">其他功能</span>
            </el-menu-item>
            <!-- 请假信息提交(限制学生) -->
            <el-menu-item index="/vacate" v-if="show">
              <i class="el-icon-edit"></i>
              <span slot="title">我要请假</span>
            </el-menu-item>
            <!-- 用户设置 -->
            <el-menu-item index="/userSetting">
              <i class="el-icon-setting"></i>
              <span slot="title">用户设置</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <!-- 主页面 -->
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data () {
    return {
      message: '请假管理系统',
      defaultRouter: '/home',
      show: false,
      identity: ''
    }
  },
  methods: {
  },
  beforeRouteEnter (to, from, next) {
    let storage = window.localStorage
    if (storage.getItem('userData') == null) {
      // 未登录，跳转至登录
      next('/')
    } else {
      // 说明登录过，放行
      next()
    }
  },
  mounted () {
    this.identity = window.localStorage.identity
    this.show = this.identity === '0'
  }
}
</script>

<style scoped>
  .el-header{
    background-color: #F2F6FC;
    color: #333;
    text-align: left;
    line-height: 60px;
    font-size: 20px;
    letter-spacing: 10px;
    position:sticky;
    top:0;
    z-index: 999;
  }

  .el-aside {
    background-color: #545c64;
    color: #333;
    text-align: left;
    line-height: 200px;
    height: calc(100vh - 60px);
    position: sticky;
    top: 60px;
    bottom: 0px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    padding: 0;
    position: sticky;
    top: 60px;
    left: 200px;
  }

  body > .el-container {
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
  .el-icon-date{
    color: #0081FF;
  }
</style>
