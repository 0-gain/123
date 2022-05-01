<template>
  <div class="dashboard-editor-container">
    <PanelGroup @handleSetLineChartData="handleSetLineChartData"/>

    <div class="chart-line">
      <line-chart :chart-data="lineChartData" :yTittle="yTitle" />
    </div>
    
    <el-row :gutter="20" class="chart-row">
      <el-col :xs='24' :sm='24' :lg='12'>
        <el-card>
          <BarChart/>
        </el-card>
      </el-col>
      <el-col :xs='24' :sm='24' :lg='12'>
        <el-card>
          <PieChart/>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :xs='24' :sm='24' :lg='8'>
        <el-card>
          <LineChart2/>
        </el-card>
      </el-col>
      <el-col :xs='24' :sm='24' :lg='8'>
        <el-card>
          <BarChart2/>
        </el-card>
      </el-col>
      <el-col :xs='24' :sm='24' :lg='8'>
        <el-card>
          <PieChart2/>
        </el-card>
      </el-col>
      
      
    </el-row>
  </div>
</template>

<script>
import PanelGroup from "./components/PanelGroup";
import LineChart from "./components/LineChart.vue";
import BarChart from './components/Barchart.vue'
import PieChart from './components/PieChart.vue'

import BarChart2 from './components/Barchart2.vue'
import LineChart2 from './components/LineChart2.vue'
import PieChart2 from './components/PieChart2.vue'

const lineChartDatas = {
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130],
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130],
  },
  newUsers: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145],
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130],
  },
};

const yTitles = {
  purchases: "交易金额(万元)",
  shoppings: "订单数量(个)",
  newUsers: "客户数量(人)",
  messages: "消息数量(条)",
};
export default {
  name: "Dashboard",
  data() {
    return {
      lineChartDatas: [],
      lineChartData: {},
      yTitle: yTitles.purchases,
    };
  },
  mounted() {
    setTimeout(() => {
      this.lineChartDatas = lineChartDatas;
      this.lineChartData = lineChartDatas.purchases;
    }, 1000);
  },
  methods: {
    handleSetLineChartData(type){
      this.lineChartData = this.lineChartDatas[type]
    }
  },
  components: {
    PanelGroup,
    LineChart,
    BarChart,
    PieChart,
    BarChart2,
    LineChart2,
    PieChart2
  },
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .chart-line {
    background: #fff;
    padding: 16px 0 0 16px;
    margin-bottom: 32px;
  }
  .chart-row {
    margin-bottom: 32px;
  }
}
</style>
