export class MiniPlayer extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1) {
        super(parent, __localStorage, elmtId);
        this.__progress = new SynchedPropertySimpleOneWayPU(params.progress, this, "progress");
        this.__img = new SynchedPropertySimpleOneWayPU(params.img, this, "img");
        this.__name = new SynchedPropertySimpleOneWayPU(params.name, this, "name");
        this.__performerAndAlbum = new SynchedPropertySimpleOneWayPU(params.performerAndAlbum, this, "performerAndAlbum");
        this.__isPlay = new SynchedPropertySimpleTwoWayPU(params.isPlay, this, "isPlay");
        this.__start = new ObservedPropertySimplePU(0, this, "start");
        this.__intervalNumber = new ObservedPropertySimplePU(0, this, "intervalNumber");
        this.__playingIndex = new SynchedPropertySimpleTwoWayPU(params.playingIndex, this, "playingIndex");
        this.setInitiallyProvidedValue(params);
        this.declareWatch("isPlay", this.rotateImg);
    }
    setInitiallyProvidedValue(params) {
        if (params.start !== undefined) {
            this.start = params.start;
        }
        if (params.intervalNumber !== undefined) {
            this.intervalNumber = params.intervalNumber;
        }
    }
    updateStateVars(params) {
        this.__progress.reset(params.progress);
        this.__img.reset(params.img);
        this.__name.reset(params.name);
        this.__performerAndAlbum.reset(params.performerAndAlbum);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__progress.purgeDependencyOnElmtId(rmElmtId);
        this.__img.purgeDependencyOnElmtId(rmElmtId);
        this.__name.purgeDependencyOnElmtId(rmElmtId);
        this.__performerAndAlbum.purgeDependencyOnElmtId(rmElmtId);
        this.__isPlay.purgeDependencyOnElmtId(rmElmtId);
        this.__start.purgeDependencyOnElmtId(rmElmtId);
        this.__intervalNumber.purgeDependencyOnElmtId(rmElmtId);
        this.__playingIndex.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__progress.aboutToBeDeleted();
        this.__img.aboutToBeDeleted();
        this.__name.aboutToBeDeleted();
        this.__performerAndAlbum.aboutToBeDeleted();
        this.__isPlay.aboutToBeDeleted();
        this.__start.aboutToBeDeleted();
        this.__intervalNumber.aboutToBeDeleted();
        this.__playingIndex.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    get progress() {
        return this.__progress.get();
    }
    set progress(newValue) {
        this.__progress.set(newValue);
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
    get start() {
        return this.__start.get();
    }
    set start(newValue) {
        this.__start.set(newValue);
    }
    get intervalNumber() {
        return this.__intervalNumber.get();
    }
    set intervalNumber(newValue) {
        this.__intervalNumber.set(newValue);
    }
    get playingIndex() {
        return this.__playingIndex.get();
    }
    set playingIndex(newValue) {
        this.__playingIndex.set(newValue);
    }
    rotateImg() {
        clearInterval(this.intervalNumber);
        console.log('isPlay', this.isPlay);
        if (this.isPlay) {
            this.intervalNumber = setInterval(() => {
                this.start += 5;
                if (this.start > 360) {
                    this.start = 0;
                }
            }, 100);
        }
        else {
            clearInterval(this.intervalNumber);
            this.start = 0;
        }
    }
    initialRender() {
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create();
            Column.width('100%');
            Column.height(60);
            Column.justifyContent(FlexAlign.Center);
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Row.create();
            Row.width('100%');
            Row.margin({ top: 5 });
            if (!isInitialRender) {
                Row.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Progress.create({
                value: this.progress
            });
            Progress.height(2);
            Progress.backgroundColor(Color.Black);
            Progress.width('100%');
            if (!isInitialRender) {
                Progress.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Row.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Row.create();
            Row.width('100%');
            Row.margin({ top: 5 });
            if (!isInitialRender) {
                Row.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Image.create(this.img);
            Image.width(40);
            Image.height(40);
            Image.borderRadius(50);
            Image.margin({ left: 10 });
            Image.rotate({
                x: 0,
                y: 0,
                z: 1,
                angle: this.start
            });
            if (!isInitialRender) {
                Image.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create();
            Column.layoutWeight(1);
            Column.margin({ left: 10 });
            Column.alignItems(HorizontalAlign.Start);
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create(this.name);
            Text.fontSize(14);
            Text.fontWeight(600);
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create(this.performerAndAlbum);
            Text.fontWeight(10);
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
            Row.create();
            Row.width(120);
            if (!isInitialRender) {
                Row.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Image.create(this.isPlay ? { "id": 16777224, "type": 20000, params: [], "bundleName": "com.example.hmnetworkmusicplayer", "moduleName": "entry" } : { "id": 16777225, "type": 20000, params: [], "bundleName": "com.example.hmnetworkmusicplayer", "moduleName": "entry" });
            Image.width(36);
            Image.height(36);
            Image.borderRadius(10);
            Image.margin({ left: 10 });
            Image.onClick((() => {
                this.isPlay = !this.isPlay;
            }));
            if (!isInitialRender) {
                Image.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Image.create({ "id": 16777223, "type": 20000, params: [], "bundleName": "com.example.hmnetworkmusicplayer", "moduleName": "entry" });
            Image.width(40);
            Image.height(40);
            Image.borderRadius(10);
            Image.margin({ left: 10 });
            Image.onClick(() => {
                this.playingIndex++;
                this.isPlay = false;
            });
            if (!isInitialRender) {
                Image.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Row.pop();
        Row.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
//# sourceMappingURL=MiniPlayer.js.map