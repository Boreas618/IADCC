import allData from "../constants/json/driving_record.json";
import * as d3 from "d3";
import treeMap from "../constants/tree_map";
import treeMapData from "../constants/tree_map";
import planningTrajectory from "../constants/planning_trajectory";
import predictedTrajectory from "../constants/prediction";
import {angleBasedSimilarity, dtw, euclideanDistance} from "utils/sequence_similarity";
import organizedData from '../constants/all_data';

export default class DataProvider {
    static instance = null;
    static planningSimilarity = [];

    constructor() {
        if (DataProvider.instance) {
            return DataProvider.instance;
        }
        DataProvider.instance = this;
        for (const i in planningTrajectory) {
            if(i==0){
                continue;
            } else {
                DataProvider.planningSimilarity.push(dtw(planningTrajectory[i-1], planningTrajectory[i]));
            }
        }
    }

    get length() {
        return allData.length;
    }

    get treeMap() {
        return (index) => treeMap[index];
    }

    get planning() {
        return (index) => planningTrajectory[index];
    }

    get frame() {
        return (index) => allData[index];
    }

    get objects() {
        return (index) => predictedTrajectory[index].object;
    }

    get decision() {
        return (index) => organizedData[index].obstacle;
    }

    get trajectoryOf() {
        return (id) => {
            const real = [];
            const predicted = [];
            let xStart = -1;
            let yStart = -1;
            for (const i in predictedTrajectory) {
                for (const j of predictedTrajectory[i].object) {
                    if (parseInt(j.id) === parseInt(id)) {
                        if (xStart === -1) {
                            xStart = j.positionX;
                            yStart = j.positionY;
                            real.push({
                                x: 0,
                                y: 0,
                                index: i,
                            });
                        } else {
                            real.push({
                                x: j.positionX - xStart,
                                y: j.positionY - yStart,
                                index: i,
                            });
                        }
                        predicted.push([]);
                        for (const k of j.predictedTrajectory) {
                            predicted[real.length - 1].push({
                                x: k.x - xStart,
                                y: k.y - yStart,
                                index: i,
                            })
                        }
                    }
                }
            }
            const traj = real.map((val, idx) => ({'real': val, 'pred': predicted[idx]}));
            return traj;
        };
    }

    get shapeOf() {
        return (id) => {
            const shapes = [];
            for (const i in predictedTrajectory) {
                for (const j of predictedTrajectory[i].object) {
                    if (parseInt(j.id) === parseInt(id)) {
                        let rawShape = j.polygonPoint;
                        let convertedShape = rawShape.map((e) => ({
                            'x': (e.x - rawShape[0].x) * 50,
                            'y': (e.y - rawShape[0].y) * 50
                        }));
                        shapes.push(convertedShape);
                    }
                }
            }
            return shapes;
        };
    }

    get allObject() {
        const allObject = [];
        for (const i of allData) {
            for (const j of i.object) {
                if (!allObject.find(item => item.id === j.id)) {
                    allObject.push({
                        id: j.id,
                        type: j.type,
                        heading: j.heading,
                        positionX: j.positionX,
                        positionY: j.positionY,
                    });
                }
            }
        }
        allObject.sort((a, b) => Number(a.id) - Number(b.id));
        return allObject;
    }

    get allGPS() {
        let allGPS = [];
        for (const i of allData) {
            allGPS.push({
                positionX: i.autoDrivingCar.positionX,
                positionY: i.autoDrivingCar.positionY,
            });
        }
        return allGPS
    }

    get allTypes() {
        let allTypes = [];
        for (const i of treeMapData) {
            for (const j of i.children) {
                if (allTypes.indexOf(j.name) === -1) {
                    allTypes.push(j.name);
                }
            }
        }
        return allTypes
    }

    get temporalData() {
        let temporal = [];
        let speedRange = d3.extent(allData, d => d['autoDrivingCar']['speed']);
        let accRange = d3.extent(allData, d => d['autoDrivingCar']['speedAcceleration']);
        let brakeRange = d3.extent(allData, d => d['autoDrivingCar']['brakePercentage']);
        let throttleRange = d3.extent(allData, d => d['autoDrivingCar']['throttlePercentage']);
        let steeringRange = d3.extent(allData, d => d['autoDrivingCar']['steeringPercentage']);
        let headingRange = d3.extent(allData, d => d['autoDrivingCar']['heading']);

        let normalize = (element, dataRange) => {
            if (element >= 0) {
                if (dataRange[0] >= 0) {
                    return (element - dataRange[0]) / (dataRange[1] - dataRange[0]);
                } else {
                    return element / dataRange[1];
                }
            } else {
                return -1 * element / dataRange[0];
            }
        }

        for (let e of allData) {
            temporal.push(
                {
                    'series': 'Velocity',
                    'ts': new Date(parseFloat(e['timestamp'])),
                    'val': normalize(e['autoDrivingCar']['speed'], speedRange),
                    'raw': e['autoDrivingCar']['speed'],
                    'index': e['sequenceNum']
                }
            );
            temporal.push(
                {
                    'series': 'Acceleration',
                    'ts': new Date(parseFloat(e['timestamp'])),
                    'val': normalize(e['autoDrivingCar']['speedAcceleration'], accRange),
                    'raw': e['autoDrivingCar']['speedAcceleration'],
                    'index': e['sequenceNum']
                }
            );
            temporal.push(
                {
                    'series': 'Brake',
                    'ts': new Date(parseFloat(e['timestamp'])),
                    'val': normalize(e['autoDrivingCar']['brakePercentage'], brakeRange),
                    'raw': e['autoDrivingCar']['brakePercentage'],
                    'index': e['sequenceNum']
                }
            );
            temporal.push(
                {
                    'series': 'Steering',
                    'ts': new Date(parseFloat(e['timestamp'])),
                    'val': normalize(e['autoDrivingCar']['steeringPercentage'], steeringRange),
                    'raw': e['autoDrivingCar']['steeringPercentage'],
                    'index': e['sequenceNum']
                }
            );
            temporal.push(
                {
                    'series': 'Heading',
                    'ts': new Date(parseFloat(e['timestamp'])),
                    'val': normalize(e['autoDrivingCar']['heading'], headingRange),
                    'raw': e['autoDrivingCar']['heading'],
                    'index': e['sequenceNum']
                }
            );
            temporal.push(
                {
                    'series': 'Throttle',
                    'ts': new Date(parseFloat(e['timestamp'])),
                    'val': normalize(e['autoDrivingCar']['throttlePercentage'], throttleRange),
                    'raw': e['autoDrivingCar']['throttlePercentage'],
                    'index': e['sequenceNum']
                }
            );
        }
        return temporal;
    }

    get differentiated() {
        let differentiated = {'acceleration': [], 'brake': [], 'steering': [], 'heading': [], 'throttle': []};
        for (const i in allData) {
            if (i == 0) {
                differentiated['acceleration'].push(0);
                differentiated['brake'].push(0);
                differentiated['steering'].push(0);
                differentiated['heading'].push(0);
                differentiated['throttle'].push(0);
            } else {
                differentiated['acceleration'].push(1000 * (allData[i]['autoDrivingCar']['speedAcceleration'] - allData[i - 1]['autoDrivingCar']['speedAcceleration']) / (allData[i]['timestamp'] - allData[i - 1]['timestamp']));
                differentiated['brake'].push(1000 * (allData[i]['autoDrivingCar']['brakePercentage'] - allData[i - 1]['autoDrivingCar']['brakePercentage']) / (allData[i]['timestamp'] - allData[i - 1]['timestamp']));
                differentiated['steering'].push(1000 * (allData[i]['autoDrivingCar']['steeringPercentage'] - allData[i - 1]['autoDrivingCar']['steeringPercentage']) / (allData[i]['timestamp'] - allData[i - 1]['timestamp']));
                differentiated['heading'].push(1000 * (allData[i]['autoDrivingCar']['heading'] - allData[i - 1]['autoDrivingCar']['heading']) / (allData[i]['timestamp'] - allData[i - 1]['timestamp']));
                differentiated['throttle'].push(1000 * (allData[i]['autoDrivingCar']['throttlePercentage'] - allData[i - 1]['autoDrivingCar']['throttlePercentage']) / (allData[i]['timestamp'] - allData[i - 1]['timestamp']));
            }
        }
        return differentiated;
    }

}