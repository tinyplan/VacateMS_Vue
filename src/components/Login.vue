<template>
  <div id="login">
    <el-form :model="loginForm" status-icon :rules="rules" ref="loginForm" class="loginForm">
      <div id="title">用户登录</div>
      <el-form-item prop="uid">
        <el-input v-model="loginForm.uid" autocomplete="off" placeholder="用户ID"></el-input>
      </el-form-item>
      <el-form-item prop="pwd">
        <el-input type="password" v-model="loginForm.pwd" autocomplete="off" placeholder="密码" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="selected" placeholder="请选择身份">
          <el-option v-for="item in identityList" :key="item.index" :label="item.value" :value="item.index"></el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    /* 校验用户ID */
    var checkUid = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入用户ID'))
      } else {
        callback()
      }
    }
    /* 校验用户密码 */
    var checkPwd = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      identityList: [{
        index: 0,
        value: '学生'
      }, {
        index: 1,
        value: '辅导员'
      }, {
        index: 2,
        value: '教务'
      }, {
        index: 3,
        value: '任课教师'
      }],
      selected: '',
      loginForm: {
        uid: '',
        pwd: ''
      },
      rules: {
        uid: [{
          validator: checkUid,
          trigger: 'blur'
        }],
        pwd: [{
          validator: checkPwd,
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let _this = this
          this.$axios.get(_this.global.BaseUrl + '/work/login', {
            params: {
              userId: this.loginForm.uid,
              password: this.loginForm.pwd,
              identity: this.selected
            }
          }).then((res) => {
            let response = res.data
            if (response.status === 'success') {
              var storage = window.localStorage
              storage.identity = this.selected
              storage.userData = JSON.stringify(response.data)
              let _this = this
              this.$notify({
                type: 'success',
                title: '登录成功',
                message: '欢迎进入请假系统!' + response.data.name + _this.identityList[this.selected].value,
                duration: 3000
              })
              if (this.selected !== 0) {
                this.findNew(this.loginForm.uid, this.selected)
              }
              this.$router.push('/index')
            } else {
              this.$notify({
                type: 'error',
                title: '登录失败',
                message: 'ID或密码错误!',
                duration: 3000
              })
            }
          }).catch((error) => {
            console.error(error)
          })
        }
      })
    },
    findNew (userId, identity) {
      let _this = this
      this.$axios.get(_this.global.BaseUrl + '/work/vacate/count', {
        params: {
          userId: userId,
          identity: identity
        }
      }).then((res) => {
        if (res.data !== 0) {
          this.$alert('您有' + res.data + '条未处理的请假信息', '消息提示', {
            confirmButtonText: '确定',
            callback: action => {
            }
          })
        }
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    let storage = window.localStorage
    if (storage.getItem('userData') != null) {
      // 登陆过，则直接跳转
      next('/index')
    } else {
      // 未登录，进入登录界面
      next()
    }
  },
  beforeRouteLeave (to, from, next) {
    let storage = window.localStorage
    if (storage.getItem('userData') == null) {
      this.$notify({
        type: 'error',
        title: '错误',
        message: '请先登录!',
        duration: 3000
      })
      // 截断
      next(false)
    } else {
      next()
    }
  },
  mounted () {
    console.log('BaseUrl=' + this.global.BaseUrl)
  }
}
</script>

<style scoped>
  #login {
    background-image: url(../../static/index.jpg);
    width: 100%;
    height: 100vh;
    position: relative;
  }

  .loginForm {
    width: 20rem;
    height: 20rem;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    text-align: center;
  }

  #title {
    margin-top: 2rem;
    margin-bottom: 2rem;
    color: #ddd;
    font-size: 2rem;
  }

  .el-button {
    width: 20rem;
  }

  .el-select {
    width: 100%;
  }
</style>
