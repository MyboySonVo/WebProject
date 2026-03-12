import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import Header from "./LayOut/Header";
import Home from "./Page/Home";
import Auth from "./Page/Auth";
import AirlineTickets from "./Page/AirlineTickets";
import BusTickets from "./Page/BusTickets";
import TrainTickets from "./Page/TrainTickets";
import OrderByPackage from "./Page/OrderByPackage"; 
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import Footer from "./LayOut/Footer"; 
import AdminTrips from "./Page/AdminTrips";

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
        <Route path="/ve-may-bay" element={<AirlineTickets />} />
        <Route path="/ve-tau-hoa" element={<TrainTickets />} />
        <Route path="/xe-khach" element={<BusTickets />} />
        <Route path="/dat-theo-goi" element={<OrderByPackage />} /> 
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin/trips" element={<AdminTrips />} />
      </Routes>
      {showFooter && <Footer />} {/* Thêm Footer */}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <AppWrapper />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;