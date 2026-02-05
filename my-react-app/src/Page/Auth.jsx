import React from "react";
import G from "../Picture/G.png";
import FB from "../Picture/FB.png";
import A from "../Picture/A.svg";

const Auth = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Style dùng chung cho các icon để đảm bảo kích thước đồng đều
  const iconStyle = {
    width: "20px",
    height: "20px",
    objectFit: "contain",
  };

  // Style dùng chung cho các nút mạng xã hội
  const socialButtonStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px", // Khoảng cách giữa logo và chữ
    padding: "12px",
    marginBottom: "12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "500",
    width: "100%",
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: "relative",
          width: "750px",
          display: "flex",
          backgroundColor: "#fff",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút đóng (X) */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "50%",
            width: "35px",
            height: "35px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          ×
        </button>

        {/* CỘT TRÁI: FORM */}
        <div style={{ flex: 1, padding: "50px 40px", display: "flex", flexDirection: "column" }}>
          <h3 style={{ textAlign: "center", marginBottom: "30px", fontSize: "22px", fontWeight: "500" }}>
            Đăng nhập / Đăng ký
          </h3>

          <input
            type="email"
            placeholder="Vui lòng nhập địa chỉ email"
            style={{
              padding: "14px",
              marginBottom: "12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              backgroundColor: "#4a4a4a",
              color: "#fff",
              fontSize: "15px",
              outline: "none",
            }}
          />
          <button
            style={{
              padding: "14px",
              border: "none",
              borderRadius: "4px",
              backgroundColor: "#e8e8e8",
              fontWeight: "600",
              cursor: "pointer",
              marginBottom: "25px",
              color: "#666",
            }}
          >
            Tiếp tục với email
          </button>

          <div
            style={{
              position: "relative",
              textAlign: "center",
              borderBottom: "1px solid #eee",
              lineHeight: "0.1em",
              margin: "10px 0 30px",
            }}
          >
            <span style={{ background: "#fff", padding: "0 15px", color: "#999", fontSize: "14px" }}>Hoặc</span>
          </div>

          {/* Nút Google */}
          <button style={{ ...socialButtonStyle, backgroundColor: "#fff", border: "1px solid #ddd", color: "#333" }}>
            <img src={G} alt="Google" style={iconStyle} />
            Đăng nhập bằng Google
          </button>

          {/* Nút Facebook */}
          <button style={{ ...socialButtonStyle, backgroundColor: "#1877F2", color: "white" }}>
            <img src={FB} alt="Facebook" style={iconStyle} />
            Đăng nhập với Facebook
          </button>

          {/* Nút Apple */}
          <button style={{ ...socialButtonStyle, backgroundColor: "#000", color: "white" }}>
            <img src={A} alt="Apple" style={{ ...iconStyle, filter: "invert(1)" }} />
            Đăng nhập với Apple
          </button>
        </div>

        {/* CỘT PHẢI: QR */}
        <div
          style={{
            flex: 0.85,
            backgroundColor: "#f9f9f9",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "40px",
            borderLeft: "1px solid #f0f0f0",
          }}
        >
          <div style={{ width: "170px", height: "170px", backgroundColor: "#777", borderRadius: "8px", marginBottom: "25px" }}></div>
          <p style={{ textAlign: "center", fontSize: "14px", color: "#666", lineHeight: "1.6" }}>
            Sử dụng ứng dụng để <br /> <span style={{ fontWeight: "600" }}>đăng nhập bằng mã QR</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;