import { useState } from "react";
import Header from "../LayOut/Header";
import Sidebar from "../components/Sidebar";
import BookingTabs from "../components/BookingTabs";

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fb" }}>
     
      <Header setIsSidebarOpen={setIsSidebarOpen} />

      
      <div className="page-with-sidebar">
        <Sidebar isOpen={isSidebarOpen} />
        <main className={`page-main ${isSidebarOpen ? "with-sidebar" : ""}`}>
          <BookingTabs />
        </main>
      </div>
    </div>
  );
};

export default Home;