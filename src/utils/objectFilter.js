import allData from '../constants/all_data';

const objectFilter = (dataNumber, choice, req) => {
    let result = [];
    if(choice === 'type') {
        if(req === 'ALL') {
            allData[dataNumber].object.forEach((item) => {
                result.push(item.id);
            });
        }
        else {
            allData[dataNumber].object.forEach((item) => {
                if(item.type === req) {result.push(item.id);}
            });
        }
    }
    else if(choice === 'objectHeading') {
        allData[dataNumber].object.forEach((item) => {
            if(item.heading >= req[0] && item.heading <= req[1]) {result.push(item.id);}
        });
    }
    else if(choice === 'objectPositionX') {
        allData[dataNumber].object.forEach((item) => {
            if(item.positionX-allData[dataNumber].autoDrivingCar.positionX >= req[0] && item.positionX-allData[dataNumber].autoDrivingCar.positionX <= req[1]) {result.push(item.id);}
        });
    }
    else if(choice === 'objectPositionY') {
        allData[dataNumber].object.forEach((item) => {
            if(item.positionY-allData[dataNumber].autoDrivingCar.positionY >= req[0] && item.positionY-allData[dataNumber].autoDrivingCar.positionY <= req[1]) {result.push(item.id);}
        });
    }
    else if(choice === 'objectImportance') {
        allData[dataNumber].object.forEach((item) => {
            if(item.importance >= req[0] && item.importance <= req[1]) {result.push(item.id);}
        });
    }
    // console.log(result);
    return result;
};

export default objectFilter;