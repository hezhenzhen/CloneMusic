import { GetLyric } from './lyric'
import { Base64 } from 'js-base64'

export default class Song {
  constructor ({id, mid, singer, name, ablum, duration, image, url, url1}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.ablum = ablum
    this.duration = duration
    this.image = image
    this.url = url
    this.url1 = url1
  }

  // Promise 封装
  getLyric () {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      GetLyric(this.mid).then(res => {
        if (res.retcode === 0) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          console.log('no lyric')
        }
      })
    })
  }
}

export function createSong (musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    ablum: musicData.ablumname,
    duration: filterTime(musicData.interval),
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}/${musicData.songid}.m4a?guid=263427534&fromtag=66`,
    url1: `http://ws.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=0&guid=${musicData.songid}`
  })
}

function filterSinger (singer) {
  let ret = []
  if (!singer) return ''
  singer.forEach((item, index) => {
    ret.push(item.name)
  })
  return ret.join('/')
}

function filterTime (duration) {
  var dur = ''
  if (!duration) return ''
  var m = parseInt(duration / 60)
  if (m < 10) m = '0' + m
  var s = parseInt(duration - (m * 60))
  if (s < 10) s = '0' + s
  dur = m + ' : ' + s
  return dur
}
