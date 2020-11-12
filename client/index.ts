import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ui } from './UI';

declare global {
  // eslint-disable-next-line no-var 
  var __APP_LOADED__ : boolean 
}
// eslint-disable-next-line no-undef
global.__APP_LOADED__ = true;

ReactDOM.render(
  React.createElement(ui),
  document.getElementById('root')
);
