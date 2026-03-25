import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";
import Header from "../LayOut/Header";
import Sidebar from "../components/Sidebar"; 
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import { MdOutlineCreditCard } from "react-icons/md";
import { TbTrain } from "react-icons/tb";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";
import { CgSandClock } from "react-icons/cg";
import { CiCreditCard1 } from "react-icons/ci";
import { FaChair } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaBell } from "react-icons/fa";
import { FaTicketAlt } from "react-icons/fa";

const toLatinUpper = (str) => {
  const map = {
    à:'a',á:'a',â:'a',ã:'a',ả:'a',ạ:'a',ă:'a',ằ:'a',ắ:'a',ẵ:'a',ẳ:'a',ặ:'a',
    ầ:'a',ấ:'a',ẫ:'a',ẩ:'a',ậ:'a',
    è:'e',é:'e',ê:'e',ề:'e',ế:'e',ễ:'e',ể:'e',ẹ:'e',ẻ:'e',ẽ:'e',ệ:'e',
    ì:'i',í:'i',ị:'i',ỉ:'i',ĩ:'i',
    ò:'o',ó:'o',ô:'o',ồ:'o',ố:'o',ỗ:'o',ổ:'o',ọ:'o',ỏ:'o',õ:'o',ộ:'o',
    ơ:'o',ờ:'o',ớ:'o',ỡ:'o',ở:'o',ợ:'o',
    ù:'u',ú:'u',ư:'u',ừ:'u',ứ:'u',ữ:'u',ử:'u',ụ:'u',ủ:'u',ũ:'u',ự:'u',
    ỳ:'y',ý:'y',ỵ:'y',ỷ:'y',ỹ:'y',
    đ:'d',
  };
  return str.split('').map(c => map[c.toLowerCase()] ? (map[c.toLowerCase()]).toUpperCase() : c.toUpperCase()).join('');
};


const formatDob = (raw) => {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return digits.slice(0,2) + '/' + digits.slice(2);
  return digits.slice(0,2) + '/' + digits.slice(2,4) + '/' + digits.slice(4);
};




const TrainTickets = () => {
  const { t } = useLanguage();
  const { token, isAuthenticated } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
  const stations = [
    { code: "HAN", name: "Hà Nội", fullName: "Ga Hà Nội" },
    { code: "SGN", name: "TP. HCM", fullName: "Ga Sài Gòn" },
    { code: "DAD", name: "Đà Nẵng", fullName: "Ga Đà Nẵng" },
    { code: "HUE", name: "Huế", fullName: "Ga Huế" },
    { code: "HPH", name: "Hải Phòng", fullName: "Ga Hải Phòng" },
    { code: "NTR", name: "Nha Trang", fullName: "Ga Nha Trang" },
    { code: "VIN", name: "Vinh", fullName: "Ga Vinh" },
    { code: "QNH", name: "Quảng Ninh", fullName: "Ga Hạ Long" },
    { code: "BMT", name: "Buôn Ma Thuột", fullName: "Ga Buôn Ma Thuột" },
    { code: "TNH", name: "Thanh Hóa", fullName: "Ga Thanh Hóa" },
  ];
  const [from, setFrom] = useState("HAN");
  const [to, setTo] = useState("SGN");
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [step, setStep] = useState("search"); 

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
  const [formErrors, setFormErrors] = useState({});
  const [promoCode, setPromoCode] = useState("");
  const [selectedSeatClass, setSelectedSeatClass] = useState("");

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
      
      setTimeout(() => {
        loadCalendar();
      }, 0);
    }
  
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
     
    }
  }, []);

  const handleSearch = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
  
    setCalendarOpen(false);
    
    const errs = {};
    if (!from || !from.trim()) errs.from = "Vui lòng nhập điểm đi";
    if (!to || !to.trim()) errs.to = "Vui lòng nhập điểm đến";
    if (!date) errs.date = "Vui lòng chọn ngày đi";
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      setError("");
      return;
    }
    setFormErrors({});
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
        type: "TRAIN",
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
      setError("Không tìm được chuyến tàu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  
  const handleSearchWithDate = async (selectedDate) => {
    setDate(selectedDate);
    setCalendarOpen(false);
    setFormErrors({});
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
        date: selectedDate,
        type: "TRAIN",
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
      setError("Không tìm được chuyến tàu. Vui lòng thử lại.");
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
        type: "TRAIN",
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
     
      setStep("seatClass");
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
    if (!selectedSeatIds.length) {
      setError("Vui lòng chọn ghế trước khi tiếp tục.");
      return;
    }
    setError("");
    setStep("passenger");
  };

  const goToExtrasFromPassenger = async () => {
    const msg = validatePassenger();
    if (msg) {
      setError(msg);
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
              Vé tàu hỏa
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
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr 1fr auto", gap: 12, alignItems: "start" }}>

               
                <div style={{ position: "relative" }}>
                  <label style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: 13, color: "#555" }}><TbTrain /> {t.from}</label>
                  <div
                    onClick={() => { setShowFromDropdown(!showFromDropdown); setShowToDropdown(false); }}
                    style={{ padding: "10px 14px", borderRadius: 10, border: formErrors.from ? "2px solid #e53935" : "2px solid #e0e7ff",
                      background: "#f8f9ff", cursor: "pointer", userSelect: "none" }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 16, color: "#1a1a2e" }}>{from}</div>
                    <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
                      {stations.find(a => a.code === from)?.name || t.selectTrainStation}
                    </div>
                  </div>
                  {formErrors.from && <div style={{ color: "#e53935", fontSize: 12, marginTop: 4 }}>{formErrors.from}</div>}
                  {showFromDropdown && (
                    <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", borderRadius: 12,
                      boxShadow: "0 8px 30px rgba(0,0,0,0.15)", zIndex: 100, marginTop: 4, overflow: "hidden", maxHeight: 260, overflowY: "auto" }}>
                      {stations.filter(a => a.code !== to).map(a => (
                        <div key={a.code} onClick={() => { setFrom(a.code); setShowFromDropdown(false); setFormErrors(p => ({...p, from: undefined})); }}
                          style={{ padding: "12px 16px", cursor: "pointer", borderBottom: "1px solid #f0f0f0",
                            background: from === a.code ? "#eff6ff" : "#fff" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#f5f5ff"}
                          onMouseLeave={e => e.currentTarget.style.background = from === a.code ? "#eff6ff" : "#fff"}
                        >
                          <div style={{ fontWeight: 700, fontSize: 14 }}>{a.code} <span style={{ fontWeight: 400, color: "#888", fontSize: 13 }}>– {a.name}</span></div>
                          <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{a.fullName}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                
                <button type="button"
                  onClick={() => { const t2 = from; setFrom(to); setTo(t2); }}
                  style={{ marginTop: 28, width: 38, height: 38, borderRadius: "50%", border: "2px solid #e0e7ff",
                    background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, color: "#4f7cff", flexShrink: 0, transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#eff6ff"; e.currentTarget.style.borderColor = "#4f7cff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e0e7ff"; }}
                  title={t.swapDestinations}
                >⇄</button>

                
                <div style={{ position: "relative" }}>
                  <label style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: 13, color: "#555" }}><TbTrain /> {t.to}</label>
                  <div
                    onClick={() => { setShowToDropdown(!showToDropdown); setShowFromDropdown(false); }}
                    style={{ padding: "10px 14px", borderRadius: 10, border: formErrors.to ? "2px solid #e53935" : "2px solid #e0e7ff",
                      background: "#f8f9ff", cursor: "pointer", userSelect: "none" }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 16, color: "#1a1a2e" }}>{to}</div>
                    <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
                      {stations.find(a => a.code === to)?.name || t.selectTrainStation}
                    </div>
                  </div>
                  {formErrors.to && <div style={{ color: "#e53935", fontSize: 12, marginTop: 4 }}>{formErrors.to}</div>}
                  {showToDropdown && (
                    <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", borderRadius: 12,
                      boxShadow: "0 8px 30px rgba(0,0,0,0.15)", zIndex: 100, marginTop: 4, overflow: "hidden", maxHeight: 260, overflowY: "auto" }}>
                      {stations.filter(a => a.code !== from).map(a => (
                        <div key={a.code} onClick={() => { setTo(a.code); setShowToDropdown(false); setFormErrors(p => ({...p, to: undefined})); }}
                          style={{ padding: "12px 16px", cursor: "pointer", borderBottom: "1px solid #f0f0f0",
                            background: to === a.code ? "#eff6ff" : "#fff" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#f5f5ff"}
                          onMouseLeave={e => e.currentTarget.style.background = to === a.code ? "#eff6ff" : "#fff"}
                        >
                          <div style={{ fontWeight: 700, fontSize: 14 }}>{a.code} <span style={{ fontWeight: 400, color: "#888", fontSize: 13 }}>– {a.name}</span></div>
                          <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{a.fullName}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

               
                <div>
                  <label style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: 13, color: "#555" }}><FaRegCalendarAlt /> {t.departureDate}</label>
                  <input type="date" value={date}
                    onChange={(e) => { setDate(e.target.value); setFormErrors(p => ({...p, date: undefined})); }}
                    min={todayISO}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 10, fontSize: 14, boxSizing: "border-box",
                      border: formErrors.date ? "2px solid #e53935" : "2px solid #e0e7ff", background: "#f8f9ff" }}
                  />
                  {formErrors.date && <div style={{ color: "#e53935", fontSize: 12, marginTop: 4 }}>{formErrors.date}</div>}
                </div>

                
                <div>
                  <label style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: 13, color: "#555" }}><FaUser /> {t.passengers}</label>
                  <input type="number" min={1} max={9} value={passengers}
                    onChange={(e) => setPassengers(Math.max(1, Number(e.target.value) || 1))}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "2px solid #e0e7ff",
                      background: "#f8f9ff", fontSize: 15, marginBottom: 10, boxSizing: "border-box" }}
                  />
                  <button type="button" onClick={handleSearch} disabled={loading}
                    style={{ width: "100%", padding: "11px", borderRadius: 10, border: "none",
                      background: loading ? "#aaa" : "linear-gradient(135deg,blue,blue)",
                      color: "#fff", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontSize: 14, marginBottom: 8 }}
                  >
                    {loading ? <><CgSandClock /> ${t.searching}</> : <><IoMdSearch /> {t.searchTrain}</>}
                  </button>
                  <button type="button" onClick={loadCalendar} disabled={calendarLoading}
                    style={{ width: "100%", padding: "10px", borderRadius: 10, border: "2px solid #e0e7ff",
                      background: "#fff", color: "#333", fontWeight: 600, cursor: calendarLoading ? "not-allowed" : "pointer", fontSize: 13 }}
                  >
                    {calendarLoading ? <><CgSandClock /> {t.loadingCalendar}</> : <><FaRegCalendarAlt /> {t.viewCheapCalendar}</>}
                  </button>
                </div>
              </div>

              {calendarOpen && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #eee" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ fontWeight: 700 }}>{t.calendar30Days}</div>
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
                          handleSearchWithDate(d.date);
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

            
            {["seatClass", "passenger", "extras", "review"].includes(step) && (
              <div style={{ marginBottom: 20, background: "#fff", borderRadius: 12, padding: "16px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
                
                  <div style={{ position: "absolute", top: 20, left: "10%", right: "10%", height: 3, background: "#e0e7ff", zIndex: 0 }} />
                  {[
                    { key: "seatClass", icon:  <FaChair />, label: t.step1Title },
                    { key: "passenger", icon: <FaUser />, label: t.step2Title },
                    { key: "extras", icon: <FaBell />, label: t.step3Title },
                    { key: "review", icon: <CiCreditCard1 />, label: t.step4Title },
                  ].map((s) => {
                    const orderMap = { seatClass: 0, passenger: 1, extras: 2, review: 3 };
                    const current = orderMap[step];
                    const isDone = orderMap[s.key] < current;
                    const isActive = s.key === step;
                    return (
                      <div key={s.key} style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 1, flex: 1 }}>
                        <div style={{
                          width: 42, height: 42, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                          background: isDone ? "#22c55e" : isActive ? "#4f7cff" : "#e0e7ff",
                          color: isDone || isActive ? "#fff" : "#888",
                          fontWeight: 700, fontSize: 18, transition: "all .3s",
                        }}>{isDone ? "✓" : s.icon}</div>
                        <div style={{ marginTop: 6, fontSize: 12, fontWeight: isActive ? 700 : 400, color: isActive ? "#4f7cff" : "#888" }}>{s.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          
            {selectedTrip && step === "seatClass" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
                <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{t.step1}</h2>
                  <p style={{ color: "#666", fontSize: 13, marginBottom: 16 }}>{t.selectSeatInstruction}</p>

                  {loading && <p style={{ color: "#888" }}>Đang tải sơ đồ ghế...</p>}

                
                  {!loading && (() => {
                    const classTypes = [...new Set(seats.map(s => s.seatType || "ECONOMY"))];
                    return (
                      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                        <button type="button" onClick={() => setSelectedSeatClass("")} style={{
                          padding: "8px 18px", borderRadius: 20, border: `2px solid ${!selectedSeatClass ? "#4f7cff" : "#ddd"}`,
                          background: !selectedSeatClass ? "#4f7cff" : "#fff", color: !selectedSeatClass ? "#fff" : "#333",
                          fontWeight: 600, cursor: "pointer",
                        }}>Tất cả</button>
                        {classTypes.map(cls => (
                          <button key={cls} type="button" onClick={() => setSelectedSeatClass(cls)} style={{
                            padding: "8px 18px", borderRadius: 20,
                            border: `2px solid ${selectedSeatClass === cls ? "#4f7cff" : "#ddd"}`,
                            background: selectedSeatClass === cls ? "#4f7cff" : "#fff",
                            color: selectedSeatClass === cls ? "#fff" : "#333",
                            fontWeight: 600, cursor: "pointer",
                          }}>{cls === "ECONOMY" ? "🟢 Phổ thông" : cls === "BUSINESS" ? "🔵 Thương gia" : cls}</button>
                        ))}
                      </div>
                    );
                  })()}

                
                  {!loading && seats.length > 0 && (() => {
                    const filteredSeats = selectedSeatClass
                      ? seats.filter(s => (s.seatType || "ECONOMY") === selectedSeatClass)
                      : seats;

                    const parse = (sn) => { const m = String(sn||"").match(/^(\d+)([A-Za-z])$/); return m ? { row: +m[1], col: m[2].toUpperCase() } : null; };
                    const items = filteredSeats.map(s => { const p = parse(s.seatNumber); return p ? {...s, ...p} : null; }).filter(Boolean);
                    const cols = [...new Set(items.map(i => i.col))].sort();
                    const rows = [...new Set(items.map(i => i.row))].sort((a,b) => a-b);
                    const smap = new Map(items.map(i => [`${i.row}${i.col}`, i]));

                   
                    const half = Math.ceil(cols.length / 2);
                    const leftCols = cols.slice(0, half);
                    const rightCols = cols.slice(half);

                    return (
                      <div style={{ overflowX: "auto" }}>
                      
                        <div style={{ display: "flex", gap: 6, marginBottom: 8, paddingLeft: 48 }}>
                          {leftCols.map(c => <div key={c} style={{ width: 44, textAlign: "center", fontWeight: 700, color: "#888", fontSize: 12 }}>{c}</div>)}
                          <div style={{ width: 32 }} />
                          {rightCols.map(c => <div key={c} style={{ width: 44, textAlign: "center", fontWeight: 700, color: "#888", fontSize: 12 }}>{c}</div>)}
                        </div>
                        {rows.map(row => (
                          <div key={row} style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }}>
                            <div style={{ width: 36, textAlign: "center", fontWeight: 700, color: "#aaa", fontSize: 12 }}>{row}</div>
                            {leftCols.map(col => {
                              const s = smap.get(`${row}${col}`);
                              if (!s) return <div key={col} style={{ width: 44, height: 38 }} />;
                              const sel = selectedSeatIds.includes(s.id);
                              return (
                                <button key={s.id} type="button" onClick={() => toggleSeat(s)} disabled={s.booked}
                                  title={`${s.seatNumber} ${s.seatType || "ECONOMY"} ${s.booked ? "(Đã đặt)" : ""}`}
                                  style={{ width: 44, height: 38, borderRadius: 6, border: "none", cursor: s.booked ? "not-allowed" : "pointer",
                                    background: s.booked ? "#e0e0e0" : sel ? "#f59e0b" : (s.seatType === "BUSINESS" ? "#dbeafe" : "#dcfce7"),
                                    color: s.booked ? "#aaa" : sel ? "#fff" : "#333", fontWeight: 600, fontSize: 11 }}>
                                  {s.booked ? "✗" : s.seatNumber}
                                </button>
                              );
                            })}
                            <div style={{ width: 32, textAlign: "center", color: "#ccc", fontSize: 10 }}>✈</div>
                            {rightCols.map(col => {
                              const s = smap.get(`${row}${col}`);
                              if (!s) return <div key={col} style={{ width: 44, height: 38 }} />;
                              const sel = selectedSeatIds.includes(s.id);
                              return (
                                <button key={s.id} type="button" onClick={() => toggleSeat(s)} disabled={s.booked}
                                  title={`${s.seatNumber} ${s.seatType || "ECONOMY"} ${s.booked ? "(Đã đặt)" : ""}`}
                                  style={{ width: 44, height: 38, borderRadius: 6, border: "none", cursor: s.booked ? "not-allowed" : "pointer",
                                    background: s.booked ? "#e0e0e0" : sel ? "#f59e0b" : (s.seatType === "BUSINESS" ? "#dbeafe" : "#dcfce7"),
                                    color: s.booked ? "#aaa" : sel ? "#fff" : "#333", fontWeight: 600, fontSize: 11 }}>
                                  {s.booked ? "✗" : s.seatNumber}
                                </button>
                              );
                            })}
                          </div>
                        ))}
                       
                        <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 12, color: "#666" }}>
                          <span><span style={{ display: "inline-block", width: 14, height: 14, background: "#dcfce7", borderRadius: 3, marginRight: 4 }} />{t.seatClassEco}</span>
                          <span><span style={{ display: "inline-block", width: 14, height: 14, background: "#dbeafe", borderRadius: 3, marginRight: 4 }} />{t.seatClassBiz}</span>
                          <span><span style={{ display: "inline-block", width: 14, height: 14, background: "#f59e0b", borderRadius: 3, marginRight: 4 }} />{t.seatClassSelected}</span>
                          <span><span style={{ display: "inline-block", width: 14, height: 14, background: "#e0e0e0", borderRadius: 3, marginRight: 4 }} />{t.seatClassBooked}</span>
                        </div>
                      </div>
                    );
                  })()}

                  {!loading && seats.length === 0 && <p style={{ color: "#888" }}>Chưa có dữ liệu ghế cho chuyến này.</p>}

                  {error && <p style={{ color: "red", marginTop: 12 }}>{error}</p>}
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
                    <button type="button" onClick={() => setStep("chooseTrip")} style={{ padding: "10px 24px", borderRadius: 8, border: "1px solid #ddd", background: "#fff", fontWeight: 700, cursor: "pointer" }}>← {t.goBack}</button>
                    <button type="button" onClick={goToExtras} style={{ padding: "10px 28px", borderRadius: 8, border: "none", background: "#4f7cff", color: "#fff", fontWeight: 700, cursor: "pointer" }}>{t.nextStep} →</button>
                  </div>
                </div>

               
                <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 4px 15px rgba(0,0,0,0.05)", height: "fit-content", position: "sticky", top: 16 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, borderBottom: "1px solid #eee", paddingBottom: 10 }}>{t.bookingSummary}</div>
                  <div style={{ fontSize: 13, color: "#444", lineHeight: 1.8 }}>
                    <div>✈ <b>{selectedTrip.origin}</b> → <b>{selectedTrip.destination}</b></div>
                    <div style={{ color: "#888" }}>{selectedTrip.departureTime}</div>
                    <div style={{ color: "#888" }}>{selectedTrip.providerName}</div>
                    <div style={{ marginTop: 8, fontWeight: 700, color: "#ff6b00", fontSize: 15 }}>{Number(selectedTrip.price||0).toLocaleString("vi-VN")} đ / ghế</div>
                    <div style={{ marginTop: 8, color: selectedSeatIds.length >= (passengers||1) ? "#22c55e" : "#888" }}>Ghế đã chọn: {selectedSeatIds.length}/{passengers||1}</div>
                  </div>
                </div>
              </div>
            )}

        
            {selectedTrip && step === "passenger" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
                <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{t.step2}</h2>
                  <p style={{ color: "#666", fontSize: 13, marginBottom: 20 }}>{t.passengerInstruction}</p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    {[{label: t.passengerLastName,key:"lastName"},{label: t.passengerFirstName,key:"firstName"}].map(f => (
                      <div key={f.key}>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{f.label}</label>
                        <input
                          value={passengerInfo[f.key]}
                          onChange={e => setPassengerInfo(p => ({...p, [f.key]: toLatinUpper(e.target.value)}))}
                          style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, letterSpacing: 1 }} />
                      </div>
                    ))}
                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{t.dob}</label>
                      <input
                        value={passengerInfo.dob}
                        onChange={e => setPassengerInfo(p => ({...p, dob: formatDob(e.target.value)}))}
                        placeholder="__/__/____"
                        inputMode="numeric"
                        maxLength={10}
                        style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, letterSpacing: 2 }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{t.nationality}</label>
                      <select value={passengerInfo.nationality} onChange={e => setPassengerInfo(p => ({...p, nationality: e.target.value}))}
                        style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14 }}>
                        {["Việt Nam","Nhật Bản","Hàn Quốc","Anh","Mỹ","Úc","Khác"].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{t.phoneNumber}</label>
                      <div style={{ display: "flex", gap: 8 }}>
                        <input readOnly value="+84" style={{ width: 64, padding: "10px 8px", borderRadius: 8, border: "1px solid #ddd", background: "#f5f5f5", textAlign: "center" }} />
                        <input value={passengerInfo.phoneDigits} onChange={e => setPassengerInfo(p => ({...p, phoneDigits: e.target.value.replace(/\D/g,"")}))} placeholder="912345678"
                          style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14 }} />
                      </div>
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{t.emailField}</label>
                      <input value={passengerInfo.email} onChange={e => setPassengerInfo(p => ({...p, email: e.target.value}))} type="email"
                        style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14 }} />
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{t.memberCode}</label>
                      <input value={passengerInfo.memberCode} onChange={e => setPassengerInfo(p => ({...p, memberCode: e.target.value}))}
                        style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14 }} />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
                    <label style={{ fontSize: 13, display: "flex", gap: 8, alignItems: "center", cursor: "pointer" }}>
                      <input type="checkbox" checked={passengerInfo.promoOptIn} onChange={e => setPassengerInfo(p => ({...p, promoOptIn: e.target.checked}))} />
                      {t.receivePromo}
                    </label>
                    <label style={{ fontSize: 13, display: "flex", gap: 8, alignItems: "center", cursor: "pointer" }}>
                      <input type="checkbox" checked={passengerInfo.remember} onChange={e => setPassengerInfo(p => ({...p, remember: e.target.checked}))} />
                      {t.rememberInfo}
                    </label>
                  </div>

                  {error && <p style={{ color: "red", marginTop: 12 }}>{error}</p>}
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
                    <button type="button" onClick={() => setStep("seatClass")} style={{ padding: "10px 24px", borderRadius: 8, border: "1px solid #ddd", background: "#fff", fontWeight: 700, cursor: "pointer" }}>← {t.goBack}</button>
                    <button type="button" onClick={goToExtrasFromPassenger} style={{ padding: "10px 28px", borderRadius: 8, border: "none", background: "#4f7cff", color: "#fff", fontWeight: 700, cursor: "pointer" }}>{t.nextStep} →</button>
                  </div>
                </div>

             
                <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 4px 15px rgba(0,0,0,0.05)", height: "fit-content" }}>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, borderBottom: "1px solid #eee", paddingBottom: 10 }}>Thông tin đặt chỗ</div>
                  <div style={{ fontSize: 13, color: "#444", lineHeight: 1.9 }}>
                    <div>✈ <b>{selectedTrip.origin}</b> → <b>{selectedTrip.destination}</b></div>
                    <div style={{ color: "#888" }}>{selectedTrip.departureTime}</div>
                    <div style={{ marginTop: 6 }}>Ghế: <b>{selectedSeatIds.length === 0 ? "Chưa chọn" : seats.filter(s => selectedSeatIds.includes(s.id)).map(s => s.seatNumber).join(", ")}</b></div>
                    <div style={{ marginTop: 8, fontWeight: 700, color: "#ff6b00", fontSize: 15 }}>{Number(selectedTrip.price||0).toLocaleString("vi-VN")} đ / ghế</div>
                  </div>
                </div>
              </div>
            )}

         
            {selectedTrip && step === "extras" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
                <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{t.step3}</h2>
                  <p style={{ color: "#666", fontSize: 13, marginBottom: 20 }}>{t.extrasInstruction}</p>

                  {servicesLoading && <p style={{ color: "#888" }}>Đang tải dịch vụ...</p>}

                  {!servicesLoading && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
             
                      <div style={{ border: "1px solid #e0e7ff", borderRadius: 12, padding: 16, background: "#f9fafb" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                          <span style={{ fontSize: 24 }}>🧳</span>
                          <div><div style={{ fontWeight: 700, fontSize: 15 }}>{t.baggage}</div><div style={{ fontSize: 12, color: "#888" }}>Chọn gói hành lý phù hợp</div></div>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                          <label style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8,
                            border: `2px solid ${!selectedServiceIds.some(id => categories.baggage.map(s=>s.id).includes(id)) ? "#4f7cff" : "#ddd"}`,
                            background: !selectedServiceIds.some(id => categories.baggage.map(s=>s.id).includes(id)) ? "#eff6ff" : "#fff",
                            cursor: "pointer" }}>
                            <input type="radio" name="baggage" style={{ display: "none" }}
                              checked={!selectedServiceIds.some(id => categories.baggage.map(s=>s.id).includes(id))}
                              onChange={() => setSingleServiceInCategory(null, categories.baggage)} />
                            Không mua thêm
                          </label>
                          {categories.baggage.map(s => (
                            <label key={s.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8,
                              border: `2px solid ${selectedServiceIds.includes(s.id) ? "#4f7cff" : "#ddd"}`,
                              background: selectedServiceIds.includes(s.id) ? "#eff6ff" : "#fff", cursor: "pointer" }}>
                              <input type="radio" name="baggage" style={{ display: "none" }} checked={selectedServiceIds.includes(s.id)} onChange={() => setSingleServiceInCategory(s.id, categories.baggage)} />
                              <span style={{ fontWeight: 600 }}>{s.serviceName}</span>
                              <span style={{ marginLeft: 6, color: "#4f7cff", fontWeight: 700 }}>{Number(s.price||0).toLocaleString("vi-VN")} đ</span>
                            </label>
                          ))}
                        </div>
                      </div>

                  
                      <div style={{ border: "1px solid #fef3c7", borderRadius: 12, padding: 16, background: "#f9fafb" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                          <span style={{ fontSize: 24 }}>🍱</span>
                          <div><div style={{ fontWeight: 700, fontSize: 15 }}>{t.meal}</div><div style={{ fontSize: 12, color: "#888" }}>Chọn món ăn trên chuyến đi</div></div>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                          <label style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8,
                            border: `2px solid ${!selectedServiceIds.some(id => categories.meal.map(s=>s.id).includes(id)) ? "#f59e0b" : "#ddd"}`,
                            background: !selectedServiceIds.some(id => categories.meal.map(s=>s.id).includes(id)) ? "#fffbeb" : "#fff",
                            cursor: "pointer" }}>
                            <input type="radio" name="meal" style={{ display: "none" }}
                              checked={!selectedServiceIds.some(id => categories.meal.map(s=>s.id).includes(id))}
                              onChange={() => setSingleServiceInCategory(null, categories.meal)} />
                            Không chọn suất ăn
                          </label>
                          {categories.meal.map(s => (
                            <label key={s.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8,
                              border: `2px solid ${selectedServiceIds.includes(s.id) ? "#f59e0b" : "#ddd"}`,
                              background: selectedServiceIds.includes(s.id) ? "#fffbeb" : "#fff", cursor: "pointer" }}>
                              <input type="radio" name="meal" style={{ display: "none" }} checked={selectedServiceIds.includes(s.id)} onChange={() => setSingleServiceInCategory(s.id, categories.meal)} />
                              <span style={{ fontWeight: 600 }}>{s.serviceName}</span>
                              <span style={{ marginLeft: 6, color: "#f59e0b", fontWeight: 700 }}>{Number(s.price||0).toLocaleString("vi-VN")} đ</span>
                            </label>
                          ))}
                        </div>
                      </div>

                  
                      {[{cat: categories.insurance, icon: "🛡️", title: "Bảo hiểm du lịch", sub: "Bảo vệ chuyến đi của bạn", color: "#f0fdf4", border: "#bbf7d0"},
                        {cat: categories.taxi, icon: "🚕", title: "Xe đón sân bay", sub: "Tiện lợi với dịch vụ xe riêng", color: "#fef9c3", border: "#fde68a"}]
                      .map(({cat, icon, title, sub, color, border}) => (
                        cat.length > 0 && (
                          <div key={title} style={{ border: `1px solid ${border}`, borderRadius: 12, padding: 16, background: "#f9fafb" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                              <span style={{ fontSize: 24 }}>{icon}</span>
                              <div><div style={{ fontWeight: 700, fontSize: 15 }}>{title}</div><div style={{ fontSize: 12, color: "#888" }}>{sub}</div></div>
                            </div>
                            {cat.map(s => (
                              <label key={s.id} onClick={() => toggleService(s.id)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                                padding: 12, borderRadius: 10, background: selectedServiceIds.includes(s.id) ? color : "#fff",
                                border: `1.5px solid ${selectedServiceIds.includes(s.id) ? border : "#eee"}`,
                                cursor: "pointer", marginBottom: 6 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                  <div style={{ width: 22, height: 22, borderRadius: 11, border: "2px solid #ddd",
                                    background: selectedServiceIds.includes(s.id) ? "#22c55e" : "#fff",
                                    display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12 }}>
                                    {selectedServiceIds.includes(s.id) ? "✓" : ""}
                                  </div>
                                  <span style={{ fontWeight: 600 }}>{s.serviceName}</span>
                                </div>
                                <span style={{ fontWeight: 700, color: selectedServiceIds.includes(s.id) ? "#16a34a" : "#666" }}>
                                  {Number(s.price||0) === 0 ? "Miễn phí" : `${Number(s.price||0).toLocaleString("vi-VN")} đ`}
                                </span>
                              </label>
                            ))}
                          </div>
                        )
                      ))}
                    </div>
                  )}

                  {error && <p style={{ color: "red", marginTop: 12 }}>{error}</p>}
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
                    <button type="button" onClick={() => setStep("passenger")} style={{ padding: "10px 24px", borderRadius: 8, border: "1px solid #ddd", background: "#fff", fontWeight: 700, cursor: "pointer" }}>← {t.goBack}</button>
                    <button type="button" onClick={goToReview} style={{ padding: "10px 28px", borderRadius: 8, border: "none", background: "#4f7cff", color: "#fff", fontWeight: 700, cursor: "pointer" }}>{t.reviewAndPay} →</button>
                  </div>
                </div>

        
                <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 4px 15px rgba(0,0,0,0.05)", height: "fit-content" }}>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, borderBottom: "1px solid #eee", paddingBottom: 10 }}>{t.totalCost}</div>
                  <div style={{ fontSize: 13, lineHeight: 2 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span>Giá vé ({selectedSeatIds.length} ghế)</span><b>{Number((selectedTrip.price||0) * selectedSeatIds.length).toLocaleString("vi-VN")} đ</b></div>
                    {services.filter(s => selectedServiceIds.includes(s.id)).map(s => (
                      <div key={s.id} style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#888" }}>+ {s.serviceName}</span><span>{Number(s.price||0).toLocaleString("vi-VN")} đ</span></div>
                    ))}
                    <div style={{ borderTop: "1px solid #eee", marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 15, color: "#ff6b00" }}>
                      <span>Tổng cộng</span>
                      <span>{Number((selectedTrip.price||0)*selectedSeatIds.length + services.filter(s=>selectedServiceIds.includes(s.id)).reduce((sum,s)=>sum+(s.price||0),0)).toLocaleString("vi-VN")} đ</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

       
            {selectedTrip && step === "review" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
                <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{t.step4}</h2>
                  <p style={{ color: "#666", fontSize: 13, marginBottom: 20 }}>{t.reviewInstruction}</p>

         
                  <div style={{ border: "1px solid #e0e7ff", borderRadius: 12, padding: 16, marginBottom: 14, background: "#f9fafb" }}>
                    <div style={{ fontWeight: 700, marginBottom: 8, color: "#4f7cff" }}>✈ Chuyến bay</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 16 }}>{selectedTrip.origin} → {selectedTrip.destination}</div>
                        <div style={{ color: "#888", fontSize: 13, marginTop: 4 }}>{selectedTrip.departureTime} · {selectedTrip.providerName}</div>
                      </div>
                      <div style={{ fontWeight: 800, color: "#ff6b00", fontSize: 16 }}>{Number(selectedTrip.price||0).toLocaleString("vi-VN")} đ</div>
                    </div>
                  </div>

             
                  <div style={{ border: "1px solid #e0e7ff", borderRadius: 12, padding: 16, marginBottom: 14, background: "#f9fafb" }}>
                    <div style={{ fontWeight: 700, marginBottom: 8, color: "#4f7cff" }}>👤 Hành khách</div>
                    <div style={{ fontSize: 14 }}>
                      <b>{passengerInfo.lastName} {passengerInfo.firstName}</b>
                      <div style={{ color: "#888", fontSize: 13, marginTop: 4 }}>{passengerInfo.email} · +84 {passengerInfo.phoneDigits}</div>
                      <div style={{ marginTop: 4 }}>Ghế: <b>{seats.filter(s=>selectedSeatIds.includes(s.id)).map(s=>s.seatNumber).join(", ") || "Chưa chọn"}</b></div>
                    </div>
                  </div>

              
                  {selectedServiceIds.length > 0 && (
                    <div style={{ border: "1px solid #e0e7ff", borderRadius: 12, padding: 16, marginBottom: 14, background: "#f9fafb" }}>
                      <div style={{ fontWeight: 700, marginBottom: 8, color: "#4f7cff" }}>🛎 Dịch vụ bổ sung</div>
                      {services.filter(s=>selectedServiceIds.includes(s.id)).map(s => (
                        <div key={s.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 4 }}>
                          <span>{s.serviceName}</span><b>{Number(s.price||0).toLocaleString("vi-VN")} đ</b>
                        </div>
                      ))}
                    </div>
                  )}

                 
                  <div style={{ border: "1px dashed #d1d5db", borderRadius: 12, padding: 16, marginBottom: 14 }}>
                    <div style={{ fontWeight: 700, marginBottom: 10 }}>🎫 {t.promoCodeLabel}</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input value={promoCode} onChange={e => setPromoCode(e.target.value.toUpperCase())} placeholder="..."
                        style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14 }} />
                      <button type="button" style={{ padding: "10px 16px", borderRadius: 8, border: "1px solid #4f7cff", background: "#eff6ff", color: "#4f7cff", fontWeight: 700, cursor: "pointer" }}>{t.applyPromo}</button>
                    </div>
                    <div style={{ fontSize: 12, color: "#888", marginTop: 6 }}>{t.promoInstruction}</div>
                  </div>

                  {error && <p style={{ color: "red", marginTop: 4 }}>{error}</p>}

                  {bookingResult ? (
                    <div style={{ padding: 20, borderRadius: 12, background: "#f0fdf4", border: "1px solid #bbf7d0", marginTop: 8 }}>
                      <div style={{ fontWeight: 800, color: "#16a34a", fontSize: 16, marginBottom: 8 }}><MdOutlineDone /> {t.successBooking}</div>
                      <div style={{ fontSize: 14, color: "#166534", lineHeight: 1.9 }}>
                        <div>Mã booking: <b>#{bookingResult.id}</b></div>
                        <div>{t.totalCost}: <b>{Number(bookingResult.totalPrice||0).toLocaleString("vi-VN")} đ</b></div>
                        <div>Ghế: {Array.isArray(bookingResult.seatNumbers) ? bookingResult.seatNumbers.join(", ") : ""}</div>
                      </div>
                      <button type="button"
                        onClick={async () => {
                          try {
                            const res = await axios.post("http://localhost:8080/api/payment/create", { bookingId: bookingResult.id, language: "vn" }, { headers: { Authorization: `Bearer ${token}` } });
                            if (res.data && res.data.paymentUrl) window.location.href = res.data.paymentUrl;
                          } catch { alert("Lỗi tạo link VNPay, vui lòng thử lại."); }
                        }}
                        style={{ marginTop: 14, width: "100%", padding: "14px", borderRadius: 10, border: "none", background: "#005baa", color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                        <MdOutlineCreditCard /> {t.paymentVNPAY}
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                      <button type="button" onClick={() => setStep("extras")} style={{ padding: "10px 24px", borderRadius: 8, border: "1px solid #ddd", background: "#fff", fontWeight: 700, cursor: "pointer" }}>← {t.goBack}</button>
                      <button type="button" onClick={submitBooking} disabled={submitLoading}
                        style={{ padding: "12px 32px", borderRadius: 8, border: "none", background: "#ff6b00", color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer" }}>
                        {submitLoading ? "Đang xử lý..." : <><FaTicketAlt /> Đặt vé ngay</>}
                      </button>
                    </div>
                  )}
                </div>

              
                <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 4px 15px rgba(0,0,0,0.05)", height: "fit-content" }}>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, borderBottom: "1px solid #eee", paddingBottom: 10 }}>{t.paymentDetails}</div>
                  <div style={{ fontSize: 13, lineHeight: 2 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span>Giá vé ({selectedSeatIds.length} ghế)</span><b>{Number((selectedTrip.price||0)*selectedSeatIds.length).toLocaleString("vi-VN")} đ</b></div>
                    {services.filter(s=>selectedServiceIds.includes(s.id)).map(s => (
                      <div key={s.id} style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#888" }}>+ {s.serviceName}</span><span>{Number(s.price||0).toLocaleString("vi-VN")} đ</span></div>
                    ))}
                    {promoCode && <div style={{ display: "flex", justifyContent: "space-between", color: "#16a34a" }}><span>Mã: {promoCode}</span><span>-0 đ</span></div>}
                    <div style={{ borderTop: "1px solid #eee", marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 16, color: "#ff6b00" }}>
                      <span>Tổng cộng</span>
                      <span>{Number((selectedTrip.price||0)*selectedSeatIds.length + services.filter(s=>selectedServiceIds.includes(s.id)).reduce((sum,s)=>sum+(s.price||0),0)).toLocaleString("vi-VN")} đ</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainTickets;