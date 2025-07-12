import React from 'react';
import DataProvider from "../providers/DataProvider";
import {inject, observer} from "mobx-react";
import * as d3 from "d3";
import STORE from "store/index";
import {legendColor} from "d3-svg-legend";

@inject('store') @observer
class PredictionTab extends React.Component {
    constructor(props) {
        super(props);
        this.dataProvider = new DataProvider();
    }

    drawPredictionChart(props) {
        d3.select("#prediction-chart").select("svg").remove();

        const index = props.index;
        const traj = this.dataProvider.trajectoryOf(props.clickID);
        const real = traj.map((val, _) => val.real);
        const pred = traj.map((val, _) => val.pred);
        const width = (1 - 0.618) * window.innerWidth * 0.8;
        const height = 650 * 0.8;
        const margin = {left: 20, right: 20, up: 20, down: 20};
        const dotRadius = 5;

        const svg = d3.select("#prediction-chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        const zoomed = (e) => svg.attr("transform", e.transform);
        const zoom = d3.zoom().scaleExtent([0.8, 5]).on("zoom", zoomed);

        const xScale = d3.scaleLinear()
            .domain([Math.min(d3.min(real, d => d.x), d3.min(pred.flat(), d => d.x)), Math.max(d3.max(real, d => d.x), d3.max(pred.flat(), d => d.x))])
            .range([margin.left, width - margin.right]);

        const yScale = d3.scaleLinear()
            .domain([Math.min(d3.min(real, d => d.y), d3.min(pred.flat(), d => d.y)), Math.max(d3.max(real, d => d.y), d3.max(pred.flat(), d => d.y))])
            .range([height - margin.up, margin.down]);

        const densityData = d3.contourDensity()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y))
            .size([Math.floor(width), Math.floor(height)])
            .bandwidth(4)  // Adjust for desired smoothness
            (pred.flat());
        const maxDensity = d3.max(densityData, d => d.value);

        const colorScale = d3.scaleSequential(d3.interpolateBlues)
            .domain([0, maxDensity]);
        const colorLegend = legendColor()
            .scale(colorScale)
            .orient('horizontal')
            .shapeWidth(50)
            .title("Density of predicted future coordinates")
            .labelFormat(d3.format(".2f"));
        const trajColor = d3.scaleOrdinal()
            .domain(["Real trajectory", "Predicted trajectory"])
            .range(["#448EF7", "gray"]);

        const line = d3.line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y))
            .curve(d3.curveMonotoneX);

        const trajLegend = legendColor()
            .shape("path", d3.symbol().type(d3.symbolCircle).size(150)())
            .shapePadding(10)
            .scale(trajColor)

        svg.call(zoom);

        svg.selectAll("path")
            .data(densityData)
            .enter().append("path")
            .attr("fill", d => colorScale(d.value))
            .attr("d", d3.geoPath());

        svg.append("path")
            .datum(real)
            .attr("fill", "none")
            .attr("stroke", "#448EF7")
            .attr("stroke-width", 2)
            .attr("d", line);

        svg.selectAll(".dot")
            .data(traj)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", d => xScale(d.real.x))
            .attr("cy", d => yScale(d.real.y))
            .attr("r", d => parseInt(d.real.index) === parseInt(index) ? 10 : dotRadius)
            .attr("fill", "white")
            .attr("stroke", "#448EF7")
            .each(function (d, i) {
                d3.select(this)
                    .on("mouseover", function (event) {
                        svg.append("path")
                            .datum(pred[i])
                            .attr("fill", "none")
                            .attr("stroke", "gray")
                            .attr("stroke-width", 2)
                            .attr("id", "predicted-path")
                            .attr("d", line);

                        svg.selectAll(".pred-dot")
                            .data(pred[i].slice(1))
                            .enter().append("circle")
                            .attr("class", "pred-dot")
                            .attr("cx", d => xScale(d.x))
                            .attr("cy", d => yScale(d.y))
                            .attr("r", dotRadius)
                            .attr("fill", "white")
                            .attr("stroke", "gray")
                    })
                    .on("mouseout", function () {
                        svg.select("#predicted-path").remove();
                        svg.selectAll(".pred-dot").remove();
                    });
            });

        svg.append("g")
            .attr("transform", `translate(${margin.left}, ${height - margin.up - 60})`)
            .attr("class", "legend")
            .attr("id", "possibility-legend");

        svg.select("#possibility-legend").call(colorLegend);

        svg.append("g")
            .attr("transform", `translate(${width - margin.right - 150}, ${height - margin.up - 50})`)
            .attr("class", "legend")
            .attr("id", "trajectory-legend");

        svg.select("#trajectory-legend").call(trajLegend);

        document.querySelector('#trajectory-legend > g > g:nth-child(1) > path').style.stroke = '#448EF7';
        document.querySelector('#trajectory-legend > g > g:nth-child(1) > path').style.fill = 'none';
        document.querySelector('#trajectory-legend > g > g:nth-child(2) > path').style.stroke = 'gray';
        document.querySelector('#trajectory-legend > g > g:nth-child(2) > path').style.fill = 'none';
    }

    componentDidUpdate(_, __, ___) {
        this.drawPredictionChart(this.props);
    }

    componentDidMount() {
        this.drawPredictionChart(this.props);
    }

    render() {
        return (<div className={"pane"}>
            <div className='header'>Prediction Tab</div>
            <div style={{display: "flex", flexDirection: "column"}}>
                <div id="prediction-chart" className="line-chart-container"
                     style={{
                         height: 616,
                         width: (1 - 0.618) * window.innerWidth * 0.97,
                         display: "flex",
                         justifyContent: "center",
                         alignItems: "center",
                         border: STORE.selectedInfo.metric.startsWith("prediction") ? "dashed" : "none"
                     }}
                     onClick={() => {
                         STORE.selectMetric("prediction", STORE.clickID)
                     }}
                >
                </div>
            </div>
        </div>);
    }
}

export default PredictionTab;