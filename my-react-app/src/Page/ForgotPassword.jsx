import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [step, setStep] = useState(1); 
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const navigate = useNavigate();

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            await axios.post("http://localhost:8080/api/auth/forgot-password", { email });
            setStep(2);
            setMessage({ type: "success", text: "Mã OTP đã được gửi đến email của bạn!" });
        } catch (err) {
            setMessage({ type: "error", text: err.response?.data?.message || "Không tìm thấy tài khoản với email này." });
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage({ type: "error", text: "Mật khẩu xác nhận không khớp." });
            return;
        }

        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            await axios.post("http://localhost:8080/api/auth/reset-password", {
                email,
                newPassword,
                otpCode: otp
            });
            setMessage({ type: "success", text: "Đổi mật khẩu thành công! Chuyển hướng về trang đăng nhập..." });
            setTimeout(() => {
                navigate("/auth");
            }, 3000);
        } catch (err) {
            setMessage({ type: "error", text: err.response?.data?.message || "Mã OTP không đúng hoặc đã hết hạn." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            minHeight: "100vh", 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            padding: "20px"
        }}>
            <div style={{ 
                background: "#fff", 
                padding: "40px", 
                borderRadius: "24px", 
                boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
                width: "100%",
                maxWidth: "450px"
            }}>
                <h2 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "10px", color: "#111827", textAlign: "center" }}>
                    {step === 1 ? "Quên mật khẩu" : "Đặt lại mật khẩu"}
                </h2>
                <p style={{ color: "#666", textAlign: "center", marginBottom: "30px", fontSize: "14px" }}>
                    {step === 1 
                        ? "Nhập email của bạn để nhận mã xác thực OTP." 
                        : "Vui lòng nhập mã OTP đã gửi đến email và mật khẩu mới."}
                </p>

                {message.text && (
                    <div style={{ 
                        padding: "12px 16px", 
                        borderRadius: "12px", 
                        marginBottom: "20px",
                        fontSize: "14px",
                        fontWeight: "500",
                        backgroundColor: message.type === "success" ? "#dcfce7" : "#fee2e2",
                        color: message.type === "success" ? "#16a34a" : "#dc2626",
                        border: `1px solid ${message.type === "success" ? "#bbf7d0" : "#fecaca"}`
                    }}>
                        {message.text}
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleRequestOTP}>
                        <div style={{ marginBottom: "25px" }}>
                            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#374151" }}>Email tài khoản</label>
                            <input 
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@gmail.com"
                                style={{
                                    width: "100%",
                                    padding: "14px",
                                    borderRadius: "12px",
                                    border: "1px solid #ddd",
                                    outline: "none",
                                    fontSize: "15px"
                                }}
                            />
                        </div>
                        <button 
                            disabled={loading}
                            type="submit"
                            style={{
                                width: "100%",
                                padding: "14px",
                                borderRadius: "12px",
                                border: "none",
                                background: "#4f7cff",
                                color: "#fff",
                                fontWeight: "700",
                                cursor: loading ? "not-allowed" : "pointer",
                                opacity: loading ? 0.7 : 1,
                                fontSize: "16px"
                            }}
                        >
                            {loading ? "Đang gửi..." : "Gửi mã OTP"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword}>
                        <div style={{ marginBottom: "20px" }}>
                            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#374151" }}>Nhập mã OTP (6 số)</label>
                            <input 
                                type="text"
                                required
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="000000"
                                style={{
                                    width: "100%",
                                    padding: "14px",
                                    borderRadius: "12px",
                                    border: "1px solid #ddd",
                                    outline: "none",
                                    fontSize: "18px",
                                    textAlign: "center",
                                    letterSpacing: "8px",
                                    fontWeight: "700"
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: "20px" }}>
                            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#374151" }}>Mật khẩu mới</label>
                            <input 
                                type="password"
                                required
                                minLength={6}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "14px",
                                    borderRadius: "12px",
                                    border: "1px solid #ddd",
                                    outline: "none",
                                    fontSize: "15px"
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: "25px" }}>
                            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#374151" }}>Xác nhận mật khẩu mới</label>
                            <input 
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "14px",
                                    borderRadius: "12px",
                                    border: "1px solid #ddd",
                                    outline: "none",
                                    fontSize: "15px"
                                }}
                            />
                        </div>
                        <button 
                            disabled={loading}
                            type="submit"
                            style={{
                                width: "100%",
                                padding: "14px",
                                borderRadius: "12px",
                                border: "none",
                                background: "#20c997",
                                color: "#fff",
                                fontWeight: "700",
                                cursor: loading ? "not-allowed" : "pointer",
                                opacity: loading ? 0.7 : 1,
                                fontSize: "16px"
                            }}
                        >
                            {loading ? "Đang xác nhận..." : "Cập nhật mật khẩu"}
                        </button>
                        <button 
                            type="button"
                            onClick={() => setStep(1)}
                            style={{
                                width: "100%",
                                padding: "12px",
                                marginTop: "12px",
                                borderRadius: "12px",
                                border: "1px solid #ddd",
                                background: "#fff",
                                color: "#666",
                                fontWeight: "600",
                                cursor: "pointer",
                                fontSize: "14px"
                            }}
                        >
                            Quay lại
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
