import 'styles/main-view.scss'
import Navigator from "./Navigator";
import ControlPanel from "./ControlPanel";
import React from 'react';
import {Space} from "antd";
import SceneView from "components/SceneView";
import Architecture from "./Architecture";
import TabContainer from "components/TabContainer";
import CaseStory from "components/Timeline";

class MainView extends React.Component {
    render() {
        return (
            <div id={"main-view"} style={{overflow: "scroll"}}>
                <Navigator id={"navigator"}/>
                <Space>
                    <ControlPanel id={"playback-controller"}/>
                    <SceneView id={"scene-view"} width={window.innerWidth * 0.37} height={window.innerHeight * 0.2465}/>
                </Space>
                <Space>
                    <Architecture style={{width:1400}}></Architecture>
                    <TabContainer/>
                </Space>
                <CaseStory/>
            </div>
        );
    }
}

export default MainView;