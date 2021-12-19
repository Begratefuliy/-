<template>
  <div id="usertop">
    <div class="top">
      <span>患者信息查询</span>
      <el-input placeholder="信息搜索" class="search" v-model="input4">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </div>
    <div class="center">
      <router-link class="link" to="/userList">患者管理</router-link>|
      <router-link class="link" to="/shopList">患者统计</router-link>|
      <router-link class="link" to="/foodList">数据分析</router-link>|
      <router-link class="link" to="/orderList">诊断分析</router-link>
    </div>
    <div class="down">
      <div class="place">
        <span>区域</span>
        <el-select placeholder="所属区域">
          <el-option label="长安区" value="changan"></el-option>
          <el-option label="曲江区" value="qujaing"></el-option>
          <el-option label="莲湖区" value="lianhu"></el-option>
        </el-select>
      </div>
      <div class="time">
        <span>检查日期</span>
        <el-date-picker type="date" placeholder="选择日期"></el-date-picker>
      </div>
      <div class="dogid">
        <span>信息查询</span>
        <el-input placeholder="信息搜索" class="search">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.top {
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 5px 20px;
  // background: cornflowerblue;
  font-size: 25px;
  color: rgb(0, 87, 128);
  > span {
    width: 200px;
    margin-left: 20px;
  }
  .search {
    width: 400px;
    margin-right: 200px;
  }
}
.center {
  height: 40px;
  display: flex;
  justify-content: space-start;
  align-items: center;
  padding: 5px 0;
  color: rgb(107, 107, 107);
  background-color: rgb(236, 242, 252);
  .link {
    color: gray;
    padding: 5px 30px;
    cursor: pointer;
  }
  .link:active {
    color: black;
    font-weight: bolder;
  }
}
.down {
  height: 40px;
  display: flex;
  justify-content: space-start;
  background-color: rgb(248, 248, 248);
  font-size: 15px;
  align-items: center;
  padding: 5px 20px;
  .place {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-right: 20px;
    > span {
      margin: 0 10px;
    }
  }
  .time {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-right: 20px;
    > span {
      margin: 0 10px;
    }
  }
  .dogid {
    display: flex;
    justify-content: space-between;
    align-items: center;
    > span {
      width: 120px;
      margin: 0 10px;
    }
  }
}
</style>
