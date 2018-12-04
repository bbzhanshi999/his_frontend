<template>
  <div style="height:100%">
    <el-row :gutter="20" class="toolbar">
      <el-col :span="12">
        <el-button type="success" icon="el-icon-document"  size="mini" @click="save"  plain>退费</el-button>
        <el-button type="info" icon="el-icon-close" size="mini" @click="cancel" plain>取消</el-button>
        <el-button type="warning" icon="el-icon-minus" size="mini"  plain @click="clear(true)">清屏</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="allRefund" plain>全退</el-button>
      </el-col>
    </el-row>
    <el-container style="height: 100%">
      <el-header height="90px">
        <el-row :gutter="10">
          <el-col :span="3">
            <el-input placeholder="病历号" size="mini" v-model="query.code" @keyup.native="searchMedicalRecord">
              <template slot="prepend">病历号</template>
            </el-input>
          </el-col>
          <el-col :span="3">
            <el-input placeholder="患者姓名" size="mini" disabled v-model="query.name">
              <template slot="prepend">患者姓名</template>
            </el-input>
          </el-col>
          <el-col :span="3">
            <el-input placeholder="合同单位" size="mini" disabled v-model="query.contract">
              <template slot="prepend">合同单位</template>
            </el-input>
          </el-col>
          <el-col :span="3">
            <el-input placeholder="总金额" size="mini" disabled v-model="query.amount">
              <template slot="prepend">总金额</template>
            </el-input>
          </el-col>
          <el-col :span="3">
            <el-input placeholder="自费金额" size="mini" disabled v-model="query.selfPaying">
              <template slot="prepend">自费金额</template>
            </el-input>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="3" :offset="3">
            <el-input placeholder="退后总额" size="mini" disabled v-model="actual.afterAmount">
              <template slot="prepend">退后总金额</template>
            </el-input>
          </el-col>
          <el-col :span="3">
            <el-input placeholder="退后自费金额" size="mini" disabled v-model="actual.afterSelfPaying">
              <template slot="prepend">退后自费金额</template>
            </el-input>
          </el-col>
          <el-col :span="3">
            <el-input placeholder="应退金额" size="mini" disabled v-model="actual.refundAmount">
              <template slot="prepend">应退金额</template>
            </el-input>
          </el-col>
          <el-col :span="3">
            <el-input placeholder="剩余金额" size="mini" disabled v-model="actual.surplusAmount">
              <template slot="prepend">剩余金额</template>
            </el-input>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <transition appear
                    appear-active-class="animated zoomInUp"
                    name="custom-classes-transition" enter-active-class="animated  zoomInUp"
                    mode="out-in">
          <el-table
            :data="tableData"
            highlight-current-row
            size="mini"
            style="width: 98%;margin-left: 0.5rem">
            <el-table-column
              type="index"
              width="50">
            </el-table-column>
            <el-table-column
              prop="drugName"
              label="药品名称">
            </el-table-column>
            <el-table-column
              prop="num"
              label="数量">
            </el-table-column>
            <el-table-column
              prop="unit"
              label="单位">
            </el-table-column>
            <el-table-column
              prop="amount"
              label="金额">
            </el-table-column>
            <el-table-column
              prop="selfPaying"
              label="自费金额">
            </el-table-column>
            <el-table-column
              prop="surplusAmount"
              label="剩余金额">
            </el-table-column>
            <el-table-column
              prop="refundAmount"
              label="应退金额">
            </el-table-column>
            <el-table-column
              prop="price"
              label="单价">
            </el-table-column>
            <el-table-column
              prop="refundNum"
              label="退药数量">
              <template slot-scope="scope">
                <el-input-number size="mini" v-model="scope.row.refundNum" :min="min" :max="scope.row.num"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column
              prop="surplusNum"
              label="剩余数量">
            </el-table-column>
          </el-table>
        </transition>
      </el-main>
      <el-footer height="220px">
        <h4>退款信息</h4>
        <transition appear
                    appear-active-class="animated zoomInUp"
                    name="custom-classes-transition" enter-active-class="animated  zoomInUp"
                    mode="out-in">
        <el-table
          :data="dropData"
          highlight-current-row
          size="mini"
          style="width: 98%;margin-left: 0.5rem">
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            prop="drugName"
            label="退药名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="refundNum"
            label="退药数量"
            style="color:#F56C6C">
          </el-table-column>
          <el-table-column
            prop="unit"
            label="单位">
          </el-table-column>
          <el-table-column
            prop="refundAmount"
            label="退款金额">
          </el-table-column>
          <el-table-column
            prop="price"
            label="单价">
          </el-table-column>
        </el-table>
        </transition>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import _ from 'lodash'
import * as math from 'mathjs'
const dateFormat = require('dateformat')
export default {
  name: 'Restore',
  data () {
    return {
      query: {
        id: '',
        gender: '',
        name: '',
        code: '',
        age: null,
        depart: '',
        contract: '',
        doctor: '',
        status: '',
        selfPaying: 0,
        amount: 0
      },
      tableData: [],
      min: 0,
      actual: {
        surplusAmount: 0,
        refundAmount: 0,
        afterAmount: 0,
        afterSelfPaying: 0
      }
    }
  },
  computed: {
    dropData () {
      return this.tableData.filter(item => item.refundNum > 0)
    }
  },
  watch: {
    tableData: {
      handler (newValue, oldValue) {
        _.forEach(newValue, data => {
          if (this.query.contract === '医保') {
            this.$set(data, 'refundAmount', Number(math.format(data.price * 0.6 * data.refundNum, 14)))
          } else {
            this.$set(data, 'refundAmount', Number(math.format(data.price * data.refundNum, 14)))
          }
          this.$set(data, 'surplusAmount', Number(math.format(data.selfPaying - data.refundAmount, 14)))
          this.$set(data, 'surplusNum', data.num - data.refundNum)
        })
        this.actual.surplusAmount = _.reduce(this.tableData, function (total, data) {
          return total + data.surplusAmount
        }, 0)
        this.actual.refundAmount = _.reduce(this.tableData, function (total, data) {
          return total + data.refundAmount
        }, 0)
        this.actual.afterAmount = Number(math.format(_.reduce(this.tableData, function (total, data) {
          return data.surplusNum * data.price + total
        }, 0), 14))
        this.actual.afterSelfPaying = this.actual.surplusAmount
      },
      deep: true // 深度监视数组或者对象元素的变化
    }
  },
  methods: {
    searchMedicalRecord () {
      if (_.trim(this.query.code)) {
        this.axios.get('/api/medicalRecord/' + this.query.code + '/1').then(res => {
          this.clear()
          if (res.data) {
            _.assignIn(this.query, res.data)
            if (res.data.drugInfoList && res.data.drugInfoList.length > 0) {
              _.each(res.data.drugInfoList, item => {
                item.contract = item.contract ? item.contract : '自费'
                item.refundNum = 0
                this.tableData.splice(this.tableData.length - 1, 0, item)
              })
            }
          }
        })
      }
    },
    clear (complete) {
      this.tableData.splice(0, this.tableData.length)
      if (complete) {
        _.assignIn(this.query, {
          id: '',
          gender: '',
          name: '',
          code: '',
          age: null,
          depart: '',
          contract: '',
          doctor: '',
          status: '',
          selfPaying: 0,
          amount: 0
        })
      } else {
        _.assignIn(this.query, {
          id: '',
          gender: '',
          name: '',
          age: null,
          depart: '',
          contract: '',
          doctor: '',
          status: '',
          selfPaying: 0,
          amount: 0
        })
      }
    },
    save () {
      const h = this.$createElement
      this.$confirm('是否确认进行退费费？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post('/api/medicalRecord/save', this.pepareCommit()).then(res => {
          this.$message({
            type: 'success',
            message: h('h1', {style: 'color: teal'}, '退费成功。'),
            showClose: false,
            center: true
          })
          this.searchMedicalRecord()
        }).catch(() => {
          this.$message({
            type: 'error',
            message: h('h1', {style: 'color: teal'}, '退费成功。'),
            showClose: false,
            center: true
          })
        })
      })
    },
    /**
     * 设置提交病历
     * @param isTemp
     */
    pepareCommit (isTemp) {
      let mr = {}
      mr.status = isTemp ? '2' : '1'
      mr.operator = this.$store.getters.principal.username
      mr.updateTime = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss')
      mr.amount = this.actual.afterAmount
      mr.selfPaying = this.actual.afterSelfPaying
      mr.id = this.query.id
      mr.name = this.query.name
      mr.age = this.query.age
      mr.gender = this.query.gender
      mr.code = this.query.code
      mr.contract = this.query.contract
      mr.depart = this.query.depart
      mr.doctor = this.query.doctor
      // 克隆药品表
      mr.drugInfoList = []
      _.each(this.tableData, item => {
        mr.drugInfoList.push({
          id: item.id,
          price: item.price,
          drugName: item.drugName,
          num: item.surplusNum,
          unit: item.unit,
          amount: Number(math.format(item.price * item.surplusNum)),
          selfPaying: item.surplusAmount
        })
      })
      return mr
    },
    allRefund () {
      _.each(this.tableData, item => { item.refundNum = item.num })
    },
    cancel () {
      _.each(this.tableData, item => { item.refundNum = 0 })
    }
  }
}
</script>

<style scoped>
  .toolbar {
    text-align: justify;
    margin: 5px;
    border-bottom: #909399 1px solid;
    padding-bottom: 5px;
    padding-left: 5px;
    box-shadow: #E4E7ED 2px 2px 5px;
  }

  .el-header, .el-main {
    width: 100%;
    padding: 0;
    margin-bottom: 10px;
    font-size: 12px;
  }

  .el-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 0;
    font-size: 12px;
  }

  .el-header {
    line-height: 40px;
  }

  .el-header, .el-footer {
    background-color: #F2F6FC;
  }

  .table-input:focus {
    outline: none;
  }

  .table-input {
    outline: none;
    border: none;
    color: #606266;
  }

  .table-input::-webkit-input-placeholder {
    color: #dcdfe6;
  }

  .table-input:-moz-placeholder {
    color: #dcdfe6;
  }

  .table-input::-moz-placeholder {
    color: #dcdfe6;
  }

  .table-input:-ms-input-placeholder {
    color: #dcdfe6;
  }

  .total {
    color: #F56C6C;
    font-size: 1.5rem;
  }

  .input-red input {
    color: #F56C6C !important;
  }

</style>
