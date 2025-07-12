import allData from '../constants/all_data';
import * as d3 from 'd3';
const getDataRange = (dataNumber, choice) => {

    let result = [];
    if(choice === 'objectHeading') {
        let minResult = d3.min(allData[dataNumber].object, (d) => {
            return d.heading;
        });

        let maxResult = d3.max(allData[dataNumber].object, (d) => {
            return d.heading;
        });
        result.push(Math.floor(minResult), Math.ceil(maxResult));
    }
    else if(choice === 'objectPositionX') {
        let minResult = d3.min(allData[dataNumber].object, (d) => {
            return d.positionX - allData[dataNumber].autoDrivingCar.positionX;
        });

        let maxResult = d3.max(allData[dataNumber].object, (d) => {
            return d.positionX - allData[dataNumber].autoDrivingCar.positionX;
        });
        result.push(Math.floor(minResult), Math.ceil(maxResult));
    }
    else if(choice === 'objectPositionY') {
        let minResult = d3.min(allData[dataNumber].object, (d) => {
            return d.positionY - allData[dataNumber].autoDrivingCar.positionY;
        });

        let maxResult = d3.max(allData[dataNumber].object, (d) => {
            return d.positionY - allData[dataNumber].autoDrivingCar.positionY;
        });
        result.push(Math.floor(minResult), Math.ceil(maxResult));
    }
    else if(choice === 'objectImportance') {
        let minResult = d3.min(allData[dataNumber].object, (d) => {
            return d.importance;
        });

        let maxResult = d3.max(allData[dataNumber].object, (d) => {
            return d.importance;
        });
        result.push(Math.floor(minResult), Math.ceil(maxResult));
    }
    return result;
};

export default getDataRange;