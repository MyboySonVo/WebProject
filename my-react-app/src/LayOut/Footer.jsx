import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { 
  FaCcVisa, 
  FaCcMastercard, 
  FaPaypal, 
  FaGooglePay, 
  FaApplePay,
  FaCcAmex,
  FaCcDinersClub,
  FaCcDiscover,
  FaCcJcb
} from "react-icons/fa";
import { SiAlipay, SiWechat } from "react-icons/si"; // Bỏ SiUnionpay
import { useLocation } from "react-router-dom";

const Footer = ({ sidebarCollapsed }) => {
  const { t } = useLanguage();
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth";

  // Tính toán marginLeft dựa trên trạng thái sidebar
  const sidebarWidth = !isAuthPage ? (sidebarCollapsed ? "80px" : "220px") : "0";
  
  return (
    <footer style={{
      backgroundColor: "#f8f9fa",
      borderTop: "1px solid #e9ecef",
      padding: "48px 0 24px 0",
      marginTop: "60px",
      width: "100%",
      boxSizing: "border-box",
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        width: "100%",
        padding: "0 24px",
        boxSizing: "border-box",
      }}>
        {/* Main Footer Grid */}
        <div className="footer-grid">
          {/* Column 1: Contact Us */}
          <div style={{ width: "100%" }}>
            <h4 style={{
              fontSize: "16px",
              fontWeight: "700",
              color: "#333",
              marginBottom: "20px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}>
              {t.contactUs || "LIÊN HỆ VỚI CHÚNG TÔI"}
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li style={{ marginBottom: "12px" }}>
                <a href="#" style={{ 
                  color: "#666", 
                  textDecoration: "none", 
                  fontSize: "14px",
                  transition: "color 0.2s",
                  display: "inline-block",
                }}
                onMouseEnter={(e) => e.target.style.color = "#4f7cff"}
                onMouseLeave={(e) => e.target.style.color = "#666"}
                >
                  {t.customerCare || "Chăm Sóc Khách Hàng"}
                </a>
              </li>
              <li style={{ marginBottom: "12px" }}>
                <a href="#" style={{ 
                  color: "#666", 
                  textDecoration: "none", 
                  fontSize: "14px",
                  transition: "color 0.2s",
                  display: "inline-block",
                }}
                onMouseEnter={(e) => e.target.style.color = "#4f7cff"}
                onMouseLeave={(e) => e.target.style.color = "#666"}
                >
                  {t.serviceGuarantee || "Bảo Đảm Dịch Vụ"}
                </a>
              </li>
              <li style={{ marginBottom: "12px" }}>
                <a href="#" style={{ 
                  color: "#666", 
                  textDecoration: "none", 
                  fontSize: "14px",
                  transition: "color 0.2s",
                  display: "inline-block",
                }}
                onMouseEnter={(e) => e.target.style.color = "#4f7cff"}
                onMouseLeave={(e) => e.target.style.color = "#666"}
                >
                  {t.moreServiceInfo || "Xem thêm thông tin dịch vụ"}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: CÁC DỊCH VỤ KHÁC */}
          <div style={{ width: "100%" }}>
            <h4 style={{
              fontSize: "16px",
              fontWeight: "700",
              color: "#333",
              marginBottom: "20px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}>
              {t.otherServices || "CÁC DỊCH VỤ KHÁC"}
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li style={{ marginBottom: "12px" }}>
                <a href="#" style={{ 
                  color: "#666", 
                  textDecoration: "none", 
                  fontSize: "14px",
                  transition: "color 0.2s",
                  display: "inline-block",
                }}
                onMouseEnter={(e) => e.target.style.color = "#4f7cff"}
                onMouseLeave={(e) => e.target.style.color = "#666"}
                >
                  {t.investorRelations || "Quan Hệ Đầu Tư"}
                </a>
              </li>
              <li style={{ marginBottom: "12px" }}>
                <a href="#" style={{ 
                  color: "#666", 
                  textDecoration: "none", 
                  fontSize: "14px",
                  transition: "color 0.2s",
                  display: "inline-block",
                }}
                onMouseEnter={(e) => e.target.style.color = "#4f7cff"}
                onMouseLeave={(e) => e.target.style.color = "#666"}
                >
                  {t.careers || "Tuyển dụng"}
                </a>
              </li>
              <li style={{ marginBottom: "12px" }}>
                <a href="#" style={{ 
                  color: "#666", 
                  textDecoration: "none", 
                  fontSize: "14px",
                  transition: "color 0.2s",
                  display: "inline-block",
                }}
                onMouseEnter={(e) => e.target.style.color = "#4f7cff"}
                onMouseLeave={(e) => e.target.style.color = "#666"}
                >
                  {t.termsConditions || "Điều Khoản & Điều Kiện"}
                </a>
              </li>
              <li style={{ marginBottom: "12px" }}>
                <a href="#" style={{ 
                  color: "#666", 
                  textDecoration: "none", 
                  fontSize: "14px",
                  transition: "color 0.2s",
                  display: "inline-block",
                }}
                onMouseEnter={(e) => e.target.style.color = "#4f7cff"}
                onMouseLeave={(e) => e.target.style.color = "#666"}
                >
                  {t.privacyPolicy || "Tuyên bố quyền riêng tư"}
                </a>
              </li>
              <li style={{ marginBottom: "12px" }}>
                <a href="#" style={{ 
                  color: "#666", 
                  textDecoration: "none", 
                  fontSize: "14px",
                  transition: "color 0.2s",
                  display: "inline-block",
                }}
                onMouseEnter={(e) => e.target.style.color = "#4f7cff"}
                onMouseLeave={(e) => e.target.style.color = "#666"}
                >
                  {t.aboutGroup || "Giới Thiệu Về Tập Đoàn Datxe.com"}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: PHƯƠNG THỨC THANH TOÁN */}
          <div style={{ width: "100%" }}>
            <h4 style={{
              fontSize: "16px",
              fontWeight: "700",
              color: "#333",
              marginBottom: "20px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}>
              {t.paymentMethods || "PHƯƠNG THỨC THANH TOÁN"}
            </h4>
            <div style={{ 
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "12px",
            }}>
              <span style={{ fontSize: "14px", color: "#666" }}>VISA</span>
              <span style={{ fontSize: "14px", color: "#666" }}>AMERICAN EXPRESS</span>
              <span style={{ fontSize: "14px", color: "#666" }}>MASTERCARD</span>
              <span style={{ fontSize: "14px", color: "#666" }}>JCB</span>
              <span style={{ fontSize: "14px", color: "#666" }}>PLUS</span>
              <span style={{ fontSize: "14px", color: "#666" }}>Diners Club</span>
              <span style={{ fontSize: "14px", color: "#666" }}>Discover</span>
              <span style={{ fontSize: "14px", color: "#666" }}>UnionPay</span>
              <span style={{ fontSize: "14px", color: "#666" }}>Alipay</span>
              <span style={{ fontSize: "14px", color: "#666" }}>WeChat Pay</span>
              <span style={{ fontSize: "14px", color: "#666" }}>Apple Pay</span>
              <span style={{ fontSize: "14px", color: "#666" }}>Google Pay</span>
              <span style={{ fontSize: "14px", color: "#666" }}>DatxeVisor</span>
            </div>
          </div>

          {/* Column 4: ĐỐI TÁC CỦA CHÚNG TÔI */}
          <div style={{ width: "100%" }}>
            <h4 style={{
              fontSize: "16px",
              fontWeight: "700",
              color: "#333",
              marginBottom: "20px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}>
              {t.ourPartners || "ĐỐI TÁC CỦA CHÚNG TÔI"}
            </h4>
            <div style={{ 
              display: "flex", 
              flexDirection: "column",
              gap: "12px",
            }}>
              <span style={{ 
                fontSize: "14px", 
                fontWeight: "600", 
                color: "#4285F4",
                background: "#fff",
                padding: "6px 16px",
                borderRadius: "30px",
                border: "2px solid #4285F4",
                display: "inline-block",
                width: "fit-content",
              }}>
                Google
              </span>
              <span style={{ 
                fontSize: "14px", 
                fontWeight: "600", 
                color: "#00aa6c",
                background: "#fff",
                padding: "6px 16px",
                borderRadius: "30px",
                border: "2px solid #00aa6c",
                display: "inline-block",
                width: "fit-content",
              }}>
                DatXeVisor
              </span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div style={{
          borderTop: "1px solid #e0e0e0",
          paddingTop: "24px",
          textAlign: "center",
          color: "#888",
          fontSize: "13px",
          lineHeight: "1.6",
        }}>
          <p style={{ margin: 0 }}>
            {t.copyright || "Bản quyền © 2025 Datxe.com Travel VietNam Pte. Ltd. Bảo lưu mọi quyền. Nhà điều hành trang: Datxe.com Travel VietNam Pte. Ltd."}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;