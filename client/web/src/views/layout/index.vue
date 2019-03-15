<template>
  <div id="wrap">
    <Header></Header>
    <div id="content">
      <keep-alive>
				<router-view v-if="$route.meta.keepAlive"></router-view>
			</keep-alive>
			<router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
  </div>
</template>
<script>
import Header from './header'
export default {
  name: 'layout',
  components: {
    Header
  },
  watch: {
    '$route'() {
    }
  }
}
</script>
<style lang="scss">
 .container {
    width: 960px;
    margin: 0 auto;
    position: relative;
  }
  @media (max-width: 960px) {
    .container {
      width: 96%;
    }
  }

</style>
