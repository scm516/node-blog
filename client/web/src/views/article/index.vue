<template>
  <div class="container-wraper">
    <div class="container">
      <div class="main-content">
          <Banner></Banner>
          <article-list></article-list>
      </div>
      <div class="aside">
        <Category></Category>  
      </div>
    </div>
  </div>
</template>
<script>
import Category from './category'
import Banner from './banner'
import articleList from '@/views/article/list'
export default {
  components: {
    Banner,
    articleList,
    Category
  },
  data() {
    return {
      category: ''
    }
  },
  watch: {
    $route() {
      this.$store.dispatch('changeSearchParam', this.$route.query)
    }
  },
  created() {
    this.getCategory()
  },
  methods: {
    // 判断两个对象里面的值是否一样
    isEqualObj(obj1, obj2) {
      if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
        return true
      } else {
        return false
      }
    },
    getCategory() {
      let category = this.$route.query.category
      if (category) {
        this.$store.dispatch('changeCategory', category)
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'Detail') {
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      console.log(scrollTop)
      this.$store.dispatch('changeScrollTop', scrollTop)
    }
    next()
  },
}
</script>
<style lang="scss">
.container-wraper {
  .container {
    display: flex;
  }
  .container {
    background: #fff;
  }
  margin-top: 1.767rem;
  display: flex;
  .main-content {
    overflow: hidden;
    flex-grow: 1;
    padding-left: 30px;
  }
  .aside {
    width: 240px;
    min-width: 240px;
    margin-left: 20px;
  }
}


.aside-section {
  width: 100%;
  background: #fcfcfc;
  border-radius: 6px;
}
.aside-title {
  padding-left: 10px;
  height: 45px;
  line-height: 45px;
  border-bottom: 1px solid #f3f3f3;
  font-size: 14px;
}
.aside-body {
  padding: 20px 10px;
}
@media (max-width: 960px) {
  .aside {
    display: none;
  }
  .banner {
    display: none;
  }
  .container-wraper {
    background: #fff;
    .main-content {
      padding-left: 0;
    }
  }
}
</style>

