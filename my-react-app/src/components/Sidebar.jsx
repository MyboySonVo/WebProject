import { PiAirplaneTilt } from "react-icons/pi";
import { MdOutlineTrain } from "react-icons/md";
import { IoIosBus } from "react-icons/io";
import { MdOutlinePercent } from "react-icons/md";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const menuItems = [
    { icon: <PiAirplaneTilt />, label: t.flight, path: "/ve-may-bay" },
    { icon: <MdOutlineTrain />, label: t.train, path: "/ve-tau-hoa" },
    { icon: <IoIosBus />, label: t.bus, path: "/xe-khach" },
    { icon: <MdOutlinePercent />, label: t.package, path: "/dat-theo-goi" },
  ];

  const handleMenuClick = (path) => {
    navigate(path);
  };

  return (
    <aside
      style={{
        position: "fixed",
        top: "70px",
        left: 0,
        width: isOpen ? "170px" : "0", 
        height: "calc(100vh - 70px)",
        backgroundColor: "#ffffff",
        boxShadow: isOpen ? "2px 0 10px rgba(0,0,0,0.05)" : "none",
        transition: "width 0.3s",
        overflow: "hidden",
        zIndex: 999,
      }}
    >
      <div style={{ 
        padding: isOpen ? "20px 10px" : "0", 
        opacity: isOpen ? 1 : 0,
        transition: "opacity 0.2s",
        width: "200px", 
      }}>
        {menuItems.map((item, index) => (
          <div 
            key={index}
            onClick={() => handleMenuClick(item.path)}
            style={{ 
              padding: "12px 12px", 
              margin: "4px 0",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              borderRadius: "6px",
              transition: "background 0.2s",
              color: "#333",
              fontSize: "14px",
              fontWeight: "500",
              width: "100%",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#f5f5f5"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            <span style={{ 
              fontSize: "18px", 
              color: "#4f7cff",
              minWidth: "24px", 
              display: "flex",
              justifyContent: "center",
            }}>
              {item.icon}
            </span>
            <span style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              flex: 1, 
              textAlign: "left", 
            }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;