import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {Button, Input, Space} from "antd";
import {ArrowRightOutlined} from "@ant-design/icons";
import {Timeline} from 'flowbite-react';
import STORE from "store/index";

const {TextArea} = Input;

const index2Module = [
    "Localization",
    "Perception",
    "Prediction",
    "Planning",
    "Control"
];

let InformationItem = (props) => {
    return (
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <div className='tagText' style={{fontSize: 18, overflow:'scroll'}}>
                {props.attribute}
            </div>
            <div style={{fontSize: 15, overflow:'scroll'}}>
                {props.value}
            </div>
        </div>
    );
}

const SelectedInfo = (props) => {
    return (
        <div id={"edit-container"} style={{
            display: "flex",
            flexDirection: "row",
            border: "thick",
            borderRadius: "5px",
            alignItems: "center"
        }}>
            <div id={"selected-information"}
                 style={{
                     display: 'flex',
                     flexDirection: 'column',
                     justifyContent: 'space-evenly',
                     height: 0.16 * window.innerHeight,
                     width: 0.12 * window.innerWidth,
                     paddingRight: '15px',
                     stroke: 'gray'
                 }}>
                <InformationItem attribute={"Timestamp"} value={props.timestamp}/>
                <InformationItem attribute={"Module"} value={index2Module[props.module]}/>
                <InformationItem attribute={"Metric"} value={props.metric}/>
                <InformationItem attribute={"Value"} value={props.val}/>
            </div>
        </div>
    );
}

const StageButton = (props) => {
    return (
        <Button shape="circle" icon={<ArrowRightOutlined/>} onClick={() => {
            props.caseRecord.newEvent(props.timestamp, props.module, props.description, props.metric, props.value);
            STORE.currentFrameIndex++;
            STORE.currentFrameIndex--;
        }}/>
    );
}

const EventLine = (props) => {
    let events = props.caseRecord.events;
    return (
        <Timeline style={{width: 0.7 * window.innerWidth, overflow: 'scroll'}} horizontal>
            {events.map((e) => <StoryNode module={e.module} timestamp={e.timestamp}
                                          metric={e.metric} value={e.value}
                                          description={e.description}/>)}
        </Timeline>
    );
}

const StoryNode = (props) => {
    return (
        <Timeline.Item>
            <Timeline.Point/>
            <Timeline.Content>
                <Timeline.Title>
                    {index2Module[props.module]}
                </Timeline.Title>
                <Timeline.Time>
                    {props.timestamp}
                </Timeline.Time>
                <Timeline.Body>
                    {props.metric.toString() + ":" + props.value.toString() + "\n" + props.description.toString()}
                </Timeline.Body>
            </Timeline.Content>
        </Timeline.Item>
    );
}

@inject('store') @observer
class CaseStory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            description: ""
        };
    }

    setDescription = (text) => {
        this.setState({description: text});
    }

    render() {
        return (
            <div className={"pane"}>
                <div className='header'>Case</div>
                <Space direction={"horizontal"}>
                    <div style={{
                        width: window.innerWidth * 0.25,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        alignItems: 'center'
                    }}>
                        <SelectedInfo
                            timestamp={this.props.store.currentFrameIndex}
                            module={this.props.store.currentModule}
                            metric={this.props.store.selectedInfo.metric}
                            val={this.props.store.selectedInfo.val}
                            onChange={this.setDescription}
                        />
                        <div>
                            <TextArea rows={6} placeholder="Description" maxLength={100} onChange={(e) => {
                                this.setDescription(e.target.value);
                            }}/>
                        </div>
                        <StageButton description={this.state.description}
                                     caseRecord={this.props.store.caseRecord}
                                     timestamp={this.props.store.currentFrameIndex}
                                     module={this.props.store.currentModule}
                                     metric={"Metric"}
                                     value={0}/>
                    </div>
                    <EventLine
                        caseRecord={this.props.store.caseRecord}
                    />
                </Space>
            </div>
        );
    }
}

export default CaseStory;