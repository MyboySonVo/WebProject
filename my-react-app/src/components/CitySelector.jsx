// src/components/CitySelector.jsx
import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { IoClose, IoSearch } from "react-icons/io5";

const CitySelector = ({ isOpen, onClose, onSelect, type }) => {
  const { t, currentLanguage } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("vietnam");

  // Chỉ giữ lại các thành phố từ 4 nước: Việt Nam, Đài Loan, Nhật Bản, Anh
  const cities = {
    vietnam: [
      { code: "HAN", name: t.hanoi, en: "Hanoi", ja: "ハノイ", zh: "河內" },
      { code: "SGN", name: t.hcmc, en: "Ho Chi Minh City", ja: "ホーチミン", zh: "胡志明市" },
      { code: "DAD", name: t.danang, en: "Da Nang", ja: "ダナン", zh: "峴港" },
    ],
    taiwan: [
      { code: "TPE", name: t.taipei, en: "Taipei", ja: "台北", zh: "台北" },
      { code: "KHH", name: t.kaohsiung, en: "Kaohsiung", ja: "高雄", zh: "高雄" },
      { code: "TXG", name: t.taichung, en: "Taichung", ja: "台中", zh: "台中" },
    ],
    japan: [
      { code: "NRT", name: t.tokyo, en: "Tokyo", ja: "東京", zh: "東京" },
      { code: "KIX", name: t.osaka, en: "Osaka", ja: "大阪", zh: "大阪" },
      { code: "NGO", name: t.nagoya, en: "Nagoya", ja: "名古屋", zh: "名古屋" },
      { code: "CTS", name: t.sapporo, en: "Sapporo", ja: "札幌", zh: "札幌" },
      { code: "FUK", name: t.fukuoka, en: "Fukuoka", ja: "福岡", zh: "福岡" },
    ],
    uk: [
      { code: "LHR", name: t.london, en: "London", ja: "ロンドン", zh: "倫敦" },
      { code: "MAN", name: t.manchester, en: "Manchester", ja: "マンチェスター", zh: "曼徹斯特" },
      { code: "EDI", name: t.edinburgh, en: "Edinburgh", ja: "エディンバラ", zh: "愛丁堡" },
      { code: "BHX", name: t.birmingham, en: "Birmingham", ja: "バーミンガム", zh: "伯明翰" },
    ],
  };

  const tabs = [
    { id: "vietnam", label: t.vietnam },
    { id: "taiwan", label: t.taiwan },
    { id: "japan", label: t.japan },
    { id: "uk", label: t.uk },
  ];

  const getCityName = (city) => {
    // Trả về tên thành phố theo ngôn ngữ hiện tại
    return city.name;
  };

  const filteredCities = (cityList) => {
    if (!searchTerm) return cityList;
    return cityList.filter(city => 
      getCityName(city).toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 2000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "700px",
          maxWidth: "90vw",
          maxHeight: "80vh",
          backgroundColor: "#fff",
          borderRadius: "16px",
          padding: "24px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}>
          <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#333" }}>
            {type === "from" ? t.selectDeparture : t.selectDestination}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "24px",
              color: "#666",
            }}
          >
            <IoClose />
          </button>
        </div>

        {/* Search */}
        <div style={{
          position: "relative",
          marginBottom: "20px",
        }}>
          <IoSearch style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#999",
          }} />
          <input
            type="text"
            placeholder={t.searchCity}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 12px 12px 40px",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              fontSize: "15px",
              outline: "none",
            }}
          />
        </div>

        {/* Tabs - 4 nước */}
        <div style={{
          display: "flex",
          gap: "8px",
          marginBottom: "20px",
          borderBottom: "1px solid #e0e0e0",
          paddingBottom: "12px",
          flexWrap: "wrap",
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              style={{
                padding: "8px 16px",
                border: "none",
                background: selectedTab === tab.id ? "#4f7cff" : "transparent",
                color: selectedTab === tab.id ? "#fff" : "#666",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: selectedTab === tab.id ? "600" : "400",
                transition: "all 0.2s",
                flex: "0 1 auto",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* City list */}
        <div style={{
          overflowY: "auto",
          flex: 1,
          paddingRight: "8px",
        }}>
          {/* Việt Nam */}
          {selectedTab === "vietnam" && (
            <div>
              <h4 style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#666",
                marginBottom: "12px",
                textTransform: "uppercase",
              }}>
                {t.vietnam}
              </h4>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "8px",
                marginBottom: "16px",
              }}>
                {filteredCities(cities.vietnam).map(city => (
                  <button
                    key={city.code}
                    onClick={() => {
                      onSelect(city);
                      onClose();
                    }}
                    style={{
                      padding: "12px",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      background: "#fff",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = "#4f7cff";
                      e.target.style.boxShadow = "0 2px 8px rgba(79,124,255,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = "#e0e0e0";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                      {getCityName(city)}
                    </div>
                    <div style={{ fontSize: "12px", color: "#999" }}>
                      {city.code}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Đài Loan */}
          {selectedTab === "taiwan" && (
            <div>
              <h4 style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#666",
                marginBottom: "12px",
                textTransform: "uppercase",
              }}>
                {t.taiwan}
              </h4>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "8px",
                marginBottom: "16px",
              }}>
                {filteredCities(cities.taiwan).map(city => (
                  <button
                    key={city.code}
                    onClick={() => {
                      onSelect(city);
                      onClose();
                    }}
                    style={{
                      padding: "12px",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      background: "#fff",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = "#4f7cff";
                      e.target.style.boxShadow = "0 2px 8px rgba(79,124,255,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = "#e0e0e0";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                      {getCityName(city)}
                    </div>
                    <div style={{ fontSize: "12px", color: "#999" }}>
                      {city.code}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Nhật Bản */}
          {selectedTab === "japan" && (
            <div>
              <h4 style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#666",
                marginBottom: "12px",
                textTransform: "uppercase",
              }}>
                {t.japan}
              </h4>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "8px",
                marginBottom: "16px",
              }}>
                {filteredCities(cities.japan).map(city => (
                  <button
                    key={city.code}
                    onClick={() => {
                      onSelect(city);
                      onClose();
                    }}
                    style={{
                      padding: "12px",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      background: "#fff",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = "#4f7cff";
                      e.target.style.boxShadow = "0 2px 8px rgba(79,124,255,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = "#e0e0e0";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                      {getCityName(city)}
                    </div>
                    <div style={{ fontSize: "12px", color: "#999" }}>
                      {city.code}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Anh */}
          {selectedTab === "uk" && (
            <div>
              <h4 style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#666",
                marginBottom: "12px",
                textTransform: "uppercase",
              }}>
                {t.uk}
              </h4>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "8px",
                marginBottom: "16px",
              }}>
                {filteredCities(cities.uk).map(city => (
                  <button
                    key={city.code}
                    onClick={() => {
                      onSelect(city);
                      onClose();
                    }}
                    style={{
                      padding: "12px",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      background: "#fff",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = "#4f7cff";
                      e.target.style.boxShadow = "0 2px 8px rgba(79,124,255,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = "#e0e0e0";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                      {getCityName(city)}
                    </div>
                    <div style={{ fontSize: "12px", color: "#999" }}>
                      {city.code}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CitySelector;