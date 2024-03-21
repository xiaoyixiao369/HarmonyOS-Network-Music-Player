export class Song {
  id: number
  album_id: number
  // 歌曲名
  name: string
  // 时长
  duration: number
  cover: string
  lang: string
  listen_end: number
  // 歌手名
  performer: string
  mp3_wav: string
  style: string
  img: string
  // 播放地址
  src: string
  // 专辑
  album: Album
}

export class Album {
  id: number
  name: string
  alias_name: string
  sub_name: string
  product_code: number
  editor_code: number
  bar_code: string
  performer: string
  version: string
  link: string
  main_version: number
  album_desc: string
  intro: string
  issue_time: string
  issue_state: string
  issue_company: string
  issue_area: number
  copyright: number
  money: number
  graphy: string
  style: string
  lang: string
  is_hot: number
  sort_hot: number
  audit: number
  disc_count: number
  cover: string
  tag: string
  created_at: string
  updated_at: string
  deleted_at: null
}