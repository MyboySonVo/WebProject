import React, { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import Header from "../LayOut/Header";
import Sidebar from "../components/Sidebar"; 
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";

const AirlineTickets = () => {
  const { t } = useLanguage();
  const { token, isAuthenticated } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
  const [from, setFrom] = useState("HAN");
  const [to, setTo] = useState("SGN");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [step, setStep] = useState("search"); // search | chooseTrip | passenger | extras | review

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [calendarData, setCalendarData] = useState([]);

  const [servicesLoading, setServicesLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);

  const [passengerInfo, setPassengerInfo] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    nationality: "Việt Nam",
    phoneDigits: "",
    email: "",
    memberCode: "",
    promoOptIn: true,
    remember: false,
  });

  const [submitLoading, setSubmitLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE = "http://localhost:8080/api";
  const todayISO = useMemo(() => new Date().toISOString().split("T")[0], []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const qFrom = params.get("from");
    const qTo = params.get("to");
    const qDate = params.get("date");
    const qPassengers = params.get("passengers");
    const mode = params.get("mode");

    if (qFrom) setFrom(qFrom);
    if (qTo) setTo(qTo);
    if (qDate) setDate(qDate);
    if (qPassengers) {
      const n = Number(qPassengers);
      if (!Number.isNaN(n) && n > 0) setPassengers(n);
    }

    if (qFrom && qTo && qPassengers && mode === "calendar") {
      // Từ trang chủ: mở thẳng lịch giá
      setTimeout(() => {
        loadCalendar();
      }, 0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (passengerInfo.remember) {
      localStorage.setItem("guestPassengerDraft", JSON.stringify(passengerInfo));
    }
  }, [passengerInfo]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("guestPassengerDraft");
      if (saved) {
        const parsed = JSON.parse(saved);
        setPassengerInfo((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!from || !to || !date) {
      setError("Vui lòng nhập đầy đủ điểm đi, điểm đến và ngày đi");
      return;
    }
    setError("");
    setLoading(true);
    setSelectedTrip(null);
    setSeats([]);
    setSelectedSeatIds([]);
    setSelectedServiceIds([]);
    setBookingResult(null);

    try {
      const params = new URLSearchParams({
        from,
        to,
        date,
        type: "PLANE",
        passengers: String(passengers || 1),
      });

      const res = await fetch(`${API_BASE}/trips/search?${params.toString()}`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Lỗi HTTP ${res.status}`);
      }
      const data = await res.json();
      setTrips(data);
      setStep("chooseTrip");
    } catch (err) {
      console.error(err);
      setError("Không tìm được chuyến bay. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const loadCalendar = async () => {
    if (!from || !to) {
      setError("Vui lòng nhập đầy đủ điểm đi và điểm đến để xem lịch giá.");
      return;
    }

    setError("");
    setCalendarLoading(true);
    setCalendarOpen(true);

    try {
      const base = date || todayISO;
      const start = base < todayISO ? todayISO : base;
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);
      const end = endDate.toISOString().split("T")[0];

      const params = new URLSearchParams({
        from,
        to,
        start,
        end,
        type: "PLANE",
        passengers: String(passengers || 1),
      });

      const res = await fetch(`${API_BASE}/trips/calendar?${params.toString()}`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Lỗi HTTP ${res.status}`);
      }
      const data = await res.json();
      setCalendarData(data || []);
    } catch (err) {
      console.error(err);
      setError("Không tải được lịch giá. Vui lòng thử lại.");
    } finally {
      setCalendarLoading(false);
    }
  };

  const loadServices = async () => {
    setServicesLoading(true);
    try {
      const res = await fetch(`${API_BASE}/additional-services`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Lỗi HTTP ${res.status}`);
      }
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Không tải được danh sách dịch vụ bổ sung.");
    } finally {
      setServicesLoading(false);
    }
  };

  const handleSelectTrip = async (trip) => {
    setSelectedTrip(trip);
    setSeats([]);
    setSelectedSeatIds([]);
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/trips/${trip.id}/seats`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Lỗi HTTP ${res.status}`);
      }
      const data = await res.json();
      setSeats(data);
      setStep("passenger");
    } catch (err) {
      console.error(err);
      setError("Không tải được danh sách ghế. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSeat = (seat) => {
    if (seat.booked) return;

    setSelectedSeatIds((prev) => {
      const exists = prev.includes(seat.id);
      if (exists) {
        return prev.filter((id) => id !== seat.id);
      }

      if (prev.length >= (passengers || 1)) {
        return prev;
      }
      return [...prev, seat.id];
    });
  };

  const categories = useMemo(() => {
    const byName = (prefix) => services.filter((s) => (s.serviceName || "").startsWith(prefix));
    return {
      seat: byName("Chọn chỗ"),
      baggage: byName("Hành lý"),
      meal: byName("Suất ăn"),
      insurance: services.filter((s) => (s.serviceName || "").includes("Bảo hiểm")),
      taxi: services.filter((s) => (s.serviceName || "").includes("Taxi")),
    };
  }, [services]);

  const setSingleServiceInCategory = (serviceId, categoryServices) => {
    const categoryIds = categoryServices.map((s) => s.id);
    setSelectedServiceIds((prev) => {
      const filtered = prev.filter((id) => !categoryIds.includes(id));
      if (!serviceId) return filtered;
      return [...filtered, serviceId];
    });
  };

  const toggleService = (serviceId) => {
    setSelectedServiceIds((prev) => {
      if (prev.includes(serviceId)) return prev.filter((id) => id !== serviceId);
      return [...prev, serviceId];
    });
  };

  const validatePassenger = () => {
    const firstName = passengerInfo.firstName.trim();
    const lastName = passengerInfo.lastName.trim();
    const dob = passengerInfo.dob.trim();
    const email = passengerInfo.email.trim();
    const digits = passengerInfo.phoneDigits.trim();

    if (!firstName || !lastName || !dob || !email || !digits) {
      return "Vui lòng nhập đầy đủ thông tin hành khách bắt buộc.";
    }

    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dob)) {
      return "Ngày sinh phải theo định dạng DD/MM/YYYY.";
    }

    if (!/^\d{9,10}$/.test(digits)) {
      return "Số điện thoại phải gồm 9-10 chữ số (không gồm +84).";
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return "Email không đúng định dạng.";
    }

    return null;
  };

  const goToExtras = async () => {
    const msg = validatePassenger();
    if (msg) {
      setError(msg);
      return;
    }

    if (!selectedSeatIds.length) {
      setError("Vui lòng chọn ghế trước khi tiếp tục.");
      return;
    }

    setError("");
    await loadServices();
    setStep("extras");
  };

  const goToReview = () => {
    setError("");
    setStep("review");
  };

  const submitBooking = async () => {
    if (!isAuthenticated || !token) {
      setError("Vui lòng đăng nhập trước khi đặt vé.");
      return;
    }

    if (!selectedTrip) {
      setError("Vui lòng chọn chuyến bay.");
      return;
    }

    if (!selectedSeatIds.length) {
      setError("Vui lòng chọn ghế.");
      return;
    }

    setError("");
    setSubmitLoading(true);

    try {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tripId: selectedTrip.id,
          seatIds: selectedSeatIds,
          additionalServiceIds: selectedServiceIds,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        const message = data?.message || "Đặt vé thất bại. Vui lòng thử lại.";
        setError(message);
        setSubmitLoading(false);
        return;
      }

      setBookingResult(data);
    } catch (err) {
      console.error(err);
      setError("Không thể kết nối đến máy chủ để đặt vé.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const seatsByRow = useMemo(() => {
    const parse = (seatNumber) => {
      const match = String(seatNumber || "").match(/^(\d+)([A-Za-z])$/);
      if (!match) return null;
      return { row: Number(match[1]), col: match[2].toUpperCase() };
    };

    const items = seats
      .map((s) => {
        const parsed = parse(s.seatNumber);
        if (!parsed) return null;
        return { ...s, row: parsed.row, col: parsed.col };
      })
      .filter(Boolean);

    const cols = Array.from(new Set(items.map((i) => i.col))).sort();
    const rows = Array.from(new Set(items.map((i) => i.row))).sort((a, b) => a - b);

    const map = new Map();
    for (const item of items) {
      map.set(`${item.row}${item.col}`, item);
    }

    return { cols, rows, map };
  }, [seats]);

  const selectedSeatNumbers = useMemo(() => {
    const byId = new Map(seats.map((s) => [s.id, s.seatNumber]));
    return selectedSeatIds.map((id) => byId.get(id)).filter(Boolean);
  }, [seats, selectedSeatIds]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
     
      <Header setIsSidebarOpen={setIsSidebarOpen} />
      
      <div className="page-with-sidebar">
        <Sidebar isOpen={isSidebarOpen} />
        <div
          className={`page-main ${isSidebarOpen ? "with-sidebar" : ""}`}
          style={{ backgroundColor: "#f8f9fa" }}
        >
          <div className="page-content-wrap" style={{ maxWidth: "1200px" }}>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: "700",
                color: "#333",
                marginBottom: "30px",
              }}
            >
              {t.flight}
            </h1>

            <div
              style={{
                background: "#fff",
                borderRadius: "12px",
                padding: "24px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                marginBottom: "24px",
              }}
            >
              <form onSubmit={handleSearch} className="search-form-grid">
                <div>
                  <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
                    {t.from} (VD: HAN)
                  </label>
                  <input
                    type="text"
                    value={from}
                    onChange={(e) => setFrom(e.target.value.toUpperCase())}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: "1px solid #ddd",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
                    {t.to} (VD: SGN)
                  </label>
                  <input
                    type="text"
                    value={to}
                    onChange={(e) => setTo(e.target.value.toUpperCase())}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: "1px solid #ddd",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
                    {t.departureDate}
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={todayISO}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: "1px solid #ddd",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
                    {t.passengers}
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={passengers}
                    onChange={(e) => setPassengers(Number(e.target.value) || 1)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: "1px solid #ddd",
                      marginBottom: 8,
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 8,
                      border: "none",
                      backgroundColor: "#ff6b00",
                      color: "#fff",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                    disabled={loading}
                  >
                    {loading ? "Đang tìm kiếm..." : t.search}
                  </button>
                  <button
                    type="button"
                    onClick={loadCalendar}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 8,
                      border: "1px solid #ddd",
                      backgroundColor: "#fff",
                      color: "#333",
                      fontWeight: 600,
                      cursor: "pointer",
                      marginTop: 8,
                    }}
                    disabled={calendarLoading}
                  >
                    {calendarLoading ? "Đang tải lịch giá..." : "Tìm chuyến bay rẻ nhất"}
                  </button>
                </div>
              </form>

              {calendarOpen && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #eee" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ fontWeight: 700 }}>Lịch giá 30 ngày tới</div>
                    <button
                      type="button"
                      onClick={() => setCalendarOpen(false)}
                      style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        fontSize: 18,
                        color: "#666",
                      }}
                    >
                      ×
                    </button>
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {calendarData.map((d) => (
                      <button
                        key={d.date}
                        type="button"
                        disabled={!d.available}
                        onClick={() => {
                          if (!d.available) return;
                          setDate(d.date);
                          setCalendarOpen(false);
                        }}
                        style={{
                          width: 150,
                          padding: "10px 12px",
                          borderRadius: 10,
                          border: "1px solid #eee",
                          background: d.available ? "#fff" : "#f5f5f5",
                          cursor: d.available ? "pointer" : "not-allowed",
                          textAlign: "left",
                        }}
                      >
                        <div style={{ fontWeight: 700, color: "#333" }}>{d.date}</div>
                        <div style={{ marginTop: 6, color: d.available ? "#ff6b00" : "#999", fontWeight: 700 }}>
                          {d.minPrice != null ? `${Number(d.minPrice).toLocaleString("vi-VN")} đ` : "—"}
                        </div>
                      </button>
                    ))}
                  </div>

                  {!calendarLoading && calendarData.every((d) => !d.available) && (
                    <p style={{ marginTop: 12, color: "#666", fontSize: 13 }}>
                      Hiện chưa có chuyến bay phù hợp trong khoảng ngày này. Bạn có thể bỏ chọn "tìm vé rẻ nhất"
                      và dùng tìm kiếm thường, hoặc đổi điểm đi/điểm đến/ngày khác.
                    </p>
                  )}
                </div>
              )}

              {error && (
                <p style={{ marginTop: 16, color: "red" }}>
                  {error}
                </p>
              )}
            </div>

            {step === "chooseTrip" && trips.length > 0 && (
              <div
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: 24,
                  boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                  marginBottom: 24,
                }}
              >
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 600,
                    marginBottom: 16,
                  }}
                >
                  Danh sách chuyến bay
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {trips.map((trip) => (
                    <button
                      key={trip.id}
                      onClick={() => handleSelectTrip(trip)}
                      style={{
                        textAlign: "left",
                        padding: 16,
                        borderRadius: 10,
                        border: "1px solid #eee",
                        backgroundColor:
                          selectedTrip && selectedTrip.id === trip.id ? "#fff7ec" : "#fff",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 8,
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600 }}>
                            {trip.origin} → {trip.destination}
                          </div>
                          <div style={{ fontSize: 13, color: "#666" }}>
                            Khởi hành: {trip.departureTime}
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontWeight: 700, color: "#ff6b00" }}>
                            {trip.price?.toLocaleString("vi-VN")} đ
                          </div>
                          <div style={{ fontSize: 13, color: "#666" }}>
                            Còn {trip.availableSeats}/{trip.totalSeats} chỗ
                          </div>
                        </div>
                      </div>
                      <div style={{ fontSize: 13, color: "#666" }}>
                        {trip.providerName} · {trip.vehicleType}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedTrip && step === "passenger" && (
              <div
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: 24,
                  boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                }}
              >
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 600,
                    marginBottom: 16,
                  }}
                >
                  Bước 1: Chọn ghế & điền thông tin hành khách
                </h2>
                {loading && seats.length === 0 && <p>Đang tải ghế...</p>}
                {!loading && seats.length === 0 && (
                  <p>Chưa có dữ liệu ghế cho chuyến này.</p>
                )}
                {seats.length > 0 && (
                  <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 16 }}>
                    <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16, background: "#fafafa" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                        <div style={{ fontWeight: 700 }}>Sơ đồ ghế</div>
                        <div style={{ fontSize: 13, color: "#666" }}>
                          Đã chọn: {selectedSeatIds.length}/{passengers || 1}
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8, maxHeight: 420, overflow: "auto" }}>
                        {seatsByRow.rows.map((row) => (
                          <div key={row} style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: 10, alignItems: "center" }}>
                            <div style={{ fontWeight: 700, color: "#666" }}>H{row}</div>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                              {seatsByRow.cols.map((col) => {
                                const s = seatsByRow.map.get(`${row}${col}`);
                                if (!s) return null;
                                const selected = selectedSeatIds.includes(s.id);
                                return (
                                  <button
                                    key={s.id}
                                    type="button"
                                    onClick={() => toggleSeat(s)}
                                    disabled={s.booked}
                                    style={{
                                      width: 46,
                                      height: 36,
                                      borderRadius: 10,
                                      border: "1px solid #ddd",
                                      cursor: s.booked ? "not-allowed" : "pointer",
                                      background: s.booked ? "#eee" : selected ? "#4f7cff" : "#fff",
                                      color: s.booked ? "#999" : selected ? "#fff" : "#333",
                                      fontWeight: 700,
                                      fontSize: 12,
                                    }}
                                    title={`${s.seatNumber} · ${s.seatType || "ECO"}`}
                                  >
                                    {s.col}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: "flex", gap: 12, marginTop: 12, fontSize: 12, color: "#666" }}>
                        <div><span style={{ display: "inline-block", width: 12, height: 12, background: "#4f7cff", borderRadius: 3, marginRight: 6 }} />Đã chọn</div>
                        <div><span style={{ display: "inline-block", width: 12, height: 12, background: "#eee", borderRadius: 3, marginRight: 6 }} />Đã đặt</div>
                        <div><span style={{ display: "inline-block", width: 12, height: 12, background: "#fff", border: "1px solid #ddd", borderRadius: 3, marginRight: 6 }} />Còn trống</div>
                      </div>
                    </div>

                    <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
                      <div style={{ fontWeight: 700, marginBottom: 12 }}>Thông tin hành khách (bắt buộc)</div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <div>
                          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Họ</label>
                          <input
                            value={passengerInfo.lastName}
                            onChange={(e) => setPassengerInfo((p) => ({ ...p, lastName: e.target.value }))}
                            style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd" }}
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Tên & tên đệm</label>
                          <input
                            value={passengerInfo.firstName}
                            onChange={(e) => setPassengerInfo((p) => ({ ...p, firstName: e.target.value }))}
                            style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd" }}
                          />
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
                        <div>
                          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Ngày sinh (DD/MM/YYYY)</label>
                          <input
                            value={passengerInfo.dob}
                            onChange={(e) => setPassengerInfo((p) => ({ ...p, dob: e.target.value }))}
                            placeholder="DD/MM/YYYY"
                            style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd" }}
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Quốc gia</label>
                          <select
                            value={passengerInfo.nationality}
                            onChange={(e) => setPassengerInfo((p) => ({ ...p, nationality: e.target.value }))}
                            style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd" }}
                          >
                            {["Việt Nam", "Nhật Bản", "Đài Loan", "Anh", "Mỹ", "Hàn Quốc", "Úc"].map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div style={{ marginTop: 12 }}>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Số điện thoại</label>
                        <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 8 }}>
                          <input value="+84" readOnly style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd", background: "#f5f5f5" }} />
                          <input
                            value={passengerInfo.phoneDigits}
                            onChange={(e) => setPassengerInfo((p) => ({ ...p, phoneDigits: e.target.value.replace(/\D/g, "") }))}
                            placeholder="VD: 912345678"
                            style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd" }}
                          />
                        </div>
                      </div>

                      <div style={{ marginTop: 12 }}>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Email</label>
                        <input
                          value={passengerInfo.email}
                          onChange={(e) => setPassengerInfo((p) => ({ ...p, email: e.target.value }))}
                          style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd" }}
                        />
                      </div>

                      <div style={{ marginTop: 12 }}>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Mã hội viên (nếu có)</label>
                        <input
                          value={passengerInfo.memberCode}
                          onChange={(e) => setPassengerInfo((p) => ({ ...p, memberCode: e.target.value }))}
                          style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd" }}
                        />
                      </div>

                      <div style={{ display: "flex", gap: 12, marginTop: 12, alignItems: "center" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                          <input
                            type="checkbox"
                            checked={passengerInfo.promoOptIn}
                            onChange={(e) => setPassengerInfo((p) => ({ ...p, promoOptIn: e.target.checked }))}
                          />
                          Nhận thông tin khuyến mãi/ưu đãi
                        </label>
                      </div>

                      <div style={{ display: "flex", gap: 12, marginTop: 8, alignItems: "center" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                          <input
                            type="checkbox"
                            checked={passengerInfo.remember}
                            onChange={(e) => setPassengerInfo((p) => ({ ...p, remember: e.target.checked }))}
                          />
                          Ghi nhớ chi tiết hành khách cho lần sau (guest lưu localStorage)
                        </label>
                      </div>

                      <button
                        type="button"
                        onClick={goToExtras}
                        style={{
                          width: "100%",
                          padding: "12px 14px",
                          borderRadius: 10,
                          border: "none",
                          background: "#4f7cff",
                          color: "#fff",
                          fontWeight: 700,
                          cursor: "pointer",
                          marginTop: 14,
                        }}
                      >
                        Tiếp tục chọn dịch vụ thêm
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedTrip && step === "extras" && (
              <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
                <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Bước 2: Chọn dịch vụ thêm</h2>

                {servicesLoading && <p>Đang tải dịch vụ...</p>}

                {!servicesLoading && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
                      <div style={{ fontWeight: 700, marginBottom: 10 }}>Hành lý ký gửi</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <input
                            type="radio"
                            name="baggage"
                            checked={!selectedServiceIds.some((id) => categories.baggage.map((s) => s.id).includes(id))}
                            onChange={() => setSingleServiceInCategory(null, categories.baggage)}
                          />
                          Không mua thêm hành lý
                        </label>
                        {categories.baggage.map((s) => (
                          <label key={s.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <input
                              type="radio"
                              name="baggage"
                              checked={selectedServiceIds.includes(s.id)}
                              onChange={() => setSingleServiceInCategory(s.id, categories.baggage)}
                            />
                            {s.serviceName} · <b>{Number(s.price || 0).toLocaleString("vi-VN")} đ</b>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
                      <div style={{ fontWeight: 700, marginBottom: 10 }}>Suất ăn</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <input
                            type="radio"
                            name="meal"
                            checked={!selectedServiceIds.some((id) => categories.meal.map((s) => s.id).includes(id))}
                            onChange={() => setSingleServiceInCategory(null, categories.meal)}
                          />
                          Không chọn suất ăn
                        </label>
                        {categories.meal.map((s) => (
                          <label key={s.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <input
                              type="radio"
                              name="meal"
                              checked={selectedServiceIds.includes(s.id)}
                              onChange={() => setSingleServiceInCategory(s.id, categories.meal)}
                            />
                            {s.serviceName} · <b>{Number(s.price || 0).toLocaleString("vi-VN")} đ</b>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
                      <div style={{ fontWeight: 700, marginBottom: 10 }}>Bảo hiểm</div>
                      {categories.insurance.map((s) => (
                        <label key={s.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <input type="checkbox" checked={selectedServiceIds.includes(s.id)} onChange={() => toggleService(s.id)} />
                          {s.serviceName} · <b>{Number(s.price || 0).toLocaleString("vi-VN")} đ</b>
                        </label>
                      ))}
                    </div>

                    <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
                      <div style={{ fontWeight: 700, marginBottom: 10 }}>Taxi đưa đón sân bay</div>
                      {categories.taxi.map((s) => (
                        <label key={s.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <input type="checkbox" checked={selectedServiceIds.includes(s.id)} onChange={() => toggleService(s.id)} />
                          {s.serviceName} · <b>{Number(s.price || 0).toLocaleString("vi-VN")} đ</b>
                        </label>
                      ))}
                      <div style={{ fontSize: 12, color: "#666", marginTop: 8 }}>
                        Gợi ý: Xanh SM (demo) – bước sau có thể thêm điểm đón/trả.
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                  <button
                    type="button"
                    onClick={() => setStep("passenger")}
                    style={{
                      padding: "12px 14px",
                      borderRadius: 10,
                      border: "1px solid #ddd",
                      background: "#fff",
                      cursor: "pointer",
                      fontWeight: 700,
                    }}
                  >
                    Quay lại
                  </button>
                  <button
                    type="button"
                    onClick={goToReview}
                    style={{
                      padding: "12px 14px",
                      borderRadius: 10,
                      border: "none",
                      background: "#4f7cff",
                      color: "#fff",
                      cursor: "pointer",
                      fontWeight: 700,
                    }}
                  >
                    Xem lại & đặt vé
                  </button>
                </div>
              </div>
            )}

            {selectedTrip && step === "review" && (
              <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
                <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Bước 3: Xác nhận</h2>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>Chuyến bay</div>
                    <div><b>{selectedTrip.origin}</b> → <b>{selectedTrip.destination}</b></div>
                    <div style={{ fontSize: 13, color: "#666", marginTop: 6 }}>Khởi hành: {selectedTrip.departureTime}</div>
                    <div style={{ fontSize: 13, color: "#666" }}>Nhà cung cấp: {selectedTrip.providerName}</div>
                    <div style={{ fontSize: 13, color: "#666" }}>Loại: {selectedTrip.vehicleType}</div>
                    <div style={{ marginTop: 10, fontWeight: 800, color: "#ff6b00" }}>
                      Giá vé: {Number(selectedTrip.price || 0).toLocaleString("vi-VN")} đ / ghế
                    </div>
                  </div>

                  <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>Hành khách & ghế</div>
                    <div>{passengerInfo.lastName} {passengerInfo.firstName}</div>
                    <div style={{ fontSize: 13, color: "#666", marginTop: 6 }}>Email: {passengerInfo.email}</div>
                    <div style={{ fontSize: 13, color: "#666" }}>SĐT: +84 {passengerInfo.phoneDigits}</div>
                    <div style={{ marginTop: 10 }}>
                      Ghế đã chọn: <b>{selectedSeatNumbers.length}</b>{" "}
                      ({selectedSeatNumbers.join(", ")})
                    </div>
                  </div>
                </div>

                <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16, marginTop: 16 }}>
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>Dịch vụ thêm</div>
                  {selectedServiceIds.length === 0 ? (
                    <div style={{ color: "#666" }}>Chưa chọn dịch vụ thêm.</div>
                  ) : (
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {services
                        .filter((s) => selectedServiceIds.includes(s.id))
                        .map((s) => (
                          <li key={s.id}>
                            {s.serviceName} · <b>{Number(s.price || 0).toLocaleString("vi-VN")} đ</b>
                          </li>
                        ))}
                    </ul>
                  )}
                </div>

                <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                  <button
                    type="button"
                    onClick={() => setStep("extras")}
                    style={{
                      padding: "12px 14px",
                      borderRadius: 10,
                      border: "1px solid #ddd",
                      background: "#fff",
                      cursor: "pointer",
                      fontWeight: 700,
                    }}
                  >
                    Quay lại
                  </button>
                  <button
                    type="button"
                    onClick={submitBooking}
                    disabled={submitLoading}
                    style={{
                      padding: "12px 14px",
                      borderRadius: 10,
                      border: "none",
                      background: "#ff6b00",
                      color: "#fff",
                      cursor: "pointer",
                      fontWeight: 800,
                      minWidth: 200,
                    }}
                  >
                    {submitLoading ? "Đang đặt vé..." : "Đặt vé"}
                  </button>
                </div>

                {bookingResult && (
                  <div style={{ marginTop: 16, padding: 16, borderRadius: 12, background: "#e6fff2", border: "1px solid #b7f0d2" }}>
                    <div style={{ fontWeight: 900, color: "#0a7b38" }}>Đặt vé thành công</div>
                    <div style={{ marginTop: 6, fontSize: 13, color: "#0a7b38" }}>
                      Mã booking: <b>{bookingResult.id}</b> · Tổng tiền: <b>{Number(bookingResult.totalPrice || 0).toLocaleString("vi-VN")} đ</b>
                    </div>
                    <div style={{ marginTop: 6, fontSize: 13, color: "#0a7b38" }}>
                      Ghế: {Array.isArray(bookingResult.seatNumbers) ? bookingResult.seatNumbers.join(", ") : ""}
                    </div>
                    <div style={{ marginTop: 6, fontSize: 13, color: "#0a7b38" }}>
                      Dịch vụ: {Array.isArray(bookingResult.additionalServices) ? bookingResult.additionalServices.join(", ") : "—"}
                    </div>
                  </div>
                )}

                {error && (
                  <p style={{ marginTop: 16, color: "red" }}>
                    {error}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirlineTickets;