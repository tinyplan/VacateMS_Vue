<template>
  <div id="home">
    <!-- 按钮组 -->
    <div class="butGroup">
      <el-button type="success" size="medium" @click="findVacate(1)">审批通过</el-button>
      <el-button type="warning" size="medium" @click="findVacate(0)">审核中</el-button>
      <el-button type="danger" size="medium" @click="findVacate(-1)" :disabled="identity ==='3'">申请驳回</el-button>
      <el-button type="info" size="medium" @click="findVacate(-2)" v-if="identity === '0'">回收站</el-button>
    </div>
    <!-- 列表展示 -->
    <el-table
      stripe
      fix
      :data.sync="currentData"
      style="width: 100%"
      height="calc(100vh - 153px)"
      :header-cell-style="{'text-align':'center'}">
      <!-- 展开行 -->
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <!-- 审核未通过 -->
            <template v-if="props.row.status===-1">
              <div class="step">
                <el-steps :active="props.row.step-1" process-status="error" finish-status="success" align-center space="20%">
                  <el-step title="辅导员"></el-step>
                  <el-step title="学院教务部门"></el-step>
                  <el-step title="老师"></el-step>
                </el-steps>
              </div>
            </template>
            <!-- 审核通过 -->
            <template v-else-if="props.row.status===1">
              <div class="step">
                <el-steps :active="3" process-status="success" finish-status="success" align-center space="20%">
                  <el-step title="辅导员"></el-step>
                  <el-step title="学院教务部门"></el-step>
                  <el-step title="老师"></el-step>
                </el-steps>
              </div>
            </template>
            <!-- 审核中 -->
            <template v-else>
              <div class="step">
                <el-steps :active="props.row.step-1" process-status="process" finish-status="success" align-center space="20%">
                  <el-step title="辅导员"></el-step>
                  <el-step title="学院教务部门"></el-step>
                  <el-step title="老师"></el-step>
                </el-steps>
              </div>
            </template>
            <div class="content">
              <el-form-item label="请假单号">
                <span>{{ props.row.vacate.vacate_id }}</span>
              </el-form-item>
              <el-form-item label="申请人">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="请假类型">
                <span>{{ props.row.vacate.type }}</span>
              </el-form-item>
              <el-form-item label="申请时间">
                <span>{{ props.row.vacate.start_time }} ~ {{props.row.vacate.end_time}}</span>
              </el-form-item>
              <el-form-item label="申请学期">
                <span>{{ props.row.vacate.term }}</span>
              </el-form-item>
              <el-form-item label="申请天数">
                <span>{{ props.row.vacate.period }}天</span>
              </el-form-item>
              <el-form-item label="提交时间">
                <span>{{ props.row.vacate.submit_time }}</span>
              </el-form-item>
            </div>
          </el-form>
        </template>
      </el-table-column>
      <!-- 列表行 -->
      <el-table-column
        label="请假人"
        prop="name"
        align="center">
      </el-table-column>
      <el-table-column
        label="请假类型"
        prop="vacate.type"
        align="center">
      </el-table-column>
      <el-table-column
        label="请假时间段"
        align="center">
        <template slot-scope="scope">
          {{scope.row.vacate.start_time}} ~ {{scope.row.vacate.end_time}}
        </template>
      </el-table-column>
      <el-table-column
        label="提交时间"
        prop="vacate.submit_time"
        align="center"
        sortable>
      </el-table-column>
      <el-table-column
        label="审批状态"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1" class="el-icon-check" style="color: #0081ff;font-size: 16px">通过</span>
          <span v-else-if="scope.row.status === -1" class="el-icon-close" style="color: #e54d42;font-size: 16px">未通过</span>
          <span v-else-if="scope.row.status === 0" style="color: #f37b1d;font-size: 16px">
            <i class="el-icon-loading"></i>
            审核中
          </span>
          <span v-else class="el-icon-delete" style="color: #909399;font-size: 16px">撤回</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center">
        <!-- 学生 审核中 -->
        <template slot-scope="scope">
          <template v-if="identity === '0' && scope.row.status === 0">
              <!-- 辅导员已审核过则禁用 -->
              <el-button type="danger" size="medium" :disabled="scope.row.step !== 1" @click="getBack(scope.row)"
                         class="el-icon-circle-close">撤回</el-button>
          </template>
          <!-- 学生 回收站 -->
          <template v-if="identity === '0' && scope.row.status === -2">
            <el-button type="success" size="medium" @click="reSubmit(scope.row)" class="el-icon-upload">重新提交</el-button>
          </template>
          <template v-if="identity ==='1' || identity === '2' && scope.row.status === 0">
            <el-button type="success" size="medium" @click="verified(scope.row,1)" class="el-icon-check">批准</el-button>
            <el-button type="danger" size="medium" @click="verified(scope.row,-1)" class="el-icon-close">驳回</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页导航 -->
    <div class="pageSelector">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="size"
        :total="total"
        :current-page="pageNo"
        @current-change="pageNoChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      identity: '',
      userData: '',
      total: 0,
      size: 2,
      pageNo: 1,
      vacateMap: {},
      currentData: []
    }
  },
  methods: {
    pageNoChange (pageNo) {
      console.log(pageNo)
      this.pageNo = pageNo
      this.currentData = this.vacateMap[pageNo]
    },
    findVacate (status) {
      this.pageNo = 1
      let _this = this
      let storage = window.localStorage
      let userData = JSON.parse(storage.userData)
      this.$axios.get(_this.global.BaseUrl + '/work/vacate/find/web', {
        params: {
          userId: userData.id,
          identity: storage.identity,
          status: status,
          pageSize: _this.size
        }
      }).then((res) => {
        // 元素赋值
        _this.vacateMap = res.data.data.vacateMap
        _this.currentData = _this.vacateMap[1]
        _this.total = res.data.data.dataCount
      })
    },
    getBack (data) {
      console.log(data)
      let _this = this
      this.pageNo = 1
      let storage = window.localStorage
      let userData = JSON.parse(storage.userData)
      this.$axios.get(_this.global.BaseUrl + '/work/student/trash/add', {
        params: {
          userId: userData.id,
          vacate_id: data.vacate.vacate_id
        }
      }).then((res) => {
        // 重新请求数据
        this.$message({
          message: '撤回成功',
          type: 'success'
        })
        this.findVacate(0)
      })
    },
    reSubmit (data) {
      this.pageNo = 1
      let _this = this
      let storage = window.localStorage
      let userData = JSON.parse(storage.userData)
      this.$axios.get(_this.global.BaseUrl + '/work/student/trash/reSubmit', {
        params: {
          userId: userData.id,
          vacate_id: data.vacate.vacate_id
        }
      }).then((res) => {
        // 重新请求数据
        this.$message({
          message: '提交成功,请耐心等待审核',
          type: 'success'
        })
        this.findVacate(-2)
      })
    },
    verified (data, upStatus) {
      let url = this.global.BaseUrl + '/work'
      if (this.identity === '1') {
        url += '/tutor'
      } else {
        url += '/edu'
      }
      let _this = this
      this.$axios.get(url + '/verified', {
        params: {
          userId: _this.userData.id,
          vacate_id: data.vacate.vacate_id,
          identity: _this.identity,
          upStatus: upStatus
        }
      }).then((res) => {
        _this.findVacate(0)
        this.$notify({
          type: 'success',
          title: '成功',
          message: '操作成功',
          duration: 3000
        })
      })
    }
  },
  mounted () {
    let storage = window.localStorage
    this.userData = JSON.parse(storage.userData)
    this.identity = window.localStorage.getItem('identity')
  }
}

</script>

<style scoped>
.butGroup {
  padding-top: 10px;
  padding-left: 20px;
  padding-bottom: 5px;
}
.step{
  margin-left: 300px;
}
.content{
  margin-left: 200px;
}
.pageSelector{
  margin-top: 5px;
  width: calc(100vw - 200px);
  text-align: center;
  position: sticky;
  left: 200px;
  bottom: 0;
  z-index: 999;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
