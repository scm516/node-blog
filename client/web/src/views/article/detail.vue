<template>
  <div class="article-container">
    <div class="article-title">{{articleInfo.title}}</div>
    <div class="article-author">
      <div class="avatar">
        <img :src="articleInfo.avatar" alt="">
      </div>
      <div class="author-info">
        <span class="author-name">
          {{articleInfo.author}}
        </span>
        <div class="meta">
          <span class="post-time">
            {{articleInfo.updatedAt}}
          </span>
        </div>
       
      </div>
    </div>
    <div class="content markdown-body" v-html="articleInfo.convertedContent"></div>
    <div class="comment-split">评论</div>
    <div class="article-comment">
      <div class="commit-avatar main-avatar" v-if="isLogin">
        <img :src="avatar" alt="">
      </div>
      <div class="commen-form">
        <div class="comment-box">
          <input type="text" class="comment-input" placeholder="输入评论" v-model="articleComment">
        </div>
        <el-button type="primary" class="fr" size="small" @click="addComment" >评论</el-button>
      </div>
    </div>

    <!-- comment-list -->
      <div class="comment-list-wrap" v-show="articleCommentList.length">
        <div class="comment-list" v-for="item in articleCommentList" :key="item.id">
          <div class="list-item">
            <div class="commit-avatar">
              <img :src="item.avatar" alt="">
            </div>
            <div class="content-box">
              <div class="meta">{{item.username}}</div>
              <div class="content">{{item.content}}</div>
              <div class="replay">
                <span class="time">{{item.updatedAt}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="no-comment" v-show="!articleCommentList.length">暂无评论，快来抢沙发</div>
    </div> 
   
</template>
<script>
var MarkdownIt = require('markdown-it')
import moment from 'moment'
var md = new MarkdownIt()
import { getArticleDetail } from '@/api/article'
import { addComment, getArticleCommentList } from '@/api/comment'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      articleComment: '',
      articleInfo: {
        title: '',
        author: '',
        content: '',
        updatedAt: '',
        convertedContent: ''
      },
      articleCommentList: []
    }
  },
  computed: {
    ...mapGetters(['isLogin', 'user_id', 'username', 'avatar'])
  },
  watch: {
    '$route'() {
      this.getArticleCommentList()
      this.getArticleDetail()
    }
  },
  created() {
    this.getArticleCommentList()
    this.getArticleDetail()
  },
  methods: {
    getArticleDetail() {
      // 根据路由信息获取文章id
      let articleId = this.getParams()
      if (!articleId) {
        this.$message({
          type: 'error',
          duration: 1000,
          message: '文章id不存在'
        })
        return
      }
      getArticleDetail(articleId).then(res => {
        this.articleInfo = res.data
        this.articleInfo.convertedContent = md.render(res.data.content)
      }).catch(() => {
        this.$router.push({ path: '/' })
      })
    },
    getParams() {
      let id = this.$route.params.id
      return id
    },
    getArticleCommentList() {
      let article_id = this.$route.params.id
      console.log(article_id)
      getArticleCommentList(article_id).then(res => {
        this.articleCommentList = res.data.list
      })
    },
    addComment() {
      let query = {
        user_id: this.user_id,
        article_id: this.articleInfo.id,
        content: this.articleComment
      }
      addComment(query).then(res => {
        this.articleCommentList.splice(0, 0, {
          username: this.username,
          content: this.articleComment,
          avatar: this.avatar,
          updatedAt: moment().format('YYYY-MM-DD')
        })
        this.articleComment = ''
        
        this.$message({
          type: 'success',
          duration: 1000,
          message: '评论成功'
        })
      })
    }
  }
 
}
</script>

<style lang="scss">
  .article-container {
    width: 670px;
    box-sizing: border-box;
    padding: 20px;
    padding-bottom: 100px;
    margin: 0 auto;
    background: #fff;
  }
  
  .article-title {
    font-size: 2.5rem;
    line-height: 1.5;
    font-weight: 700;
  }
  .article-author {
    margin: 15px 0 ;
    display: flex;
    .avatar {
      width: 3.3rem;
      height: 3.3rem;
      margin-right: 10px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .author-info {
      flex-grow: 1;
    }
    .author-name {
      font-size: 1.3rem;
      color: #333;
      font-weight: 600;
    }
    .post-time {
      font-size: 1.1rem;
      color: #909090;
    }
  }
  .article-comment {
    margin: 20px 0;
    padding: 1rem 1.33rem;
    background: #fafbfc;
    display: flex;
    .comment-input {
      position: relative;
      border: none;
      width: 100%;
      padding: .6rem 1rem;
      font-size: 1.083rem;
      line-height: 1.7;
      color: #17181a;
      outline: none;
      min-height: 1.3em;
    }
  }
  .comment-split {
    color: #8a9aa9;
    font-size: 16px;
    font-weight: 400;
    text-align: center;
    padding: 1.67rem 0 5px;
  }
  .comment-box {
    margin: 10px 0;
    border: 1px solid #f1f1f1;
    background: #fff;
    border-radius: 3px;
    &:focus {
      border-color: #007fff;
    }
  }
  .commit-avatar {
    width:2.67rem;
    height: 2.67rem;
    margin-right: 1.34rem;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .main-avatar {
    margin: 10px;
  }
  .commen-form {
    flex-grow: 1;
  }
  .comment-list {
    padding: 0 1.66rem 0 4.85rem;
    .list-item {
      display: flex;
      margin-bottom: 20px;
      align-items: flex-start;
      border-bottom: 1px solid #f1f1f1;
    }
    .meta {
      font-size: 1.1rem;
      line-height: 1.2;
    }
    .content {
      margin-top: .55rem;
      font-size: 1.083rem;
      line-height: 1.833rem;
      white-space: pre-wrap;
      color: #505050;
    }
    .content-box {
      flex-grow: 1;
      /* -border-bottom: 1px solid #f1f1f1; */
    }
  }
  /* .sub-comment-list .list-item:last-child .content-box {
    border: none;
  } */
  .sub-comment-list {
    padding: 0;
    margin: 1rem 0;
  }
  .replay {
    margin: 1rem 0 ;
    .time {
      color: #8a9aa9;
    }
  }
  @media (max-width: 960px) {
    .article-container {
      width: 100%;
    }
    .main-avatar {
      display: none;
    }
    .comment-list {
      padding: 0;
    }
  }
</style>
