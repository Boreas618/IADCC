import React, {Component} from 'react';
import 'styles/dashboard.scss';
import DataFlow from 'components/DataFlow';
import {inject, observer} from "mobx-react";
import DataProvider from "../providers/DataProvider";

@inject('store') @observer
class Architecture extends Component {
    constructor(props) {
        super(props);
        this.dataProvider = new DataProvider();
    }

    onChangeClickID = (id) => {
        this.props.store.changeClickID(id);
    }

    render() {
        const index = this.props.store.currentFrameIndex;
        const clickID = this.props.store.clickID;
        const currentModule = this.props.store.currentModule;
        const frame = this.dataProvider.frame(index);
        const filteredTreeMapData = this.dataProvider.treeMap(index);
        const curPlanningTrajectory = this.dataProvider.planning(index);
        const prePlanningTrajectory = (index === 0) ? [] :this.dataProvider.planning(index-1);
        const allObject = this.dataProvider.allObject;
        const allGPS = this.dataProvider.allGPS;
        const allTypes = this.dataProvider.allTypes;

        const rawGpsDataCurrent = {
            heading: frame.autoDrivingCar.heading,
            positionX: frame.autoDrivingCar.positionX,
            positionY: frame.autoDrivingCar.positionY,
        };

        const speedAndAcceleration = {
            speed: frame.autoDrivingCar.speed,
            acceleration: frame.autoDrivingCar.speedAcceleration,
        };

        const controlInfo = {
            throttlePercentage: frame.autoDrivingCar.throttlePercentage,
            brakePercentage: frame.autoDrivingCar.brakePercentage,
            steeringPercentage: frame.autoDrivingCar.steeringPercentage,
            steeringAngle: frame.autoDrivingCar.steeringAngle,
        };

        const planningObstacle = this.dataProvider.decision(index);

        const currentObject = this.dataProvider.objects(index);

        const trafficSignal = frame.trafficSignal;

        return (
            <div className={"pane"}>
                <div className='header'>Decision-making Pipeline</div>
                <DataFlow
                    speedAndAcceleration={speedAndAcceleration}
                    filteredTreeMapData={filteredTreeMapData}
                    trafficSignal={trafficSignal}
                    currentObject={currentObject}
                    rawGps={rawGpsDataCurrent}
                    allTypes={allTypes}
                    planningObstacle={planningObstacle}
                    curPlanningTrajectory={curPlanningTrajectory}
                    prePlanningTrajectory={prePlanningTrajectory}
                    dataNumber={index}
                    allGPS={allGPS}
                    controlInfo={controlInfo}
                    changeClickID={this.onChangeClickID}
                    clickID={clickID}
                    currentModule={currentModule}
                />
            </div>
        );
    }
}

export default Architecture;