import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import Header from "./LayOut/Header";
import Home from "./Page/Home";
import Auth from "./Page/Auth";

import AirlineTicketsDetail from "./Page/AirlineTicketsDetail"; 

import UserInfo from "./Page/UserInfo"; 
import { LanguageProvider } from "./context/LanguageContext";
import Footer from "./LayOut/Footer"; 

function AppWrapper() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const showHeader = location.pathname !== "/auth";
  const showFooter = location.pathname !== "/auth"; 

  return (
    <>
      {showHeader && <Header setIsSidebarOpen={setIsSidebarOpen} />}
      <Routes>
        <Route path="/" element={<Home isSidebarOpen={isSidebarOpen} />} />      
        <Route path="/ve-may-bay/" element={<AirlineTicketsDetail />} /> 
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<UserInfo />} /> 
      </Routes>
      {showFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AppWrapper />
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;