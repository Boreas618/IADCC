import {Divider, Slider, Space} from "antd";
import React from "react";
import {inject, observer} from "mobx-react";
import STORE from 'store';
import RENDERER from "renderer/index";
import groundData from "../constants/json/scene_ground.json";
import DataProvider from "../providers/DataProvider";

const fontStyle = {
    color: 'black',
    fontSize: '10px',
    fontWeight: 500,
};

const lineMark = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200];

@inject('store') @observer
class PlaybackController extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const currentTimestamp = this.props.store.currentFrameIndex;
        const dataProvider = new DataProvider();
        let changeMarks = {};
        for (const i of lineMark) {
            changeMarks[i] = {style: fontStyle, label: i,};
        }

        return (
            <div id={"playback-controller-container"}>
                <Space direction={"horizontal"}>
                    <div id={"index"} style={{width:50, fontWeight:'bold'}}>
                        {currentTimestamp}
                    </div>
                    <Divider type="vertical" style={{width: 5, marginLeft: 5, marginTop: -5}}/>
                    <Slider
                        style={{marginLeft: 32, marginTop: 10, width: 0.56375 * window.innerWidth, fontSize: '5px'}}
                        max={199}
                        marks={changeMarks}
                        defaultValue={0}
                        onChange={(index) => {
                            STORE.changeFrameIndex(index);
                            const frame = dataProvider.frame(index);
                            RENDERER.coordinates.setSystem('ENU');
                            RENDERER.updateGroundMetadata(groundData);
                            STORE.update(frame, false);
                            STORE.updateTimestamp(frame.timestamp);
                            RENDERER.maybeInitializeOffest(
                                frame.autoDrivingCar.positionX,
                                frame.autoDrivingCar.positionY,
                            );
                            STORE.meters.update(frame);
                            STORE.monitor.update(frame);
                            STORE.trafficSignal.update(frame);
                            RENDERER.updateWorld(frame);
                        }}
                        value={currentTimestamp}
                    />
                </Space>
            </div>
        );
    }

}

export default PlaybackController;