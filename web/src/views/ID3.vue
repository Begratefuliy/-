<template>
  <div class="container">
    <div class="statistic">
      <div class="left">
        <el-card shadow="hover" style="width: 100%; height: 300px">
          <chart_1 :age="age"></chart_1>
        </el-card>
      </div>
      <div class="center">
        <el-card shadow="hover" style="width: 100%; height: 300px">
          <chart_2 :income="income"></chart_2>
        </el-card>
      </div>
      <div class="right">
        <el-card shadow="hover" style="width: 100%; height: 300px">
          <chart_3 :appearance="appearance"></chart_3>
        </el-card>
      </div>
    </div>
    <div class="bottom">
      <div class="left">
        <el-card shadow="hover" style="width: 100%; height: 330px">
          <div class="title">
            <span>Entropy</span>
          </div>
          <div class="content">
            <span>长相：{{Entropy.age}}</span>
            <span>年龄：{{Entropy.income}}</span>
            <span>收入：{{Entropy.appearance}}</span>
          </div>
        </el-card>
      </div>
      <div class="center">
        <el-card shadow="hover" style="width: 100%; height: 330px">
          <el-form
            label-position="right"
            label-width="40px"
            :model="formLabelAlign"
          >
            <el-form-item label="年龄">
              <el-input v-model="formLabelAlign.age"></el-input>
            </el-form-item>
            <el-form-item label="体型">
              <el-input v-model="formLabelAlign.body_type"></el-input>
            </el-form-item>
            <el-form-item label="长相">
              <el-input v-model="formLabelAlign.appearance"></el-input>
            </el-form-item>
            <el-form-item label="收入">
              <el-input v-model="formLabelAlign.income"></el-input>
            </el-form-item>
            <el-form-item style="display: flex">
              <el-button type="primary" @click="submitForm">预测</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
      <div class="right">
        <el-card shadow="hover" style="width: 100%; height: 330px">
          <div class="title">
            <span>MostFrequentValue</span>
          </div>
          <div class="content">
            <span>长相：{{MostFrequentValue.appearance}}</span>
            <span>年龄：{{MostFrequentValue.age}}</span>
            <span>收入：{{MostFrequentValue.income}}</span>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>
<script>
import chart_1 from "../components/echarts/chart_1";
import chart_2 from "../components/echarts/chart_2";
import chart_3 from "../components/echarts/chart_3";
export default {
  name: "ID3",
  components: {
    chart_1,
    chart_2,
    chart_3,
  },
  data() {
    return {
      formLabelAlign: {
        appearance: "",
        age: "",
        body_type: "",
        income: "",
      },
      age: {},
      income: {},
      appearance: {},
      Entropy: {
        age: 0,
        income: 0,
        appearance: 0
      },
      MostFrequentValue: {
        age: '',
        income: '',
        appearance: ''
      }
    };
  },
  methods: {
    get() {
      let _this = this;
      let xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          if (xhr.status >= 200 && xhr.status < 300) {
            let mes = JSON.parse(xhr.responseText);
            console.log(mes);
            _this.age = mes[0].countUniqueValues['年龄']
            _this.income =  mes[0].countUniqueValues['收入']
            _this.appearance =  mes[0].countUniqueValues['长相']
            _this.Entropy.age = mes[0].entropy['年龄'].toFixed(2);
            _this.Entropy.income = mes[0].entropy['收入'].toFixed(2);
            _this.Entropy.appearance = mes[0].entropy['长相'].toFixed(2);
            _this.MostFrequentValue.age = mes[0].mostFrequentValue['年龄']
            _this.MostFrequentValue.income = mes[0].mostFrequentValue['收入']
            _this.MostFrequentValue.appearance = mes[0].mostFrequentValue['长相']
          }
        }
      };
      xhr.open("get", "http://localhost:8080/data_mining", true);
      xhr.send(null);
    },
    submitForm() {
      let _this = this;
      //console.log(this.formLabelAlign)
      let data = {
        '年龄': this.formLabelAlign.age,
        '长相': this.formLabelAlign.appearance,
        '体型': this.formLabelAlign.body_type,
        '收入': this.formLabelAlign.income,
      };
      let xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          if (xhr.status >= 200 && xhr.status < 300) {
            let mes = JSON.parse(xhr.responseText);
            alert(mes.res);
            _this.resetForm()
          }
        }
      };
      xhr.open("post", "http://localhost:8080/data_mining", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send(JSON.stringify(data));
    },
    resetForm() {
      this.formLabelAlign.appearance = "",
        this.formLabelAlign.income = "",
        this.formLabelAlign.age = "",
        this.formLabelAlign.body_type = "";
    },
  },
  created() {
    this.get();
  },
  watch: {
    age() {
      console.log(this.age);
    }
  }
};
</script>
<style lang="less" scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  overflow: auto;
  .statistic {
    width: 96%;
    height: 350px;
    border: 1px solid rgb(212, 211, 211);
    margin-top: 20px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    .left {
      width: 30%;
      height: 300px;
    }
    .center {
      width: 30%;
      height: 300px;
    }
    .right {
      width: 30%;
      height: 300px;
    }
  }
  .bottom {
    width: 96%;
    height: 350px;
    border: 1px solid rgb(212, 211, 211);
    margin-top: 20px;
    margin-bottom: 100px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    .left {
      width: 32%;
      height: 330px;
      .title {
        width: 100%;
        height: 50px;
        font-size: 24px;
        font-weight: 600;
      }
      .content {
        span{
          display: block;
          margin: 20px 0;
          font-size: 16px;
          font-weight: 600;
        }
      }
    }
    .center {
      width: 32%;
      height: 330px;
    }
    .right {
      width: 32%;
      height: 330px;
      .title {
        width: 100%;
        height: 50px;
        font-size: 24px;
        font-weight: 600;
      }
      .content {
        span{
          display: block;
          margin: 20px 0;
          font-size: 16px;
          font-weight: 600;
        }
      }
    }
  }
}
</style>
