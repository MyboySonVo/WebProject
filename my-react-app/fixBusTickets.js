const fs = require('fs');
let content = fs.readFileSync('src/Page/BusTickets.jsx', 'utf8');

const target = `{/* Right: booking summary */}
                <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 4px 15px rgba(0,0,0,0.05)", height: "fit-content", position: "sticky", top: 16 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, borderBottom: "1px solid #eee", paddingBottom: 10 }}>{t.bookingSummary}</div>
                  <p style={{ color: "#666", fontSize: 13, marginBottom: 20 }}>{t.passengerInstruction}</p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    {[{label:t.passengerLastName,key:"lastName"},{label:t.passengerFirstName,key:"firstName"}].map(f => (
                      <div key={f.key}>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{f.label}</label>
                        style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14 }} />
                    </div>`;

const replacement = `{/* Right: booking summary */}
                <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 4px 15px rgba(0,0,0,0.05)", height: "fit-content", position: "sticky", top: 16 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, borderBottom: "1px solid #eee", paddingBottom: 10 }}>{t.bookingSummary}</div>
                  <div style={{ fontSize: 13, color: "#444", lineHeight: 1.8 }}>
                    <div><b>{selectedTrip.origin}</b> → <b>{selectedTrip.destination}</b></div>
                    <div style={{ color: "#888" }}>{selectedTrip.departureTime}</div>
                    <div style={{ color: "#888" }}>{selectedTrip.providerName}</div>
                    <div style={{ marginTop: 8, fontWeight: 700, color: "#ff6b00", fontSize: 15 }}>{Number(selectedTrip.price||0).toLocaleString("vi-VN")} đ / ghế</div>
                    <div style={{ marginTop: 8, color: selectedSeatIds.length >= (passengers||1) ? "#22c55e" : "#888" }}>Ghế đã chọn: {selectedSeatIds.length}/{passengers||1}</div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Thông tin hành khách */}
            {selectedTrip && step === "passenger" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
                <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{t.step2}</h2>
                  <p style={{ color: "#666", fontSize: 13, marginBottom: 20 }}>{t.passengerInstruction}</p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    {[{label:t.passengerLastName,key:"lastName"},{label:t.passengerFirstName,key:"firstName"}].map(f => (
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
                    </div>`;

if (content.includes("style={{ width: \"100%\", padding: \"10px 12px\", borderRadius: 8, border: \"1px solid #ddd\", fontSize: 14 }} />")) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/Page/BusTickets.jsx', content);
  console.log("Replaced successfully!");
} else {
  console.log("Target string not found or already replaced.");
}
