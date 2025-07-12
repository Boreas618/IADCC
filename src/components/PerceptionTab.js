import React from 'react';
import DataProvider from "../providers/DataProvider";
import {inject, observer} from "mobx-react";
import FilterPanel from "./FilterPanel";
import getDataRange from "utils/getDataRange";
import objectFilter from "utils/objectFilter";
import allData from "../constants/all_data";

@inject('store') @observer
class PerceptionTab extends React.Component {
    constructor(props) {
        super(props);
        this.dataProvider = new DataProvider();
        this.state = {
            index: 0,
            clickID: -1,
            timestampLoc: -1,
            chartSign: 'objectType',
            type: 'ALL',
            objectHeading: getDataRange(0, 'objectHeading'),
            objectPositionX: getDataRange(0, 'objectPositionX'),
            objectPositionY: getDataRange(0, 'objectPositionY'),
            objectImportance: getDataRange(0, 'objectImportance'),
            rangeObjectHeading: getDataRange(0, 'objectHeading'),
            rangeObjectPositionX: getDataRange(0, 'objectPositionX'),
            rangeObjectPositionY: getDataRange(0, 'objectPositionY'),
            rangeObjectImportance: getDataRange(0, 'objectImportance'),
        };
    }

    onChangeType = (e) => {
        this.setState({
            type: e,
        });
    };

    onChangeObjectHeadingMin = (e) => {
        let valueTemp = this.state.objectHeading;
        valueTemp[0] = e;
        this.setState({
            objectHeading: valueTemp,
        });
    };

    onChangeObjectHeadingMax = (e) => {
        let valueTemp = this.state.objectHeading;
        valueTemp[1] = e;
        this.setState({
            objectHeading: valueTemp,
        });
    };

    onChangeObjectPositionXMin = (e) => {
        let valueTemp = this.state.objectPositionX;
        valueTemp[0] = e;
        this.setState({
            objectPositionX: valueTemp,
        });
    };

    onChangeObjectPositionXMax = (e) => {
        let valueTemp = this.state.objectPositionX;
        valueTemp[1] = e;
        this.setState({
            objectPositionX: valueTemp,
        });
    };

    onChangeObjectPositionYMin = (e) => {
        let valueTemp = this.state.objectPositionY;
        valueTemp[0] = e;
        this.setState({
            objectPositionY: valueTemp,
        });
    };

    onChangeObjectPositionYMax = (e) => {
        let valueTemp = this.state.objectPositionY;
        valueTemp[1] = e;
        this.setState({
            objectPositionY: valueTemp,
        });
    };

    onChangeObjectImportanceMin = (e) => {
        let valueTemp = this.state.objectImportance;
        valueTemp[0] = e;
        this.setState({
            objectImportance: valueTemp,
        });
    };

    onChangeObjectImportanceMax = (e) => {
        let valueTemp = this.state.objectImportance;
        valueTemp[1] = e;
        this.setState({
            objectImportance: valueTemp,
        });
    };

    onChangeClickID = (id) => {
        this.props.store.changeClickID(id);
    }

    render() {
        const index = this.props.index;
        const clickID = this.props.clickID;
        const {type, objectHeading, objectPositionX, objectPositionY, objectImportance} = this.state;
        const {rangeObjectHeading, rangeObjectPositionX, rangeObjectPositionY, rangeObjectImportance} = this.state;
        let filteredObject1 = objectFilter(index, 'type', type);
        let filteredObject2 = objectFilter(index, 'objectHeading', objectHeading);
        let filteredObject3 = objectFilter(index, 'objectPositionX', objectPositionX);
        let filteredObject4 = objectFilter(index, 'objectPositionY', objectPositionY);
        let filteredObject5 = objectFilter(index, 'objectImportance', objectImportance);

        let filteredObject = [];
        for (const i of filteredObject1) {
            if (filteredObject2.includes(i) && filteredObject3.includes(i)
                && filteredObject4.includes(i) && filteredObject5.includes(i)) {
                filteredObject.push(i);
            }
        }

        let filteredObjectAllInfo = [];
        for (const i of filteredObject) {
            allData[index].object.forEach(item => {
                if (item.id === i) {
                    let tempItem = {
                        id: item.id,
                        type: item.type,
                        heading: item.heading,
                        positionX: item.positionX - allData[index].autoDrivingCar.positionX,
                        positionY: item.positionY - allData[index].autoDrivingCar.positionY,
                        importance: item.importance,
                    };
                    filteredObjectAllInfo.push(tempItem);
                }
            });
        }

        const curTimestampObjectNum = allData[index].object.length;

        return (
            <div className={"pane"}>
                <div className='header'>Perception Tab</div>
                <div style={{display: "flex", flexDirection: "column"}}>
                    <FilterPanel
                        onChangeType={this.onChangeType}
                        onChangeObjectHeadingMax={this.onChangeObjectHeadingMax}
                        onChangeObjectHeadingMin={this.onChangeObjectHeadingMin}
                        onChangeObjectPositionXMax={this.onChangeObjectPositionXMax}
                        onChangeObjectPositionXMin={this.onChangeObjectPositionXMin}
                        onChangeObjectPositionYMax={this.onChangeObjectPositionYMax}
                        onChangeObjectPositionYMin={this.onChangeObjectPositionYMin}
                        onChangeObjectImportanceMax={this.onChangeObjectImportanceMax}
                        onChangeObjectImportanceMin={this.onChangeObjectImportanceMin}
                        objectHeading={objectHeading}
                        objectPositionX={objectPositionX} objectPositionY={objectPositionY}
                        objectImportance={objectImportance}
                        dataNumber={index}
                        filteredObject={filteredObject} filteredObjectAllInfo={filteredObjectAllInfo}
                        changeClickID={this.onChangeClickID}
                        curTimestampObjectNum={curTimestampObjectNum}
                        clickID={clickID}
                        rangeObjectHeading={rangeObjectHeading}
                        rangeObjectPositionX={rangeObjectPositionX}
                        rangeObjectPositionY={rangeObjectPositionY}
                        rangeObjectImportance={rangeObjectImportance}
                    />
                </div>
            </div>
        );
    }
}

export default PerceptionTab;