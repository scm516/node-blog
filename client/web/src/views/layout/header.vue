<template>
  <div id="header-box">
    <div class="header">
      <div class="container">
          <router-link :to="{path: '/'}" class="logo">
            <img :src=logo alt="">  
          </router-link>
          <ul class="nav-item">
            <li id="search">
              <el-input
                placeholder="搜索文章标题 作者"
                suffix-icon="el-icon-search"
                @click="searchArticle"
                v-model="listQuery.keyword"
                @keydown.enter.native="searchArticle"
              >
              </el-input>
            </li>
            <li id="welcome">
              <div v-if="isLogin">
                <el-dropdown size="small">
                  <span class="el-dropdown-link">
                    欢迎 {{username}}<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown" class="user">
                    <el-dropdown-item >
                      <router-link :to="{ name: 'User', params: { user_id: this.user_id } }">个人中心</router-link>
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="handleLogout">退出登录</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </li>
            <li id="auth" class="link" v-if="!isLogin">
              
              <span class="login" @click="handleLogin" >登录</span>
              <span class="register" @click="handleRgister">注册</span>
            </li>
          </ul>
      </div>
    </div>
    <el-dialog :title="authState" :visible.sync="dialogFormVisible" custom-class="auth-form">
      <el-form :model="form">
        <div class="input-box">
          <input type="text" class="auth-input" placeholder="请输入用户名" v-model="form.username">
        </div>
        <div class="input-box">
          <input type="password" class="auth-input" placeholder="请输入密码" v-model="form.password">
        </div>
      </el-form>
      <div slot="footer" class="footer">
        <div class="auth-footer" @click="handleSubmit">{{authState}}</div>
        <div class="auth-more">
          {{authInfoPre}}
          <span class="link" @click="toggleState">{{authInfo}}</span> 
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import logo from '@/assets/img/logo.png'
import { mapGetters } from 'vuex'
import { searchArticle } from '@/api/article'
import { register } from '@/api/user'
import { whiteList } from '@/utils/auth'
export default {
  data() {
    return {
      logo,
      listQuery: {
        keyword: '',
        category: ''
      },
      state: 'login',
      dialogFormVisible: false,
      authInfoPre: '还没有账号？',
      authInfo: '注册',
      authState: '登录',
      form: {
        username: '',
        password: ''
      }
    }
  },
  computed: {
    ...mapGetters(['user_id', 'username', 'isLogin'])
  },
  watch: {
    state() {
      this.authInfoPre = this.state === 'login' ? '还没有账号？' : '已有账号？'
      console.log(this.state)
      this.authInfo = this.state === 'login' ? '注册' : '登录'
      this.authState = this.state === 'login' ? '登录' : '注册'
    }
  },
  methods: {
    handleRgister() {
      this.dialogFormVisible = true
      this.state = 'register'
    },
    handleLogin() {
      this.dialogFormVisible = true
      this.state = 'login'
    },
    toggleState() {
      this.state = this.state === 'login' ? 'register' : 'login'
    },
    handleSubmit() {
      if (this.state === 'login') {
       this.submitLogin()
      } else {
        this.submitRegister()
      }
    },
    handleLogout() {
      this.$store.dispatch('Logout').then(res => {
        let isWhitePath = whiteList.some(item => {
          return item.test(this.$route.path)
        })
        if (!isWhitePath) {
          // 如果非白名单调到首页
          this.$router.push('/')
        }
      })
    },
    submitLogin() {
      this.$store.dispatch('Login', this.form).then(() => {
        this.dialogFormVisible = false
        this.$message({
          type: 'success',
          message: '登陆成功'
        })
        this.$store.dispatch('GetInfo')
        this.$store.dispatch('changeLoginState', true)
      }).catch((res) => {
        console.log(res)
      })
    },
    submitRegister() {
      register(this.form).then(res => {
          this.submitLogin()
        }).catch(err => {
          console.log(err)
      })
    },
    searchArticle() {
      let originQuery = this.$route.query
      let { keyword } = this.listQuery
      console.log(originQuery)
      if (Object.keys(originQuery).includes('category')) {
        // 如果原路由存在category
        if (keyword !=='') {
          this.$router.push({ name:'Index', query: { category: originQuery.category, keyword: this.listQuery.keyword }  })
        } else {
          this.$router.push({ name: 'Index', query: { category: originQuery.category} })
         }
        
      } else {
        if (keyword !=='') {
          this.$router.push({ name: 'Index', query: { keyword: this.listQuery.keyword }  })
        } else {
          this.$router.push({ name: 'Index' })
        }
      }
      // this.$store.dispatch('changeSearchParam', this.$route.query)
    }
  }
}
</script>

<style lang="scss">
#header-box {
  height: 5rem;
  margin: 0 auto;
  .el-dialog__body {
    padding-bottom: 10px;
  }
  .header {
    width: 100%;
    position: fixed;
    left: 0;
    top: 0;
    transition: all .2s;
    background: #fff;
    border-bottom: 1px solid #f1f1f1;
    color: #909090;
    z-index: 250;
    .container {
      height: 5rem;
    }
  }
  .logo {
    height: 56px;
    img {
      height: 100%;
    }
  }
}
.nav-item {
  height: 5rem;
  float: right;
  li {
    float: left;
    height: 5rem;
    display: flex;
    align-items: center;
  }
}
#welcome {
  font-size: 1.33rem;
  cursor: pointer;
  margin-left: 30px;
}
#auth {
  margin-left: 30px;
  font-size: 1.33rem;
  .login {
    &:after {
      content: '·';
      margin: 0 .4rem;
    }
  }
}
.el-dialog.auth-form {
  width: 26.5rem;
  max-width: 100%;
  font-size: 1.167rem;
  background: #fff;
  border-radius: 2px;
}
.input-box {
  margin-bottom: 10px;
  .auth-input {
    padding: 10px;
    width: 100%;
    border: 1px solid #e9e9e9;
    border-radius: 2px;
    outline: none;
    box-sizing: border-box;
    &:focus {
      border-color: #007fff;
    }
  }
}
.auth-footer {
  width: 100%;
  height: 3.334rem;
  line-height: 3.334rem;
  text-align: center;
  color: #fff;
  background: #007fff;
  border-radius: 2px; 
  outline: none;
  cursor: pointer;
}

.auth-more {
  text-align: center;
  margin-top: 10px;
}
.user li a {
  color: #606266;
}
@media (max-width: 960px) {
  #search {
    display: none;
  }
}
</style>
