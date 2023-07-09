import './App.css';

import Login from './pages/Login';
import Home from './pages/Home';
import SignUp from './pages/Signup';
import RedirectHandler from './pages/LinkView';
import NotFound from './pages/404NotFound';
import { Routes, Route } from "react-router-dom";
// import useAuth from './hooks/UseAuth';

const App = ()=>{
  // const { auth } = useAuth();
  return (
    <div style={{ height: '100%'}}>
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Home />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="/:link_id" element={<RedirectHandler />} />


      {/* {console.log(auth)} */}
      </Routes>
  </div>
  );
}

export default App;
