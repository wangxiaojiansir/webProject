<template >
  <div class="login-container">
    <el-form class="login-form" label-width="80px" :model="form" :rules="rules" ref="login">
      <el-form-item props="email" label="用户名">
        <el-input placeholder="用户名" v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item props="pasword" label="密码">
        <el-input placeholder="密码" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item props="captcha" class="captcha" label="验证码">
        <el-input placeholder="验证码" v-model="form.captcha"></el-input>
        <img @click="updataCaptcha" :src="captchaUrl" alt srcset />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="loginHandle">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>



<script>
import md5 from "md5";
export default {
  layout: "login",
  data() {
    return {
      captchaUrl: "",
      form: {
        email: "wangxiaojiansir@163.com",
        password: "a123456",
        captcha: ""
      },
      rules: {
        email: [
          { required: true, message: "请输入邮箱" },
          { type: "email", message: "请输入正确邮箱" }
        ],
        password: [{ required: true, message: "请输入密码" }],
        captcha: [{ required: true, message: "请输入验证码" }]
      }
    };
  },
  mounted() {
    this.updataCaptcha();
  },
  methods: {
    updataCaptcha() {
      this.captchaUrl = "/api/captcha?_t=" + new Date().getTime();
    },
    loginHandle() {
      this.$refs["login"].validate(async valid => {
        if (valid) {
          console.log("验证成功");

          let obj = {
            email: this.form.email,
            password: md5(this.form.password),
            captcha: this.form.captcha
          };
          let res = await this.$http.post("/user/login", obj);

          if (res.code == 0) {
            this.$message.success("登录成功");
            setTimeout(() => {
              this.$router.push("/");
            }, 500);
          } else {
            this.$message.error(res.message);
          }
        } else {
          console.log("验证失败");
        }
      });
    }
  }
};
</script> 


<style >
</style>