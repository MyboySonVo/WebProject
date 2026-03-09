import React, { useState, useEffect } from "react";
import G from "../Picture/G.png";
import FB from "../Picture/FB.png";
import A from "../Picture/A.svg";
import { IoIosWarning } from "react-icons/io";
import { TiTick } from "react-icons/ti";
import { useLanguage } from "../context/LanguageContext";

const Auth = ({ isOpen, onClose, onLoginSuccess }) => { // Thêm prop onLoginSuccess
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { t, currentLanguage } = useLanguage();

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("tempEmail");
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  useEffect(() => {
    if (email) {
      sessionStorage.setItem("tempEmail", email);
    }
  }, [email]);

  const clearTempData = () => {
    sessionStorage.removeItem("tempEmail");
  };

  if (!isOpen) return null;

  const isValidEmail = (email) => {
    return email.includes('@gmail.com') && email.trim() !== '';
  };

  const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleEmailSubmit = (submittedEmail) => {
    setEmailError("");
    
    if (!submittedEmail.trim()) {
      setEmailError(t.emailRequired);
      return;
    }
    
    if (!isValidEmail(submittedEmail)) {
      setEmailError(t.emailInvalid);
      return;
    }
    
    setEmail(submittedEmail.trim());
    setStep(2);
  };

  const handleRegister = (password) => {
    setPasswordError("");
    
    if (!password) {
      setPasswordError(t.passwordRequired);
      return;
    }
    
    if (!isValidPassword(password)) {
      setPasswordError(t.passwordInvalid);
      return;
    }
    
    console.log("Đăng ký với:", email, password);
    
    setSuccessMessage(t.registerSuccess.replace("{email}", email));
    setShowSuccess(true);
    
    clearTempData();
    
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
    
    setTimeout(() => {
      onClose();
      setStep(1);
      setEmail("");
      setEmailError("");
      setPasswordError("");
      // Gọi callback onLoginSuccess với email khi đăng nhập thành công
      if (onLoginSuccess) {
        onLoginSuccess(email);
      }
    }, 1500);
  };

  const handleBack = () => {
    setStep(1);
    setEmail("");
    setEmailError("");
    setPasswordError("");
    sessionStorage.removeItem("tempEmail");
  };

  // Thêm hàm xử lý đăng nhập với Google
  const handleGoogleLogin = () => {
    // Giả lập đăng nhập Google thành công với email demo
    const demoEmail = "user@gmail.com";
    console.log("Đăng nhập với Google:", demoEmail);
    
    setSuccessMessage(t.loginSuccess.replace("{email}", demoEmail));
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
    
    setTimeout(() => {
      onClose();
      if (onLoginSuccess) {
        onLoginSuccess(demoEmail);
      }
    }, 1500);
  };

  // Thêm hàm xử lý đăng nhập với Facebook
  const handleFacebookLogin = () => {
    // Giả lập đăng nhập Facebook thành công với email demo
    const demoEmail = "user@facebook.com";
    console.log("Đăng nhập với Facebook:", demoEmail);
    
    setSuccessMessage(t.loginSuccess.replace("{email}", demoEmail));
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
    
    setTimeout(() => {
      onClose();
      if (onLoginSuccess) {
        onLoginSuccess(demoEmail);
      }
    }, 1500);
  };

  // Thêm hàm xử lý đăng nhập với Apple
  const handleAppleLogin = () => {
    // Giả lập đăng nhập Apple thành công với email demo
    const demoEmail = "user@apple.com";
    console.log("Đăng nhập với Apple:", demoEmail);
    
    setSuccessMessage(t.loginSuccess.replace("{email}", demoEmail));
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
    
    setTimeout(() => {
      onClose();
      if (onLoginSuccess) {
        onLoginSuccess(demoEmail);
      }
    }, 1500);
  };

  const iconStyle = {
    width: "20px",
    height: "20px",
    objectFit: "contain",
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
      {showSuccess && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            backgroundColor: "#4caf50",
            color: "white",
            padding: "16px 24px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 10001,
            animation: "slideIn 0.3s ease",
            fontSize: "16px",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span style={{ fontSize: "20px" }}><TiTick /></span>
          {successMessage}
        </div>
      )}

      <div
        style={{
          position: "relative",
          width: step === 1 ? "750px" : "500px",
          display: "flex",
          backgroundColor: "#fff",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
          transition: "width 0.3s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
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

        {step === 1 && (
          <>
            <div style={{ flex: 1, padding: "50px 40px", display: "flex", flexDirection: "column" }}>
              <h3 style={{ textAlign: "center", marginBottom: "30px", fontSize: "22px", fontWeight: "500" }}>
                {t.authTitle}
              </h3>

              <input
                type="email"
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                style={{
                  padding: "14px",
                  marginBottom: "8px",
                  border: emailError ? "1px solid #ff4444" : "1px solid #ccc",
                  borderRadius: "4px",
                  backgroundColor: "#fff",
                  color: "#333",
                  fontSize: "15px",
                  outline: "none",
                }}
              />
              
              {emailError && (
                <p style={{
                  color: "#ff4444",
                  fontSize: "13px",
                  marginBottom: "12px",
                  marginTop: "0",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}>
                  <span><IoIosWarning /></span> {emailError}
                </p>
              )}
              
              <button
                onClick={() => handleEmailSubmit(email)}
                style={{
                  padding: "14px",
                  border: "none",
                  borderRadius: "4px",
                  backgroundColor: "#4f7cff",
                  fontWeight: "600",
                  cursor: "pointer",
                  marginBottom: "25px",
                  color: "#fff",
                }}
              >
                {t.continueWithEmail}
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
                <span style={{ background: "#fff", padding: "0 15px", color: "#999", fontSize: "14px" }}>{t.or}</span>
              </div>

              <button 
                onClick={handleGoogleLogin}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", padding: "12px", marginBottom: "12px", border: "1px solid #ddd", borderRadius: "4px", cursor: "pointer", fontSize: "15px", fontWeight: "500", width: "100%", backgroundColor: "#fff", color: "#333" }}
              >
                <img src={G} alt="Google" style={iconStyle} />
                {t.loginWithGoogle}
              </button>

              <button 
                onClick={handleFacebookLogin}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", padding: "12px", marginBottom: "12px", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "15px", fontWeight: "500", width: "100%", backgroundColor: "#1877F2", color: "white" }}
              >
                <img src={FB} alt="Facebook" style={iconStyle} />
                {t.loginWithFacebook}
              </button>

              <button 
                onClick={handleAppleLogin}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", padding: "12px", marginBottom: "12px", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "15px", fontWeight: "500", width: "100%", backgroundColor: "#000", color: "white" }}
              >
                <img src={A} alt="Apple" style={{ ...iconStyle, filter: "invert(1)" }} />
                {t.loginWithApple}
              </button>
            </div>

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
                {t.qrText} <br /> <span style={{ fontWeight: "600" }}>{t.qrHighlight}</span>
              </p>
            </div>
          </>
        )}

        {step === 2 && (
          <div style={{ flex: 1, padding: "50px 40px" }}>
            <h2 style={{ 
              marginBottom: "16px", 
              fontSize: "28px", 
              color: "#333", 
              textAlign: "center",
              fontWeight: "600"
            }}>
              {t.createAccount}
            </h2>
            
            <p style={{ 
              marginBottom: "24px", 
              color: "#666", 
              textAlign: "center",
              fontSize: "16px"
            }}>
              {t.setPassword}
            </p>
            
            <div style={{
              padding: "16px 20px",
              background: "#f0f7ff",
              borderRadius: "12px",
              marginBottom: "28px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: "1px solid #d4e4ff",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ 
                  fontWeight: "600", 
                  fontSize: "16px",
                  color: "#1a1a1a",
                  wordBreak: "break-all"
                }}>
                  {email}
                </span>
              </div>
              <button 
                onClick={handleBack}
                style={{
                  background: "none",
                  border: "none",
                  color: "#4f7cff",
                  cursor: "pointer",
                  fontWeight: "500",
                  fontSize: "14px",
                  textDecoration: "underline",
                  padding: "4px 8px",
                  borderRadius: "4px",
                }}
              >
                {t.notYou}
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const password = e.target.password.value;
              handleRegister(password);
            }}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  fontSize: "14px", 
                  fontWeight: "500",
                  color: "#555"
                }}>
                  {t.password}
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder={t.password}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    border: passwordError ? "2px solid #ff4444" : "2px solid #e0e0e0",
                    borderRadius: "10px",
                    fontSize: "15px",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                    outline: "none",
                  }}
                  onFocus={(e) => {
                    if (!passwordError) {
                      e.target.style.borderColor = "#4f7cff";
                    }
                  }}
                  onBlur={(e) => {
                    if (!passwordError) {
                      e.target.style.borderColor = "#e0e0e0";
                    }
                  }}
                  onChange={() => setPasswordError("")}
                  required
                />
              </div>
              
              {passwordError && (
                <p style={{
                  color: "#ff4444",
                  fontSize: "13px",
                  marginBottom: "12px",
                  marginTop: "-8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}>
                  <span><IoIosWarning /></span> {passwordError}
                </p>
              )}
              
              <p style={{
                fontSize: "13px",
                color: "#666",
                marginBottom: "28px",
                fontStyle: "italic",
                background: "#f9f9f9",
                padding: "12px",
                borderRadius: "8px",
                borderLeft: "3px solid #4f7cff",
              }}>
                <span style={{ fontWeight: "600" }}>{t.passwordRequirement}</span>
              </p>
              
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "16px",
                  backgroundColor: "#4f7cff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  marginBottom: "20px",
                  transition: "background-color 0.2s",
                  boxShadow: "0 4px 10px rgba(79,124,255,0.3)",
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#3a5fd0"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#4f7cff"}
              >
                {t.registerAndLogin}
              </button>
            </form>
            
            <p style={{
              fontSize: "12px",
              color: "#888",
              textAlign: "center",
              lineHeight: "1.6",
              borderTop: "1px solid #eee",
              paddingTop: "20px",
              marginTop: "10px",
            }}>
              {t.termsPrefix} <a href="#" style={{ color: "#4f7cff", textDecoration: "none", fontWeight: "500", textDecoration: "underline", }}>{t.termsAndConditions}</a> {t.termsPrefix === "Bằng việc đăng nhập hoặc đăng ký, bạn được xem như đã đồng ý với" ? "và" : "and"} <a href="#" style={{ color: "#4f7cff", textDecoration: "none", fontWeight: "500", textDecoration: "underline", }}>{t.privacyPolicy}</a> {t.of} Datxe.com.
            </p>
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Auth;