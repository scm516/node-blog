<template>
  <div class="article-template">
    <el-form ref="form" class="article-form" :model="articleData" label-width="100px" :rules="rules">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="articleData.title" placeholder="title"></el-input>
      </el-form-item>
      <el-form-item label="文章作者" prop="author">
        <el-input v-model="articleData.author" placeholder="author"></el-input>
      </el-form-item>
      <!-- <el-form-item label="文章分类">
        <el-input v-model="articleData.category" placeholder="category"></el-input>
      </el-form-item> -->
      <el-form-item label="文章分类" prop="category_id">
        <el-select v-model="articleData.category_id">
          <el-option 
            v-for="item in categoryList"
            :key="item.id"
            :value="item.id"
            :label="item.name"
            placeholder="请选择分类"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文章banner">
        <el-upload
          class="upload"
          ref="upload"
          :data="articleData"
          :headers="urlHeader"
          :action="actionUrl"
          :fileList="fileList"
          :on-change="onChange"
          :on-error="onError"
          :on-success="handleSuccess"
          :auto-upload="false"
          >
          <div slot="tip" class="el-upload__tip">只能上传图像文件，且不超过2M</div>
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
       <el-form-item label="文章简介" prop="introduce">
        <el-input type="textarea" v-model="articleData.introduce" placeholder="introduce"></el-input>
      </el-form-item>
      <el-form-item label="文章内容" prop="content" v-loading="uploading" element-loading-text="图片上传中">
        <mavon-editor  v-model="articleData.content" @imgAdd="imgAdd" @imgDel="imgDel" ref="md"></mavon-editor>
      </el-form-item>
      <el-form-item label="是否推荐" class="article-recommend">
        <el-rate v-model="articleData.recommend"></el-rate>
      </el-form-item>
       <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
    
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
import { getCategoryList } from '@/api/category'
import { createArticle, updateArticle, getList, getArticleDetail } from '@/api/article'
import { mapGetters } from 'vuex';
import axios from 'axios';
const base_url = '/api'
export default {
  props: ['type'],
  computed: {
    ...mapGetters(['user_id']),
    urlHeader() {
      return {
        'Authorization': 'Bearer ' + getToken()
      }
    },
    actionUrl() {
      const base_url = '/api'
      if (this.type === 'add') {
        return base_url + '/article/create'
      } else {
        return base_url + '/article/update'
      }
    }
  },
  data() {
    return {
      fileList: [],
      uploading: false,
      articleData: {
        title: '',
        author: '水超敏',
        category_id: '',
        banner: '',
        introduce: '',
        content: '',
        recommend: 0
      },
      image_file: {},
      categoryList: null,
      rules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' }
        ],
        author: [
          { required: true, message: '请输入文章作者', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '请输入文章简介', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ],
        category_id: [
          { required: false, message: '请选择文章分类', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.getCategoryList()
    this.chcekType()
  },
  methods: {
    chcekType() {
      // 检查是add 还是 update
      if (this.type === 'update') {
        if (!this.$route.query.articleId) {
          this.$message({
            type: 'error',
            message: '文章未找到',
            duration: 1000
          })
          // 返回文章列表
          this.$router.push({path: '/article/list'})
        }
        this.restoreArticle()
      }
    },
    getCategoryList() {
      getCategoryList().then(res => {
        this.categoryList = res.data.list
      })
    },
    restoreArticle() { // load原有文章信息
      let articleId = this.$route.query.articleId
      getArticleDetail(articleId).then(res => {
        let data = res.data
        this.articleData.author = data.author
        this.articleData.title = data.title
        this.articleData.category_id = data.category_id
        this.articleData.introduce = data.introduce
        this.articleData.content = data.content
        this.articleData.banner = data.banner
        this.articleData.recommend = data.recommend
      })
    },
    handleSuccess(res) {
      console.log(res)
      this.fileList = []
      let type = 'success'
      if (res.code !== 200) {
        type = 'error'
      }
      this.$message({
        type,
        duration: 1000,
        message: res.msg
      })
      this.$router.push({path: '/article/list'})
    },
    onError(err) {
      console.log(err)
    },
    onChange(file, fileList) {  
      const re = /\.jpeg$|\.png$|\.jpg$|\.svg$|\.webp$/g
      const isLt2M = file.size / 1024 / 1024 < 2;
      const isImage = re.test(file.name)
      console.log(file.name)
      if (!isImage) {
        this.$message.error('请上传图像文件');
        
      }
      if (isImage && !isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      if (isImage && isLt2M) {
        this.fileList.splice(0, 1, file) 
      } else {
        fileList.splice(fileList.length - 1, 1)
      }
    },
    submit(param) {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.articleData.user_id = this.user_id
          this.articleData.id = this.$route.query.articleId
          if (!this.fileList.length) {
            if (this.type === 'add') {
              createArticle(this.articleData).then(res => {
                this.$message({
                  type: 'success',
                  duration: 1000,
                  message: res.msg
                })
                this.$router.push({path: '/article/list'})
              })
            } else if (this.type === 'update') {
              updateArticle(this.articleData).then(res => {
                this.$message({
                  type: 'success',
                  duration: 1000,
                  message: res.msg
                })
                this.$router.push({path: '/article/list'})
              })
            }
          }
          else {
            this.$refs.upload.submit()
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    imgAdd(pos, file) {
      // 文章内容添加图片
      var formdata = new FormData();
      formdata.append('image', file);
      formdata.append('user_id', this.user_id)
      // this.$refs.md.$img2Url(pos, '图片上传中~~~');
      this.uploading = true
      axios({
        url: base_url + '/article/image',
        method: 'post',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(res => {
        let url = res.data.data.url
        this.uploading = false
        this.$refs.md.$img2Url(pos, url);
      }).catch(err => {
        this.uploading = false
      })
    },
    imgDel(file) {
      const pos = file[1]
      delete this.image_file[pos]
      console.log(this.image_file)
    },
    delImg() {
      let flag = this.$refs.md.$refs.toolbar_left.$imgDelByFilename(0)
      console.log(flag)
    }
  }
}
</script>
<style lang="scss">
.article-form .el-select {
  width: 100%;
}
.article-recommend {
  .el-form-item__content {
    padding-top: 8px;
  }
}
.dropdown-images {
  display: none;
}
</style>


