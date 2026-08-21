// @ts-expect-error React typings are not installed in this project.
import {createElement, StrictMode} from 'react';
// @ts-expect-error React DOM typings are not installed in this project.
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
// @ts-expect-error CSS module declarations are not installed in this project.
import './index.css';

createRoot(document.getElementById('root')!).render(
  createElement(StrictMode, null, createElement(App)),
);
