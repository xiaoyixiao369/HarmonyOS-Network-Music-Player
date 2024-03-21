import media from '@ohos:multimedia.media';
import { MiniPlayer } from '@bundle:com.example.hmnetworkmusicplayer/entry/ets/components/MiniPlayer';
import axios from '@package:pkg_modules/.ohpm/@ohos+axios@2.2.0/pkg_modules/@ohos/axios/index';
import Prompt from '@ohos:prompt';
class Index extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1) {
        super(parent, __localStorage, elmtId);
        this.__songs = new ObservedPropertyObjectPU([], this, "songs");
        this.avPlayer = undefined;
        this.__progress = new ObservedPropertySimplePU(0, this, "progress");
        this.__totalProgress = new ObservedPropertySimplePU(0, this, "totalProgress");
        this.__img = new ObservedPropertySimplePU('', this, "img");
        this.__name = new ObservedPropertySimplePU('', this, "name");
        this.__performerAndAlbum = new ObservedPropertySimplePU('', this, "performerAndAlbum");
        this.__isPlay = new ObservedPropertySimplePU(false, this, "isPlay");
        this.__playingIndex = new ObservedPropertySimplePU(0, this, "playingIndex");
        this.__miniPlayerHeight = new ObservedPropertySimplePU(0, this, "miniPlayerHeight");
        this.setInitiallyProvidedValue(params);
        this.declareWatch("isPlay", this.onIsPlayChanged);
        this.declareWatch("playingIndex", this.onPlayingIndexChanged);
    }
    setInitiallyProvidedValue(params) {
        if (params.songs !== undefined) {
            this.songs = params.songs;
        }
        if (params.avPlayer !== undefined) {
            this.avPlayer = params.avPlayer;
        }
        if (params.progress !== undefined) {
            this.progress = params.progress;
        }
        if (params.totalProgress !== undefined) {
            this.totalProgress = params.totalProgress;
        }
        if (params.img !== undefined) {
            this.img = params.img;
        }
        if (params.name !== undefined) {
            this.name = params.name;
        }
        if (params.performerAndAlbum !== undefined) {
            this.performerAndAlbum = params.performerAndAlbum;
        }
        if (params.isPlay !== undefined) {
            this.isPlay = params.isPlay;
        }
        if (params.playingIndex !== undefined) {
            this.playingIndex = params.playingIndex;
        }
        if (params.miniPlayerHeight !== undefined) {
            this.miniPlayerHeight = params.miniPlayerHeight;
        }
    }
    updateStateVars(params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__songs.purgeDependencyOnElmtId(rmElmtId);
        this.__progress.purgeDependencyOnElmtId(rmElmtId);
        this.__totalProgress.purgeDependencyOnElmtId(rmElmtId);
        this.__img.purgeDependencyOnElmtId(rmElmtId);
        this.__name.purgeDependencyOnElmtId(rmElmtId);
        this.__performerAndAlbum.purgeDependencyOnElmtId(rmElmtId);
        this.__isPlay.purgeDependencyOnElmtId(rmElmtId);
        this.__playingIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__miniPlayerHeight.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__songs.aboutToBeDeleted();
        this.__progress.aboutToBeDeleted();
        this.__totalProgress.aboutToBeDeleted();
        this.__img.aboutToBeDeleted();
        this.__name.aboutToBeDeleted();
        this.__performerAndAlbum.aboutToBeDeleted();
        this.__isPlay.aboutToBeDeleted();
        this.__playingIndex.aboutToBeDeleted();
        this.__miniPlayerHeight.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    get songs() {
        return this.__songs.get();
    }
    set songs(newValue) {
        this.__songs.set(newValue);
    }
    get progress() {
        return this.__progress.get();
    }
    set progress(newValue) {
        this.__progress.set(newValue);
    }
    get totalProgress() {
        return this.__totalProgress.get();
    }
    set totalProgress(newValue) {
        this.__totalProgress.set(newValue);
    }
    get img() {
        return this.__img.get();
    }
    set img(newValue) {
        this.__img.set(newValue);
    }
    get name() {
        return this.__name.get();
    }
    set name(newValue) {
        this.__name.set(newValue);
    }
    get performerAndAlbum() {
        return this.__performerAndAlbum.get();
    }
    set performerAndAlbum(newValue) {
        this.__performerAndAlbum.set(newValue);
    }
    get isPlay() {
        return this.__isPlay.get();
    }
    set isPlay(newValue) {
        this.__isPlay.set(newValue);
    }
    get playingIndex() {
        return this.__playingIndex.get();
    }
    set playingIndex(newValue) {
        this.__playingIndex.set(newValue);
    }
    get miniPlayerHeight() {
        return this.__miniPlayerHeight.get();
    }
    set miniPlayerHeight(newValue) {
        this.__miniPlayerHeight.set(newValue);
    }
    onPlayingIndexChanged() {
        if (this.playingIndex < this.songs.length) {
            this.gotoPlay(this.playingIndex);
        }
        else {
            this.playingIndex = 0;
        }
    }
    onIsPlayChanged() {
        if (this.isPlay) {
            this.avPlayer.play();
        }
        else {
            this.avPlayer.pause();
        }
    }
    // 注册avplayer回调函数
    setAVPlayerCallback() {
        this.avPlayer.on('timeUpdate', (currentTime) => {
            this.progress = (currentTime / 100 / this.totalProgress);
        });
        // error回调监听函数,当avPlayer在操作过程中出现错误时调用reset接口触发重置流程
        this.avPlayer.on('error', (err) => {
            console.error(`Invoke avPlayer failed, code is ${err.code}, message is ${err.message}`);
            this.avPlayer.reset(); // 调用reset重置资源，触发idle状态
        });
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
                        });
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
        });
    }
    async aboutToAppear() {
        // 加载音乐列表
        try {
            let response = await axios({
                method: 'get',
                url: 'https://www.yyq.cn/api/getPlayData?playid=4926%2C4925%2C4924%2C4923%2C4922%2C4921%2C4920%2C4919%2C4918%2C4917%2C4916%2C4915&typeid=3'
            });
            if (response.status === 200) {
                this.songs = response.data;
                this.songs.forEach((song) => {
                    song.img = song.img.replace('http://', 'https://');
                    song.src = 'https://www.yyq.cn/' + song.src;
                });
            }
            else {
                console.error('load song list error not successful, status code is : ', response.status);
            }
        }
        catch (err) {
            console.error('load song list error: ', err);
        }
        // 创建avPlayer实例对象
        this.avPlayer = await media.createAVPlayer();
        // 创建状态机变化回调函数
        this.setAVPlayerCallback();
    }
    formatDuration(duration) {
        let min = Math.floor(duration / 60);
        let sec = Math.floor(duration % 60);
        return `${min}:${sec}`;
    }
    async gotoPlay(index) {
        const song = this.songs[index];
        this.totalProgress = song.duration;
        this.img = song.img;
        this.name = song.name;
        this.performerAndAlbum = song.performer + ' - ' + song.album.name;
        if (this.miniPlayerHeight == 0) {
            this.miniPlayerHeight = 60;
        }
        this.avPlayer.reset(() => {
            this.avPlayer.url = song.src;
            this.isPlay = true;
        });
    }
    initialRender() {
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Row.create();
            Row.height('100%');
            if (!isInitialRender) {
                Row.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create();
            Column.width('100%');
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Row.create();
            Row.width('100%');
            Row.height(40);
            Row.backgroundColor('#ffd2d0d0');
            Row.justifyContent(FlexAlign.Center);
            Row.alignItems(VerticalAlign.Center);
            if (!isInitialRender) {
                Row.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create('鸿蒙网络音乐播放器');
            Text.fontSize(20);
            Text.fontWeight(600);
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        Row.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            List.create();
            List.width('100%');
            List.divider({
                strokeWidth: 2,
                startMargin: 50
            });
            List.margin({ top: 10 });
            List.layoutWeight(1);
            if (!isInitialRender) {
                List.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            ForEach.create();
            const forEachItemGenFunction = (_item, index) => {
                const song = _item;
                {
                    const isLazyCreate = true;
                    const itemCreation = (elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        ListItem.create(deepRenderFunction, isLazyCreate);
                        ListItem.width('100%');
                        ListItem.height(60);
                        ListItem.margin({ top: 5 });
                        ListItem.onClick(() => {
                            this.gotoPlay(index);
                        });
                        if (!isInitialRender) {
                            ListItem.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    };
                    const observedShallowRender = () => {
                        this.observeComponentCreation(itemCreation);
                        ListItem.pop();
                    };
                    const observedDeepRender = () => {
                        this.observeComponentCreation(itemCreation);
                        this.observeComponentCreation((elmtId, isInitialRender) => {
                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                            Row.create();
                            Row.alignItems(VerticalAlign.Top);
                            Row.justifyContent(FlexAlign.Start);
                            Row.width('100%');
                            if (!isInitialRender) {
                                Row.pop();
                            }
                            ViewStackProcessor.StopGetAccessRecording();
                        });
                        this.observeComponentCreation((elmtId, isInitialRender) => {
                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                            Image.create(song.img);
                            Image.width(50);
                            Image.height(50);
                            Image.borderRadius(10);
                            Image.margin({
                                left: 10
                            });
                            if (!isInitialRender) {
                                Image.pop();
                            }
                            ViewStackProcessor.StopGetAccessRecording();
                        });
                        this.observeComponentCreation((elmtId, isInitialRender) => {
                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                            Column.create();
                            Column.height(46);
                            Column.justifyContent(FlexAlign.SpaceBetween);
                            Column.alignItems(HorizontalAlign.Start);
                            Column.layoutWeight(1);
                            Column.margin({
                                left: 10
                            });
                            if (!isInitialRender) {
                                Column.pop();
                            }
                            ViewStackProcessor.StopGetAccessRecording();
                        });
                        this.observeComponentCreation((elmtId, isInitialRender) => {
                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                            Text.create(song.name);
                            Text.fontSize(16);
                            Text.fontWeight(600);
                            if (!isInitialRender) {
                                Text.pop();
                            }
                            ViewStackProcessor.StopGetAccessRecording();
                        });
                        Text.pop();
                        this.observeComponentCreation((elmtId, isInitialRender) => {
                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                            Text.create(song.performer + ' - ' + song.album.name);
                            Text.fontSize(12);
                            Text.fontColor(Color.Grey);
                            if (!isInitialRender) {
                                Text.pop();
                            }
                            ViewStackProcessor.StopGetAccessRecording();
                        });
                        Text.pop();
                        Column.pop();
                        this.observeComponentCreation((elmtId, isInitialRender) => {
                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                            Text.create(this.formatDuration(song.duration));
                            Text.fontSize(12);
                            Text.fontColor(Color.Grey);
                            Text.width(40);
                            if (!isInitialRender) {
                                Text.pop();
                            }
                            ViewStackProcessor.StopGetAccessRecording();
                        });
                        Text.pop();
                        Row.pop();
                        ListItem.pop();
                    };
                    const deepRenderFunction = (elmtId, isInitialRender) => {
                        itemCreation(elmtId, isInitialRender);
                        this.updateFuncByElmtId.set(elmtId, itemCreation);
                        this.observeComponentCreation((elmtId, isInitialRender) => {
                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                            Row.create();
                            Row.alignItems(VerticalAlign.Top);
                            Row.justifyContent(FlexAlign.Start);
                            Row.width('100%');
                            if (!isInitialRender) {
                                Row.pop();
                            }
                            ViewStackProcessor.StopGetAccessRecording();
                        });
                        this.observeComponentCreation((elmtId, isInitialRender) => {
                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                            Image.create(song.img);
                            Image.width(50);
                            Image.height(50);
                            Image.borderRadius(10);
                            Image.margin({
                                left: 10
                            });
                            if (!isInitialRender) {
                                Image.pop();
                            }
                            ViewStackProcessor.StopGetAccessRecording();
                        });
                        this.observeComponentCreation((elmtId, isInitialRender) => {
                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                            Column.create();
                            Column.height(46);
                            Column.justifyContent(FlexAlign.SpaceBetween);
                            Column.alignItems(HorizontalAlign.Start);
                            Column.layoutWeight(1);
                            Column.margin({
                                left: 10
                            });
                            if (!isInitialRender) {
                                Column.pop();
                            }
                            ViewStackProcessor.StopGetAccessRecording();
                        });
                        this.observeComponentCreation((elmtId, isInitialRender) => {
                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                            Text.create(song.name);
                            Text.fontSize(16);
                            Text.fontWeight(600);
                            if (!isInitialRender) {
                                Text.pop();
                            }
                            ViewStackProcessor.StopGetAccessRecording();
                        });
                        Text.pop();
                        this.observeComponentCreation((elmtId, isInitialRender) => {
                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                            Text.create(song.performer + ' - ' + song.album.name);
                            Text.fontSize(12);
                            Text.fontColor(Color.Grey);
                            if (!isInitialRender) {
                                Text.pop();
                            }
                            ViewStackProcessor.StopGetAccessRecording();
                        });
                        Text.pop();
                        Column.pop();
                        this.observeComponentCreation((elmtId, isInitialRender) => {
                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                            Text.create(this.formatDuration(song.duration));
                            Text.fontSize(12);
                            Text.fontColor(Color.Grey);
                            Text.width(40);
                            if (!isInitialRender) {
                                Text.pop();
                            }
                            ViewStackProcessor.StopGetAccessRecording();
                        });
                        Text.pop();
                        Row.pop();
                        ListItem.pop();
                    };
                    if (isLazyCreate) {
                        observedShallowRender();
                    }
                    else {
                        observedDeepRender();
                    }
                }
            };
            this.forEachUpdateFunction(elmtId, this.songs, forEachItemGenFunction, undefined, true, false);
            if (!isInitialRender) {
                ForEach.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        ForEach.pop();
        List.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            __Common__.create();
            Context.animation(null);
            __Common__.height(this.miniPlayerHeight);
            if (!isInitialRender) {
                __Common__.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        {
            this.observeComponentCreation((elmtId, isInitialRender) => {
                ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                if (isInitialRender) {
                    ViewPU.create(new MiniPlayer(this, {
                        progress: this.progress,
                        img: this.img,
                        name: this.name,
                        performerAndAlbum: this.performerAndAlbum,
                        isPlay: this.__isPlay,
                        playingIndex: this.__playingIndex
                    }, undefined, elmtId));
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        progress: this.progress,
                        img: this.img,
                        name: this.name,
                        performerAndAlbum: this.performerAndAlbum
                    });
                }
                ViewStackProcessor.StopGetAccessRecording();
            });
        }
        __Common__.pop();
        Column.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
ViewStackProcessor.StartGetAccessRecordingFor(ViewStackProcessor.AllocateNewElmetIdForNextComponent());
loadDocument(new Index(undefined, {}));
ViewStackProcessor.StopGetAccessRecording();
//# sourceMappingURL=Index.js.map