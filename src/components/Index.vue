<template>
  <div class="index-page">
    <Layout>
      <Row>
        <Col span="18" offset="3">
          <div class="index-carousel">
            <Carousel loop>
              <CarouselItem v-for="(slider, index) in recommendList" :key="index">
                <a href="#">
                  <img :src="slider.picUrl" alt="">
                </a>
              </CarouselItem>
            </Carousel>
          </div>
        </Col>
        <Col span="3">col-12</Col>
      </Row>
      <Row>
        <Col span="18" offset="3">
          <div class="disc-list">
            <Card dis-hover>
              <p slot="title">为您推荐歌单</p>
              <div class="list-box clearfix">
                <ul>
                  <li v-for="item in discList" :key="item.key" @click="selectList(item)">
                    <div class="list-img">
                      <img :src="item.imgurl" alt="" width="148" height="148">
                    </div>
                    <div class="list-name">
                      <p class="">{{item.dissname}}</p>
                      <p class="fs-12 c-gray">{{item.creator.name}}</p>
                    </div>
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </Col>
      </Row>
      <Footer class="t-a-c">Copy QQMusic By Jane He</Footer>
    </Layout>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { getRecommend, getDiscList } from '../api/recommend'
export default{
  data () {
    return {
      discList: [],
      recommendList: []
    }
  },
  created () {
    this._getDiscList()
    this._getRecommend()
  },
  methods: {
    _getDiscList () {
      getDiscList().then(res => {
        if (res.code === 0) {
          this.discList = res.data.list
        }
      })
    },
    _getRecommend () {
      getRecommend().then(res => {
        if (res.code === 0) {
          this.recommendList = res.data.slider
        }
      })
    },
    selectList (item) {
      this.$router.push({
        path: `/recommend/${item.dissid}`
      })
      this.setd(item)
    },
    ...mapMutations({
      setd: 'setDisc'
    })
  }
}
</script>

<style scoped>
  .index-page{}
  .list-box{}
  .list-box li{
    width: 148px;
    height: 230px;
    float: left;
    display: inline;
    margin-left: 14px;
    margin-right: 10px;
    margin-bottom: 10px;
  }
  .list-img{
    position: relative;
    width: 148px;
    height: 148px;
    overflow: hidden;
    cursor: pointer;
  }
  .list-img:after{
    content: '';
    width: 0;
    height: 0;
  }
  .list-img:hover:after{
    content: '';
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .6);
    position: absolute;
    left: 50%;
    right:0;
    top: 0;
    bottom:0;
    margin-left: -50%;
    transition: height .3s ease-in-out;
    cursor: pointer;
  }
</style>
