<template>
  <div class="aside-section">
    <div class="aside-title">热门标签</div>
    <div class="aside-body">
      <ul class="tag-list clearfix">
        <li v-for="(item,$index) in categoryList" :key="item.id" @click="changeCategory($index)">
          <router-link :to="{path: '/index', query: categoryQuery(item)}" class="link">{{item.name}}</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { getCategoryList } from '@/api/category'
export default {
  data() {
    return {
      activeIndex: null,
      categoryList: null
    }
  },
  created() {
    this.getCategoryList()
  },
  methods: {
    getCategoryList() {
      getCategoryList().then(res => {
        this.categoryList = res.data.list
      })
    },
    changeCategory(index) {
      let category = this.$route.query.category
      this.$store.dispatch('changeCategory', category)
      // this.$store.dispatch('changeSearchParam', this.$route.query)
    },
    categoryQuery(item) {
      let query = this.$route.query
      if (query.keyword) {
        return { category: item.name, keyword: query.keyword }
      } else {
        return { category: item.name }
      }
    }
  }
}
</script>
<style lang="scss">
.tag-list {
  li {
    float: left;
  }
  .link {
    display: block;
    margin:0 10px 10px 0;
    height: 28px;
    line-height: 26px;
    padding: 0 15px;
    border: 1px solid #e8ecef;
    background: #fff;
    font-size: 16px;
    color: #5e6b73;
    border-radius: 14px;
  }
  .router-link-exact-active {
    color: #fff;
    background: #1989fa;
  }
}

</style>

