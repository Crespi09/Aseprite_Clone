import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from "./Navbar";
import Home from "./Home";
import NewFile from "./NewFile";
import Login from './Login';
import Register from './Register';
import Protected from './Protected';
import Profile from './Profile';

function App() {


  return (
    <div>
        <Navbar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/NewFile/:value" element={<NewFile />} /> */}
          <Route path="/NewFile/:value" element={<Protected Component = {NewFile} />} />
          <Route path='/Login' element={<Login />} />
          <Route path='/Register' element={<Register />} />
          <Route path='/Profile' element={<Protected Component = {Profile} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;