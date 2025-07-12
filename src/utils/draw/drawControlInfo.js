import 'styles/main-view.scss';

const drawControlInfo = (svg, x, y, rateWidth, rateHeight, props) => {

    // svg.append("rect")
    // .attr("class", "signRect")
    // .attr("x", x * rateWidth)
    // .attr("y", y * rateHeight)
    // .attr("rx", 10)
    // .attr("ry", 10)
    // .attr("width", 100 * rateWidth)
    // .attr("height", 130 * rateHeight);

    // svg.append("text")
    // .attr("class", "signText")
    // .attr("x", (x+18) * rateWidth)
    // .attr("y", (y+25) * rateHeight)
    // .text("Control");
    // svg.append("text")
    // .attr("class", "signText")
    // .attr("x", (x+31) * rateWidth)
    // .attr("y", (y+47) * rateHeight)
    // .text("Info");


    // svg.append("svg:image")
    // .attr("xlink:href", require('../data/Images/control.png'))
    // .attr("width", 50 * rateWidth)
    // .attr("x", (x+25) * rateWidth)
    // .attr("y", (y+60) * rateHeight);
    svg.append('rect')
        .attr('class', 'infoRect')
        .attr('id', 'm0')
        .attr('id', 'control-info-rect')
        .attr('x', x * rateWidth)
        .attr('y', y * rateHeight)
        .attr('rx', 10)
        .attr('ry', 10)
        .attr('width', 180 * rateWidth)
        .attr('height', 120 * rateHeight);

    svg.append('text')
        .attr('class', 'infoTextTitle')
        .attr('x', (x + 10) * rateWidth)
        .attr('y', (y + 25) * rateHeight)
        .text('Control Info');

    svg.append('text')
        .attr('class', 'infoText')
        .attr('x', (x + 10) * rateWidth)
        .attr('y', (y + 50) * rateHeight)
        .text('Steering: ' + props.controlInfo.steeringPercentage.toFixed(2) + '%');
    svg.append('text')
        .attr('class', 'infoText')
        .attr('x', (x + 10) * rateWidth)
        .attr('y', (y + 78) * rateHeight)
        .text('Brake: ' + props.controlInfo.brakePercentage.toFixed(2) + '%');
    svg.append('text')
        .attr('class', 'infoText')
        .attr('x', (x + 10) * rateWidth)
        .attr('y', (y + 106) * rateHeight)
        .text('Throttle: ' + props.controlInfo.throttlePercentage.toFixed(2) + '%');
};

export default drawControlInfo;