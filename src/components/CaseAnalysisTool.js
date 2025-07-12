import React from 'react';
import {inject, observer} from 'mobx-react';
import allData from '../constants/json/driving_record.json';
import drawHorizonChart from "utils/draw/drawHorizonChart";
import DataProvider from '../providers/DataProvider';
import {Content, Header} from "antd/es/layout/layout";
import MainView from "components/MainView";
import * as d3 from "d3";
import {Layout} from "antd";

@inject('store') @observer
export default class CaseAnalysisTool extends React.Component {
    constructor(props) {
        super(props);
        this.updateDimension = this.props.store.dimension.update.bind(this.props.store.dimension);
        this.showPlanningEva = true;
        this.state = {
            world_data: [],
            loaded: false,
        };
    }

    componentWillMount() {
        this.props.store.dimension.initialize();
        this.setState({
            world_data: allData
        });
    }

    componentDidMount() {
        window.onerror = function (message, source, lineno, colno, error) {
            console.error('There was an uncaught error:', error);
        };
    }

    render() {
        return (
            <Layout>
                <Header
                    id={"header"}
                    style={{height: 0.04 * window.innerHeight}}
                    onClick={(_) => {
                        d3.selectAll('#horizon-chart > svg').remove();
                        d3.selectAll('.label').remove();
                        d3.selectAll('#header').remove();
                    }}
                    onDoubleClick={() => {
                        drawHorizonChart(new DataProvider().temporalData())
                    }}>Case Analysis Tool for Autonomous Driving (单击这里启动演示模式)
                </Header>
                <Layout>
                    <Content>
                        <MainView style={{height: 0.95 * window.innerHeight}}/>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}