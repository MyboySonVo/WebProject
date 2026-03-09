import React, { useState, useEffect } from "react";
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiUsers } from "react-icons/fi";
import { useLanguage } from "../context/LanguageContext";

const UserInfo = ({ userData }) => {
  const { t } = useLanguage();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Nếu có userData từ props thì dùng
    if (userData) {
      setUserInfo(userData);
      return;
    }

    // Nếu không có userData, lấy từ localStorage
    const savedEmail = localStorage.getItem("userEmail");
    
    if (savedEmail) {
      // Lấy thêm các thông tin khác từ localStorage nếu có
      const savedUserData = localStorage.getItem("userData");
      
      if (savedUserData) {
        setUserInfo(JSON.parse(savedUserData));
      } else {
        // Chỉ hiển thị email từ localStorage, các thông tin khác để trống
        setUserInfo({
          fullName: "",
          email: savedEmail,
          phone: "",
          address: "",
          gender: "",
          birthDate: "",
        });
      }
    }
  }, [userData]);

  // Nếu chưa có dữ liệu, hiển thị loading hoặc thông báo đăng nhập
  if (!userInfo) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        padding: "20px",
      }}>
        <div style={{
          maxWidth: "600px",
          width: "100%",
          backgroundColor: "#fff",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          padding: "30px",
          textAlign: "center",
        }}>
          <p style={{ color: "#666", fontSize: "16px" }}>
            Vui lòng đăng nhập để xem thông tin
          </p>
        </div>
      </div>
    );
  }

  const infoItems = [
    { icon: <FiUser />, label: t.fullName || "HỌ VÀ TÊN", value: userInfo.fullName || "Chưa cập nhật" },
    { icon: <FiMail />, label: t.email || "EMAIL", value: userInfo.email },
    { icon: <FiPhone />, label: t.phone || "SỐ ĐIỆN THOẠI", value: userInfo.phone || "Chưa cập nhật" },
    { icon: <FiCalendar />, label: t.birthDate || "NGÀY SINH", value: userInfo.birthDate || "Chưa cập nhật" },
    { icon: <FiUsers />, label: t.gender || "GIỚI TÍNH", value: userInfo.gender || "Chưa cập nhật" },
    { icon: <FiMapPin />, label: t.address || "ĐỊA CHỈ", value: userInfo.address || "Chưa cập nhật" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f5f5f5",
      padding: "20px",
    }}>
      <div style={{
        maxWidth: "600px",
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        padding: "30px",
      }}>
        {/* Header với avatar */}
        <div style={{
          textAlign: "center",
          marginBottom: "30px",
          paddingBottom: "20px",
          borderBottom: "2px solid #f0f0f0",
        }}>
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "#4f7cff",
            margin: "0 auto 15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: "32px",
            fontWeight: "600",
          }}>
            {userInfo.fullName ? userInfo.fullName.charAt(0).toUpperCase() : userInfo.email.charAt(0).toUpperCase()}
          </div>
          <h2 style={{
            margin: "0 0 8px",
            fontSize: "24px",
            fontWeight: "600",
            color: "#333",
          }}>
            {userInfo.fullName || "Người dùng"}
          </h2>
          <p style={{
            margin: 0,
            fontSize: "14px",
            color: "#666",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}>
            <FiMail style={{ color: "#4f7cff" }} /> {userInfo.email}
          </p>
          {userInfo.phone && (
            <p style={{
              margin: "5px 0 0",
              fontSize: "14px",
              color: "#666",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}>
              <FiPhone style={{ color: "#4f7cff" }} /> {userInfo.phone}
            </p>
          )}
        </div>

        {/* Thông tin chi tiết */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "20px",
          marginBottom: "30px",
        }}>
          {infoItems.map((item, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "#f9f9f9",
                borderRadius: "12px",
                padding: "16px",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
              }}>
                <span style={{
                  fontSize: "18px",
                  color: "#4f7cff",
                }}>
                  {item.icon}
                </span>
                <span style={{
                  fontSize: "12px",
                  color: "#888",
                  fontWeight: "600",
                  letterSpacing: "0.5px",
                }}>
                  {item.label}
                </span>
              </div>
              <div style={{
                fontSize: "15px",
                fontWeight: "500",
                color: "#333",
                wordBreak: "break-word",
                paddingLeft: "26px",
              }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* Nút chỉnh sửa */}
        <div style={{
          textAlign: "center",
        }}>
          <button
            style={{
              padding: "12px 40px",
              backgroundColor: "#4f7cff",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "background-color 0.2s, transform 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#3a5fd0";
              e.target.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#4f7cff";
              e.target.style.transform = "scale(1)";
            }}
          >
            {t.editProfile || "Chỉnh sửa thông tin"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;