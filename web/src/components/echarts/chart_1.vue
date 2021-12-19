<template>
  <div class="container">
    <div id="main_1"></div>
  </div>
</template>
<script>
import * as echarts from "echarts";
export default {
  name: "chart_1",
  data() {
    return {
      key: [],
      value: [],
    };
  },
  props: {
    age: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    Init_map() {
      console.log(this.key);
      var chartDom = document.getElementById("main_1");
      var myChart = echarts.init(chartDom);
      var option;
      option = {
        title: {
          text: "各年龄段统计图",
          textStyle: {
            fontSize: 16,
          },
        },
        xAxis: {
          type: "category",
          data: this.key,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: this.value,
            type: "bar",
          },
        ],
      };
      option && myChart.setOption(option, true);
    },
  },
  created() {
    this.key = Object.keys(this.age);
    this.value = Object.values(this.age);
  },
  mounted() {
    this.Init_map();
  },
  watch: {
    age() {
      this.key = Object.keys(this.age);
      this.value = Object.values(this.age);
      this.Init_map();
    },
  },
};
</script>
<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
#main_1 {
  width: 100%;
  height: 300px;
}
</style>
