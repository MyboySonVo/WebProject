import React, { useState } from "react";
import { IoIosPhonePortrait } from "react-icons/io";
import { MdOutlinePhone } from "react-icons/md";
import VNDIcon from "../Picture/vn.png"; 
import Auth from "../Page/Auth"; 

const Header = ({ setIsSidebarOpen }) => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "70px",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          zIndex: 1000,
          color: "black",
        }}
      >
        {/* Left: Sidebar button + Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            style={{
              fontSize: "22px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "black",
            }}
          >
            ☰
          </button>
          <h2 style={{ margin: 0, color: "#20c997" }}>Datxe.com</h2>
        </div>

        {/* Middle: Search */}
        <input
          placeholder="Tìm kiếm"
          style={{
            width: "300px",
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            backgroundColor: "white",
            position: "relative",
            right: "220px",
          }}
        />

        {/* Right: Menu */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", position: "relative", right: "50px" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" }}>
            <IoIosPhonePortrait /> Ứng dụng
          </span>

          <span style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", position:"relative", right:"20px" }}>
            <img src={VNDIcon} alt="VND" style={{ width: "50px", height: "30px", position:"relative", left:"20px" }} />
            |VND
          </span>

          <span style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" }}>
            <MdOutlinePhone /> CSKH
          </span>

          {/* Nút Đăng nhập/Đăng ký */}
          <button
            onClick={() => setIsAuthOpen(true)}
            style={{
              padding: "8px 14px",
              borderRadius: "8px",
              border: "none",
              background: "#4f7cff",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Đăng nhập/Đăng ký
          </button>
        </div>
      </header>

      {/* HIỂN THỊ AUTH MODAL */}
      <Auth isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
};

export default Header;