import * as ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'mobx-react';

import './styles/main.scss';
import './styles/antd-reset.scss';
import './styles/a.css';

import STORE from 'store';
import CaseAnalysisTool from 'components/CaseAnalysisTool';

ReactDOM.render(
    <Provider store={STORE}>
        <CaseAnalysisTool />
    </Provider>,
    document.getElementById('root'),
);
