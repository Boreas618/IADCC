import React from 'react';
import DataProvider from "../providers/DataProvider";
import {inject, observer} from "mobx-react";
import * as echarts from "echarts";
import STORE from "store/index";

@inject('store') @observer
class ControlTab extends React.Component {
    constructor(props) {
        super(props);
        this.dataProvider = new DataProvider();
    }

    drawLineChart(props) {
        const data = this.dataProvider.temporalData;
        const differentiatedData = this.dataProvider.differentiated;
        const startIdx = Math.max(props.index - 20, 0);
        const endIdx = Math.min(props.index + 20, this.dataProvider.length);
        const throttle = data.filter(item => item.series === 'Throttle').map(item => item.raw).slice(startIdx, endIdx);
        const brake = data.filter(item => item.series === 'Brake').map(item => item.raw).slice(startIdx, endIdx);
        const steering = data.filter(item => item.series === 'Steering').map(item => item.raw).slice(startIdx, endIdx);
        const dThrottle = differentiatedData['throttle'].slice(startIdx, endIdx);
        const dBrake = differentiatedData['brake'].slice(startIdx, endIdx);
        const dSteering = differentiatedData['steering'].slice(startIdx, endIdx);
        const xData = Array.from({length: this.dataProvider.length}, (_, idx) => idx + 1).slice(startIdx, endIdx);

        const throttleOption = {
            color: ["#448EF7"],
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['Throttle', 'dThrottle']
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xData
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                name: 'Throttle',
                type: 'line',
                data: throttle,
                smooth: true
            }]
        };

        const differentiatedThrottleOption = {
            color: ["#DFCCFB"],
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['dThrottle']
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xData
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: 'dThrottle',
                    type: 'line',
                    data: dThrottle,
                    smooth: true
                }]
        };

        const brakeOption = {
            color: ["#448EF7"],
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['Brake', 'dBrake']
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xData
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: 'Brake',
                    type: 'line',
                    data: brake,
                    smooth: true
                }]
        };

        const differentiatedBrakeOption = {
            color: ["#DFCCFB"],
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['dBrake']
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xData
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: 'dBrake',
                    type: 'line',
                    data: dBrake,
                    smooth: true
                }]
        };

        const steeringOption = {
            color: ["#448EF7", "#DFCCFB"],
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['Steering', 'dSteering']
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xData
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: 'Steering',
                    type: 'line',
                    data: steering,
                    smooth: true
                }]
        };

        const differentiatedSteeringOption = {
            color: ["#DFCCFB"],
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['dSteering']
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xData
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: 'dSteering',
                    type: 'line',
                    data: dSteering,
                    smooth: true
                }]
        };

        const throttleContainer = document.getElementById("throttle-container");
        const brakeContainer = document.getElementById("brake-container");
        const steeringContainer = document.getElementById("steering-container");

        if (throttleContainer) {
            let throttle_chart = echarts.init(throttleContainer);
            throttle_chart.setOption(this.props.differentiated ? differentiatedThrottleOption : throttleOption);
        } else {
            console.error('Throttle container not found!');
        }

        if (brakeContainer) {
            let brake_chart = echarts.init(brakeContainer);
            brake_chart.setOption(this.props.differentiated ? differentiatedBrakeOption : brakeOption);
        } else {
            console.error('Brake container not found!');
        }

        if (steeringContainer) {
            let steering_chart = echarts.init(steeringContainer);
            steering_chart.setOption(this.props.differentiated ? differentiatedSteeringOption : steeringOption);
        } else {
            console.error('Steering container not found!');
        }
    }

    componentDidUpdate(_, __, ___) {
        this.drawLineChart(this.props);
    }

    componentDidMount() {
        this.drawLineChart(this.props);
    }

    render() {
        return (
            <div className={"pane"}>
                <div className='header'>Control Tab</div>
                <div style={{display: "flex", flexDirection: "column"}}>
                    <div id="throttle-container" className="line-chart-container"
                         style={{height: 203, width: (1 - 0.618) * window.innerWidth * 0.97, border: (STORE.selectedInfo.metric == "dThrottle" || STORE.selectedInfo.metric == "throttle") ? "dashed" : "none"}}
                         onClick={()=>{STORE.selectMetric(STORE.differentiated ? "dThrottle": "throttle", this.dataProvider.temporalData.filter(item => item.series === 'Throttle')[STORE.currentFrameIndex].raw)}}
                    >
                    </div>
                    <div id="brake-container" className="line-chart-container"
                         style={{height: 203, width: (1 - 0.618) * window.innerWidth * 0.97, border: (STORE.selectedInfo.metric == "dBrake" || STORE.selectedInfo.metric == "brake") ? "dashed" : "none"}}
                         onClick={()=>{STORE.selectMetric(STORE.differentiated ? "dBrake": "brake", this.dataProvider.temporalData.filter(item => item.series === 'Brake')[STORE.currentFrameIndex].raw)}}>
                    </div>
                    <div id="steering-container" className="line-chart-container"
                         style={{height: 203, width: (1 - 0.618) * window.innerWidth * 0.97, border: (STORE.selectedInfo.metric == "dSteering" || STORE.selectedInfo.metric == "steering") ? "dashed" : "none"}}
                         onClick={()=>{STORE.selectMetric(STORE.differentiated ? "dSteering": "steering", this.dataProvider.temporalData.filter(item => item.series === 'Steering')[STORE.currentFrameIndex].raw)}}>
                    </div>
                </div>
            </div>
        );
    }
}

export default ControlTab;