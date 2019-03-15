<template>
  <div class="user-setting">
    <!-- <ul class="user-nav">
      <router-link tag="li" :to="{ path: '/user/setting/profile' }">个人资料</router-link>
      <router-link tag="li" :to="{ path: '/user/setting/password' }">修改密码</router-link>
    </ul> -->
    <div class="user-info" v-show="!isEditProfile">
      <div class="user-avatar">
        <img :src="userInfo.avatar" alt="">
      </div>
      <div class="user-detail">
        <div class="top">
          <h2>{{username}}</h2>
        </div>
        <div class="middle">
          <span class="info-tip" v-if="!userInfo.profession || userInfo.profession === ''" :class="{ 'link': this.isLogin }" @click="toEditPage">你的职业？</span>
          <span class="info-tip" v-else title="职业">{{userInfo.profession}}</span>
        </div>
        <div class="buttom">
          <span class="info-tip" v-if="!userInfo.hobby || userInfo.hobby === ''" :class="{ 'link': this.isLogin }" @click="toEditPage">兴趣爱好？</span>
          <span class="info-tip">{{userInfo.hobby}}</span>
        </div>
      </div>
      <div class="user-edit">
        <el-button @click="toEditPage">编辑个人资料</el-button>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getInfo } from '@/api/user'
export default {
  data() {
    return {
      userInfo: {
        avatar: '',
        profession: '',
        hobby: ''
      }
    }
  },
  computed: {
    ...mapGetters(['isEditProfile', 'username', 'isLogin'])
  },
  created() {
    this.getInfo()
  },
  watch: {
    '$route'() {
      this.getInfo()
    }
  },
  methods: {
    getInfo() {
      getInfo().then(res => {
        this.userInfo = res.data
      }) 
    },
    toEditPage() {
      this.$router.push({name: 'Profile'})
    }
  }
}
</script>

<style lang="scss">
.user-setting {
  margin-top: 20px;
}
.user-info {
  margin-top: 20px;
  background: #fff;
  width: 700px;
  margin: 0 auto;
  display: flex;
  padding: 20px;
  .user-avatar {
    flex: 0 0 auto;
    margin-right: 2.4rem;
    width: 7.5rem;
    height: 7.5rem;
    background-color: #f9f9f9;
    border-radius: 50%;
    img {
      width: 100%;
      height: 100%;
    }
  }
  h2 {
    margin: 0;
    padding: 0;
    font-size: 2.167rem;
    font-weight: 600;
    line-height: 1.2;
    color: #000;
  }
  .middle {
    margin-top: .8rem;
  }
  .buttom {
    margin-top: 0.4rem;
  }
  .info-tip {
    font-size: 1.25rem;
    line-height: 1.5;
    color: #72777b;
  }
  .link {
    color: #4a68ad;
  }
  .user-detail {
    flex-grow: 1;
  }
  .user-edit {
    display: flex;
    align-items: center;
  }
}
@media (max-width: 960px) {
  .user-info {
    width: 100%;
    margin: 0;
  }
}
</style>
