import React, { useContext } from 'react';
import { AppContext } from './context/AppContext';
import Login from './components/Login';
import Layout from './components/Layout';

function App() {
  const { currentUser } = useContext(AppContext);

  return currentUser ? <Layout /> : <Login />;
}

export default App;
