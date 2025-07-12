import 'styles/main-view.scss';

const drawLocation = (svg, x, y, props, rateWidth, rateHeight) => {
    svg.append('rect')
    .attr('class', 'infoRect')
    .attr('id','location-rect')
    .attr('x', x * rateWidth)
    .attr('y', y * rateHeight)
    .attr('rx', 10)
    .attr('ry', 10)
    .attr('width', 180 * rateWidth)
    .attr('height', 120 * rateHeight);

    svg.append('text')
    .attr('class', 'infoTextTitle')
    .attr('x', (x+10) * rateWidth)
    .attr('y', (y+25) * rateHeight)
    .text('Location');

    svg.append('text')
    .attr('class', 'infoText')
    .attr('x', (x+10) * rateWidth)
    .attr('y', (y+50) * rateHeight)
    .text('Heading: '+props.rawGps.heading.toFixed(2));

    svg.append('text')
    .attr('class', 'infoText')
    .attr('x', (x+10) * rateWidth)
    .attr('y', (y+78) * rateHeight)
    .text('PositionX: '+props.rawGps.positionX.toFixed(2));

    svg.append('text')
    .attr('class', 'infoText')
    .attr('x', (x+10) * rateWidth)
    .attr('y', (y+106)*rateHeight)
    .text('PositionY: '+props.rawGps.positionY.toFixed(2));
};

export default drawLocation;