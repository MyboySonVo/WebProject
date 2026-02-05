import { useState } from "react";
import { PiAirplaneTilt } from "react-icons/pi";
import { MdOutlineTrain, MdOutlinePercent } from "react-icons/md";
import { IoIosBus } from "react-icons/io";

const tabs = [
  { icon: <PiAirplaneTilt />, label: "Vé máy bay" },
  { icon: <MdOutlineTrain />, label: "Vé tàu hỏa" },
  { icon: <IoIosBus />, label: "Xe khách" },
  { icon: <MdOutlinePercent />, label: "Đặt theo gói" },
];

const BookingTabs = () => {
  const [active, setActive] = useState(0);

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "20px",
        padding: "30px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        color:"black"
      }}
    >
      {/* Tabs */}
      <div
        style={{
          display: "flex",
          background: "#e9ecef",
          borderRadius: "999px",
          padding: "6px",
          marginBottom: "30px",
        }}
      >
        {tabs.map((tab, index) => (
          <div
            key={index}
            onClick={() => setActive(index)}
            style={{
              flex: 1,
              textAlign: "center",
              padding: "10px",
              borderRadius: "999px",
              cursor: "pointer",
              background: active === index ? "#4f7cff" : "transparent",
              color: active === index ? "#fff" : "#333",
              transition: "0.3s",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
            }}
          >
            {/* Chỉ sửa chỗ này */}
            {tab.icon}
            <span>{tab.label}</span>
          </div>
        ))}
      </div>

      {/* Content */}
      <div
        style={{
          height: "200px",
          border: "2px dashed #dee2e6",
          borderRadius: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#999",
          fontSize: "18px",
        }}
      >
        Nội dung đặt vé cho: <b style={{ marginLeft: 6 }}>{tabs[active].label}</b>
      </div>
    </div>
  );
};

export default BookingTabs;
