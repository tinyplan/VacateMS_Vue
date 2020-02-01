<template>
  <div id="feature">
    <el-tabs type="border-card">
      <el-tab-pane label="数据分析">
        <div id="Analysis">
          <el-row type="flex" class="margin-top" justify="space-around">
            <el-col :span="9">
              <div class="grid-content">
                <el-card class="pie">
                  <ve-pie :data="chartData"></ve-pie>
                  <span class="chartName">请假类型分布(饼图)</span>
                </el-card>
              </div>
            </el-col>
            <el-col :span="9">
              <div class="grid-content">
                <el-card class="histogram">
                  <ve-histogram :data="chartData"></ve-histogram>
                  <span class="chartName">请假类型分布(柱状图)</span>
                </el-card>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="导入信息">
        <el-upload
          class="upload-demo"
          ref="upload"
          action="#"
          :auto-upload="false"
          :before-upload="beforeUploadFile"
          :multiple="false"
          :limit="1"
          :file-list="fileList"
          :on-exceed="handleExceed"
          accept=".xlsx">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传1个Excel文件，且不超过500kb</div>
        </el-upload>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'Feature',
  data () {
    return {
      userData: '',
      fileList: [],
      chartData: {
        columns: ['请假类型', '次数'],
        rows: []
      }
    }
  },
  methods: {
    submitUpload () {
      this.$refs.upload.submit()
    },
    beforeUploadFile (file) {
      let isExcel = file.name.substring(file.name.lastIndexOf('.') + 1) === 'xlsx'
      let isFit = file.size / 1024 <= 500
      if (!isExcel) {
        this.$message({
          message: '上传文件只能是 xlsx 格式!',
          type: 'warning'
        })
      } else if (!isFit) {
        this.$message({
          message: '上传文件大小不符!',
          type: 'warning'
        })
      } else {
        let _this = this
        let formData = new FormData()
        formData.append('userId', this.userData.id)
        formData.append('file', file)
        let config = {
          headers: {'Content-Type': 'multipart/form-data'}
        }
        this.$axios.post(_this.global.BaseUrl + '/work/edu/file/upload', formData, config).then(res => {
          let response = res.data
          if (response.status === 'success') {
            this.$message({
              message: '成功导入' + response.data + '条数据!',
              type: 'success'
            })
          } else {
            this.$message({
              message: '导入失败!',
              type: 'error'
            })
          }
        })
      }
      return false
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    }
  },
  created () {
    let storage = window.localStorage
    this.userData = JSON.parse(storage.userData)
    let _this = this
    console.log(_this.userData.id)
    this.$axios.get(_this.global.BaseUrl + '/work/edu/analysis', {
      params: {
        userId: _this.userData.id
      }
    }).then((res) => {
      if (res.data !== '') {
        let map = res.data
        for (let key in map) {
          this.chartData.rows.push({
            '请假类型': key,
            '次数': map[key]
          })
        }
      }
    })
  }
}
</script>

<style scoped>

</style>
