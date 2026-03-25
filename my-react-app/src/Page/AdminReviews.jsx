import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminReviews = () => {
  const { t } = useLanguage();
  const { user, token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!isAuthenticated || (user?.role !== "ROLE_ADMIN" && user?.role !== "ROLE_PROVIDER")) {
      navigate("/");
      return;
    }

    const fetchReviews = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/reviews/all", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReviews(res.data);
      } catch (err) {
        console.error(err);
        setError("Lỗi tải đánh giá");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [isAuthenticated, user, token, navigate]);

  const filteredReviews = reviews.filter(r => 
    (r.providerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.tripOrigin || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.tripDestination || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.comment || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: "40px", marginTop: "80px", background: "#f5f7fa", minHeight: "100vh" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "20px", color: "#333" }}>
        {user?.role === "ROLE_PROVIDER" ? "Danh sách Đánh giá (Nhà cung cấp)" : "Quản lý Đánh giá"}
      </h2>
      
      <div style={{ marginBottom: "20px" }}>
        <input 
          type="text" 
          placeholder="Tìm kiếm theo chuyến bay, hãng, hoặc nội dung..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ padding: "10px", width: "300px", borderRadius: "8px", border: "1px solid #ddd" }}
        />
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div style={{ background: "#fff", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc", textAlign: "left", color: "#64748b", fontSize: "14px" }}>
                <th style={{ padding: "16px", borderBottom: "1px solid #eee" }}>ID</th>
                <th style={{ padding: "16px", borderBottom: "1px solid #eee" }}>Người dùng</th>
                <th style={{ padding: "16px", borderBottom: "1px solid #eee" }}>Nhà cung cấp</th>
                <th style={{ padding: "16px", borderBottom: "1px solid #eee" }}>Hành trình</th>
                <th style={{ padding: "16px", borderBottom: "1px solid #eee" }}>Số sao</th>
                <th style={{ padding: "16px", borderBottom: "1px solid #eee" }}>Bình luận</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: "20px", textAlign: "center", color: "#888" }}>Không tìm thấy đánh giá.</td></tr>
              ) : (
                filteredReviews.map(r => (
                  <tr key={r.id} style={{ borderBottom: "1px solid #eee", fontSize: "14px", color: "#333" }}>
                    <td style={{ padding: "16px" }}>#{r.id}</td>
                    <td style={{ padding: "16px", fontWeight: 600 }}>{r.userName}</td>
                    <td style={{ padding: "16px", color: "#ff6b00", fontWeight: 600 }}>{r.providerName || "N/A"}</td>
                    <td style={{ padding: "16px" }}>{r.tripOrigin} → {r.tripDestination}</td>
                    <td style={{ padding: "16px", color: "#f59e0b", fontWeight: "bold" }}>{"⭐".repeat(r.rating)}</td>
                    <td style={{ padding: "16px", maxWidth: "300px" }}>{r.comment}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
