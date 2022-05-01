<template>
  <div class="chart" style="width: 100%; height: 300px"></div>
</template>

<script>
import echarts from "echarts";
import resize from './mixins/resize'
export default {
  mixins:[resize],
  name: "PieChart",
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      this.chart.setOption({
        title: {
          text: "某站点用户访问来源",
          subtext: "纯属虚构",
          left: "right",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"],
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
              {
                value: 335,
                name: "直接访问",
              },
              {
                value: 310,
                name: "邮件营销",
              },
              {
                value: 234,
                name: "联盟广告",
              },
              {
                value: 250,
                name: "视频广告",
              },
              {
                value: 2553,
                name: "搜索引擎",
              },
            ],
          },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      });
    },
  },
};
</script>

<style></style>
