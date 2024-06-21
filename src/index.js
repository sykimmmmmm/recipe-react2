import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Browser from './Browser';
import {RecoilRoot} from 'recoil'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RecoilRoot>
    <Browser/>  
  </RecoilRoot>
);


