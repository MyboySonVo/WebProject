import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./LayOut/Header";
import Home from "./Page/Home";
import Auth from "./Page/Auth";

function AppWrapper() {
  const location = useLocation();
  const showHeader = location.pathname !== "/auth";

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;
