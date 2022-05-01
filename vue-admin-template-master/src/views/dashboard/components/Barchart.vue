<template>
  <div :class="className" :style="{ width, height }"></div>
</template>

<script>
import echarts from "echarts";
import resize from "./mixins/resize";

const animationDuration = 3000;

export default {
    mixins: [resize],
  name: "BarChart",
  props: {
    className: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "300px",
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      this.chart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
        },
        grid: {
          top: 10,
          left: "2%",
          right: "2%",
          bottom: "2%",
          containLabel: true,
        },
        xAxis: [
          {
            data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "pageA",
            type: "bar",
            data: [79, 52, 200, 334, 390, 330, 220],
            stack: "x", //堆叠柱状图
            barWidth: '60%',
            animationDuration,
          },
          {
            name: "pageB",
            type: "bar",
            data: [80, 52, 200, 334, 390, 330, 220],
            stack: "x",
            barWidth: '60%',
            animationDuration,
          },
          {
            name: "pageC",
            type: "bar",
            data: [30, 52, 200, 334, 390, 330, 220],
            stack: "x",
            barWidth: '60%',
            animationDuration,
          },
        ],
      });
    },
  },
};
</script>

<style></style>
