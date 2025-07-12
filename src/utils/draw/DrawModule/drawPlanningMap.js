import * as d3 from 'd3';
import 'styles/planning-map.scss';

const drawPlanningMap = (svg, divX, divY, width, height, props) => {
    const w = width;
    const h = height;
    const data = props.allObject;
    const curData = props.currentObject;
    const allTypes = props.allTypes;
    const planningObstacle = props.planningObstacle;
    const clickID = props.clickID;
    const rawGps = props.rawGps;
    const curveType = 'curveLinear';
    const IDLength = 5;

    const searchType = value => {
        if(curData.find(item => item.id === value)){
            return curData.find(item => item.id === value).type;
        }
        else if(data.find(item => item.id === value)){
            return data.find(item => item.id === value).type;
        }
        else {return 'UNKNOWN';}
    };

    //pre
    // 1 | 2
    // - 0 -
    // 3 | 4
    //cur
    // 4 | 1
    // - 0 -
    // 3 | 2
    const judgeMark = (x1, y1, x_base, y_base) => {
        if(x1 <= x_base && y1 >= y_base) {return 4;}
        else if(x1 >= x_base && y1 >= y_base) {return 1;}
        else if(x1 <= x_base && y1 <= y_base) {return 3;}
        else if(x1 >= x_base && y1 <= y_base) {return 2;}
    };

    let obstacleInfo = planningObstacle;
    let maxDistance = 1;
    let markCount = [0,0,0,0,0]; // 0 1 2 3 4
    for(const i of obstacleInfo) {
        if(curData.find(item => item.id === i.id.slice(0, IDLength))) {
            let tempPositionX = Number(curData.find(item => item.id === i.id.slice(0, IDLength)).positionX);
            let tempPositionY = Number(curData.find(item => item.id === i.id.slice(0, IDLength)).positionY);
            let tempDistance = Math.sqrt((tempPositionX-rawGps.positionX)**2 + (tempPositionY-rawGps.positionY)**2);
            i.distance = tempDistance.toFixed(2);
            i.mark = judgeMark(tempPositionX, tempPositionY, rawGps.positionX, rawGps.positionY);
            i.markNumber = ++markCount[i.mark];
        }
        else if(data.find(item => item.id === i.id.slice(0, IDLength))) {
            let tempPositionX = Number(data.find(item => item.id === i.id.slice(0, IDLength)).positionX);
            let tempPositionY = Number(data.find(item => item.id === i.id.slice(0, IDLength)).positionY);
            let tempDistance = Math.sqrt((tempPositionX-rawGps.positionX)**2 + (tempPositionY-rawGps.positionY)**2);
            i.distance = tempDistance.toFixed(2);
            i.mark = judgeMark(tempPositionX, tempPositionY, rawGps.positionX, rawGps.positionY);
            i.markNumber = ++markCount[i.mark];
        }
        else {
            i.distance = -1;
            i.mark = 0;
            i.markNumber = ++markCount[i.mark];
        }
        if(Number(i.distance) > Number(maxDistance)) {
            maxDistance = i.distance;
        }
    }

    // console.log(obstacleInfo);
    // console.log(markCount);

    // console.log(obstacleInfo);

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
        .html('id: '+d.id+'<br/>decision: '+d.decision)
        .attr('class', 'active');
    };
    const moveTooltip = function(e, d) {
        tooltip
        .style('left', d3.pointer(e, d3.selectAll('mainView'))[0] + 'px')
        .style('top', d3.pointer(e, d3.selectAll('mainView'))[1] + 'px')
        .attr('class', 'active');
    };
    const hideTooltip = function(e, d) {
        tooltip
        .transition()
        .duration(200)
        .style('opacity', 0)
        .attr('class', 'notActive');
    };
    const clickCircle = function(e, d) {
        if(d.id.length >= IDLength && d.id.slice(0, IDLength) === clickID) {
            props.changeClickID(-1);
            hideTooltip(e, d);
        }
        else if(d.id.length > IDLength && !isNaN(d.id.slice(0, IDLength))) {
            props.changeClickID(d.id.slice(0, IDLength));
            // hideTooltip(e, d);
            showTooltip(e, d);
        }
        else {
            props.changeClickID(d.id);
            // hideTooltip(e, d);
            showTooltip(e, d);
        }
    }; 

    const marker =
        svg.append('marker')
            .attr('id', 'planning')
            .attr('markerUnits', 'strokeWidth')//设置为strokeWidth箭头会随着线的粗细发生变化
            .attr('markerUnits', 'userSpaceOnUse')
            .attr('viewBox', '-8 -5 10 10')//坐标系的区域
            .attr('refX', 10)//箭头坐标
            .attr('refY', 0)
            .attr('markerWidth', 6)//标识的大小
            .attr('markerHeight', 12)
            .attr('orient', 'auto')//绘制方向，可设定为：auto（自动确认方向）和 角度值
            // .attr("stroke", "#bebada")
            // .attr("stroke-width", 1)//箭头宽度
            .append('path')
            .attr('d', 'M-8,-5 L2,0 L-8,5 L-8,-5')//箭头的路径
            .attr('fill', 'black');//箭头颜色


    const line = d3.line()
        .x(d => d.x)
        .y(d => d.y)
        .curve(d3[curveType])
        .context(null);

        // Math.PI/2*(d.mark-1 + d.markNumber/(markCount[d.mark]+1))
    svg.append('g')
        .selectAll('path')
        .data(obstacleInfo)
        .enter()
        .append('path')
        .attr('d', (d, i) => {
            if(d.distance > 0) {
                return line([{x: w/2 +divX, y: h/2 +divY +20}, 
                {
                    x: w/2 + Math.sin(Math.PI/2*(d.mark-1 + d.markNumber/(markCount[d.mark]+1)))*(h/2-h/8)*d.distance/maxDistance +divX,
                    y: h/2 - (h/2-h/8)*d.distance/maxDistance + (1-Math.cos(Math.PI/2*(d.mark-1 + d.markNumber/(markCount[d.mark]+1))))*(h/2-h/8)*d.distance/maxDistance +divY +20
                }]);
            }
            else {
                return line([{x: w/2 +divX, y: h/2 +divY +20}, 
                {
                    x: w/2 +divX,
                    y: h/8 + (h/2-h/8)*(d.markNumber-1)/markCount[d.mark] +divY +20
                }]);
            }
            
        })
        .attr('fill', 'none')
        .attr('stroke', 'grey')
        .attr('opacity', 0.5)
        .attr('marker-end','url(#planning)');

    svg.append('circle')
        .attr('cx', w/2 +divX)
        .attr('cy', h/2 +divY +20)
        .attr('r', 8)
        .attr('stroke', 'grey')
        .attr('stroke-width', '8px')
        .attr('stroke-opacity', 0.5)
        .attr('opacity', 1)
        .attr('fill', '#9c755f');

        // console.log(h/2-h/8);
    svg.append('g')
        .selectAll('circle')
        .data(obstacleInfo)
        .join('circle')
        .attr('class', 'circle')
        .attr('cx', (d, i) => {
            if(d.distance > 0) {
                return w/2 + Math.sin(Math.PI/2*(d.mark-1 + d.markNumber/(markCount[d.mark]+1)))*(h/2-h/8)*d.distance/maxDistance +divX;
            }
            else {return w/2 +divX;}
        })
        .attr('cy', (d, i) => {
            if(d.distance > 0) {
                return h/2 - (h/2-h/8)*d.distance/maxDistance + (1-Math.cos(Math.PI/2*(d.mark-1 + d.markNumber/(markCount[d.mark]+1))))*(h/2-h/8)*d.distance/maxDistance +divY +20;
            }
            else {return h/8 + (h/2-h/8)*(d.markNumber-1)/markCount[d.mark] +divY +20;}
        })
        .attr('r', 5)
        .attr('fill', d => {
            if(d.id === 'DEST') {
                // return "#b3de69";
                return '#4CAF50';
            }
            else if(d.id === 'SL_2231') {
                return 'red';
            }
            else if(d.id.length >=IDLength) {
                return colorScale(searchType(d.id.slice(0, IDLength)));
            }
            else {return 'grey';}
        })
        .attr('stroke', d => {
            if(d.id.length >=IDLength && d.id.slice(0, IDLength) === clickID) {
                return 'black';
            }
            else if(d.id === 'SL_2231') {
                return '#fff686';
            }
            else {
                return '#eee';
            }
        })
        .attr('stroke-opacity', d => {
            if(d.id === 'SL_2231') {return 0.7;}
            else {return 1;}
        })
        .attr('stroke-width', d => {
            if(d.id === 'SL_2231') {return '10px';}
            else {return '1px';}
        })
        .attr('opacity', 1)
        .on('mouseover', (e, d) => showTooltip(e, d))
        .on('mousemove', (e, d) => moveTooltip(e, d))
        .on('mouseleave', (e, d) => hideTooltip(e, d))
        .on('click', (e, d) => {
            d3.select('.active').remove();
            clickCircle(e, d);
        });
};

export default drawPlanningMap;