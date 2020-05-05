<template>
  <div class="login-container">
    <el-form class="login-form" :model="form" :rules="rules" label-width="100px" ref="register">
      <el-form-item label="邮箱" prop="email">
        <el-input type="text" v-model="form.email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="昵称" prop="nickName">
        <el-input type="text" v-model="form.nickName" placeholder="请输入昵称" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password" placeholder="请输入密码" show-password />
      </el-form-item>
      <el-form-item label="确认密码" prop="repassword">
        <el-input type="password" v-model="form.repassword" placeholder="请输再次输入密码" show-password />
      </el-form-item>
      <el-form-item label="验证码" class="captcha" prop="captcha">
        <el-input type="text" maxlength="4" v-model="form.captcha" placeholder="请输入验证码" />
        <img :src="captchaImg" alt />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="registerHandle">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import md5 from "md5";
export default {
  layout: "login",
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      captchaImg: "",

      form: {
        email: "wangxiaojiansir@163.com",
        nickName: "王小建",
        password: "a123456",
        repassword: "a123456",
        captcha: ""
      },
      rules: {
        email: [
          { required: true, message: "请输入邮箱" },
          { type: "email", message: "请输入正确邮箱" }
        ],
        nickName: [{ required: true, message: "请输入昵称" }],
        password: [{ required: true, message: "请输入密码" }],
        repassword: [
          { required: true, message: "请再次输入密码" },
          {
            validator: (rule, value, callback) => {
              if (value != this.form.password) {
                callback(new Error("两次密码不一致"));
              } else {
                callback();
              }
            }
          }
        ],
        captcha: [{ required: true, message: "请输入验证码" }]
      }
    };
  },

  mounted() {
    this.updataChptcha();
  },
  //方法集合
  methods: {
    registerHandle() {
      this.$refs["register"].validate(async valid => {
        if (valid) {
          console.log("验证成功");

          let obj = {
            email: this.form.email,
            nickName: this.form.nickName,
            password: md5(this.form.password),
            captcha: this.form.captcha
          };
          let res = await this.$http.post("/user/register", obj);

          if (res.code == 0) {
            this.$alert("注册成功", "成功", {
              confirmButtonText: "去登陆",
              callback: () => {
                this.$router.push("/login");
              }
            });
          } else {
            this.$message.error(res.message);
          }
        } else {
          console.log("验证失败");
        }
      });
    },
    updataChptcha() {
      this.captchaImg = "/api/captcha?_t=" + new Date().getTime();
    }
  }
};
</script>
<style >
</style>