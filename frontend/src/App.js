import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignUp } from "./components/signup/SignUp";
import SetQuestionAnswer from './components/signup/SetQuestionAnswer';
import SetCipherDetails from './components/signup/SetCipherDetails';
import Login from './components/login/Login';
import HomePage from './components/homepage/HomePage';
import Logout from './components/logout/Logout';
import Chat from './components/chat/Chat';
import React from 'react';
import ChatList from './components/chatList/ChatList';
import Reviews from './components/reviews/Reviews';
import Notifications from './components/notifications/Notifications';

import RestaurantDetails from './components/restaurants/RestaurantDetails';
import CustomerOrders from './components/orders/CustomerOrders';
import RestaurantReport from './components/reports/RestaurantReport';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />}> </Route>
        <Route path='/signup' element={<SignUp />}> </Route>
        <Route path='/setquestionanswer' element={<SetQuestionAnswer />}> </Route>
        <Route path='/setcipherdetails' element={<SetCipherDetails />}> </Route>
        <Route path='/login' element={<Login />}> </Route>
        <Route path='/homepage' element={<HomePage />}> </Route>
        <Route path='/chat' element={<Chat />}> </Route>
        <Route path='/chats' element={<ChatList />}> </Route>
        <Route path='/reviews' element={<Reviews />}> </Route>
        <Route path='/notifications' element={<Notifications />}> </Route>
        <Route path='/logout' element={<Logout />}> </Route>
        <Route path='/restaurantdetails' element={<RestaurantDetails />}> </Route>
        <Route path='/customerorders' element={<CustomerOrders />}> </Route>
        <Route path='/reports' element={<RestaurantReport />}> </Route>
      </Routes >
    </BrowserRouter >
  );
}

export default App;
