import React from 'react';
import 'antd/dist/reset.css';
import SinglePage from './app/pages/SinglePage'
import { Provider } from 'react-redux';
import { store } from './app/boot';

function App() {
  return (
    <Provider store={store}>
      <SinglePage />
    </Provider>
  );
}

export default App;
