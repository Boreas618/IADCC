import * as d3 from 'd3';
import allData from '../../../constants/all_data';
import 'styles/predicted-map.scss';

const drawPredictedMap = (svg, divX, divY, width, height, props, rateWidth, rateHeight) => {
    const globalData = allData[props.dataNumber].object;

    const positionX = allData[props.dataNumber]['autoDrivingCar']['positionX'];
    const positionY = allData[props.dataNumber]['autoDrivingCar']['positionY'];

    const xNegativeDomain = d3.min(globalData, d => d3.min(d.polygonPoint, dd => dd['x'])) - positionX;
    const xPositiveDomain = d3.max(globalData, d => d3.max(d.polygonPoint, dd => dd['x'])) - positionX;

    const yNegativeDomain = d3.min(globalData, d => d3.min(d.polygonPoint, dd => dd['y'])) - positionY;
    const yPositiveDomain = d3.max(globalData, d => d3.max(d.polygonPoint, dd => dd['y'])) - positionY;

    const absouluteXRange = (xNegativeDomain >= 0 ? xNegativeDomain : -1 * xNegativeDomain) > xPositiveDomain ? (xNegativeDomain >= 0 ? xNegativeDomain : -1 * xNegativeDomain) : xPositiveDomain;
    const absouluteYRange = (yNegativeDomain >= 0 ? yNegativeDomain : -1 * yNegativeDomain) > yPositiveDomain ? (yNegativeDomain >= 0 ? yNegativeDomain : -1 * yNegativeDomain) : yPositiveDomain;

    const xScale = d3.scaleLinear()
        .domain([-1*absouluteXRange, absouluteXRange])
        .range([divX + width * 0.1, divX + width * 0.9]);

    const yScale = d3.scaleLinear()
        .domain([-1*absouluteYRange, absouluteYRange])
        .range([divY + height * 0.9, divY + height * 0.1]);
    const data = props.currentObject;
    const gps = props.rawGps;
    const allTypes = props.allTypes;
    const w = width;
    const h = height;
    let curID = props.clickID;

    const carWidth = 21/2 * rateWidth;
    const carHeight = 49/2 * rateHeight;

    const curveType = 'curveCardinal';
    
    const colorScale = d3.scaleOrdinal()
        .domain(allTypes)   //use allTypes to ensure the same legend in all timestamps
        .range(d3.schemePastel1);  

    const tooltip = d3.select('#flow')
        .append('div')
        .style('opacity', 0)
        .attr('id', 'tooltip')
        .style('background-color', 'black')
        .style('border-radius', '5px')
        .style('padding', '10px')
        .style('color', 'white');  
      
    const showTooltip = function(e, d) {
        tooltip
            .transition()
            .duration(100);
        tooltip
            .style('left', d3.pointer(e,d3.selectAll('mainView'))[0] + 'px')
            .style('top', d3.pointer(e,d3.selectAll('mainView'))[1] + 'px')
            .style('opacity', 1)
            .text('id: '+d.id)
            .attr('class', 'active');
    };

    const moveTooltip = function(e, d) {
        tooltip
            .style('left', d3.pointer(e,d3.selectAll('mainView'))[0] + 'px')
            .style('top', d3.pointer(e,d3.selectAll('mainView'))[1] + 'px')
            .attr('class', 'active');
    };

    const hideTooltip = function(e, d) {
        tooltip
            .transition()
            .duration(200)
            .style('opacity', 0)
            .attr('class', 'notActive');
    };

    const clickRect = function(e, d) {
        if(curID === d.id) {
            props.changeClickID(-1);
            hideTooltip(e, d);
        } else {
            props.changeClickID(d.id);
            showTooltip(e, d);
        }
    };

    // add the AD car rect
    svg.append('rect')
        .attr('x', xScale(0))
        .attr('y', yScale(0))
        .attr('rx', 3)
        .attr('ry', 3)
        .attr('width', carWidth)
        .attr('height', carHeight)
        .attr('fill', '#9c755f');

    for(const i of data) {
        //the relative position of the detected object
        let distanceX = i.positionX - gps.positionX;
        let distanceY = i.positionY - gps.positionY;

        // add the object rect
        svg.append('rect')
        .attr('class', 'rect')
        .attr('x', xScale(distanceX))
        .attr('y', yScale(distanceY))
        .attr('rx', 2)
        .attr('ry', 2)
        .attr('width', carWidth)
        .attr('height', carHeight)
        .attr('fill', colorScale(i.type))
        .on('mouseover', e => showTooltip(e, i))
        .on('mousemove', e => moveTooltip(e, i))
        .on('mouseout', e => hideTooltip(e, i))
        .on('click', e => {
            d3.select('.active').remove();
            clickRect(e, i);
        })
        .attr('stroke', d => {
            if(i.id === props.clickID) {
                return 'black';
            } else {
                return '#eee';
            }
        })
        .attr('stroke-width', '1px');

        // add object dot to predicted trajectory
        let addFirstDot = i.predictedTrajectory;
        console.log(i);
        addFirstDot.unshift({x: i.positionX, y: i.positionY});

        // draw predicted trajectory
        const line = d3
        .line()
        .x(d => xScale(d.x - gps.positionX)+0.5*carWidth)
        .y(d => yScale(d.y - gps.positionY)+0.5*carHeight)
        .curve(d3[curveType])
        .context(null);

        svg.append('path')
            .attr('d', line(addFirstDot))
            .attr('fill', 'none')
            .attr('stroke', 'grey')
            .attr('opacity', 0.5);
        
        svg.append('g')
            .selectAll('circle')
            .data(addFirstDot)
            .join('circle')
            .attr('cx', d => xScale(d.x - gps.positionX)+0.5*carWidth)
            .attr('cy', d => yScale(d.y - gps.positionY)+0.5*carHeight)
            .attr('r', 3 * rateWidth)
            .attr('fill', 'white')
            .attr('stroke', 'grey')
            .attr('opacity', 0.8);
    }

};

export default drawPredictedMap;