import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "mobx-react";
import { configure } from "mobx";
import './index.css';
import App from './routes/App/index';
import * as serviceWorker from './serviceWorker';
import { default as store } from "./store";

configure({ enforceActions: "always" });

ReactDOM.render(
  <Provider {...store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
