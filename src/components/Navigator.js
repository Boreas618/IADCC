import {Button, Space, Switch} from "antd";
import PlaybackController from "./PlaybackController";
import {inject, observer} from "mobx-react";
import STORE from 'store';
import React from 'react';

@inject('store') @observer
class Navigator extends React.Component {
    render() {
        return (
            <div id={"navigator-container"} style={{height:0.04* window.innerHeight}}>
                <PlaybackController/>
                <Space direction={"horizontal"} align={"center"}>
                    <Space wrap>
                        <Switch
                            checked={STORE.differentiated}
                            onChange={()=>STORE.differentiated = !STORE.differentiated}
                            checkedChildren="Differentiated"
                            unCheckedChildren="Regular"
                        />
                        <Button type={STORE.currentModule === 0 ? "primary" : "default"} size={'large'}
                                onClick={() => STORE.navigateTo(0)}>
                            Localization
                        </Button>
                        <Button type={STORE.currentModule === 1 ? "primary" : "default"} size={'large'}
                                onClick={() => STORE.navigateTo(1)}>
                            Perception
                        </Button>
                        <Button type={STORE.currentModule === 2 ? "primary" : "default"} size={'large'}
                                onClick={() => STORE.navigateTo(2)}>
                            Prediction
                        </Button>
                        <Button type={STORE.currentModule === 3 ? "primary" : "default"} size={'large'}
                                onClick={() => STORE.navigateTo(3)}>
                            Planning
                        </Button>
                        <Button type={STORE.currentModule === 4 ? "primary" : "default"} size={'large'}
                                onClick={() => STORE.navigateTo(4)}>
                            Control
                        </Button>
                    </Space>
                </Space>
            </div>
        );
    }
}

export default Navigator;