<template>
  <div class="container">
    <div id="main_3"></div>
  </div>
</template>
<script>
import * as echarts from "echarts";
export default {
  name: "chart_3",
  data() {
    return {
      key: [],
      value: []
    };
  },
  props: {
    appearance: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    Init_map() {
      console.log(this.key);
      var chartDom = document.getElementById("main_3");
      var myChart = echarts.init(chartDom);
      var option;
      option = {
        title: {
          text: "长相比例分布",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "Access From",
            type: "pie",
            radius: "50%",
            data: [
              { value: this.value[0], name: this.key[0] },
              { value: this.value[1], name: this.key[1] }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };

      option && myChart.setOption(option, true);
    },
  },
  created() {

  },
  mounted() {
    this.Init_map();
  },
  watch: {
    appearance() {
      this.key = Object.keys(this.appearance);
      this.value = Object.values(this.appearance);
      this.Init_map();
    }
  }
};
</script>
<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
#main_3 {
  width: 100%;
  height: 300px;
}
</style>
