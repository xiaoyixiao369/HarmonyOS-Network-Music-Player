import media from '@ohos.multimedia.media';
import { MiniPlayer } from '../components/MiniPlayer'
import { Song } from '../viewmodel/Song'
import axios from '@ohos/axios'
import Prompt from '@system.prompt';
import audio from '@ohos.multimedia.audio';

@Entry
@Component
struct Index {
  @State songs: Song[] = []
  private avPlayer: media.AVPlayer
  @State progress: number = 0
  @State totalProgress: number = 0
  @State img: string = ''
  @State name: string = ''
  @State performerAndAlbum: string = ''
  @State @Watch('onIsPlayChanged') isPlay: boolean = false
  @State @Watch('onPlayingIndexChanged') playingIndex: number = 0
  @State miniPlayerHeight: number = 0

  onPlayingIndexChanged() {
    if (this.playingIndex < this.songs.length) {
      this.gotoPlay(this.playingIndex)
    } else {
      this.playingIndex = 0
    }
  }

  onIsPlayChanged() {
    if (this.isPlay) {
      this.avPlayer.play()
    } else {
      this.avPlayer.pause()
    }
  }

  // 注册avplayer回调函数
  setAVPlayerCallback() {

    this.avPlayer.on('timeUpdate', (currentTime) => {
      this.progress = (currentTime / 100 / this.totalProgress)
    })
    // error回调监听函数,当avPlayer在操作过程中出现错误时调用reset接口触发重置流程
    this.avPlayer.on('error', (err) => {
      console.error(`Invoke avPlayer failed, code is ${err.code}, message is ${err.message}`);
      this.avPlayer.reset(); // 调用reset重置资源，触发idle状态
    })
    // 状态机变化回调函数
    this.avPlayer.on('stateChange', async (state, reason) => {
      switch (state) {
        case 'idle': // 成功调用reset接口后触发该状态机上报
          console.info('AVPlayer state idle called.');
          break;
        case 'initialized': // avplayer 设置播放源后触发该状态上报
          console.info('AVPlayerstate initialized called.');
          this.avPlayer.prepare().then(() => {
            Prompt.showToast({
              message: '加载 ' + this.name + ' 成功'
            })
            console.info('AVPlayer prepare succeeded.');
          }, (err) => {
            console.error(`Invoke prepare failed, code is ${err.code}, message is ${err.message}`);
          });
          break;
        case 'prepared': // prepare调用成功后上报该状态机
          console.info('AVPlayer state prepared called.');
          this.avPlayer.play(); // 调用播放接口开始播放
          break;
        case 'playing': // play成功调用后触发该状态机上报
          console.info('AVPlayer state playing called.');
          break;
        case 'paused': // pause成功调用后触发该状态机上报
          console.info('AVPlayer state paused called.');
          break;
        case 'completed': // 播放结束后触发该状态机上报
          console.info('AVPlayer state completed called.');
          this.avPlayer.stop(); //调用播放结束接口
          break;
        case 'stopped': // stop接口成功调用后触发该状态机上报
          console.info('AVPlayer state stopped called.');
          this.avPlayer.reset(); // 调用reset接口初始化avplayer状态
          break;
        case 'released':
          console.info('AVPlayer state released called.');
          break;
        default:
          console.info('AVPlayer state unknown called.');
          break;
      }
    })
  }

  async aboutToAppear() {
    // 加载音乐列表
    try {
      let response = await axios({
        method: 'get',
        url: 'https://www.yyq.cn/api/getPlayData?playid=4926%2C4925%2C4924%2C4923%2C4922%2C4921%2C4920%2C4919%2C4918%2C4917%2C4916%2C4915&typeid=3'
      })
      if (response.status === 200) {
        this.songs = response.data
        this.songs.forEach((song) => {
          song.img = song.img.replace('http://', 'https://')
          song.src = 'https://www.yyq.cn/' + song.src
        })
      } else {
        console.error('load song list error not successful, status code is : ', response.status)
      }
    } catch (err) {
      console.error('load song list error: ', err)
    }

    // 创建avPlayer实例对象
    this.avPlayer = await media.createAVPlayer();
    // 创建状态机变化回调函数
    this.setAVPlayerCallback();
  }

  formatDuration(duration: number) {
    let min = Math.floor(duration / 60)
    let sec = Math.floor(duration % 60)
    return `${min}:${sec}`
  }

  async gotoPlay(index: number) {
    const song = this.songs[index]
    this.totalProgress = song.duration
    this.img = song.img
    this.name = song.name
    this.performerAndAlbum = song.performer + ' - ' + song.album.name
    if (this.miniPlayerHeight == 0) {
      this.miniPlayerHeight = 60
    }
    this.avPlayer.reset(() => {
      this.avPlayer.url = song.src
      this.isPlay = true
    })

  }

  build() {
    Row() {
      Column() {
        Row() {
          Text('鸿蒙网络音乐播放器')
            .fontSize(20)
            .fontWeight(600)
        }
        .width('100%')
        .height(40)
        .backgroundColor('#ffd2d0d0')
        .justifyContent(FlexAlign.Center)
        .alignItems(VerticalAlign.Center)

        List() {
          ForEach(this.songs, (song: Song, index: number) => {
            ListItem() {
              Row() {
                Image(song.img)
                  .width(50)
                  .height(50)
                  .borderRadius(10)
                  .margin({
                    left: 10
                  })

                Column() {
                  Text(song.name)
                    .fontSize(16)
                    .fontWeight(600)
                  Text(song.performer + ' - ' + song.album.name)
                    .fontSize(12)
                    .fontColor(Color.Grey)

                }
                .height(46)
                .justifyContent(FlexAlign.SpaceBetween)
                .alignItems(HorizontalAlign.Start)
                .layoutWeight(1)
                .margin({
                  left: 10
                })

                Text(this.formatDuration(song.duration))
                  .fontSize(12)
                  .fontColor(Color.Grey)
                  .width(40)
              }
              .alignItems(VerticalAlign.Top)
              .justifyContent(FlexAlign.Start)
              .width('100%')
            }.width('100%')
            .height(60)
            .margin({ top: 5 })
            .onClick(() => {
              this.gotoPlay(index)
            })
          })
        }
        .width('100%')
        .divider({
          strokeWidth: 2,
          startMargin: 50
        })
        .margin({ top: 10 })
        .layoutWeight(1)

        MiniPlayer({
          progress: this.progress,
          img: this.img,
          name: this.name,
          performerAndAlbum: this.performerAndAlbum,
          isPlay: $isPlay,
          playingIndex: $playingIndex
        })
          .animation({
            duration: 2000,
            curve: Curve.Linear
          })

          .height(this.miniPlayerHeight)
      }
      .width('100%')
    }
    .height('100%')
  }
}