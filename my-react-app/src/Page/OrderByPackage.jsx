import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import Header from "../LayOut/Header";
import Sidebar from "../components/Sidebar";

const OrderByPackage = () => {
  const { t } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>

      <Header setIsSidebarOpen={setIsSidebarOpen} />
      
      
      <div className="page-with-sidebar">
        <Sidebar isOpen={isSidebarOpen} />
        <div
          className={`page-main ${isSidebarOpen ? "with-sidebar" : ""}`}
          style={{ backgroundColor: "#f8f9fa" }}
        >
          <div className="page-content-wrap" style={{ maxWidth: "1200px" }}>
            <h1 style={{ 
              fontSize: "32px", 
              fontWeight: "700", 
              color: "#333",
              marginBottom: "30px"
            }}>
              {t.package}
            </h1>
            <div style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "40px",
              textAlign: "center",
              boxShadow: "0 4px 15px rgba(0,0,0,0.05)"
            }}>
              <p style={{ fontSize: "18px", color: "#666" }}>
                {t.package === "Đặt theo gói" ? "Nội dung trang đặt theo gói" :
                 t.package === "Package Booking" ? "Package booking content" :
                 t.package === "パッケージ予約" ? "パッケージ予約の内容" : "套裝預訂內容"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderByPackage;