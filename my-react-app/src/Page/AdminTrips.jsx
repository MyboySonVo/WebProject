import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_BASE = "http://localhost:8080/api";

const AdminTrips = () => {
  const { token, user } = useAuth();
  const [activeTab, setActiveTab] = useState("PLANE");
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingPrice, setEditingPrice] = useState({});
  const [routes, setRoutes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    routeId: "",
    vehicleId: "",
    departureDate: "",
    departureTime: "",
    arrivalTime: "",
    price: "",
    status: "ACTIVE",
  });

  // Delay modal state
  const [delayModal, setDelayModal] = useState({ show: false, trip: null, newDeparture: "", newArrival: "", reason: "", loading: false });
  // Cancel modal state
  const [cancelAdminModal, setCancelAdminModal] = useState({ show: false, trip: null, reason: "", loading: false });

  useEffect(() => {
    if (!token) return;
    loadInitialData();
  }, [token]);

  const loadInitialData = async () => {
    await Promise.all([loadTrips(), loadRoutes(), loadVehicles()]);
  };

  const loadTrips = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/admin/trips`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          setError("Không tải được danh sách chuyến bay (cần tài khoản admin).");
        } else {
          const text = await res.text();
          setError(text || `Lỗi ${res.status}. Thử lại sau.`);
        }
        setTrips([]);
        return;
      }

      const contentType = res.headers.get("content-type") || "";
      let parsed;

      // Ưu tiên parse theo JSON nếu server trả đúng content-type
      if (contentType.includes("application/json")) {
        try {
          parsed = await res.json();
        } catch (e) {
          // fallback: đọc text để hiển thị preview debug
          const text = await res.text();
          const preview = (text || "").replace(/^\uFEFF/, "").slice(0, 200);
          setError(
            `Dữ liệu trả về không đúng định dạng JSON. Preview: ${preview || "(rỗng)"}`
          );
          setTrips([]);
          return;
        }
      } else {
        // fallback: server trả text/html hoặc text/plain nhưng body vẫn có thể là JSON
        const text = await res.text();
        const cleaned = (text || "").replace(/^\uFEFF/, "").trim();
        if (!cleaned) {
          setTrips([]);
          return;
        }
        try {
          parsed = JSON.parse(cleaned);
        } catch {
          const preview = cleaned.slice(0, 200);
          setError(
            `Dữ liệu trả về không đúng định dạng. Content-Type: ${contentType || "(không có)"} · Preview: ${preview}`
          );
          setTrips([]);
          return;
        }
      }

      // Backend đôi khi trả về { data: [...] } hoặc { content: [...] }
      const data =
        Array.isArray(parsed) ? parsed : parsed?.data ?? parsed?.content ?? [];
      setTrips(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setError("Không kết nối được máy chủ. Kiểm tra backend hoặc mạng.");
    } finally {
      setLoading(false);
    }
  };

  const loadRoutes = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/routes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setRoutes(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  const loadVehicles = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/vehicles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setVehicles(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePriceChange = (id, value) => {
    setEditingPrice((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const savePrice = async (id) => {
    const raw = editingPrice[id];
    if (!raw) return;
    const value = Number(raw);
    if (Number.isNaN(value) || value <= 0) {
      setError("Giá phải là số dương.");
      return;
    }

    setError("");
    try {
      const res = await fetch(`${API_BASE}/admin/trips/${id}/price`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      await loadTrips();
    } catch (e) {
      console.error(e);
      setError("Không cập nhật được giá.");
    }
  };

  const handleCreateFieldChange = (field, value) => {
    setCreateForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submitCreateTrip = async () => {
    if (!createForm.routeId || !createForm.vehicleId || !createForm.departureDate || !createForm.departureTime || !createForm.arrivalTime || !createForm.price) {
      setError("Vui lòng nhập đầy đủ thông tin chuyến mới.");
      return;
    }
    setError("");
    setCreating(true);
    try {
      const departureTime = `${createForm.departureDate}T${createForm.departureTime}:00`;
      const arrivalTime = `${createForm.departureDate}T${createForm.arrivalTime}:00`;
      const body = {
        route: { id: Number(createForm.routeId) },
        vehicle: { id: Number(createForm.vehicleId) },
        departureTime,
        arrivalTime,
        price: Number(createForm.price),
        status: createForm.status,
      };
      const res = await fetch(`${API_BASE}/admin/trips`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      setCreateForm({
        routeId: "",
        vehicleId: "",
        departureDate: "",
        departureTime: "",
        arrivalTime: "",
        price: "",
        status: "ACTIVE",
      });
      await loadTrips();
    } catch (e) {
      console.error(e);
      setError("Không tạo được chuyến mới.");
    } finally {
      setCreating(false);
    }
  };

  const handleDelay = async () => {
    if (!delayModal.reason.trim()) { setError("Cần nhập lý do hoãn."); return; }
    setDelayModal(prev => ({ ...prev, loading: true }));
    try {
      const body = { reason: delayModal.reason };
      if (delayModal.newDeparture) body.newDepartureTime = delayModal.newDeparture;
      if (delayModal.newArrival) body.newArrivalTime = delayModal.newArrival;
      const res = await fetch(`${API_BASE}/admin/trips/${delayModal.trip.id}/delay`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(await res.text());
      setDelayModal({ show: false, trip: null, newDeparture: "", newArrival: "", reason: "", loading: false });
      await loadTrips();
    } catch (e) { setError("Lỗi hoãn: " + e.message); setDelayModal(prev => ({ ...prev, loading: false })); }
  };

  const handleCancelTrip = async () => {
    if (!cancelAdminModal.reason.trim()) { setError("Cần nhập lý do hủy."); return; }
    setCancelAdminModal(prev => ({ ...prev, loading: true }));
    try {
      const res = await fetch(`${API_BASE}/admin/trips/${cancelAdminModal.trip.id}/cancel`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ reason: cancelAdminModal.reason }),
      });
      if (!res.ok) throw new Error(await res.text());
      setCancelAdminModal({ show: false, trip: null, reason: "", loading: false });
      await loadTrips();
    } catch (e) { setError("Lỗi hủy: " + e.message); setCancelAdminModal(prev => ({ ...prev, loading: false })); }
  };

  if (!user || user.role !== "ROLE_ADMIN") {
    return (
      <div style={{ padding: 24 }}>
        <h2>Quản trị chuyến đi</h2>
        <p>Bạn cần đăng nhập bằng tài khoản admin để truy cập trang này.</p>
      </div>
    );
  }

  return (
    <div className="page-main" style={{ padding: "var(--page-padding)", paddingTop: "calc(var(--header-height) + var(--page-padding))" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
        Quản trị chuyến đi
      </h2>

      {error && (
        <p style={{ color: "red", marginBottom: 12 }}>
          {error}
        </p>
      )}

      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        {["PLANE", "BUS", "TRAIN"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: activeTab === tab ? "none" : "1px solid #ddd",
              background: activeTab === tab ? "#4f7cff" : "#fff",
              color: activeTab === tab ? "#fff" : "#333",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {tab === "PLANE" ? "Máy bay" : tab === "BUS" ? "Xe khách" : "Tàu hỏa"}
          </button>
        ))}
      </div>

      <div
        style={{
          marginBottom: 24,
          padding: 16,
          borderRadius: 8,
          border: "1px solid #eee",
          background: "#fafafa",
        }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
          Tạo chuyến đi mới ({activeTab === "PLANE" ? "Máy bay" : activeTab === "BUS" ? "Xe khách" : "Tàu hỏa"})
        </h3>
        <div className="admin-form-grid" style={{ marginBottom: 12 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, display: "block" }}>
              Tuyến (Route)
            </label>
            <select
              value={createForm.routeId}
              onChange={(e) => handleCreateFieldChange("routeId", e.target.value)}
              style={{
                width: "100%",
                padding: "6px 8px",
                borderRadius: 4,
                border: "1px solid #ddd",
              }}
            >
              <option value="">Chọn tuyến</option>
              {routes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.origin} → {r.destination}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, display: "block" }}>
              Phương tiện (Vehicle)
            </label>
            <select
              value={createForm.vehicleId}
              onChange={(e) => handleCreateFieldChange("vehicleId", e.target.value)}
              style={{
                width: "100%",
                padding: "6px 8px",
                borderRadius: 4,
                border: "1px solid #ddd",
              }}
            >
              <option value="">Chọn phương tiện</option>
              {vehicles.filter(v => v.vehicleType === activeTab).map((v) => (
                <option key={v.id} value={v.id}>
                  {v.provider?.providerName} · {v.vehicleType}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, display: "block" }}>
              Ngày bay
            </label>
            <input
              type="date"
              value={createForm.departureDate}
              onChange={(e) => handleCreateFieldChange("departureDate", e.target.value)}
              style={{
                width: "100%",
                padding: "6px 8px",
                borderRadius: 4,
                border: "1px solid #ddd",
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, display: "block" }}>
              Trạng thái
            </label>
            <select
              value={createForm.status}
              onChange={(e) => handleCreateFieldChange("status", e.target.value)}
              style={{
                width: "100%",
                padding: "6px 8px",
                borderRadius: 4,
                border: "1px solid #ddd",
              }}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>
        </div>

        <div className="admin-form-row-3" style={{ marginBottom: 12 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, display: "block" }}>
              Giờ đi (HH:MM)
            </label>
            <input
              type="time"
              value={createForm.departureTime}
              onChange={(e) => handleCreateFieldChange("departureTime", e.target.value)}
              style={{
                width: "100%",
                padding: "6px 8px",
                borderRadius: 4,
                border: "1px solid #ddd",
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, display: "block" }}>
              Giờ đến (HH:MM)
            </label>
            <input
              type="time"
              value={createForm.arrivalTime}
              onChange={(e) => handleCreateFieldChange("arrivalTime", e.target.value)}
              style={{
                width: "100%",
                padding: "6px 8px",
                borderRadius: 4,
                border: "1px solid #ddd",
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, display: "block" }}>
              Giá vé (VND)
            </label>
            <input
              type="number"
              value={createForm.price}
              onChange={(e) => handleCreateFieldChange("price", e.target.value)}
              style={{
                width: "100%",
                padding: "6px 8px",
                borderRadius: 4,
                border: "1px solid #ddd",
              }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={submitCreateTrip}
          disabled={creating}
          style={{
            padding: "8px 16px",
            borderRadius: 6,
            border: "none",
            background: "#4f7cff",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          {creating ? "Đang tạo..." : "Tạo chuyến mới"}
        </button>
      </div>

      <button
        type="button"
        onClick={loadTrips}
        style={{
          padding: "8px 14px",
          borderRadius: 6,
          border: "1px solid #ddd",
          background: "#fff",
          cursor: "pointer",
          marginBottom: 16,
        }}
        disabled={loading}
      >
        {loading ? "Đang tải..." : "Tải lại danh sách"}
      </button>

      <div className="table-wrap" style={{ border: "1px solid #eee", borderRadius: 8 }}>
        <table
          style={{
            borderCollapse: "collapse",
            fontSize: 13,
          }}
        >
          <thead>
            <tr
              style={{
                background: "#f8f9fa",
                textAlign: "left",
              }}
            >
              <th style={{ padding: 8, borderBottom: "1px solid #eee" }}>ID</th>
              <th style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                Tuyến
              </th>
              <th style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                Giờ đi
              </th>
              <th style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                Hãng
              </th>
              <th style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                Giá hiện tại
              </th>
              <th style={{ padding: 8, borderBottom: "1px solid #eee" }}>Sửa giá</th>
              <th style={{ padding: 8, borderBottom: "1px solid #eee" }}>Trạng thái</th>
              <th style={{ padding: 8, borderBottom: "1px solid #eee" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {trips.filter(t => t.vehicle?.vehicleType === activeTab).map((trip) => (
              <tr key={trip.id}>
                <td style={{ padding: 8, borderBottom: "1px solid #f3f3f3" }}>
                  {trip.id}
                </td>
                <td style={{ padding: 8, borderBottom: "1px solid #f3f3f3" }}>
                  {trip.route?.origin} → {trip.route?.destination}
                </td>
                <td style={{ padding: 8, borderBottom: "1px solid #f3f3f3" }}>
                  {trip.departureTime}
                </td>
                <td style={{ padding: 8, borderBottom: "1px solid #f3f3f3" }}>
                  {trip.vehicle?.provider?.providerName}
                </td>
                <td style={{ padding: 8, borderBottom: "1px solid #f3f3f3" }}>
                  {Number(trip.price || 0).toLocaleString("vi-VN")} đ
                </td>
                <td style={{ padding: 8, borderBottom: "1px solid #f3f3f3" }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      type="number" placeholder="Giá mới"
                      value={editingPrice[trip.id] ?? ""}
                      onChange={(e) => handlePriceChange(trip.id, e.target.value)}
                      style={{ width: 100, padding: "4px 6px", borderRadius: 4, border: "1px solid #ddd" }}
                    />
                    <button type="button" onClick={() => savePrice(trip.id)}
                      style={{ padding: "4px 10px", borderRadius: 4, border: "none", background: "#4f7cff", color: "#fff", cursor: "pointer" }}
                    >Lưu</button>
                  </div>
                </td>
                <td style={{ padding: 8, borderBottom: "1px solid #f3f3f3" }}>
                  <span style={{
                    padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700,
                    background: trip.status === "CANCELLED" ? "#fee2e2" : trip.status === "DELAYED" ? "#fef3c7" : "#dcfce7",
                    color: trip.status === "CANCELLED" ? "#dc2626" : trip.status === "DELAYED" ? "#d97706" : "#16a34a",
                  }}>{trip.status}</span>
                </td>
                <td style={{ padding: 8, borderBottom: "1px solid #f3f3f3" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => setDelayModal({ show: true, trip, newDeparture: "", newArrival: "", reason: "", loading: false })}
                      style={{ padding: "4px 10px", borderRadius: 4, border: "none", background: "#f59e0b", color: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 12 }}
                    >⏰ Hoãn</button>
                    <button onClick={() => setCancelAdminModal({ show: true, trip, reason: "", loading: false })}
                      style={{ padding: "4px 10px", borderRadius: 4, border: "none", background: "#ef4444", color: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 12 }}
                    >❌ Hủy</button>
                  </div>
                </td>
              </tr>
            ))}
            {trips.filter(t => t.vehicle?.vehicleType === activeTab).length === 0 && !loading && (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    padding: 12,
                    textAlign: "center",
                    color: "#666",
                  }}
                >
                  Chưa có chuyến đi nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {delayModal.show && delayModal.trip && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ background: "#fff", padding: 28, borderRadius: 16, width: 440, maxWidth: "95vw" }}>
            <h3 style={{ fontWeight: 800, color: "#92400e", marginBottom: 4 }}>⏰ Hoãn chuyến đi</h3>
            <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 14 }}>{delayModal.trip.route?.origin} → {delayModal.trip.route?.destination}</p>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontWeight: 600, fontSize: 12, display: "block", marginBottom: 5 }}>Giờ khởi hành mới</label>
              <input type="datetime-local" value={delayModal.newDeparture}
                onChange={e => setDelayModal(p => ({ ...p, newDeparture: e.target.value }))}
                style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ddd", boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontWeight: 600, fontSize: 12, display: "block", marginBottom: 5 }}>Lý do <span style={{ color: "red" }}>*</span></label>
              <textarea rows={3} value={delayModal.reason} onChange={e => setDelayModal(p => ({ ...p, reason: e.target.value }))}
                placeholder="Ví dụ: Thời tiết xấu..." maxLength={300}
                style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ddd", boxSizing: "border-box", resize: "vertical" }} />
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setDelayModal({ show: false, trip: null, newDeparture: "", newArrival: "", reason: "", loading: false })}
                style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #ddd", background: "#fff", cursor: "pointer" }}>Hủy</button>
              <button onClick={handleDelay} disabled={delayModal.loading}
                style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: "#f59e0b", color: "#fff", cursor: "pointer", fontWeight: 700 }}>
                {delayModal.loading ? "Đang xử lý..." : "Xác nhận Hoãn"}
              </button>
            </div>
          </div>
        </div>
      )}

      {cancelAdminModal.show && cancelAdminModal.trip && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ background: "#fff", padding: 28, borderRadius: 16, width: 420, maxWidth: "95vw" }}>
            <h3 style={{ fontWeight: 800, color: "#dc2626", marginBottom: 4 }}>❌ Hủy chuyến đi</h3>
            <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>{cancelAdminModal.trip.route?.origin} → {cancelAdminModal.trip.route?.destination}</p>
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 12 }}>
              ⚠️ Booking CONFIRMED/PAID sẽ bị hủy và hoàn tiền 100%. Email thông báo gửi tự động.
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontWeight: 600, fontSize: 12, display: "block", marginBottom: 5 }}>Lý do <span style={{ color: "red" }}>*</span></label>
              <textarea rows={3} value={cancelAdminModal.reason} onChange={e => setCancelAdminModal(p => ({ ...p, reason: e.target.value }))}
                placeholder="Ví dụ: Sự cố kỹ thuật..." maxLength={300}
                style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ddd", boxSizing: "border-box", resize: "vertical" }} />
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setCancelAdminModal({ show: false, trip: null, reason: "", loading: false })}
                style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #ddd", background: "#fff", cursor: "pointer" }}>Đóng</button>
              <button onClick={handleCancelTrip} disabled={cancelAdminModal.loading}
                style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: "#ef4444", color: "#fff", cursor: "pointer", fontWeight: 700 }}>
                {cancelAdminModal.loading ? "Đang xử lý..." : "Xác nhận Hủy"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTrips;


