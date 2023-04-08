import React, { useEffect } from 'react';
import './App.css';
import HomeScreen from './screens/HomeScreen';
import {  Route, BrowserRouter, Routes } from 'react-router-dom';
import LoginScreen from './screens/LoginScreen';
import { auth } from './firebase';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout, selectUser } from './features/userSlice';
import ProfileScreen from './screens/ProfileScreen';



function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
      const unsubscribe =  auth.onAuthStateChanged(userAuth => {
        if(userAuth) {
          //logged in 
          dispatch(login({
            uid: userAuth.uid,
            email: userAuth.email,
          }));
        } else {
          //logged out 
          dispatch(logout());
        }
      });

      return unsubscribe;
  }, [dispatch]);

  return (
    <div className="app">
     <BrowserRouter>
     {!user ? (<LoginScreen/>) : (

          <Routes>
            <Route path='/profile' element={<ProfileScreen/>} />
            <Route path="/" element={<HomeScreen/>}/>
            <Route path='/test' element={<h1>This is test</h1>}/>
          </Routes>
     )}
  
      </BrowserRouter>

    </div>
  );
}

export default App;
