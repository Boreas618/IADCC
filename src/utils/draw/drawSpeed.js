import 'styles/main-view.scss';

const drawSpeed = (svg, x, y, props, rateWidth, rateHeight) => {
    svg.append('rect')
    .attr('class', 'infoRect')
    .attr('id','speed-rect')
    .attr('x', x * rateWidth)
    .attr('y', y * rateHeight)
    .attr('rx', 10)
    .attr('ry', 10)
    .attr('width', 185 * rateWidth)
    .attr('height', 120 * rateHeight);

    svg.append('text')
    .attr('class', 'infoTextTitle')
    .attr('x', (x+10) * rateWidth)
    .attr('y', (y+25) * rateHeight)
    .text('Speed');

    svg.append('text')
    .attr('class', 'infoText')
    .attr('x', (x+10) * rateWidth)
    .attr('y', (y+55) * rateHeight)
    .attr('stroke', props.speedAndAcceleration.acceleration > 0
        ? 'red'
        :(props.speedAndAcceleration.acceleration == 0
            ? 'black'
            : 'green'))
    .text('Velocity: '+props.speedAndAcceleration.speed.toFixed(2));

    svg.append('text')
    .attr('class', 'infoText')
    .attr('x', (x+10) * rateWidth)
    .attr('y', (y+90) * rateHeight)
    .text('Acceleration: '+props.speedAndAcceleration.acceleration.toFixed(2));
};

export default drawSpeed;