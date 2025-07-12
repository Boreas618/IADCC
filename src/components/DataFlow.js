import React, {Component} from "react";
import * as d3 from 'd3';
import 'styles/main-view.scss';
import drawLine from '../utils/draw/drawLine';
import drawSpeed from '../utils/draw/drawSpeed';
import drawLocation from '../utils/draw/drawLocation';
import drawControlInfo from '../utils/draw/drawControlInfo';
import drawPredictedMap from '../utils/draw/DrawModule/drawPredictedMap';
import drawPerceptionMap from '../utils/draw/DrawModule/drawPerceptionMap';
import drawLocalizationMap from '../utils/draw/DrawModule/drawLocalizationMap';
import drawPlanningMap from "utils/draw/DrawModule/drawPlanningMap";

class DataFlow extends Component {
    constructor(props) {
        super(props);
    }

    drawArchitecture (props){
        d3.select('#flow')
            .select('svg')
            .remove();

        const rateWidth = 1;
        const rateHeight = 0.55 / 0.91;
        const svg = d3.select('#flow')
            .append('svg')
            .attr('width', 0.618 * window.innerWidth)
            .attr('height', 635)
            .style('margin-top', -25);

        //------------draw Localization------------
        svg.append('rect')
            .attr('class', 'signRect')
            .attr('id', 'm0')
            .attr('x', 50 * rateWidth)
            .attr('y', 100 * rateHeight)
            .attr('width', 380 * rateWidth)
            .attr('height', 380 * rateHeight)
            .attr('rx', 3)
            .attr('ry', 3);

        svg.append('rect')
            .attr('x', (50 + 5) * rateWidth)
            .attr('y', (100 + 5) * rateHeight)
            .attr('width', (380 - 10) * rateWidth)
            .attr('height', 25 * rateHeight)
            .style('fill', '#eee')
            .attr('rx', 3)
            .attr('ry', 3);

        svg.append('text')
            .attr('x', (50 + 5 + 10) * rateWidth)
            .attr('y', (100 + 5 + 18) * rateHeight)
            .text('Localization')
            .attr('class', 'moduleTextTitle');


        drawLocalizationMap(svg, 50 * rateWidth, 100 * rateHeight, 380 * rateWidth, 380 * rateHeight, props, rateWidth, rateHeight);

        //------------draw Speed------------
        drawSpeed(svg, 50+5, 140, props, rateWidth, rateHeight);

        //------------draw Location------------
        drawLocation(svg, 245, 140, props, rateWidth, rateHeight);

        //------------draw Perception------------
        svg.append('rect')
            .attr('class', 'signRect')
            .attr('id', 'm1')
            .attr('x', 50 * rateWidth)
            .attr('y', 600 * rateHeight)
            .attr('width', 380 * rateWidth)
            .attr('height', 380 * rateHeight)
            .attr('rx', 3)
            .attr('ry', 3);

        svg.append('rect')
            .attr('x', (50 + 5) * rateWidth)
            .attr('y', (600 + 5) * rateHeight)
            .attr('width', (380 - 10) * rateWidth)
            .attr('height', 25 * rateHeight)
            .style('fill', '#eee')
            .attr('rx', 3)
            .attr('ry', 3);

        svg.append('text')
            .attr('x', (50 + 5 + 10) * rateWidth)
            .attr('y', (600 + 5 + 18) * rateHeight)
            .text('Perception')
            .attr('class', 'moduleTextTitle');

        drawPerceptionMap(svg, 50 * rateWidth, 600 * rateHeight, 380 * rateWidth, 330 * rateHeight, props);

        drawLine(svg, 430, 290, 480, 540, rateWidth, rateHeight);
        drawLine(svg, 430, 790, 480, 540, rateWidth, rateHeight);

        //------------draw Prediction------------
        svg.append('rect')
            .attr('class', 'signRect')
            .attr('id', 'm2')
            .attr('x', 480 * rateWidth)
            .attr('y', 350 * rateHeight)
            .attr('width', 380 * rateWidth)
            .attr('height', 380 * rateHeight)
            .attr('rx', 3)
            .attr('ry', 3);

        svg.append('rect')
            .attr('x', (480 + 5) * rateWidth)
            .attr('y', (350 + 5) * rateHeight)
            .attr('width', (380 - 10) * rateWidth)
            .attr('height', 25 * rateHeight)
            .style('fill', '#eee')
            .attr('rx', 3)
            .attr('ry', 3);

        svg.append('text')
            .attr('x', (480 + 5 + 10) * rateWidth)
            .attr('y', (350 + 5 + 18) * rateHeight)
            .text('Prediction')
            .attr('class', 'moduleTextTitle');

        drawPredictedMap(svg, 480 * rateWidth, 350 * rateHeight, 380 * rateWidth, 380 * rateHeight, props, rateWidth, rateHeight);
        drawLine(svg, 860, 540, 910, 540, rateWidth, rateHeight);

        //------------draw Planning------------
        svg.append('rect')
            .attr('class', 'signRect')
            .attr('id', 'm3')
            .attr('x', 910 * rateWidth)
            .attr('y', 350 * rateHeight)
            .attr('width', 380 * rateWidth)
            .attr('height', 380 * rateHeight)
            .attr('rx', 3)
            .attr('ry', 3);

        svg.append('rect')
            .attr('x', (910 + 5) * rateWidth)
            .attr('y', (350 + 5) * rateHeight)
            .attr('width', (380 - 10) * rateWidth)
            .attr('height', 25 * rateHeight)
            .style('fill', '#eee')
            .attr('rx', 3)
            .attr('ry', 3);

        svg.append('text')
            .attr('x', (910 + 5 + 10) * rateWidth)
            .attr('y', (350 + 5 + 18) * rateHeight)
            .attr('class', 'moduleTextTitle')
            .text('Planning');

        drawPlanningMap(svg, 910*rateWidth, 350*rateHeight, 380* rateWidth, 380*rateHeight, props);
        drawLine(svg, 1290, 540, 1340, 540, rateWidth, rateHeight);


        //------------draw Control Info------------
        drawControlInfo(svg, 1340, 480, rateWidth, rateHeight, props);

        var defs = svg.append("defs");

        var filter = defs.append("filter")
            .attr("id", "halo")
            .attr("x", "-50%")
            .attr("y", "-50%")
            .attr("width", "200%")
            .attr("height", "200%");

        filter.append("feMorphology")
            .attr("operator", "dilate")
            .attr("radius", "5")
            .attr("in", "SourceAlpha")
            .attr("result", "expanded");

        filter.append("feGaussianBlur")
            .attr("in", "expanded")
            .attr("stdDeviation", "15") // Further increased for an even softer halo
            .attr("result", "blur");

        // Change halo color to #448EF7 and control its intensity
        filter.append("feColorMatrix")
            .attr("type", "matrix")
            .attr("values", "0 0 0 0 0.266  0 0 0 0 0.556  0 0 0 0 0.968  0 0 0 0.3 0")
            .attr("result", "colorBlur");

        var feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode").attr("in", "colorBlur");
        feMerge.append("feMergeNode").attr("in", "SourceGraphic");

        svg.selectAll("#m"+props.currentModule.toString())
            .attr("filter", "url(#halo)");
    };

    componentDidMount() {
        this.drawArchitecture(this.props);
    }

    componentDidUpdate() {
        this.drawArchitecture(this.props);
    }

    render() {
        return (
            <div id="data-flow-container" style={{display: "flex", justifyContent: "center", width:0.618 * window.innerWidth}}>
                <div id="flow" style={{display: "flex", justifyContent: "center"}}>
                </div>
            </div>
        );
    }
}

export default DataFlow;