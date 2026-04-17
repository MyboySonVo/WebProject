import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../LayOut/Header";
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../context/LanguageContext";

const ProviderRefunds = () => {
  const { user, token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [filter, setFilter] = useState("ALL");

  // Modal cho reject
  const [rejectModal, setRejectModal] = useState({ show: false, refundId: null, note: "", loading: false });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "ROLE_ADMIN") {
      setError("Vui lòng đăng nhập với tài khoản Admin.");
      setLoading(false);
      return;
    }
    fetchRefunds();
  }, [isAuthenticated, user, token]);

  const fetchRefunds = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/refunds/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRefunds(res.data);
    } catch (err) {
      console.error(err);
      setError("Lỗi tải danh sách yêu cầu hoàn tiền");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (refundId) => {
    if (!window.confirm("Bạn xác nhận duyệt hoàn tiền cho yêu cầu này?")) return;
    try {
      await axios.put(`/api/refunds/${refundId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchRefunds();
      alert("Đã duyệt hoàn tiền thành công!");
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || err.message));
    }
  };

  const openRejectModal = (refundId) => {
    setRejectModal({ show: true, refundId, note: "", loading: false });
  };

  const handleReject = async () => {
    try {
      setRejectModal(prev => ({ ...prev, loading: true }));
      await axios.put(`/api/refunds/${rejectModal.refundId}/reject`, 
        { note: rejectModal.note },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRejectModal({ show: false, refundId: null, note: "", loading: false });
      await fetchRefunds();
      alert("Đã từ chối yêu cầu hoàn tiền.");
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || err.message));
      setRejectModal(prev => ({ ...prev, loading: false }));
    }
  };

  const filteredRefunds = filter === "ALL" ? refunds : refunds.filter(r => r.status === filter);

  const statusMap = {
    PENDING: { bg: "#fef3c7", color: "#ca8a04", text: t.pendingFilter },
    APPROVED: { bg: "#dcfce7", color: "#16a34a", text: t.approvedFilter },
    REJECTED: { bg: "#fee2e2", color: "#dc2626", text: t.rejectedFilter },
    COMPLETED: { bg: "#dcfce7", color: "#16a34a", text: t.completed },
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-main)", display: "flex", flexDirection: "column" }}>
      <Header setIsSidebarOpen={setIsSidebarOpen} />
      <div className="page-with-sidebar" style={{ display: "flex", flex: 1, marginTop: "70px" }}>
        <Sidebar isOpen={isSidebarOpen} />
        <div className={`page-main ${isSidebarOpen ? "with-sidebar" : ""}`} style={{ padding: "30px", flex: 1, overflowY: "auto" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, color: "#1e293b" }}>
              Quản lý Yêu cầu Hoàn tiền
            </h1>

            {error && (
              <div style={{ padding: "20px", background: "#fee2e2", color: "#dc2626", borderRadius: "12px", marginBottom: "20px", fontWeight: 600, textAlign: "center" }}>
                ⚠️ {error}
              </div>
            )}

            {/* Filter Tabs */}
            <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
              {[
                { key: "ALL", label: t.allFilter, count: refunds.length },
                { key: "PENDING", label: t.pendingFilter, count: refunds.filter(r => r.status === "PENDING").length },
                { key: "APPROVED", label: t.approvedFilter, count: refunds.filter(r => r.status === "APPROVED").length },
                { key: "REJECTED", label: t.rejectedFilter, count: refunds.filter(r => r.status === "REJECTED").length }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  style={{
                    padding: "8px 16px", borderRadius: 20,
                    border: filter === tab.key ? "2px solid #2563eb" : "1px solid #e2e8f0",
                    background: filter === tab.key ? "#eff6ff" : "white",
                    color: filter === tab.key ? "#2563eb" : "#64748b",
                    fontWeight: 600, fontSize: 13, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 6
                  }}
                >
                  {tab.label}
                  <span style={{
                    background: filter === tab.key ? "#2563eb" : "#e2e8f0",
                    color: filter === tab.key ? "white" : "#64748b",
                    borderRadius: "50%", width: 22, height: 22,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700
                  }}>{tab.count}</span>
                </button>
              ))}
            </div>

            {loading ? (
              <p style={{ color: "var(--text-secondary)" }}>Đang tải...</p>
            ) : filteredRefunds.length === 0 ? (
              <div style={{ background: "var(--bg-card)", padding: 40, borderRadius: 12, textAlign: "center", color: "var(--text-secondary)", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                Không có yêu cầu hoàn tiền nào.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {filteredRefunds.map(r => {
                  const st = statusMap[r.status] || { bg: "#f3f4f6", color: "#6b7280", text: r.status };
                  return (
                    <div key={r.id} style={{
                      background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 12,
                      padding: 20, boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
                      borderLeft: r.status === "PENDING" ? "4px solid #f59e0b" : r.status === "APPROVED" ? "4px solid #10b981" : r.status === "REJECTED" ? "4px solid #ef4444" : "4px solid #e5e7eb"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                            <span style={{ background: st.bg, color: st.color, padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                              {st.text}
                            </span>
                            <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 600 }}>#{r.id}</span>
                            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>• Booking #{r.bookingId}</span>
                          </div>

                          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: "#1e293b" }}>
                            {r.origin} → {r.destination}
                          </div>
                          <div style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>
                            {r.vehicleType === "PLANE" ? "✈️" : r.vehicleType === "BUS" ? "🚌" : "🚂"} {r.providerName}
                            <span style={{ margin: "0 8px" }}>•</span>
                            👤 {r.userName}
                          </div>

                          {r.reason && (
                            <div style={{ background: "var(--bg-input)", border: "1px solid #e5e7eb", padding: 12, borderRadius: 8, marginBottom: 8, fontSize: 13, color: "#374151" }}>
                              <b>{t.refundReason}:</b> {r.reason}
                            </div>
                          )}

                          {r.providerNote && (
                            <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", padding: 12, borderRadius: 8, marginBottom: 8, fontSize: 13, color: "#991b1b" }}>
                              <b>{t.providerNoteText}:</b> {r.providerNote}
                            </div>
                          )}

                          <div style={{ fontSize: 12, color: "#9ca3af" }}>
                            {t.sentAt}: {r.requestedAt ? new Date(r.requestedAt).toLocaleString("vi-VN") : "N/A"}
                            {r.refundDate && <span> • {t.processedAt}: {new Date(r.refundDate).toLocaleString("vi-VN")}</span>}
                          </div>
                        </div>

                        <div style={{ textAlign: "right", minWidth: 150 }}>
                          <div style={{ fontSize: 18, fontWeight: 800, color: "#ff6b00", marginBottom: 12 }}>
                            {r.refundAmount?.toLocaleString("vi-VN")} đ
                          </div>
                          
                          {r.status === "PENDING" && (
                            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                              <button
                                onClick={() => handleApprove(r.id)}
                                style={{
                                  padding: "8px 16px", borderRadius: 8, border: "none",
                                  background: "#10b981", color: "white", fontWeight: 700,
                                  cursor: "pointer", fontSize: 13
                                }}
                              >
                                ✓ Duyệt
                              </button>
                              <button
                                onClick={() => openRejectModal(r.id)}
                                style={{
                                  padding: "8px 16px", borderRadius: 8,
                                  border: "1px solid #ef4444", background: "white",
                                  color: "#ef4444", fontWeight: 700,
                                  cursor: "pointer", fontSize: 13
                                }}
                              >
                                ✕ Từ chối
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Từ chối */}
      {rejectModal.show && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: 20 }}>
          <div style={{ background: "var(--bg-card)", padding: 32, borderRadius: 16, width: "100%", maxWidth: 420, boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, color: "var(--text-heading)" }}>
              Từ chối yêu cầu hoàn tiền
            </h3>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontWeight: 700, fontSize: 14, display: "block", marginBottom: 8 }}>{t.rejectReasonLabel}</label>
              <textarea
                value={rejectModal.note}
                onChange={e => setRejectModal(prev => ({ ...prev, note: e.target.value }))}
                placeholder="Nhập lý do từ chối..."
                rows={3}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14, resize: "vertical", outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button
                onClick={() => setRejectModal({ show: false, refundId: null, note: "", loading: false })}
                style={{ padding: "10px 20px", borderRadius: 8, border: "1px solid var(--border-input)", background: "var(--bg-card)", fontWeight: 700, cursor: "pointer", color: "var(--text-secondary)" }}
              >
                Hủy
              </button>
              <button
                onClick={handleReject}
                disabled={rejectModal.loading}
                style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "#ef4444", color: "#fff", fontWeight: 700, cursor: rejectModal.loading ? "not-allowed" : "pointer" }}
              >
                {rejectModal.loading ? "Đang xử lý..." : "Xác nhận Từ chối"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderRefunds;
