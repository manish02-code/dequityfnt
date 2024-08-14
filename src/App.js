import './App.css';
import { Route, Routes, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';


import DataCollector from './pages/DataCollector/DataCollector';
import Perticipent from './pages/Participent/Perticipent';
import DataBuyer from './pages/DataBuyer/DataBuyer';
import Header from './component/Header/Header';
import Footer from './component/Footer/Footer';
import CreateParticipantProfile from './pages/Participent/CrerateProfile/CreateProfile';
import Homepage from './pages/Hompage/Homepage'
import CreateProfileBuyer from './pages/DataBuyer/CreateProfileBuyer/CreateProfileBuyer'
import ConnectedCollector from './pages/DataCollector/ConnectedParaChain/ConnectedParaChain'
import { ApiPromise, WsProvider } from '@polkadot/api';
import ErrorBoundary from './component/ErrorBoundary';




function App() {


  return (
    <div className="App">
      <ErrorBoundary>
        <Header />
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='/DataCollector' element={<DataCollector />} />
          <Route path='/DataCollector/Dashbord' element={<ConnectedCollector />} />
          <Route path='/DataCollector/CreateProfileBuyer' element={<CreateProfileBuyer />} />
          <Route path='/Perticipent' element={<Perticipent />} />
          <Route path='/Perticipent/CreateProfile' element={<CreateParticipantProfile />} />
          <Route path='/DataBuyer' element={<DataBuyer />} />
        </Routes>
        <Footer />
      </ErrorBoundary>
    </div>
  );
}

export default App;