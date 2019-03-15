<template>
  <div class="banner">
    <!-- 加入v-if="recommendList.length > 0才能loop -->
    <swiper :options="swiperOption" v-if="recommendList.length > 0">
        <swiper-slide v-for="item in recommendList" :key="item.id">
          <router-link :to="{ name:'Detail', params: { id: item.id } }">
            <img :src="item.banner" alt="">
          </router-link>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
        <div class="swiper-button-prev" slot="button-prev"></div>
        <div class="swiper-button-next" slot="button-next"></div>
      </swiper>
  </div>
</template>
<script>
import { getRecommendList } from '@/api/article'
export default {
  data() {
    return {
      recommendList: [],
      swiperOption: {
        slidesPerView: 1,
        autoplay: true,
        spaceBetween: 30,
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      }
    }
  },
  mounted() {
    this.getRecommendList()
  },
  methods: {
    getRecommendList() {
      getRecommendList().then(res => {
        this.recommendList = res.data.list
      })
    },
  }
}
</script>
<style lang="scss">
.swiper-container {
  height: 270px;
}
.banner img {
  width: 100%;
  height: 100%;
}
</style>


