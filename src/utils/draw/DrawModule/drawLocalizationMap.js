import { range } from 'd3';
import * as d3 from 'd3';

const drawLocalizationMap = (svg, divX, divY, width, height, props, rateWidth, rateHeight) => {

    const allGPS = props.allGPS;
    const dataNumber = props.dataNumber;
    const w = width;
    const h = height;

    let frontGPS = [];
    for(const i of range(dataNumber,Math.min(dataNumber+6, allGPS.length))) {
        frontGPS.push(allGPS[i]);
    }
    // console.log(frontGPS);

    const curveType = 'curveCardinal';

    const baseLocation = {
        positionX: w/2 +divX,
        positionY: 9*h/10 +divY,
    };

    svg.append('marker')
        .attr('id', 'local')
        .attr('markerUnits', 'strokeWidth')//设置为strokeWidth箭头会随着线的粗细发生变化
        .attr('markerUnits', 'userSpaceOnUse')
        .attr('viewBox', '-8 -5 10 10')//坐标系的区域
        .attr('refX', -12)//箭头坐标
        .attr('refY', 0)
        .attr('markerWidth', 12)//标识的大小
        .attr('markerHeight', 12)
        .attr('orient', 'auto')//绘制方向，可设定为：auto（自动确认方向）和 角度值
        // .attr("stroke", "#bebada")
        // .attr("stroke-width", 1)//箭头宽度
        .append('path')
        .attr('d', 'M-8,-5 L2,0 L-8,5 L-8,-5')//箭头的路径
        .attr('fill', 'red');//箭头颜色

    const line = d3
        .line()
        .x(d => 10*(d.positionX - frontGPS[0].positionX) * rateWidth + baseLocation.positionX)
        .y(d => -7*(d.positionY - frontGPS[0].positionY) * rateHeight + baseLocation.positionY)
        .curve(d3[curveType])
        .context(null);

    const lineLeft = d3
        .line()
        .x(d => 10*(d.positionX - frontGPS[0].positionX) * rateWidth + 0.9*baseLocation.positionX)
        .y(d => -7*(d.positionY - frontGPS[0].positionY) * rateHeight + baseLocation.positionY)
        .curve(d3[curveType])
        .context(null);
    
    const lineRight = d3
        .line()
        .x(d => 10*(d.positionX - frontGPS[0].positionX) * rateWidth + 1.1*baseLocation.positionX)
        .y(d => -7*(d.positionY - frontGPS[0].positionY) * rateHeight + baseLocation.positionY)
        .curve(d3[curveType])
        .context(null);
    
    svg.append('path')
        .attr('d', line(frontGPS))
        .attr('fill', 'none')
        .attr('stroke', 'grey')
        .attr('opacity', 0.5)
        .attr('marker-end','url(#local)');
    svg.append('path')
        .attr('d', lineLeft(frontGPS))
        .attr('fill', 'none')
        .attr('stroke', 'grey')
        .attr('stroke-width', '2px');
        // .attr('opacity', 0.5);
    svg.append('path')
        .attr('d', lineRight(frontGPS))
        .attr('fill', 'none')
        .attr('stroke', 'grey')
        .attr('stroke-width', '2px');
        // .attr('opacity', 0.5);
    
    svg.append('g')
        .selectAll('circle')
        .data(frontGPS)
        .join('circle')
        .attr('cx', d => 10*(d.positionX - frontGPS[0].positionX) * rateWidth + baseLocation.positionX)
        .attr('cy', d => -7*(d.positionY - frontGPS[0].positionY) * rateHeight + baseLocation.positionY)
        .attr('r', 5 * rateWidth)
        .attr('fill', (d, i) => {
            if(i === 0) {return '#9c755f';}
            else {return '#cefbff';}
        })
        .attr('stroke', 'grey');
        // .attr('opacity', 0.9)

    // console.log(allGPS);
};

export default drawLocalizationMap;