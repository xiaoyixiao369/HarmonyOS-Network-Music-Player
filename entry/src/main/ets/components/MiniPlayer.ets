@Component
export struct MiniPlayer {
  @Prop progress: number
  @Prop img: string
  @Prop name: string
  @Prop performerAndAlbum: string
  @Link @Watch('rotateImg') isPlay: boolean
  @State start: number = 0
  @State intervalNumber: number = 0
  @Link playingIndex: number

  rotateImg() {
    clearInterval(this.intervalNumber)
    console.log('isPlay', this.isPlay)
    if (this.isPlay) {
      this.intervalNumber = setInterval(() => {
        this.start += 5
        if (this.start > 360) {
          this.start = 0
        }
      }, 100)
    } else {
      clearInterval(this.intervalNumber)
      this.start = 0
    }
  }

  build() {
    Column() {
      Row() {
        Progress({
          value: this.progress
        })
          .height(2)
          .backgroundColor(Color.Black)
          .width('100%')

      }.width('100%')
      .margin({ top: 5 })

      Row() {
        Image(this.img)
          .width(40)
          .height(40)
          .borderRadius(50)
          .margin({ left: 10 })
          .rotate({
            x: 0,
            y: 0,
            z: 1,
            angle: this.start
          })


        Column() {
          Text(this.name)
            .fontSize(14)
            .fontWeight(600)

          Text(this.performerAndAlbum)
            .fontWeight(10)
            .fontColor(Color.Grey)
        }.layoutWeight(1)
        .margin({ left: 10 })
        .alignItems(HorizontalAlign.Start)

        Row() {
          Image(this.isPlay ? $r('app.media.music_pause') : $r('app.media.music_play'))
            .width(36)
            .height(36)
            .borderRadius(10)
            .margin({ left: 10 })
            .onClick((() => {
              this.isPlay = !this.isPlay
            }))

          Image($r('app.media.music_next'))
            .width(40)
            .height(40)
            .borderRadius(10)
            .margin({ left: 10 })
            .onClick(() => {
              this.playingIndex++
              this.isPlay = false
            })
        }.width(120)

      }.width('100%')
      .margin({ top: 5 })
    }.width('100%')
    .height(60)
    .justifyContent(FlexAlign.Center)
  }
}