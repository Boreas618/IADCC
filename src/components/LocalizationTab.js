import React from 'react';
import DataProvider from "../providers/DataProvider";
import {inject, observer} from "mobx-react";
import * as echarts from "echarts";
import STORE from "store/index";

@inject('store') @observer
class LocalizationTab extends React.Component {
    constructor(props) {
        super(props);
        this.dataProvider = new DataProvider();
    }

    drawLineChart = (props) => {
        const data = this.dataProvider.temporalData;
        const differentiatedData = this.dataProvider.differentiated;
        const startIdx = Math.max(props.index - 20, 0);
        const endIdx = Math.min(props.index + 20, this.dataProvider.length);
        const velocity = data.filter(item => item.series === 'Velocity').map(item => item.raw).slice(startIdx, endIdx);
        const acceleration = data.filter(item => item.series === 'Acceleration').map(item => item.raw).slice(startIdx, endIdx);
        const dAcceleration = differentiatedData['acceleration'].slice(startIdx, endIdx);
        const xData = Array.from({length: this.dataProvider.length}, (_, idx) => idx + 1).slice(startIdx, endIdx);

        const velocityOption = {
            color: ["#448EF7"],
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['Velocity']
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xData,
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                name: 'Velocity',
                type: 'line',
                data: velocity,
                smooth: true
            }]
        };

        const differentiatedVelocityOption = {
            color: ["#DFCCFB"],
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['dVelocity']
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
                name: 'dVelocity',
                type: 'line',
                data: acceleration,
                smooth: true
            }]
        };

        const accelerationOption = {
            color: ["#448EF7"],
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['Acceleration', 'dAcceleration']
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
                    name: 'Acceleration',
                    type: 'line',
                    data: acceleration,
                    smooth: true
                }
            ]
        };

        const differentiatedAccelerationOption = {
            color: ["#DFCCFB"],
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['dAcceleration']
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
                    name: 'dAcceleration',
                    type: 'line',
                    data: dAcceleration,
                    smooth: true
                }
            ]
        };

        const velocityContainer = document.getElementById("velocity-container");
        const accelerationContainer = document.getElementById("acceleration-container");

        if (velocityContainer) {
            let velocity_chart = echarts.init(velocityContainer);
            velocity_chart.setOption(this.props.differentiated ? differentiatedVelocityOption : velocityOption);
        } else {
            console.error('Velocity container not found!');
        }

        if (accelerationContainer) {
            let velocity_chart = echarts.init(accelerationContainer);
            velocity_chart.setOption(this.props.differentiated ? differentiatedAccelerationOption : accelerationOption);
        } else {
            console.error('Acceleration container not found!');
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
                <div className='header'>Localization Tab</div>
                <div style={{display: "flex", flexDirection: "column"}}>
                    <div id="velocity-container" className="line-chart-container"
                         style={{
                             height: 305,
                             width: (1 - 0.618) * window.innerWidth * 0.97,
                             border: (STORE.selectedInfo.metric == "dVelocity" || STORE.selectedInfo.metric == "velocity") ? "dashed" : "none"
                         }}
                         onClick={() => {
                             STORE.selectMetric(STORE.differentiated ? "dVelocity" : "velocity", this.dataProvider.temporalData.filter(item => item.series === 'Velocity')[STORE.currentFrameIndex].raw.toFixed(2))
                         }}
                    >
                    </div>
                    <div id="acceleration-container" className="line-chart-container"
                         style={{
                             height: 305,
                             width: (1 - 0.618) * window.innerWidth * 0.97,
                             border: (STORE.selectedInfo.metric == "dAcceleration" || STORE.selectedInfo.metric == "acceleration") ? "dashed" : "none"
                         }}
                         onClick={() => {
                             STORE.selectMetric(STORE.differentiated ? "dAcceleration" : "acceleration", this.dataProvider.temporalData.filter(item => item.series === 'Acceleration')[STORE.currentFrameIndex].raw.toFixed(2))
                         }}>
                    </div>
                </div>
            </div>
        );
    }
}

export default LocalizationTab;