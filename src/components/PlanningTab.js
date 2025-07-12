import React from 'react';
import DataProvider from "../providers/DataProvider";
import {inject, observer} from "mobx-react";
import * as d3 from "d3";
import * as echarts from "echarts";
import STORE from "store/index";
import {legendColor} from "d3-svg-legend";

@inject('store') @observer
class PlanningTab extends React.Component {
    constructor(props) {
        super(props);
        this.dataProvider = new DataProvider();
    }

    drawPlanningChart(props) {
        d3.select("#planning-chart").select("svg").remove();
        const index = props.index;
        const planningBefore = this.dataProvider.planning(index === 0 ? 0 : index - 1);
        const planningCurrent = this.dataProvider.planning(index);
        const width = (1 - 0.618) * window.innerWidth * 0.8;
        const height = 350 * 0.8;
        const margin = {left:20, right:20, up:20, down:20};

        const svg = d3.select("#planning-chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        const g = svg.append("g");

        const zoom = d3.zoom().scaleExtent([0.8, 2]).on("zoom", zoomed);

        function zoomed(e) {
            svg.attr("transform", e.transform);
        }

        const xScale = d3.scaleLinear()
            .domain([Math.min(d3.min(planningBefore, d => d.positionX), d3.min(planningCurrent, d => d.positionX)), Math.max(d3.max(planningBefore, d => d.positionX), d3.max(planningCurrent, d => d.positionX))])
            .range([margin.left, width-margin.right]);

        const yScale = d3.scaleLinear()
            .domain([Math.min(d3.min(planningBefore, d => d.positionY), d3.min(planningCurrent, d => d.positionY)), Math.max(d3.max(planningBefore, d => d.positionY), d3.max(planningCurrent, d => d.positionY))])
            .range([height-margin.up, margin.down]);

        const line = d3.line()
            .x(d => xScale(d.positionX))
            .y(d => yScale(d.positionY))
            .curve(d3.curveMonotoneX);

        // svg.call(zoom);

        g.append("path")
            .datum(planningBefore)
            .attr("fill", "none")
            .attr("stroke", "gray")
            .attr("stroke-width", 2)
            .attr("d", line);

        g.selectAll(".dot")
            .data(planningBefore)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", d => xScale(d.positionX))
            .attr("cy", d => yScale(d.positionY))
            .attr("r", 2)
            .attr("fill", "none")
            .attr("stroke", "gray");

        g.append("path")
            .datum(planningCurrent)
            .attr("fill", "none")
            .attr("stroke", "#448EF7")
            .attr("stroke-width", 2)
            .attr("d", line);

        g.selectAll(".current-dot")
            .data(planningCurrent)
            .enter().append("circle")
            .attr("class", "current-dot")
            .attr("cx", d => xScale(d.positionX))
            .attr("cy", d => yScale(d.positionY))
            .attr("r", 2)
            .attr("fill", "none")
            .attr("stroke", "#448EF7");

        svg.append('g')
            .attr("transform", `translate(${margin.left}, ${height - margin.up - 50})`)
            .attr('class', 'legend')
            .attr('id', 'planning-legend');

        const planningColor = d3.scaleOrdinal().domain(['Current planning', 'Previous planning']).range(['#448EF7', 'gray']);
        const planningLegend = legendColor().shape("path", d3.symbol().type(d3.symbolCircle).size(150)()).shapePadding(10).scale(planningColor);
        svg.select("#planning-legend").call(planningLegend);
        document.querySelector('#planning-legend > g > g:nth-child(1) > path').style.stroke = '#448EF7';
        document.querySelector('#planning-legend > g > g:nth-child(1) > path').style.fill = 'none';
        document.querySelector('#planning-legend > g > g:nth-child(2) > path').style.stroke = 'gray';
        document.querySelector('#planning-legend > g > g:nth-child(2) > path').style.fill = 'none';
    }

    drawDTWScore(props) {
        const data = DataProvider.planningSimilarity;
        const startIdx = Math.max(props.index - 20, 0);
        const endIdx = Math.min(props.index + 20, this.dataProvider.length);
        const dtw = data.slice(startIdx, endIdx);
        const xData = Array.from({length: this.dataProvider.length}, (_, idx) => idx + 1).slice(startIdx, endIdx);
        const dtwOption = {
            color: ["#448EF7"],
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['DTW']
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
                name: 'DTW',
                type: 'line',
                data: dtw,
                smooth: true
            }]
        };
        const dtwContainer = document.getElementById("dtw-chart");
        if (dtwContainer) {
            let dtwChart = echarts.init(dtwContainer);
            dtwChart.setOption(dtwOption);
        } else {
            console.error('DTW container not found!');
        }
    }

    componentDidUpdate(_, __, ___) {
        this.drawPlanningChart(this.props);
        this.drawDTWScore(this.props);
    }

    componentDidMount() {
        this.drawPlanningChart(this.props);
        this.drawDTWScore(this.props);
    }

    render() {
        return (
            <div className={"pane"}>
                <div className='header'>Planning Tab</div>
                <div style={{display: "flex", flexDirection: "column"}}>
                    <div id="dtw-chart" style={{
                        height: 278,
                        width: (1 - 0.618) * window.innerWidth * 0.97,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                         onClick={() => {
                             STORE.selectMetric("planning-change", DataProvider.planningSimilarity[STORE.currentFrameIndex])
                         }}
                    >
                    </div>
                    <div id="planning-chart" className="line-chart-container"
                         style={{
                             height: 332,
                             width: (1 - 0.618) * window.innerWidth * 0.97,
                             display: "flex",
                             justifyContent: "center",
                             alignItems: "center",
                             border: STORE.selectedInfo.metric.startsWith("planning-change") ? "dashed" : "none"
                         }}
                         onClick={() => {
                             STORE.selectMetric("planning-change", DataProvider.planningSimilarity[STORE.currentFrameIndex])
                         }}>
                    </div>
                </div>
            </div>
        );
    }
}

export default PlanningTab;