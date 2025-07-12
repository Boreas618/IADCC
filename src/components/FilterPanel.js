import React, {Component} from 'react';
import {Collapse, Divider, Input, InputNumber, List, Radio, Select, Statistic} from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import 'styles/object-view.scss';
import ObjectChartDrawer from 'utils/draw/drawObjectInformation';
import * as d3 from 'd3';
import STORE from "store/index";

const {Option} = Select;
const {Panel} = Collapse;

const RangeDivider = () => {
    return (
        <Input
            className="site-input-split"
            style={{
                width: 30,
                borderLeft: 0,
                borderRight: 0,
                pointerEvents: 'none',
            }}
            placeholder="~"
            disabled
        />
    );
}

const TypeSelector = (props) => {
    return (
        <div className='rowStyle'>
            <div className='tagText' style={{marginTop: '4px', float: 'left'}}>
                Type:
            </div>
            <Select defaultValue="ALL" style={{marginLeft: '160px', width: 120}}
                    onChange={props.onChangeType}
            >
                <Option value="ALL">all</Option>
                <Option value="VEHICLE">vehicle</Option>
                <Option value="PEDESTRIAN">pedestrian</Option>
                <Option value="BICYCLE">bicycle</Option>
                <Option value="UNKNOWN">unknown</Option>
            </Select>
        </div>
    );
}

const RangeSelector = (props) => {
    return (
        <div>
            <div className='rowStyle'>
                <div className='tagText' style={{marginTop: '4px', float: 'left'}}>
                    {props.attribute + ":"}
                </div>
                <div style={{marginLeft: '120px'}}>
                    <Input.Group compact>
                        <InputNumber min={props.rangeLowerBound} max={props.curUpperBound} value={props.curLowerBound}
                                     onChange={props.onChangeLowerBound}
                        />
                        <RangeDivider/>
                        <InputNumber min={props.curLowerBound} max={props.rangeUpperBound} value={props.curUpperBound}
                                     onChange={props.onChangeUpperBound}
                        />
                    </Input.Group>
                </div>
            </div>
        </div>

    );
}

const StackedSelector = (props) => {
    return (
        <div id={"stacked-selector"}>
            <RangeSelector
                attribute={"Heading"}
                rangeLowerBound={props.rangeObjectHeading[0]}
                rangeUpperBound={props.rangeObjectHeading[1]}
                curLowerBound={props.objectHeading[0]}
                curUpperBound={props.objectHeading[1]}
                onChangeLowerBound={props.onChangeObjectHeadingMin}
                onChangeUpperBound={props.onChangeObjectHeadingMax}
            />
            <RangeSelector
                attribute={"PositionX"}
                rangeLowerBound={props.rangeObjectPositionX[0]}
                rangeUpperBound={props.rangeObjectPositionX[1]}
                curLowerBound={props.objectPositionX[0]}
                curUpperBound={props.objectPositionX[1]}
                onChangeLowerBound={props.onChangeObjectPositionXMin}
                onChangeUpperBound={props.onChangeObjectPositionXMax}
            />
            <RangeSelector
                attribute={"PositionY"}
                rangeLowerBound={props.rangeObjectPositionY[0]}
                rangeUpperBound={props.rangeObjectPositionY[1]}
                curLowerBound={props.objectPositionY[0]}
                curUpperBound={props.objectPositionY[1]}
                onChangeLowerBound={props.onChangeObjectPositionYMin}
                onChangeUpperBound={props.onChangeObjectPositionYMax}
            />
            <RangeSelector
                attribute={"Importance"}
                rangeLowerBound={props.rangeObjectImportance[0]}
                rangeUpperBound={props.rangeObjectImportance[1]}
                curLowerBound={props.objectImportance[0]}
                curUpperBound={props.objectImportance[1]}
                onChangeLowerBound={props.onChangeObjectImportanceMin}
                onChangeUpperBound={props.onChangeObjectImportanceMax}
            />
        </div>
    );
}

const CandidateArea = (props) => {
    return (
        <div
            id="scrollableDiv"
            style={{
                marginTop: '20px',
                height: '400px',
                overflow: 'auto',
                padding: '0 16px',
            }}
        >
            <InfiniteScroll
                dataLength={props.filteredObject.length}
                endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                scrollableTarget="scrollableDiv"
            >
                <List
                    header={<div><Statistic title="ObjectFilter" value={props.filteredObject.length}
                                            suffix={'/ ' + props.curTimestampObjectNum}/></div>}
                    bordered
                    dataSource={props.filteredObjectAllInfo}
                    renderItem={item => (
                        <List.Item onClick={() => {
                            props.changeClickID(item.id);
                        }}>
                            <Collapse>
                                <Panel header={'id: ' + item.id} style={{width: '290px'}}>
                                    <p>{'type: ' + item.type.toLowerCase()}</p>
                                    <p>{'heading: ' + item.heading.toFixed(2)}</p>
                                    <p>{'△positionX: ' + item.positionX.toFixed(2)}</p>
                                    <p>{'△positionY: ' + item.positionY.toFixed(2)}</p>
                                    <p>{'importance: ' + item.importance.toFixed(2)}</p>
                                </Panel>
                            </Collapse>
                        </List.Item>
                    )}
                />
            </InfiniteScroll>
        </div>
    );
}

const ChartArea = (props) => {
    return (
        <div id={"object-chart-container"}>
            <div id="radio-div" style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                <Radio.Group value={props.chartType} onChange={props.handleChartTypeChange}
                             style={{marginLeft: 'auto', marginRight: 'auto'}}>
                    <Radio.Button value="importance">Importance</Radio.Button>
                    <Radio.Button value="heading">Heading</Radio.Button>
                    <Radio.Button value="positionX">ΔPositionX</Radio.Button>
                    <Radio.Button value="positionY">ΔPositionY</Radio.Button>
                </Radio.Group>
            </div>
            <div
                id="object-chart"
                style={{
                    marginTop: '20px',
                    height: 630,
                    width: (1 - 0.618) * window.innerWidth * 0.97,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: STORE.selectedInfo.metric.startsWith("perception") ? "dashed" : "none"
                }}
                onClick={()=>{STORE.selectMetric("perception-"+props.chartType+'-id', STORE.clickID)}}
            >
            </div>
        </div>
    );
}

class FilterPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartType: 'importance'
        };
        this.drawer = new ObjectChartDrawer();
    }

    drawObjectChart = (props) => {
        d3.select('#object-chart').select('svg').remove();
        d3.selectAll('#object-chart > canvas:nth-child(1)').remove();
        if (this.state.chartType != 'shape') {
            const svgElement = d3.select('#object-chart').append('svg').attr('width', 0.22 * window.innerWidth)
                .attr('height', 500);
            this.drawer.draw(this.state.chartType, svgElement, this.props.clickID, this.props.dataNumber);
        } else {
            this.drawer.renderShape(props.clickID);
        }
    }

    componentDidMount() {
        this.drawObjectChart(this.props);
    }

    componentDidUpdate() {
        this.drawObjectChart(this.props);
    }

    handleChartTypeChange = (e) => {
        this.setState({
            chartType: e.target.value
        });
    }

    render() {
        return (
            <div id='perception-container'
                 style={{
                     height: 610,
                     marginRight: '0px',
                     overflow: 'scroll',
                     display: 'flex',
                     flexDirection: 'row'
                 }}>
                <div id={"perception-tab-right"}>
                    <ChartArea
                        chartType={this.state.chartType}
                        handleChartTypeChange={this.handleChartTypeChange}
                    />
                </div>
            </div>
        );
    }
}

export default FilterPanel;