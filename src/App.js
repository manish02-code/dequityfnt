import './App.css';
import { Route, Routes,useParams } from 'react-router-dom';
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




function App() {
  

  return (
    <div className="App">
      <Header />
      <Routes>
             <Route exact path='/' element={<Homepage />} />
            <Route exact path='/DataCollector' element={<DataCollector />} />
            <Route exact path='/DataCollector/Dashbord' element={<ConnectedCollector />} />
            <Route exact path='/DataCollector/CreateProfileBuyer' element={<CreateProfileBuyer />} />
            <Route exact path='/Perticipent' element={<Perticipent />} />
            <Route exact path='/Perticipent/CreateProfile' element={<CreateParticipantProfile />} />
            <Route exact path='/DataBuyer' element={<DataBuyer />} />
       
      </Routes>
      <Footer />
    </div>
  );
}

export default App;