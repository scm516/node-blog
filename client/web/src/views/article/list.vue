<template>
  <div class="article-list-wrap">
    <div class="no-data" v-if="!articleList.length">暂无文章</div> 
    <div class="article-list" v-if="articleList.length">
      <div class="list-item"  v-for="(item, $index) in articleList" :key="item.id">
        <div class="article-content">
          
          <router-link class="title" :to="{ name:'Detail', params: { id: item.id } }" >{{item.title}}</router-link>
          <span class="category-title">{{item.category}}</span>
          <p class="abstract">
            {{item.introduce}}
          </p>
          <div class="meta">
              <span class="nickname" >{{item.author}}</span>
                <router-link class="comment" :to="{ name:'Detail', params: { id: item.id } }">
                  <svg-icon iconClass="talk"></svg-icon>{{item.comment_count}}
                </router-link>      
              <span class="like" ref="like" :class="{'liked': item.isSupported || hasId(item) }" @click="support(item, $index)"><svg-icon iconClass="like"></svg-icon><span class="count">{{item.like_count}}</span></span>
            </div>
        </div>
        <router-link :to="{ name:'Detail', params: { id: item.id } }" class="img-thumbnail">
          <img :src="item.banner" alt="">
        </router-link>
      </div>
    </div>
    <div class="article-more" v-loading="loading" @click="loadMore" v-show="listQuery.page < totalPages">
      点击加载更多
    </div>
    <div class="no-data" v-show="noMore">
      没有更多了
    </div>
  </div>
</template>
<script>
import { updateLike } from '@/api/like'
import { getArticleList, getRecommendList } from '@/api/article'
import { mapGetters } from 'vuex'
export default {
   // beforeRouteLeave不触发
  computed: {
    ...mapGetters(['user_id', 'category', 'searchParam', 'scrollTop']),
    noMore() {
      return this.articleList.length == this.totalCount && this.articleList.length
    }
  },
  data() {
    return {
      loading: false,
      articleList: [],
      totalCount: 1,
      totalPages: 1,
      listQuery: {
        page: 1,
        pageSize: 5,
        category: '',
        keyword: ''
      }
    }
  },
  watch: {
    $route(to, from){
      if (from.name === 'Detail') {
        console.log(this.scrollTop)
      }
    },
    searchParam(newVal, oldVal) { // 监听查询参数参数的变化
      this.articleList = []
      this.listQuery = Object.assign({}, this.searchParam)
      this.getRouteParams()
      this.getList()
    },
  },
  created() {
    this.getRouteParams()
    this.getList()
  },
  methods: {
    getRouteParams() {
      let { category, keyword } = this.$route.query
      this.listQuery.category = category
      this.listQuery.keyword = keyword
    },
    getList() {
      this.loading = true
      getArticleList(this.listQuery).then(res => {
        this.loading = false
        this.articleList = this.articleList.concat(res.data.list)
        this.totalPages = res.data.totalPages
        this.totalCount = res.data.totalCount
      })
    },
    support(item, index) {
      let query = {
        article_id: item.id,
        user_id: this.user_id
      }
      let like = this.$refs.like[index]
      let svg = like.querySelector('svg')
      item.isSupported = true
      // 修改v-for里面的属性需要强制更新
      this.$forceUpdate()
      updateLike(query).then(res => {
        svg.style.transform = 'scale(1.5)'
        setTimeout(() => {
          svg.style.transform = 'scale(1)'
          item.like_count++
        }, 300)
      })
    },
    loadMore() {
      this.listQuery.page++
      this.getList()
    },
    hasId(obj) {
      // 检测当前登录用户的id是否存在于点赞表
      if (!obj.likes.length) return false
      let result = obj.likes.some(item => {
        return item.user_id === this.user_id
      })
      return result
    }
  }
}
</script>
<style lang="scss">
.article-list {
  margin-top: 20px;
  border-top: 1px solid #f0f0f0;
}
.list-item {
  display: flex;
  align-items: flex-start;
  padding: 15px 2px 20px 0;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  .article-content {
    flex-grow: 1;
    max-width: 500px;
  }
  .title {
    font-size: 1.4rem;
    line-height: 1.5;
    color: #333;
    text-decoration: none;
    font-weight: 700;
  }
  .abstract {
    margin: 6px 0;
    font-size: 1.1rem;
    line-height: 24px;
    color: #999;
  }
}
.category-title {
  color: #fff;
  background: #1989fa;
  padding: 2px 4px;
  margin-left: 6px;
  border-radius: 4px;
  position: relative;
  top: -1px;
}
.img-thumbnail {
  width: 165px;
  box-sizing: border-box;
  padding-left: 15px;
  img {
    width: 150px;
    height: 100px;
  }
}
.meta {
  padding-right: 0;
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  a {
    color: #b4b4b4;
  }
  .nickname {
    margin-right: 10px;
    color: #b4b4b4;
  }
  .comment {
    margin-right: 10px;
    svg {
      position: relative;
      top: 1px;
    }
  }
  .like {
    color: #b4b4b4;
    cursor: pointer;
    .svg-icon {
      transition: .3s;
      height: 1rem;
      widows: 1rem;
    }
  }
  .liked {
    color: red;
  }
  .count {
    color: #b4b4b4;
  }
}
.article-more {
    margin: 40px 0;
    background: #f0f0f0;
    height: 28px;
    line-height: 28px;
    display: block;
    font-size: 14px;
    text-align: center;
    overflow: hidden;
}
@media (max-width: 960px) {
  .article-list {
    border: none;
    margin-top: 0;
  }
  .article-content {
    width: calc( 100% - 88px)
  }
  .img-thumbnail {
    padding-left:8px;
    display: block;
    height: 80px;
    width: 80px;
    box-sizing: content-box;
  img {
    width: 100%;
    height: 100%;
  }
}
}
</style>
