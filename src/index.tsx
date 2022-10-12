import 'antd/dist/antd.css';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './assets/scss/index.scss';


const root = ReactDOM.createRoot(document.querySelector('#root') as HTMLDivElement);

root.render(
    <App />
);
