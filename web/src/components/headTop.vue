<template>
  <div class="headTop">
    <img src="../assets/img/xitong.png" alt="">
    <span>数据挖掘课程设计</span>
    <div class="right">323出品</div>
  </div>
</template>
<script>
export default {
  name: 'headTop',
}
</script>
<style lang="less" scoped>
.headTop{
  position: relative;
  width: 100%;
  height: 4vw;
  background-color: rgb(59, 64, 68);
  img{
    position: relative;
    top: 50%;
    transform: translateY(-75%);
    width: 2vw;
    height: 2vw;
    margin: 0 20px;
  }
  span{
    font-size: 1.4vw;
    line-height: 4vw;
    font-weight: 600;
    color: #fff;
  }
  .right{
    position: absolute;
    top: 0;
    right: 10px;
    font-size: 0.8vw;
    color: #fff;
    line-height: 4vw;
  }
}
</style>
