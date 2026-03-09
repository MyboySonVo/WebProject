import React, { useState, useEffect } from "react";
import { IoIosPhonePortrait } from "react-icons/io";
import { MdOutlinePhone } from "react-icons/md";
import { IoChevronDown } from "react-icons/io5";
import Auth from "../Page/Auth"; 
import { useLanguage } from "../context/LanguageContext";
import { AiOutlineGlobal } from "react-icons/ai";
import { useNavigate } from "react-router-dom"; 
import VNFlag from "../Picture/flags/vn.png";
import UKFlag from "../Picture/flags/uk.png";
import JPFlag from "../Picture/flags/jp.png";
import TWFlag from "../Picture/flags/tw.png";
import { FiUser, FiLogOut, FiSettings, FiHelpCircle } from "react-icons/fi";

const Header = ({ setIsSidebarOpen }) => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [userEmail, setUserEmail] = useState(""); 
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [showPhone, setShowPhone] = useState(false); 
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { currentLanguage, t, changeLanguage } = useLanguage();
  const navigate = useNavigate(); 

  const languages = [
    { code: 'vi', name: 'Tiếng Việt', flag: VNFlag },
    { code: 'en', name: 'English', flag: UKFlag },
    { code: 'ja', name: '日本語', flag: JPFlag },
    { code: 'zh', name: '繁體中文', flag: TWFlag },
  ];

  const phoneNumbers = {
    vi: "1900 1234",
    en: "+84 13 1234 5678",
    ja: "+84 58 1234 5678",
    zh: "+84 43 1234 5678"
  };

 
  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) {
      setUserEmail(savedEmail);
    }
  }, []);

  const handleLogoClick = () => navigate("/");

  
  useEffect(() => {
    const langWithFlag = languages.find(lang => lang.code === currentLanguage.code);
    if (langWithFlag && currentLanguage.flag !== langWithFlag.flag) {
      currentLanguage.flag = langWithFlag.flag;
    }
  }, [currentLanguage.code]);

  const handleLanguageSelect = (language) => {
    changeLanguage(language);
    setIsLanguageOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.language-selector') && 
          !event.target.closest('.cskh-container') &&
          !event.target.closest('.user-menu')) {
        setIsLanguageOpen(false);
        setShowPhone(false);
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLoginSuccess = (email) => {
    setUserEmail(email);
    localStorage.setItem("userEmail", email); 
  };

  const handleLogout = () => {
    setUserEmail("");
    localStorage.removeItem("userEmail"); 
    setIsUserMenuOpen(false);
  };

  const handleUserMenuClick = (e) => {
    e.stopPropagation();
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setIsUserMenuOpen(false);
  };

  const handleSettingsClick = () => {
    navigate("/settings");
    setIsUserMenuOpen(false);
  };

  const handleHelpClick = () => {
    navigate("/help");
    setIsUserMenuOpen(false);
  };

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
        
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={() => setIsSidebarOpen(prev => !prev)}
            style={{ fontSize: "22px", background: "none", border: "none", cursor: "pointer", color: "black" }}
          >
            ☰
          </button>
          <h2 
            onClick={handleLogoClick} 
            style={{ margin: 0, color: "#20c997", cursor: "pointer", transition: "opacity 0.2s" }}
            onMouseEnter={(e) => e.target.style.opacity = "0.8"}
            onMouseLeave={(e) => e.target.style.opacity = "1"}
          >
            Datxe.com
          </h2>
        </div>

      
        <input
          placeholder={t.search}
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

        
        <div style={{ display: "flex", alignItems: "center", gap: "16px", position: "relative", right: "50px" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" }}>
            <IoIosPhonePortrait /> {t.app}
          </span>

       
          <div className="language-selector" style={{ position: "relative" }}>
            <span 
              style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", padding: "4px 12px", borderRadius: "20px", backgroundColor: isLanguageOpen ? "#f0f0f0" : "transparent", border: "1px solid #e0e0e0" }}
              onClick={(e) => { e.stopPropagation(); setIsLanguageOpen(!isLanguageOpen); setShowPhone(false); setIsUserMenuOpen(false); }}
            >
              <img src={currentLanguage.flag} alt={currentLanguage.code} style={{ width: "24px", height: "24px", objectFit: "cover", borderRadius: "50%" }} />
              <span style={{ fontSize: "14px", fontWeight: "500" }}>{currentLanguage.code.toUpperCase()}</span>
              <IoChevronDown style={{ fontSize: "14px", color: "#666", transform: isLanguageOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s" }} />
            </span>
            {isLanguageOpen && (
              <div style={{ position: "absolute", top: "45px", right: 0, width: "250px", backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 8px 30px rgba(0,0,0,0.15)", zIndex: 1001, padding: "12px" }}>
                <h3 style={{ margin: "0 0 12px 8px", fontSize: "16px", fontWeight: "600", color: "#333", display: "flex", alignItems: "center", gap: "8px" }}>
                  <AiOutlineGlobal /> {t.selectLanguage}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {languages.map(lang => (
                    <button key={lang.code} onClick={() => handleLanguageSelect(lang)} style={{ padding: "10px 12px", border: "none", borderRadius: "8px", background: currentLanguage.code === lang.code ? "#e8f4ff" : "transparent", cursor: "pointer", fontSize: "14px", color: "#333", textAlign: "left", display: "flex", alignItems: "center", gap: "12px", width: "100%" }}>
                      <img src={lang.flag} alt={lang.code} style={{ width: "24px", height: "16px", objectFit: "cover", borderRadius: "2px" }} />
                      <span style={{ fontWeight: currentLanguage.code === lang.code ? "600" : "400" }}>{lang.name}</span>
                      {currentLanguage.code === lang.code && <span style={{ marginLeft: "auto", color: "#20c997", fontSize: "16px" }}>✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="cskh-container" style={{ position: "relative" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", padding: "4px 8px", borderRadius: "4px", backgroundColor: showPhone ? "#f0f0f0" : "transparent" }} onClick={(e) => { e.stopPropagation(); setShowPhone(!showPhone); setIsLanguageOpen(false); setIsUserMenuOpen(false); }}>
              <MdOutlinePhone /> {t.support}
            </span>
            {showPhone && (
              <div style={{ position: "absolute", top: "40px", right: 0, width: "200px", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 4px 15px rgba(0,0,0,0.15)", zIndex: 1001, padding: "16px", textAlign: "center" }}>
                <div style={{ fontSize: "20px", fontWeight: "700", color: "#4f7cff", marginBottom: "8px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <MdOutlinePhone style={{ fontSize: "18px" }} /> {phoneNumbers[currentLanguage.code]}
                </div>
                <div style={{ fontSize: "12px", color: "#666", borderTop: "1px solid #eee", paddingTop: "8px", marginTop: "8px" }}>
                  {t.support === "CSKH" ? "Tư vấn 24/7" : t.support === "Support" ? "24/7 Support" : t.support === "サポート" ? "24時間サポート" : "24小時客服"}
                </div>
              </div>
            )}
          </div>

         
          <div className="user-menu" style={{ display: "flex", alignItems: "center", gap: "8px", position: "relative" }}>
            {!userEmail ? (
              <button
                onClick={() => setIsAuthOpen(true)}
                style={{ padding: "8px 14px", borderRadius: "8px", border: "none", background: "#4f7cff", color: "#fff", cursor: "pointer", fontWeight: "600" }}
              >
                {t.login}
              </button>
            ) : (
              <>
                <div 
                  onClick={handleUserMenuClick}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "6px 12px",
                    borderRadius: "30px",
                    backgroundColor: isUserMenuOpen ? "#f0f0f0" : "transparent",
                    cursor: "pointer",
                    border: "1px solid #e0e0e0",
                    transition: "all 0.2s",
                  }}
                >
                  <FiUser style={{ fontSize: "18px", color: "#4f7cff" }} />
                  <span style={{ fontSize: "14px", fontWeight: "500", color: "#333", maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {userEmail}
                  </span>
                  <IoChevronDown style={{ fontSize: "14px", color: "#666", transform: isUserMenuOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s" }} />
                </div>

               
                {isUserMenuOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "50px",
                      right: 0,
                      width: "220px",
                      backgroundColor: "#fff",
                      borderRadius: "12px",
                      boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                      zIndex: 1001,
                      padding: "8px",
                      animation: "fadeIn 0.2s ease",
                    }}
                  >
                    <div style={{ padding: "12px", borderBottom: "1px solid #f0f0f0", marginBottom: "4px" }}>
                      <div style={{ fontSize: "12px", color: "#888", marginBottom: "2px" }}>Đã đăng nhập với</div>
                      <div style={{ fontSize: "14px", fontWeight: "600", color: "#333", wordBreak: "break-all" }}>{userEmail}</div>
                    </div>

                    <button
                      onClick={handleProfileClick}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "10px 12px",
                        width: "100%",
                        border: "none",
                        background: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "14px",
                        color: "#333",
                        textAlign: "left",
                        transition: "background-color 0.2s",
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = "#f5f5f5"}
                      onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
                    >
                      <FiUser style={{ fontSize: "16px", color: "#666" }} />
                      Thông tin cá nhân
                    </button>

                    <button
                      onClick={handleSettingsClick}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "10px 12px",
                        width: "100%",
                        border: "none",
                        background: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "14px",
                        color: "#333",
                        textAlign: "left",
                        transition: "background-color 0.2s",
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = "#f5f5f5"}
                      onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
                    >
                      <FiSettings style={{ fontSize: "16px", color: "#666" }} />
                      Cài đặt
                    </button>

                    <button
                      onClick={handleHelpClick}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "10px 12px",
                        width: "100%",
                        border: "none",
                        background: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "14px",
                        color: "#333",
                        textAlign: "left",
                        transition: "background-color 0.2s",
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = "#f5f5f5"}
                      onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
                    >
                      <FiHelpCircle style={{ fontSize: "16px", color: "#666" }} />
                      Trợ giúp
                    </button>

                    <div style={{ borderTop: "1px solid #f0f0f0", margin: "4px 0" }}></div>

                    <button
                      onClick={handleLogout}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "10px 12px",
                        width: "100%",
                        border: "none",
                        background: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "14px",
                        color: "#ff4444",
                        textAlign: "left",
                        transition: "background-color 0.2s",
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = "#fff1f1"}
                      onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
                    >
                      <FiLogOut style={{ fontSize: "16px" }} />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      
      <Auth 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLoginSuccess={handleLoginSuccess} 
      />

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </>
  );
};

export default Header;