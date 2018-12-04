<template>
  <div style="height:100%">
    <el-row :gutter="20" class="toolbar">
      <el-col :span="24">
        <el-col :span="3">
          <el-input placeholder="病历号" size="mini" v-model="queryCode" @keyup.native="searchMedicalRecord">
            <template slot="prepend">病历</template>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" plain size="mini" @click="searchMedicalRecord">查询</el-button>
        </el-col>
      </el-col>
    </el-row>
    <el-container style="height: 100%">
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
              prop="updateTime"
              label="日期"
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="患者姓名"
              width="180">
            </el-table-column>
            <el-table-column
              prop="contract"
              label="结算类型">
            </el-table-column>
            <el-table-column
              prop="code"
              label="编号">
            </el-table-column>
            <el-table-column
              prop="refund"
              label="报销金额">
            </el-table-column>
            <el-table-column
              prop="selfPaying"
              label="自付金额">
            </el-table-column>
            <el-table-column
              prop="amount"
              label="总金额">
            </el-table-column>
          </el-table>
        </transition>
      </el-main>
      <el-footer height="20px">
        <el-row>
          neusoft
        </el-row>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import _ from 'lodash'
import * as math from 'mathjs'
export default {
  name: 'Search',
  data () {
    return {
      tableData: [],
      queryCode: ''
    }
  },
  methods: {
    searchMedicalRecord () {
      if (_.trim(this.queryCode)) {
        this.axios.get('/api/medicalRecord/' + this.queryCode + '/1').then(res => {
          this.tableData.splice(0, this.tableData.length)
          if (res.data && res.data.id) {
            res.data.refund = math.format(res.data.amount - res.data.selfPaying)
            this.tableData.push(res.data)
          }
        })
      }
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
</style>
