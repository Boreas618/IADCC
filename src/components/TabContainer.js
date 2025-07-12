import ControlTab from "components/ControlTab";
import React from "react";
import {inject, observer} from "mobx-react";
import LocalizationTab from "components/LocalizationTab";
import PerceptionTab from "components/PerceptionTab";
import PredictionTab from "components/PredictionTab";
import PlanningTab from "components/PlanningTab";

@inject('store') @observer
class TabContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    condRender(module) {
        if (module === 0) {
            return <LocalizationTab index={this.props.store.currentFrameIndex} clickID={this.props.store.clickID} differentiated={this.props.store.differentiated}/>
        }
        if (module === 1) {
            return <PerceptionTab index={this.props.store.currentFrameIndex} clickID={this.props.store.clickID}/>
        }
        if (module === 2) {
            return <PredictionTab index={this.props.store.currentFrameIndex} clickID={this.props.store.clickID}/>
        }
        if (module === 3) {
            return <PlanningTab index={this.props.store.currentFrameIndex} />
        }
        if (module === 4) {
            return <ControlTab index={this.props.store.currentFrameIndex} differentiated={this.props.store.differentiated} />
        }
        return <LocalizationTab/>
    }

    render() {
        const currentModule = this.props.store.currentModule;
        return (
            <div>
                {this.condRender(currentModule)}
            </div>
        );
    }
}

export default TabContainer;