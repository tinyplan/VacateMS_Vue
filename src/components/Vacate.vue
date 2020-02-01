<template>
  <div id="vacate">
    <el-card class="box-card">
      <div class="title">请假单</div>
      <el-form ref="form"
             :model="form"
             label-width="200px"
             label-suffix=" : "
             status-icon
             :rules="rules">
      <el-row :gutter="20">
        <el-col :span="20" :offset="4">
          <div class="grid-content">
              <el-form-item label="姓名" required>
                <el-input v-model="form.name" style="width: 300px" disabled></el-input>
              </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="20" :offset="4">
          <el-form-item label="请假时间段" style="width: 1000px" required prop="startDate">
            <el-date-picker
              v-model="form.startDate"
              type="date"
              placeholder="选择开始日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd">
            </el-date-picker>
            -
            <el-date-picker
              v-model="form.endDate"
              type="date"
              placeholder="选择结束日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="20" :offset="4">
          <div class="grid-content">
            <el-form-item label="类型" required prop="type">
              <el-select v-model="form.type" placeholder="请选择类型" @change="typeChange">
                <el-option
                  v-for="item in typeSelector"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id">
                  <span style="text-align: center">{{ item.value }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <template v-if="showReason">
        <el-row :gutter="20">
          <el-col :span="20" :offset="4">
            <div class="grid-content">
              <el-form-item label="请假原因" prop="result">
                <el-input
                  style="width: 450px"
                  type="textarea"
                  placeholder="请输入请假原因"
                  v-model="form.result"
                  maxlength="100"
                  show-word-limit
                  rows="4"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </template>
      <el-row :gutter="20">
        <el-col :span="20" :offset="4">
          <div class="grid-content">
            <el-form-item label="影响课程">
              <el-button type="primary" size="small" @click="findCourse" :loading="isLoad">选择</el-button>
            </el-form-item>
            <el-dialog
              title="选择课程"
              :visible.sync="courseDialog"
              width="30%"
              :modal="false"
              center>
              <el-checkbox-group v-model="temp">
                <div v-for="course in courseList"
                      :key="course.course_id">
                  <el-row>
                    <el-col :span="10" :offset="7">
                      <el-checkbox border :label="course.course_id" class="courseCheck">
                        {{course.name}}
                      </el-checkbox>
                    </el-col>
                  </el-row>
                </div>
              </el-checkbox-group>
              <span slot="footer" class="dialog-footer">
                <el-button @click="cancelCourse">取 消</el-button>
                <el-button type="primary" @click="confirmCourse">确 定</el-button>
              </span>
            </el-dialog>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10" :offset="8">
            <el-tag v-for="course in selectedList"
                    :key="course"
                    class="courseTag"
                    effect="dark"
                    type="success">{{course}}</el-tag>
        </el-col>
      </el-row>
    </el-form>
    </el-card>
    <div class="btn">
      <el-button @click="resetForm">重置</el-button>
      <el-button type="primary" @click="submitForm('form')">提交申请</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Vacate',
  data () {
    let checkDate = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入开始时间'))
      } else if (this.form.endDate === '') {
        callback(new Error('请输入结束时间'))
      } else if (value > this.form.endDate) {
        callback(new Error('请正确填写请假时间'))
      } else {
        callback()
      }
    }
    let checkResult = (rule, value, callback) => {
      if (this.form.type === 3) {
        if (!value.length > 0) {
          callback(new Error('请填写内容'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      form: {
        name: '',
        startDate: '',
        endDate: '',
        type: '',
        result: '',
        selectedCourse: ''
      },
      rules: {
        type: [
          {required: true, trigger: 'change', message: '请选择请假类型'}
        ],
        startDate: [
          {required: true, type: 'date', validator: checkDate, trigger: 'blur', message: '开始时间不能为空'}
        ],
        result: [
          {validator: checkResult, trigger: 'blur'}
        ]
      },
      isLoad: false,
      showReason: false,
      courseDialog: false,
      userData: '',
      typeSelector: [{id: 0, value: '病假'}, {id: 1, value: '事假'},
        {id: 2, value: '学院学生辅助工作'}, {id: 3, value: '其它(请描述原因)'}],
      courseList: [],
      temp: [],
      selectedList: []
    }
  },
  methods: {
    typeChange (type) {
      this.showReason = type === 3
      this.form.result = ''
    },
    findCourse () {
      // this.isLoad = true
      this.courseDialog = true
      let _this = this
      this.$axios.get(this.global.BaseUrl + '/work/student/findCourse', {
        params: {
          stuId: _this.userData.id,
          startDate: _this.form.startDate,
          endDate: _this.form.endDate
        }
      }).then((res) => {
        this.courseList = res.data
      })
    },
    cancelCourse () {
      this.courseDialog = false
    },
    confirmCourse () {
      this.selectedList = []
      // 数据处理
      let courses = ''
      this.temp.forEach((item) => {
        courses += (item + ',')
      })
      this.temp.forEach((t) => {
        this.courseList.forEach((c) => {
          if (t === c.course_id) {
            this.selectedList.push(c.name)
          }
        })
      })
      courses = courses.substring(0, courses.length - 1)
      // 赋值并进行关闭对话框
      this.form.selectedCourse = courses
      this.courseDialog = false
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        let _this = this
        if (valid) {
          this.$axios.get(_this.global.BaseUrl + '/work/student/addVacate', {
            params: {
              stuName: this.form.name,
              submitTime: this.getTime(),
              startDate: this.form.startDate,
              endDate: this.form.endDate,
              typeIndex: this.form.type,
              result: this.form.result,
              courses: this.form.selectedCourse
            }
          }).then((res) => {
            let response = res.data
            if (response.status === 'success') {
              this.resetForm()
              this.$notify({
                type: 'success',
                title: '提交成功',
                message: '请耐心等待结果',
                duration: 3000
              })
            }
          })
        } else {
          return false
        }
      })
    },
    resetForm () {
      let _this = this
      this.form = {
        name: _this.userData.name,
        startDate: '',
        endDate: '',
        type: '',
        result: '',
        selectedCourse: ''
      }
      this.courseList = []
      this.temp = []
      this.selectedList = []
      this.showReason = false
    },
    getTime () {
      let date = new Date()
      let y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? ('0' + MM) : MM
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      let h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      let m = date.getMinutes()
      m = m < 10 ? ('0' + m) : m
      let s = date.getSeconds()
      s = s < 10 ? ('0' + s) : s
      return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
    }
  },
  mounted () {
    let storage = window.localStorage
    this.userData = JSON.parse(storage.userData)
    this.form.name = this.userData.name
  }
}
</script>

<style scoped>
  #vacate{
    padding-top: 20px;
  }
  .title {
    letter-spacing: 20px;
    margin: 20px;
    text-align: center;
    font: 20px Extra large;
  }
  .el-row {
    margin-bottom: 5px
  }
  .el-row:last-child{
    margin-bottom: 0
  }
  .el-col {
    border-radius: 4px;
  }
  .courseCheck {
    width: 200px;
    margin-bottom: 5px;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .courseTag {
    margin-bottom: 5px;
    margin-right: 10px;
    text-align: center;
    width: 100px;
  }
  .box-card {
    margin-left: 150px;
    width: fit-content;
    height: fit-content;
  }
  .btn {
    margin-top: 20px;
    text-align: center;
  }
</style>
