import React from 'react';
import {inject, observer} from 'mobx-react';
import RENDERER from 'renderer';
import STORE from 'store';

@inject('store') @observer
export default class SceneView extends React.Component {
    componentDidMount() {
        RENDERER.initialize('canvas', this.props.width, this.props.height,
            this.props.store.options, this.props.store.cameraData);
    }

    componentWillUpdate(nextProps) {
        if (nextProps.width !== this.props.width
            || nextProps.height !== this.props.height) {
            RENDERER.updateDimension(nextProps.width, nextProps.height);
        }
    }

    render() {
        const {
            dimension, options,
        } = this.props.store;


        const shouldDisplayCameraImage = options.showCameraView && !options.showRouteEditingBar;
        const leftPosition = dimension.shouldDisplayOnRight ? '50%' : '0%';

        return (
            <React.Fragment>
                {shouldDisplayCameraImage && <img id="camera-image"/>}
                <div id='scene-view' className='pane' style={{height: "fit-content"}}>
                    <div className='header'>Environment View</div>
                    <div
                        id="canvas"
                        className="dreamview-canvas"
                        style={{left: leftPosition}}
                        onMouseMove={(event) => {
                            const geo = RENDERER.getGeolocation(event);
                            STORE.setGeolocation(geo);
                        }}
                    >
                    </div>
                </div>
            </React.Fragment>
        );
    }
}