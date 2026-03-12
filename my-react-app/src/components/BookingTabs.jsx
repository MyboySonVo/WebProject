import { useState } from "react";
import { PiAirplaneTilt } from "react-icons/pi";
import { MdOutlineTrain, MdOutlinePercent } from "react-icons/md";
import { IoIosBus } from "react-icons/io";
import { useLanguage } from "../context/LanguageContext";
import FlightSearch from "./FlightSearch";
import TrainSearch from "./TrainSearch";
import BusSearch from "./BusSearch";
import PackageSearch from "./PackageSearch";

const BookingTabs = () => {
  const [active, setActive] = useState(0);
  const { t } = useLanguage();

  const tabs = [
    { icon: <PiAirplaneTilt />, label: t.flight },
    { icon: <MdOutlineTrain />, label: t.train },
    { icon: <IoIosBus />, label: t.bus },
    { icon: <MdOutlinePercent />, label: t.package },
  ];

  return (
    <div className="booking-card" style={{ color: "black" }}>
 
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
            <span style={{ fontSize: "24px" }}>{tab.icon}</span>
            <span style={{ fontSize: "14px", fontWeight: "500" }}>{tab.label}</span>
          </div>
        ))}
      </div>

     
      {active === 0 && <FlightSearch />}
      {active === 1 && <TrainSearch />}
      {active === 2 && <BusSearch />}
      {active === 3 && <PackageSearch />}
    </div>
  );
};

export default BookingTabs;