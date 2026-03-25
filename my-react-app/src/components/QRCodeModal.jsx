import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

const QRCodeModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;


  const currentURL = "http://localhost:5173";

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2000,
      padding: "20px"
    }}>
      <div style={{
        backgroundColor: "#fff",
        padding: "30px",
        borderRadius: "20px",
        maxWidth: "400px",
        width: "100%",
        textAlign: "center",
        boxShadow: "0 10px 40px rgba(0,0,0,0.2)"
      }}>
        <h3 style={{ fontSize: "22px", fontWeight: "800", marginBottom: "15px", color: "#111827" }}>
          Mở trên điện thoại
        </h3>
        <p style={{ fontSize: "14px", color: "#666", marginBottom: "25px" }}>
          Quét mã QR dưới đây để tiếp tục trải nghiệm Datxe.com trên thiết bị di động của bạn.
        </p>
        
        <div style={{ 
          padding: "20px", 
          backgroundColor: "#f9fafb", 
          borderRadius: "16px",
          display: "inline-block",
          marginBottom: "25px",
          border: "1px solid #eee"
        }}>
          <QRCodeSVG value={currentURL} size={200} />
        </div>

        <div style={{ fontSize: "12px", color: "#888", marginBottom: "25px", fontStyle: "italic" }}>
          * Lưu ý: Khi test local, hãy đảm bảo điện thoại và máy tính dùng chung Wi-Fi.
        </div>

        <button 
          onClick={onClose}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            border: "none",
            backgroundColor: "#4f7cff",
            color: "#fff",
            fontWeight: "700",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default QRCodeModal;
