<template>
<div class="recommend-page">
  <div class="recommend-box">
    <Header class="fix-top">QQ Music</Header>
    <Content class="list-box">
      <Row>
        <Col span="16">
          <!-- {{songs}} -->
          <Table :row-class-name="rowClassName" disabled-hover  ref="currentRowTable" height="500" :columns="columns" :data="songs" @on-row-click="playSong"></Table>
        </Col>
        <Col span="8">
          <div v-if="curSong.length !== 0">
            <div class="song-info flex flex-j-c">
              <div class="song-img"><img :src="curSong.image" alt=""></div>
            </div>
            <div class="fs-14 c-c9 t-a-c">
              <p>歌曲名: {{curSong.name}}</p>
              <p>歌手名: {{curSong.singer}}</p>
            </div>
          </div>
          <div class="song-info" v-else>
            <p>请选择歌曲</p>
          </div>
          <div class="lyric-wrapper">
            <div class="lyric-inner" v-if="curLyric" >
              <div v-if="curLyric.lines"  :style="{'transform':' translate3d(0px,'+ lrcOffset +'px, 0px)'}">
                <p v-for="(line, index) in curLyric.lines" :key="index" :class="{'current': currentLineNum == index}">
                {{line.txt}}
                </p>
              </div>
              <div v-else>
                {{curLyric}}
              </div>
            </div>
            <div class="lyric-inner" v-else>
              <p>暂无歌词o(╥﹏╥)o</p>
            </div>
          </div>
        </Col>
      </Row>
    </Content>
    <Footer class="fix-footer">
      <div class="flex ops">
        <Button type="ghost" shape="circle" class="m-10" icon="ios-skipbackward"></Button>
        <Button type="ghost" shape="circle" class="m-10" icon="ios-play" @click="toggleStatus"></Button>
        <Button type="ghost" shape="circle" class="m-10" icon="ios-skipforward" @click="nextSong"></Button>
      </div>
      <div class="songslide">{{curSong.length}}
        <Row v-if="curSong" type="flex" justify="center" class="code-row-bg">
          <Col span="20"><p>{{curSong.name}} - {{curSong.singer}}</p></Col>
          <Col span="4"><p>{{format(currentTime)}} / {{curSong.duration}}</p></Col>
        </Row>
        <Slider v-model="currentPos" @on-change ="changeTime"></Slider>
      </div>
    </Footer>
  </div>
  <audio ref="myaudio" id="audioPlay" :src="curSong.url1" autoplay @timeupdate = 'updateTime' @ended="autoPlay"></audio>
</div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { getSongList } from '../api/recommend'
import { createSong } from '../api/songs'
import Lyric from 'lyric-parser'
export default{
  data () {
    return {
      columns: [
        {
          title: '歌曲',
          key: 'name',
          width: 450
        },
        {
          title: '歌手',
          key: 'singer',
          width: 250
        },
        {
          title: '时长',
          key: 'duration'
        }
      ],
      songs: [],
      curSong: {},
      curLyric: null,
      currentLineNum: 0,
      playingLyric: '',
      lrcOffset: 0,
      curIndex: 0,
      playState: 0
    }
  },
  created () {
    this._getSongList()
  },
  methods: {
    rowClassName (row, index) {
      if (index == this.curIndex) {
        return 'highlight'
      }
    },
    changeTime (val) {
      var time = parseInt((val * this.totalTime) / 100)
      this.$store.commit('changeTime', time)
      this.$store.commit('setChange', true)
    },
    updateTime () {
      var myAudio = document.getElementById('audioPlay')
      var time = parseInt(myAudio.currentTime)
      this.$store.commit('updatetotalTime', parseInt(myAudio.duration))
      if (this.change) {
        myAudio.currentTime = this.tmpCurrentTime
        this.$store.commit('updatecurrentTime', this.tmpCurrentTime)
        this.curLyric.seek(myAudio.currentTime * 1000)
        this.$store.commit('setChange', false)
      } else {
        this.$store.commit('updateCurrentTime', time)
      }
    },
    playSong (val, index) {
      if (this.curLyric) {
        this.curLyric.stop()
      }
      this.curIndex = index
      this.currentLineNum = 0
      this.curSong = this.songs[index]
      this.curSong.getLyric().then(res => {
        this.curLyric = new Lyric(res, this.handleLyric)
        this.curLyric.play()
      })
      this.$store.commit('play')
    },
    handleLyric ({lineNum, txt}) {
      this.currentLineNum = lineNum
      this.playingLyric = txt
      this.lrcOffset = -(lineNum - 2) * 40
    },
    _getSongList () {
      if (!this.disc.dissid) {
        this.$router.push('/')
        return
      }
      getSongList(this.disc.dissid).then((res) => {
        if (res.code === 0) {
          this.songs = this._normalizeSongs(res.cdlist[0].songlist)
        }
      })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach((musicData) => {
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    toggleStatus () {
      if (this.playing) {
        this.$refs.myaudio.pause()
        this.$store.commit('pause')
      } else {
        this.$refs.myaudio.play()
        this.$store.commit('play')
      }
      if (this.curLyric) {
        this.curLyric.togglePlay()
      }
    },
    prevSong () {
      this.curIndex = this.curIndex - 1
      if (this.curIndex < 0) {
        this.curIndex = this.songs.length - 1
      }
      this.curSong = this.songs[this.curIndex]
      if (this.curLyric) {
        this.curLyric.stop()
      }
      this.currentLineNum = 0
      this.curSong.getLyric().then(res => {
        this.curLyric = new Lyric(res, this.handleLyric)
        this.curLyric.play()
      })
      this.$store.commit('play')
    },
    nextSong () {
      this.curIndex = this.curIndex + 1
      if (this.curIndex >= this.songs.length) {
        this.curIndex = 0
      }
      this.curSong = this.songs[this.curIndex]
      if (this.curLyric) {
        this.curLyric.stop()
      }
      this.currentLineNum = 0
      this.curSong.getLyric().then(res => {
        this.curLyric = new Lyric(res, this.handleLyric)
        this.curLyric.play()
      })
      this.$store.commit('play')
    },
    autoPlay () {
      if (this.playState === 0) {
        //  循环播放
        this.nextSong()
      }
    },
    // 格式化时间
    format (inte) {
      inte = inte | 0
      var m = parseInt(inte / 60)
      if (m < 10) m = '0' + m
      var s = parseInt(inte - (m * 60))
      if (s < 10) s = '0' + s
      return `${m} : ${s}`
    },
    ...mapMutations([
      'play',
      'pause'
    ])
  },
  computed: {
    currentPos: {
      get: function () {
        return parseInt(this.currentTime / this.totalTime * 100)
      },
      set: function () {

      }
    },
    ...mapGetters([
      'disc',
      'currentTime',
      'totalTime',
      'change',
      'tmpCurrentTime',
      'playing'
    ])
  }
}
</script>

<style>
.highlight td{ color: #62bb83 !important;}
.ivu-table-wrapper{ border: 0;}
.ivu-table, .ivu-table th, .ivu-table td{ background: none; border-bottom: none; font-size: 14px; color: #c6c6c6;}
.ivu-table:after, .ivu-table:before{ background: none;}
.ops{
  width: 200px;
  height: 60px;
  float: left;
  margin-right: 50px;
  display: inline;
}
.songslide{
  width: 790px;
  height: 60px;
  float: left;
  margin-right: 50px;
  display: inline;
}
.lyric-wrapper{
  margin: 20px;
  height: 200px;
  line-height: 40px;
  color: #ddd;
  font-size: 14px;
  text-align: center;
  overflow: hidden;
}
.lyric-inner, .lyric-inner > div{
  transition: -webkit-transform 0.3s ease-out;
  transform-origin: 0px 0px 0px;
}
.current{ color: #62bb83;}
.song-img{
  width: 242px;
  height: 242px;
  margin-left: 20px;
  overflow: hidden;
  border-radius: 50%;
  background: url('/static/images/cd_wrapper.png') no-repeat top right;
  background-size: cover;
  padding: 42px;
  margin-bottom: 20px;
}
.song-img img{ width: 160px; height: 160px; border-radius: 50%; display: block;}
.img-playing{}
.list-box{
  height: 100%;
  padding-bottom: 130px;
  margin: 0 80px;
}
.fix-top{ background: none; height: 100px; position: absolute; top:0; left: 0; right:0; color: #818181; text-align: left; font-size: 24px;}
.fix-footer{
  background: none;
  height: 100px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  color: #d8d8d8;
}
.recommend{ height: 100%; }
.recommend-page{
  width: 100%;
  height: 100%;
  background: rgba(30, 30, 30, .8);
  position: relative;
  overflow: hidden;
}
.recommend-page:before{
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: -1;
  background: url('/static/images/bg_red.jpg') no-repeat;
  background-size: cover;
  filter: blur(15px);
  margin: -20px;
}
.recommend-box{
  /*height: 760px;*/
  padding-top: 100px;
  padding-bottom: 120px;
}
.layout-footer-center{
  text-align: center;
}
</style>
