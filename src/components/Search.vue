<template>
  <div id="search">
    <div id="select">
      <template v-if="inputIndex === '0'">
        请选择学期:
        <el-select v-model="selectedValue" placeholder="请选择">
          <el-option
            v-for="item in termSelector"
            :key="item"
            :label="item"
            :value="item">
            <span style="text-align: center">{{ item }}</span>
          </el-option>
        </el-select>
      </template>
      <template v-if="inputIndex === '1'">
        请选择请假时间段:
        <el-date-picker
          v-model="selectedValue"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </template>
      <template v-if="inputIndex === '2'">
        请选择请假类型:
        <el-select v-model="selectedValue" placeholder="请选择">
          <el-option
            v-for="item in typeSelector"
            :key="item.id"
            :label="item.value"
            :value="item.id">
            <span style="text-align: center">{{ item.value }}</span>
          </el-option>
        </el-select>
      </template>
      <el-button type="primary" size="medium" @click="clickFind" :loading="isLoad">查询</el-button>
    </div>
    <!--  -->
    <el-table
      stripe
      fix
      :data="currentData"
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
          <span v-else style="color: #f37b1d;font-size: 16px">
            <i class="el-icon-loading"></i>
            审核中
          </span>
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
  name: 'Search',
  data () {
    return {
      isLoad: false,
      total: 0,
      size: 3,
      pageNo: 1,
      vacateMap: {},
      currentData: [],
      inputIndex: '0',
      inputType: ['term', 'period', 'type'],
      selectedValue: '',
      /* 学期选择 */
      termSelector: ['2018-2019-1', '2018-2019-2', '2019-2020-1', '2019-2020-2'],
      typeSelector: [{id: 0, value: '病假'}, {id: 1, value: '事假'},
        {id: 2, value: '学院学生辅助工作'}, {id: 3, value: '其它'}]
    }
  },
  methods: {
    pageNoChange (pageNo) {
      this.pageNo = pageNo
      this.currentData = this.vacateMap[pageNo]
    },
    clickFind: function () {
      this.pageNo = 1
      let _this = this
      this.isLoad = true
      if (this.selectedValue === '') {
        this.$notify({
          type: 'error',
          title: '错误',
          message: '请输入查询条件!',
          duration: 3000
        })
        _this.isLoad = false
        return false
      } else {
        let condition
        if (this.inputIndex === '1') {
          condition = this.selectedValue[0] + ',' + this.selectedValue[1]
        } else {
          condition = this.selectedValue
        }
        setTimeout(() => {
          let storage = window.localStorage
          let userData = JSON.parse(storage.userData)
          this.$axios.get(_this.global.BaseUrl + '/work/vacate/search/web', {
            params: {
              userId: userData.id,
              identity: storage.identity,
              inputIndex: _this.inputIndex,
              selectedValue: condition,
              pageSize: _this.size
            }
          }).then((res) => {
            // 元素赋值
            _this.vacateMap = res.data.data.vacateMap
            if (_this.vacateMap !== null) {
              _this.currentData = _this.vacateMap[1]
              _this.total = res.data.data.dataCount
            }
            _this.isLoad = false
          })
        }, 1000)
      }
    }
  },
  beforeRouteUpdate: function (to, from, next) {
    this.selectedValue = ''
    this.vacateMap = {}
    this.currentData = []
    if (to.name === 'Search') {
      this.isLoad = false
      this.inputIndex = to.params.index
      console.log(this.inputIndex)
    }
    next()
  }
}
</script>

<style scoped>
#select{
  margin-top: 10px;
  margin-bottom: 5px;
  margin-left: 20px;
  width: calc(100vw - 200px);
  text-align: left;
}
.step{
  margin-left: 300px;
}
.content{
  margin-left: 200px;
}
.pageSelector{
  margin-top: 3px;
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
