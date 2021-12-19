<template>
  <div class="root">
    <div class="k-body">
      <div
        v-for="k of kPoints"
        :key="k.id"
        :style="{ top: `${k.y}px`, left: `${k.x}px`, background: k.color }"
        class="k-point"
      />
      <div
        v-for="point of dataSource"
        :key="point.id"
        :style="{
          top: `${point.y}px`,
          left: `${point.x}px`,
          background: point.color,
        }"
        class="point"
      />
    </div>
    <div class="control">
      <label>
        请输入K值:
        <input type="number" v-model="k" />
      </label>
      <button @click="handleStartCalculate">开始计算</button>
      <button @click="handleMoveKPoints">移动K点</button>
      <button @click="handleReset">重置</button>
    </div>
  </div>
</template>
<script>
import { filter, forEach, isEqual, map, minBy, random, sumBy } from "lodash";
import { v4 as uuid } from "uuid";

const COLORS = [
  "#297aff",
  "#ff9800",
  "#30af28",
  "#ffcc0d",
  "#00cccc",
  "#66ccff",
  "#01a5ed",
  "#009966",
  "#A0D911",
];

const DEFAULT_COLOR = "#000000";

export default {
  name: "KMeans",
  data() {
    return {
      dataSource: [], // 样本
      kPoints: [], // 质心
      k: 5, // K值
    };
  },
  created() {
    this.handleReset();
  },
  methods: {
    handleReset() {
      this.resetDataSource();
      this.initialKPoints();
    },
    initialKPoints() {
      this.kPoints = map(new Array(parseInt(this.k)), (item, index) => ({
        id: uuid(),
        x: random(0, 800 - 50, false),
        y: random(0, 800 - 50, false),
        color: COLORS[index % COLORS.length],
      }));
    },
    resetDataSource() {
      this.dataSource = map(new Array(600), () => ({
        id: uuid(),
        x: random(0, 800 - 10, false),
        y: random(0, 800 - 10, false),
        color: DEFAULT_COLOR,
        parent: null,
      }));
    },
    /**
     * 计算样本最近的k点
     * @param point
     * @returns {*}
     */
    calculateNearestKPoint(point) {
      const { kPoints } = this;
      return minBy(kPoints, (kPoint) => {
        const { x, y } = kPoint;
        const xOffset = Math.abs(x - point.x);
        const yOffset = Math.abs(y - point.y);
        return Math.sqrt(xOffset ** 2 + yOffset ** 2);
      });
    },
    /**
     * 计算样本离哪个K点最近并进行分类
     */
    handleStartCalculate() {
      const { dataSource, calculateNearestKPoint } = this;
      forEach(dataSource, (point) => {
        const nearestKPoint = calculateNearestKPoint(point);
        point.color = nearestKPoint.color;
        point.parent = nearestKPoint.id;
      });
    },
    /**
     * 根据样本点计算质心
     */
    handleMoveKPoints() {
      const { dataSource, kPoints } = this;
      forEach(kPoints, (kPoint) => {
        const children = filter(dataSource, (point) =>
          isEqual(point.parent, kPoint.id)
        );
        kPoint.x = sumBy(children, (point) => point.x) / children.length;
        kPoint.y = sumBy(children, (point) => point.y) / children.length;
      });
    },
  },
};
</script>

<style scoped>
.root {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.k-body {
  margin: 0 auto;
  width: 800px;
  height: 800px;
  position: relative;
  border: 1px solid grey;
  transform: scale(0.5);
}
.point {
  width: 10px;
  height: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  position: absolute;
  opacity: 0.5;
}
.k-point {
  width: 25px;
  height: 25px;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 25px;
  position: absolute;
}
.control {
  position: fixed;
  top: 200px;
  left: 57%;
  transform: translateX(-50%);
}
</style>
