import { useState } from "react";
import Header from "../LayOut/Header";
import Sidebar from "../components/Sidebar";
import BookingTabs from "../components/BookingTabs";

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div style={{ height: "100vh", background: "#f5f7fb" }}>
      <Header setIsSidebarOpen={setIsSidebarOpen} />

      <div style={{ display: "flex", marginTop: "70px" }}>
        
        <Sidebar isOpen={isSidebarOpen} />

        
        <main
          style={{
            flex: 1,
            padding: "40px",
            transition: "0.3s",
          }}
        >
          <BookingTabs />
        </main>
      </div>
    </div>
  );
};

export default Home;
