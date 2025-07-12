import React, {Component} from 'react';
import DataProvider from '../providers/DataProvider';
import drawHorizonChart from 'utils/draw/drawHorizonChart';

let AttributeRow = (props)=>{
    return(
        <div className='row'>
            <div className='tagText' style={{float: 'left'}}>
                {props.attribute}
            </div>
        </div>
    );
}

let Attributes =  () => {
    return(
        <div id='filter'>
            <AttributeRow attribute="Acceleration" />
            <AttributeRow attribute="Brake" />
            <AttributeRow attribute="Heading" />
            <AttributeRow attribute="Steering" />
            <AttributeRow attribute="Throttle" />
            <AttributeRow attribute="Velocity" />
        </div>
    );
}

class ControlPanel extends Component {
    constructor(props) {
        super(props);
    }


    componentDidMount() {
        const dataProvider = new DataProvider();
        const temporalData = dataProvider.temporalData;
        drawHorizonChart(temporalData);
    }

    render() {
        return (
            <div id='control-panel' className='pane' style={{height: "fit-content"}}>
                <div className='header'>Metric View</div>
                <div id="control-panel-content">
                    <Attributes />
                    <div id='horizon-chart'>
                    </div>
                </div>
            </div>
        );
    }
}

export default ControlPanel;