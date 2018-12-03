<template>
    <div class="login" @keyup.65="keyRoute">
      <img src="./../assets/timg.jpg" width="200" height="200">
      <h1>{{ msg }}</h1>
      <form v-on:submit.prevent="submit">
        <el-row :gutter="20">
          <el-col :span="6" :offset="9">
            <el-input v-model="username" :class="{ bounceIn: signFailure, 'border-r': signFailure }" placeholder="username" size="small"></el-input>
          </el-col>
          <transition appear
                      appear-active-class="animated fadeInRight"
                      name="custom-classes-transition" enter-active-class="animated fadeInRight"
                      leave-active-class="animated fadeOutRight">
            <el-col v-if="signFailure" :span="6">
              <el-alert
                title="用户名密码输入错误"
                close-text="知道了"
                @close="signFailure=false"
                type="error">
              </el-alert>
            </el-col>
          </transition>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6" :offset="9">
            <el-input v-model="password" :class="{ bounceIn: signFailure, 'border-r': signFailure }" type="password" placeholder="password" size="small"></el-input>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="2" :offset="10">
            <el-button type="success" size="small" native-type="submit" round>sign in</el-button>
          </el-col>
          <el-col :span="1">
            <el-button type="info" size="small" native-type="button" @click="openSignUpDialog" round>sign up</el-button>
          </el-col>
        </el-row>
      </form>

      <el-dialog
        title="注册新用户："
        :visible.sync="dialogVisible"
        width="30%">
        <el-form :model="signUpForm">
          <el-form-item label="用户名" :label-width="labelWidth">
            <el-input v-model="signUpForm.username" type="text"></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="labelWidth">
            <el-input v-model="signUpForm.password" placeholder="password" type="password">
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="signUp">确 定</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      msg: '门诊收费系统',
      username: '',
      password: '',
      dialogVisible: false,
      signUpForm: {
        username: '',
        password: ''
      },
      signFailure: false,
      labelWidth: '120px'
    }
  },
  methods: {
    submit () {
      this.signFailure = false
      this.axios.post('/api/signIn', {username: this.username, password: this.password}).then(res => {
        this.$store.commit('update', {username: this.username})
        this.$router.push({ path: 'index/charge' })
      }).catch(error => {
        console.log(error)
        this.signFailure = true
      })
    },
    signUp () {
      this.dialogVisible = false
      this.axios.post('/api/signUp', {username: this.signUpForm.username, password: this.signUpForm.password}).then(res => {})
    },
    openSignUpDialog () {
      this.dialogVisible = true
    },
    keyRoute () {
      console.log('event')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  div.login {
    margin-top: 60px;
  }
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }

  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
  .border-r {
    border: #F56C6C 1px solid;
    border-radius: 4px
  }
</style>
