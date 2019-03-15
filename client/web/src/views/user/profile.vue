<template>
  <div class="setting-view">
    <h2>个人资料</h2>
    <ul class="item-list">
      <li>
        <span class="title">用户名</span>
        <div class="upload-box">
          <div class="user-avatar">
            <img :src="userInfo.avatar" alt="">
          </div>
          <el-upload
            class="upload"
            :data="data"
            :headers="urlHeader"
            :action="actionUrl"
            :before-upload="beforeUpload"
            :on-success="handleSuccess"
            >
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2M</div>
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </div>
      </li>
       <li>
        <span class="title">用户名</span>
        <div class="input-box">
          <input type="text" ref="username" v-model="userInfo.username" >
          <div class="action-box">
            <span v-if="userInfo.usernameFocus" class="link" @click="save('username')">保存</span>
            <i class="el-icon-edit-outline link" v-if="!userInfo.usernameFocus" @click="edit('username')"></i>
            <span class="link" v-if="!userInfo.usernameFocus" @click="edit('username')">修改</span>
            <span  v-if="userInfo.usernameFocus" @click="cancle('username')">取消</span>
          </div>
        </div>
      </li>
       <li>
        <span class="title">职业</span>
        <div class="input-box">
          <input type="text" ref="profession" v-model="userInfo.profession">
          <div class="action-box">
            <span v-if="userInfo.professionFocus" class="link" @click="save('profession')">保存</span>
            <i class="el-icon-edit-outline link" v-if="!userInfo.professionFocus" @click="edit('profession')"></i>
            <span class="link" v-if="!userInfo.professionFocus" @click="edit('profession')">修改</span>
            <span  v-if="userInfo.professionFocus" @click="cancle('profession')">取消</span>
          </div>
        </div>
      </li>
       <li>
        <span class="title">爱好</span>
        <div class="input-box">
          <input type="text" ref="hobby" v-model="userInfo.hobby">
          <div class="action-box">
            <span v-if="userInfo.hobbyFocus" class="link" @click="save('hobby')">保存</span>
            <i class="el-icon-edit-outline link" v-if="!userInfo.hobbyFocus" @click="edit('hobby')"></i>
            <span class="link" v-if="!userInfo.hobbyFocus" @click="edit('hobby')">修改</span>
            <span  v-if="userInfo.hobbyFocus" @click="cancle('hobby')">取消</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
import { getInfo, updateInfo } from '@/api/user'
export default {
  data() {
    return {
      data: {
        id: this.$route.params.user_id
      },
      lastFocus: '',
      actionUrl: '/api/user/update',
      userInfo : {
        username: '',
        usernameFocus: false,
        profession: '',
        professionFocus: false,
        hobby: '',
        hobbyFocus: false
      }
    }
  },
  computed: {
    urlHeader() {
      return {
        'Authorization': 'Bearer ' + getToken()
      }
    },
    ...mapGetters(['user_id', 'token'])
  },
  created() {
    this.chckUrlParams()
    this.getUserInfo()
  },
  methods: {
    chckUrlParams() {
      // 检测路由信息
      if (this.$route.path.includes('profile')) {
        this.$store.dispatch('toggleProfilePage', true)
      }
    },
    getUserInfo() {
      getInfo().then(res => {
        this.userInfo = Object.assign({}, this.userInfo, res.data)
      })
    },
    edit(type) {
      if (this.lastFocus !== '') {
        this.userInfo[this.lastFocus + 'Focus'] = false
        this.$refs[this.lastFocus].blur()
      }
      this.lastFocus = type
      this.userInfo[type + 'Focus'] = true
      this.$refs[this.lastFocus].focus()
    },
    save(type) {
      const query = {
        id: this.user_id,
        [type]: this.userInfo[type]
      }
      updateInfo(query).then(res => {
        this.getUserInfo()
        this.userInfo[type + 'Focus'] = false
        this.$message({
          type: 'success',
          duration: 1000,
          message: res.msg
        })
      })
      
    },
    cancle(type) {
      this.userInfo[type + 'Focus'] = false
    },
    beforeUpload(file) {
      const re = /(jpeg)|(png)/g
      const isLt2M = file.size / 1024 / 1024 < 2;
      const isImage = re.test(file.type)
      if (!isImage) {
        this.$message.error('上传头像图片只能是 JPG或PNG 格式!');
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isImage && isLt2M
    },
    handleSuccess(res) {
      this.userInfo.avatar = res.data.url
      this.$message({
        type: 'success',
        duration: 1000,
        message: '图像更新成功'
      })
      this.$store.dispatch('GetInfo')
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch('toggleProfilePage', false)
    next()
  }
}
</script>

<style lang="scss">
.setting-view {
  margin: 0 auto;
  background: #fff;
  width: 700px;
  padding: 2.7rem 4rem 7rem;
  
  h2 {
    font-size: 2em;
    margin: .67em 0;
    font-weight: 600;
  }
  .item-list {
    .title {
      font-size: 1.2rem;
      color: #333;
      width: 10rem;
    }
    li {
      display: flex;
      align-items: center;
      padding: 2rem 0;
      border-top: 1px solid #f1f1f1;
      
    }
    .input-box {
      display: flex;
      justify-content: flex-end;
      margin: 0;
      flex: 1;
    }
    input[type="text"] {
      flex: 1;
      display: inline-block;
      border: none;
      outline: none;
      color: #909090;
      font-size: 1.3rem;
    }
  }
}
.upload-box {
  display: flex;
  .user-avatar {
    width: 6rem;
    height: 6rem;
    margin-right: 10px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.action-box {
  font-size: 14px;
  span, i {
    margin-right: 6px;
  }
}
.el-upload-list {
  display: none;
}
@media (max-width: 960px) {
  .setting-view {
    width: 100%;
    padding: 1rem;
    

    .item-list  {
      .title {
        margin-bottom: 1rem;
      }
      li {
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
      }
    }
    .input-box {
      width: 100%;
    }
    .upload-box {
      width: 100%;
    }
  }
}
</style>

