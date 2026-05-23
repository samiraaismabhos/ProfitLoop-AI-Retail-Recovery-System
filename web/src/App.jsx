import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import RiskMonitor from "./pages/RiskMonitor";
import AIAnalysis from "./pages/AIAnalysis";
import Redistribution from "./pages/Redistribution";
import Campaigns from "./pages/Campaigns";
import ESGMetrics from "./pages/ESGMetrics";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PhoneFrame from "./components/PhoneFrame";
import ExecuteLoop from "./pages/Executeloop";


function Layout({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, overflow: "auto" }}>
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Auth — no sidebar */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* App pages — sidebar on left */}
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/risk-monitor" element={<Layout><RiskMonitor /></Layout>} />
        <Route path="/ai-analysis" element={<Layout><AIAnalysis /></Layout>} />
        <Route path="/redistribution" element={<Layout><Redistribution /></Layout>} />
        <Route path="/campaigns" element={<Layout><Campaigns /></Layout>} />
        <Route path="/esg-metrics" element={<Layout><ESGMetrics /></Layout>} />
        <Route path="/settings" element={<Layout><Settings /></Layout>} />
        <Route path="/bravo-app" element={<PhoneFrame />} />
        <Route path="/execute" element={<Layout><ExecuteLoop /></Layout>} />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;