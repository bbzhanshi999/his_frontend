<template>
  <div style="height:100%">
    <el-dialog :visible.sync="printDialogShow">
      <div id="printContainer">
        <h1>药品收费收据</h1>
        <h4>姓名：{{query.name}}</h4>
        <p><span>总金额：{{charge.amount}}元</span><span style="padding-left: 10px">自费金额：{{charge.selfPaying}}元</span></p>
        <table>
          <tr>
            <th>名称</th>
            <th>单位</th>
            <th>数量</th>
            <th>总价</th>
            <th>单价</th>
          </tr>
          <tr v-bind:key="drugData.drugName" v-for="drugData in tableData">
            <td>{{drugData.drugName}}</td>
            <td>{{drugData.unit}}</td>
            <td>{{drugData.num}}</td>
            <td>{{drugData.amount}}</td>
            <td>{{drugData.price}}</td>
          </tr>
        </table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="printDialogShow = false" size="mini">取 消</el-button>
        <el-button type="primary"  @click="print" size="mini">打印</el-button>
      </div>
    </el-dialog>
    <el-row :gutter="20" class="toolbar">
      <el-col :span="12">
        <el-button type="success" icon="el-icon-document" :disabled="isPrepare" size="mini" @click="save" plain>确认收费</el-button>
        <el-button type="info" icon="el-icon-star-on" size="mini" :disabled="isPrepare" @click="tempSave" plain>暫存</el-button>
        <el-button type="warning" icon="el-icon-delete" size="mini" @click="clear(true)" plain>清屏</el-button>
        <el-button type="danger" icon="el-icon-remove-outline" size="mini" @click="deleteRow" plain>删除</el-button>
        <el-button type="primary" plain size="mini" icon="el-icon-printer" :disabled="printable" @click="showPrint">打印发票</el-button>
      </el-col>
    </el-row>
    <el-container style="height: 100%">
      <el-header height="60px">
        <el-row :gutter="10">
          <el-col :span="3">
            <el-input placeholder="病历号" size="mini" v-model="query.code" @keyup.native="searchMedicalRecord">
              <template slot="prepend">病历</template>
            </el-input>
          </el-col>
          <el-col :span="3">
            <el-input placeholder="患者姓名" size="mini" v-model="query.name">
              <template slot="prepend">姓名</template>
            </el-input>
          </el-col>
          <el-col :span="2" style="width:80px">
            <el-select placeholder="性别" v-model="query.gender" size="mini">
              <el-option v-for="item in gender"
                         :key="item"
                         :label="item"
                         :value="item"></el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-input placeholder="年龄" size="mini" v-model="query.age">
              <template slot="prepend">年龄:</template>
            </el-input>
          </el-col>
          <el-col :span="3">
            <el-input placeholder="诊室" size="mini" v-model="query.depart">
              <template slot="prepend">诊室:</template>
            </el-input>
          </el-col>
          <el-col :span="3">
            <el-input placeholder="医生" size="mini" v-model="query.doctor">
              <template slot="prepend">医生:</template>
            </el-input>
          </el-col>
          <el-col :span="3">
            <el-input placeholder="合同单位" size="mini" v-model="query.contract">
              <template slot="prepend">合同单位</template>
            </el-input>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" plain size="mini" @click="searchMedicalRecord">查询</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <transition appear
                    appear-active-class="animated fadeInRightBig"
                    name="custom-classes-transition" enter-active-class="animated  fadeInRightBig"
                    mode="out-in">
          <el-table
            :data="tableData"
            highlight-current-row
            @current-change="handleCurrentChange"
            size="mini"
            style="width: 98%;margin-left: 0.5rem">
            <el-table-column
              type="index"
              width="50">
            </el-table-column>
            <el-table-column
              label="编码"
              prop="drugCode"
              width="140">
              <template slot-scope="scope">
                <el-autocomplete :fetch-suggestions="searchDrug" placeholder="输入编码" class="table-input"
                                 style="width: 100px"
                                 type="text" v-model="scope.row.drugCode" @select="codeSelect(scope)" size="mini">
                  <template slot-scope="{ item }">
                    <span style="font-size: 0.5rem">{{ item.drugCode }}:{{ item.drugName }}</span>
                  </template>
                </el-autocomplete>
              </template>
            </el-table-column>
            <el-table-column
              prop="drugName"
              label="药品名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="num"
              label="数量"
              width="100">
              <template slot-scope="scope">
                <input placeholder="输入数量" class="table-input" style="width: 30px" type="text" v-model="scope.row.num"/>
              </template>
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
              prop="contract"
              label="结算">
            </el-table-column>
            <el-table-column
              prop="price"
              label="单价">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  @click="deleteRow(scope.$index)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </transition>
      </el-main>
      <el-footer height="100px">
        <el-row>
          <el-col :span="4">
            <h4>当日收款总额</h4>
            <p class="total">{{statistic.amount}}</p>
          </el-col>
          <el-col :span="4">
            <h4>当日发票总数</h4>
            <p class="total">{{statistic.count}}</p>
          </el-col>
          <el-col :span="16">
            <el-row style="height: 40px;line-height: 40px;margin-top: 10px" :gutter="20">
              <el-col :span="6" :offset="11">
                <el-input placeholder="自费金额" size="mini" v-model="charge.selfPaying" :disabled="true">
                  <template slot="prepend">自费金额</template>
                </el-input>
              </el-col>
              <el-col :span="6">
                <el-input placeholder="总额" size="mini" v-model="charge.amount" :disabled="true">
                  <template slot="prepend">总额</template>
                </el-input>
              </el-col>
            </el-row>
            <el-row style="height: 40px;line-height: 40px" :gutter="20">
              <el-col :span="6" :offset="11">
                <el-input placeholder="实收现金" size="mini" v-model="actual">
                  <template slot="prepend">实收现金</template>
                </el-input>
              </el-col>
              <el-col :span="6">
                <div class="input-red el-input el-input--mini el-input-group el-input-group--prepend">
                  <div class="el-input-group__prepend">找零</div>
                  <input type="text" disabled placeholder="找零" v-model="charge.surplus" class="el-input__inner"
                         style="color:red;background-color: #f5f7fa;">
                </div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import _ from 'lodash'
import * as math from 'mathjs'
var dateFormat = require('dateformat')
export default {
  name: 'Charge',
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
        status: ''
      },
      gender: ['男', '女'],
      contracts: ['自费', '医保'],
      tableData: [],
      statistic: {
        amount: 0,
        count: 0
      },
      actual: 0,
      drugTips: [],
      currentRow: null,
      printDialogShow: false
    }
  },
  created () {
    this.tableData.push({
      drugCode: '',
      drugName: '',
      num: 0,
      unit: '',
      amount: 0,
      contract: '自费',
      price: 0
    })
    this.amount()
  },
  computed: {
    isPrepare () {
      return _.trim(this.query.id) && this.query.status !== '1' ? false : 'disabled'
    },
    printable () {
      return _.trim(this.query.id) && this.query.status === '1' ? false : 'disabled'
    },
    charge () {
      let charge = {}
      if (this.query.contract === '医保') {
        charge.selfPaying = _.reduce(this.tableData, function (total, data) {
          return math.format(math.add(total, math.multiply(data.amount, 0.6)), 14)
        }, 0)
      } else {
        charge.selfPaying = _.reduce(this.tableData, function (total, data) {
          return math.format(math.add(total, data.amount), 14)
        }, 0)
      }
      charge.amount = _.reduce(this.tableData, (total, data) => {
        return math.format(math.add(total, data.amount), 14)
      }, 0)
      charge.surplus = math.format(math.subtract(isNaN(this.actual) ? 0 : this.actual, charge.selfPaying), 14)
      // charge.surplus = _.subtract(this.actual, charge.selfPaying)
      return charge
    }
  },
  watch: {
    'query.contract': {
      handler (newValue, oldValue) {
        if (_.indexOf(['自费', '医保'], newValue) !== -1) {
          _.each(this.tableData, item => {
            item.contract = newValue
          })
        }
      },
      deep: true
    },
    tableData: {
      handler (newValue, oldValue) {
        _.forEach(newValue, data => {
          this.$set(data, 'amount', math.format(_.multiply(data.price, data.num), 14))
        })
        if (this.query.contract === '医保') {
          this.actual = _.reduce(this.tableData, function (total, data) {
            return math.format(math.add(total, math.multiply(data.amount, 0.6)), 14)
          }, 0)
        } else {
          this.actual = _.reduce(this.tableData, function (total, data) {
            return math.format(math.add(total, data.amount), 14)
          }, 0)
        }
      },
      deep: true // 深度监视数组或者对象元素的变化
    }
  },
  methods: {
    searchMedicalRecord () {
      if (_.trim(this.query.code)) {
        this.axios.get('/api/medicalRecord/' + this.query.code + '/3').then(res => {
          this.clear()
          if (res.data) {
            _.assignIn(this.query, res.data)
            if (res.data.drugInfoList && res.data.drugInfoList.length > 0) {
              _.each(res.data.drugInfoList, item => {
                item.contract = item.contract ? item.contract : '自费'
                this.tableData.splice(this.tableData.length - 1, 0, item)
              })
            }
          }
        })
      }
    },
    // scope: row, column, $index
    searchDrug (queryString, cb) {
      if (queryString) {
        this.axios.get('/api/drug/' + queryString).then(res => {
          _.forEach(res.data, item => {
            item.value = item.drugCode
          })
          this.drugTips.splice(0, this.drugTips.length)
          _.forEach(res.data, item => this.drugTips.push(item))
          cb(res.data)
        })
      } else {
        let res = []
        cb(res)
      }
    },
    clear (complete) {
      this.tableData.splice(0, this.tableData.length)
      this.tableData.push({
        drugCode: '',
        drugName: '',
        num: 0,
        unit: '',
        amount: 0,
        contract: '自费',
        price: 0
      })
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
          status: ''
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
          status: ''
        })
      }
    },
    codeSelect (scope) {
      let result = this.drugTips.filter(item => item.drugCode === scope.row.drugCode)[0]
      result.num = 1
      result.contract = '自费'
      _.assignIn(scope.row, result)
      if (scope.$index === (this.tableData.length - 1)) {
        this.tableData.push({
          drugCode: '',
          drugName: '',
          num: 0,
          unit: '',
          amount: 0,
          contract: '自费',
          price: 0
        })
      }
      this.drugTips.splice(0, this.drugTips.length)
    },
    handleCurrentChange (val) {
      this.currentRow = val
    },
    deleteRow (index) {
      if (!isNaN(index)) {
        this.tableData.splice(index, 1)
      } else if (this.currentRow) {
        index = _.findIndex(this.tableData, item => item.drugCode === this.currentRow.drugCode)
        this.tableData.splice(index, 1)
        this.currentRow = null
      }
    },
    tempSave () {
      const h = this.$createElement
      this.axios.post('/api/medicalRecord/save', this.pepareCommit(true)).then(res => {
        this.$notify({
          title: '成功',
          type: 'success',
          message: h('h3', {style: 'color: teal'}, '暂存成功'),
          showClose: false
        })
      })
    },
    save () {
      const h = this.$createElement
      this.$confirm('是否确认收费？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post('/api/medicalRecord/save', this.pepareCommit()).then(res => {
          this.$message({
            type: 'success',
            message: h('h1', {style: 'color: teal'}, '收费成功。'),
            showClose: false,
            center: true
          })
          this.amount()
          this.searchMedicalRecord()
        })
      }).catch(() => {
        this.$message({
          type: 'error',
          message: h('h1', {style: 'color: teal'}, '收费失败。'),
          showClose: false,
          center: true
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
      mr.amount = this.charge.amount
      mr.selfPaying = this.charge.selfPaying
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
        mr.drugInfoList.push(item)
      })
      mr.drugInfoList.splice(mr.drugInfoList.length - 1, 1)
      return mr
    },
    /**
     * 获取总金额和总发票数
     */
    amount () {
      this.axios.get('/api/medicalRecord/amount').then(res => {
        this.statistic.amount = math.format(_.reduce(res.data, (sum, item) => sum + item.selfPaying, 0), 14)
        this.statistic.count = res.data.length
      })
    },
    showPrint () {
      this.printDialogShow = true
    },
    print () {
      let printArea = document.getElementById('printContainer').innerHTML
      // let orginArea = document.body.innerHTML
      document.body.innerHTML = printArea
      window.print()
      window.location.reload()
      // document.body.innerHTML = orginArea
      return false
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
    line-height: 60px;
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
