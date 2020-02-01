<template>
  <div id="userSetting" v-if="flag===1">
    <center>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>用户信息</span>
        </div>
        <div class="text item">
          {{'姓名：' + userData.name}}
        </div>
        <div class="text item">
          {{'用户ID：' + userData.id}}
        </div>
      </el-card>
    </center>
    <el-button type="primary" @click="goNext">修改密码</el-button>
    <el-button type="danger" @click="logout">退出登录</el-button>
  </div>
  <div id="changePwd" v-else>
    <el-page-header @back="goBack" content="修改密码">
    </el-page-header>
    <el-form ref="form" :model="form" label-width="8rem" class="form" label-suffix=" : " status-icon :rules="rules" >
      <el-form-item label="新密码" prop="pwd" required>
        <el-input v-model="form.pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPwd" required>
        <el-input v-model="form.confirmPwd" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="changePwd('form')">修改密码</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'UserSetting',
  data () {
    return {
      identity: '',
      userData: '',
      flag: 1,
      form: {
        pwd: '',
        confirmPwd: ''
      },
      rules: {
        pwd: [{
          required: true,
          trigger: 'blur',
          message: '密码不能为空'
        }],
        confirmPwd: [{
          required: true,
          trigger: 'blur',
          message: '确认密码不能为空'
        }]
      }
    }
  },
  methods: {
    goNext () {
      this.flag = 2
    },
    goBack () {
      this.flag = 1
    },
    changePwd (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let _this = this
          if (this.form.pwd === this.form.confirmPwd) {
            this.$axios.get(_this.global.BaseUrl + '/work/vacate/edit/pwd', {
              params: {
                userId: _this.userData.id,
                identity: _this.identity,
                newPwd: _this.form.pwd
              }
            }).then((res) => {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.flag = 1
            })
          } else {
            this.$message({
              message: '两次输入密码不一致',
              type: 'error'
            })
            return false
          }
        } else {
          return false
        }
      })
    },
    logout () {
      var storage = window.localStorage
      storage.clear()
      this.$router.push('/')
    }
  },
  mounted () {
    let storage = window.localStorage
    this.userData = JSON.parse(storage.userData)
    this.identity = storage.getItem('identity')
  }
}
</script>

<style scoped>
  #userSetting {
    text-align: center;
  }

  #changePwd {
    margin-top: 10px;
    margin-left: 20px;
    width: 30rem;
  }

  .form {
    margin-left: 350px;
    margin-top: 1.5rem;
    width: 400px;
  }

  text {
    font-size: 1rem;
  }

  .item {
    margin-bottom: 1rem;
  }

  .clearfix:before, .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .box-card {
    margin-top: 20px;
    width: 30rem;
    margin-bottom: 1.5rem;
  }
</style>
