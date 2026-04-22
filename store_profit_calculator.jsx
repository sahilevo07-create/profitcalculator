import { useState, useRef, useEffect } from "react";

const DEFAULT = {
  productCost: 175,
  sellingPricePrepaid: 899,
  sellingPricePartial: 999,
  sellingPriceCOD: 1099,
  tokenAmount: 99,
  cpa: 333,
  shipping: 50,
  rtoShippingLoss: 50,
  prepaidOrders: 150,
  partialOrders: 210,
  codOrders: 90,
  prepaidDeliveryRate: 95,
  partialRTORate: 20,
  codRTORate: 50,
};

function InputField({ label, value, onChange, prefix = "₹", suffix = "", hint = "", color = "#f59e0b" }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 13 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <label style={{ fontSize: 12, color: "#94a3b8", fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.3 }}>{label}</label>
        {hint && <span style={{ fontSize: 10, color: "#475569" }}>{hint}</span>}
      </div>
      <div style={{
        display: "flex", alignItems: "center",
        background: focused ? "#1e293b" : "#0f172a",
        border: `1px solid ${focused ? color + "88" : "#1e293b"}`,
        borderRadius: 8, overflow: "hidden", transition: "all 0.2s",
      }}>
        {prefix && <span style={{ padding: "0 10px", color: "#475569", fontSize: 13, fontFamily: "'DM Mono', monospace", borderRight: "1px solid #1e293b", minWidth: 32, textAlign: "center" }}>{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={e => onChange(e.target.value === "" ? "" : Number(e.target.value))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#f1f5f9", fontSize: 15, fontWeight: 700, fontFamily: "'DM Mono', monospace", padding: "10px 12px" }}
        />
        {suffix && <span style={{ padding: "0 10px", color: "#475569", fontSize: 11 }}>{suffix}</span>}
      </div>
    </div>
  );
}

function MetricCard({ label, value, sub, color = "#f59e0b", big = false }) {
  return (
    <div style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)", border: `1px solid ${color}33`, borderRadius: 12, padding: big ? "18px 16px" : "12px 14px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: 50, height: 50, borderRadius: "0 12px 0 50px", background: `${color}11` }} />
      <div style={{ fontSize: 10, color: "#64748b", marginBottom: 5, letterSpacing: 0.5, textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: big ? 22 : 17, fontWeight: 800, color, fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>
        {typeof value === "number" ? (value < 0 ? "-₹" + Math.abs(value).toLocaleString("en-IN") : "₹" + value.toLocaleString("en-IN")) : value}
      </div>
      {sub && <div style={{ fontSize: 10, color: "#475569", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

// Simple SVG bar chart
function BarChart({ data, title }) {
  const max = Math.max(...data.map(d => Math.abs(d.value)), 1);
  const h = 140;
  return (
    <div style={{ background: "#0f172a", borderRadius: 10, padding: "14px 12px", marginBottom: 12 }}>
      <div style={{ fontSize: 10, color: "#f59e0b", letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>{title}</div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: h, paddingBottom: 24, position: "relative" }}>
        {/* Zero line */}
        <div style={{ position: "absolute", bottom: 24, left: 0, right: 0, height: 1, background: "#1e293b" }} />
        {data.map((d, i) => {
          const barH = Math.max((Math.abs(d.value) / max) * (h - 32), 4);
          const isNeg = d.value < 0;
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%", position: "relative" }}>
              <div style={{ fontSize: 9, color: d.color, fontWeight: 700, marginBottom: 3, fontFamily: "'DM Mono', monospace", textAlign: "center", lineHeight: 1.2 }}>
                {d.value >= 0 ? "₹" : "-₹"}{Math.abs(d.value) >= 100000 ? (Math.abs(d.value) / 100000).toFixed(1) + "L" : Math.abs(d.value) >= 1000 ? (Math.abs(d.value) / 1000).toFixed(0) + "k" : Math.abs(d.value)}
              </div>
              <div style={{ width: "100%", height: barH, background: `linear-gradient(180deg, ${d.color}, ${d.color}88)`, borderRadius: "4px 4px 0 0", border: `1px solid ${d.color}44`, boxShadow: `0 0 8px ${d.color}33`, opacity: isNeg ? 0.7 : 1 }} />
              <div style={{ position: "absolute", bottom: 4, fontSize: 9, color: "#64748b", textAlign: "center", width: "100%", lineHeight: 1.2, overflow: "hidden" }}>{d.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Donut chart using SVG
function DonutChart({ segments, title }) {
  const size = 110;
  const r = 38;
  const cx = size / 2, cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const total = segments.reduce((a, s) => a + s.value, 0);
  let offset = 0;
  return (
    <div style={{ background: "#0f172a", borderRadius: 10, padding: "14px 12px", marginBottom: 12 }}>
      <div style={{ fontSize: 10, color: "#f59e0b", letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>{title}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <svg width={size} height={size} style={{ flexShrink: 0 }}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e293b" strokeWidth={12} />
          {segments.map((seg, i) => {
            const pct = total > 0 ? seg.value / total : 0;
            const dash = pct * circumference;
            const gap = circumference - dash;
            const el = (
              <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color} strokeWidth={12}
                strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-offset * circumference}
                strokeLinecap="butt" style={{ transition: "stroke-dasharray 0.5s" }}
                transform={`rotate(-90 ${cx} ${cy})`}
              />
            );
            offset += pct;
            return el;
          })}
          <text x={cx} y={cy - 5} textAnchor="middle" fill="#e2e8f0" fontSize={10} fontWeight={700} fontFamily="DM Mono">{total}</text>
          <text x={cx} y={cy + 9} textAnchor="middle" fill="#475569" fontSize={8} fontFamily="DM Sans">orders</text>
        </svg>
        <div style={{ flex: 1 }}>
          {segments.map((seg, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: seg.color }} />
                <span style={{ fontSize: 11, color: "#94a3b8" }}>{seg.label}</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: seg.color, fontFamily: "'DM Mono', monospace" }}>
                {total > 0 ? Math.round(seg.value / total * 100) : 0}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Horizontal bar for profit comparison
function HBarChart({ data, title }) {
  const max = Math.max(...data.map(d => Math.abs(d.value)), 1);
  return (
    <div style={{ background: "#0f172a", borderRadius: 10, padding: "14px 12px", marginBottom: 12 }}>
      <div style={{ fontSize: 10, color: "#f59e0b", letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>{title}</div>
      {data.map((d, i) => {
        const pct = (Math.abs(d.value) / max) * 100;
        return (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: "#94a3b8" }}>{d.label}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: d.color, fontFamily: "'DM Mono', monospace" }}>
                {d.value >= 0 ? "₹" : "-₹"}{Math.abs(d.value).toLocaleString("en-IN")}
              </span>
            </div>
            <div style={{ height: 8, background: "#1e293b", borderRadius: 4 }}>
              <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${d.color}88, ${d.color})`, borderRadius: 4, transition: "width 0.4s", boxShadow: `0 0 6px ${d.color}44` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function StoreProfitCalculator() {
  const [s, setS] = useState(DEFAULT);
  const [tab, setTab] = useState("inputs");
  const update = (key) => (val) => setS(prev => ({ ...prev, [key]: val }));

  const totalOrders = (s.prepaidOrders || 0) + (s.partialOrders || 0) + (s.codOrders || 0);

  // Deliveries
  const prepaidDelivered = Math.round((s.prepaidOrders || 0) * (s.prepaidDeliveryRate || 95) / 100);
  const partialRTO = Math.round((s.partialOrders || 0) * (s.partialRTORate || 20) / 100);
  const partialDelivered = (s.partialOrders || 0) - partialRTO;
  const codRTO = Math.round((s.codOrders || 0) * (s.codRTORate || 50) / 100);
  const codDelivered = (s.codOrders || 0) - codRTO;
  const totalDelivered = prepaidDelivered + partialDelivered + codDelivered;
  const totalRTO = partialRTO + codRTO;

  // Revenue
  const prepaidRev = prepaidDelivered * (s.sellingPricePrepaid || 0);
  const partialRev = partialDelivered * (s.sellingPricePartial || 0);
  const codRev = codDelivered * (s.sellingPriceCOD || 0);
  const tokenKept = partialRTO * (s.tokenAmount || 0);
  const totalRev = prepaidRev + partialRev + codRev + tokenKept;

  // Costs
  const totalPC = totalDelivered * (s.productCost || 0);
  const totalAds = totalOrders * (s.cpa || 0);
  const totalShip = totalOrders * (s.shipping || 0);
  const totalRTOLoss = totalRTO * (s.rtoShippingLoss || 0);
  const totalCosts = totalPC + totalAds + totalShip + totalRTOLoss;

  // Profit
  const monthlyProfit = totalRev - totalCosts;
  const dailyProfit = Math.round(monthlyProfit / 30);
  const margin = totalRev > 0 ? ((monthlyProfit / totalRev) * 100).toFixed(1) : 0;
  const deliveryRate = totalOrders > 0 ? ((totalDelivered / totalOrders) * 100).toFixed(0) : 0;
  const dailyFor1L = monthlyProfit > 0 ? Math.ceil((100000 / monthlyProfit) * (totalOrders / 30)) : "∞";
  const ordersFor1L = monthlyProfit > 0 ? Math.ceil(100000 / (monthlyProfit / totalOrders)) : "∞";

  // Per segment profit
  const segProfit = (orders, delivered, rto, rev) => {
    const ads = orders * (s.cpa || 0);
    const ship = orders * (s.shipping || 0);
    const rtoL = rto * (s.rtoShippingLoss || 0);
    const pc = delivered * (s.productCost || 0);
    return rev - pc - ads - ship - rtoL;
  };
  const prepaidProfit = segProfit(s.prepaidOrders || 0, prepaidDelivered, 0, prepaidRev);
  const partialProfit = segProfit(s.partialOrders || 0, partialDelivered, partialRTO, partialRev + tokenKept);
  const codProfit = segProfit(s.codOrders || 0, codDelivered, codRTO, codRev);

  const isProfit = monthlyProfit > 0;
  const isTarget = monthlyProfit >= 100000;
  const verdictColor = isTarget ? "#22c55e" : isProfit ? "#f59e0b" : "#ef4444";
  const verdictText = isTarget ? "🎯 ₹1 Lakh Target Achieved!" : isProfit ? "📈 Profitable — Scale Up" : "❌ Loss — Adjust Numbers";

  const rows = [
    { label: `Prepaid revenue (${prepaidDelivered} × ₹${s.sellingPricePrepaid})`, amt: prepaidRev, plus: true },
    { label: `Partial COD revenue (${partialDelivered} × ₹${s.sellingPricePartial})`, amt: partialRev, plus: true },
    { label: `Full COD revenue (${codDelivered} × ₹${s.sellingPriceCOD})`, amt: codRev, plus: true },
    { label: `Token kept on RTO (${partialRTO} × ₹${s.tokenAmount})`, amt: tokenKept, plus: true },
    { label: `Product cost (${totalDelivered} × ₹${s.productCost})`, amt: -totalPC, plus: false },
    { label: `Ad spend (${totalOrders} × ₹${s.cpa} CPA)`, amt: -totalAds, plus: false },
    { label: `Shipping (${totalOrders} × ₹${s.shipping})`, amt: -totalShip, plus: false },
    { label: `RTO loss (${totalRTO} × ₹${s.rtoShippingLoss})`, amt: -totalRTOLoss, plus: false },
  ];

  const tabs = [
    { id: "inputs", label: "📝 Inputs" },
    { id: "breakdown", label: "📊 P&L" },
    { id: "charts", label: "📈 Charts" },
    { id: "segments", label: "🗂 Segments" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#020617", color: "#e2e8f0", fontFamily: "'DM Sans', sans-serif", paddingBottom: 48 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;}
        .tb { background: transparent; border: 1px solid #1e293b; border-radius: 8px; padding: 8px 10px; font-size: 11px; color: #64748b; cursor: pointer; font-family: 'DM Sans',sans-serif; font-weight: 600; letter-spacing: 0.3px; transition: all 0.2s; white-space: nowrap; }
        .tb.act { background: #f59e0b22; border-color: #f59e0b66; color: #f59e0b; }
        .tb:hover:not(.act) { border-color: #334155; color: #94a3b8; }
        .ri { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; border-bottom: 1px solid #0f172a; font-size: 12px; }
        .ri:last-child { border-bottom: none; }
        .st { font-size: 10px; color: #f59e0b; letter-spacing: 2px; text-transform: uppercase; font-weight: 700; margin-bottom: 13px; }
        .divider { border-top: 1px solid #1e293b; margin: 4px 0 16px; padding-top: 16px; }
      `}</style>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)", borderBottom: "1px solid #1e293b", padding: "22px 20px 18px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -50, right: -50, width: 160, height: 160, borderRadius: "50%", background: "#f59e0b08", filter: "blur(50px)" }} />
        <div style={{ position: "absolute", bottom: -20, left: -20, width: 100, height: 100, borderRadius: "50%", background: "#6366f108", filter: "blur(30px)" }} />
        <div style={{ fontSize: 10, color: "#f59e0b", letterSpacing: 3, textTransform: "uppercase", marginBottom: 4, fontWeight: 700 }}>COD · Partial COD · Prepaid</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", fontFamily: "'DM Mono', monospace", lineHeight: 1.1 }}>Store Profit Calculator</div>
        <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>Set orders manually — updates live</div>
      </div>

      <div style={{ padding: "16px 16px" }}>

        {/* Verdict */}
        <div style={{ background: `${verdictColor}11`, border: `1px solid ${verdictColor}44`, borderRadius: 12, padding: "12px 16px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: verdictColor }}>{verdictText}</span>
          <span style={{ fontSize: 11, color: verdictColor + "99", fontFamily: "'DM Mono', monospace" }}>
            {isProfit ? `${dailyFor1L}/day for ₹1L` : "losing money"}
          </span>
        </div>

        {/* Top metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <MetricCard label="Monthly Profit" value={monthlyProfit} color={isTarget ? "#22c55e" : isProfit ? "#f59e0b" : "#ef4444"} big />
          <MetricCard label="Daily Profit" value={dailyProfit} color="#6366f1" big />
          <MetricCard label="Net Margin" value={`${margin}%`} color="#06b6d4" sub={`${deliveryRate}% delivery rate`} />
          <MetricCard label="Orders/Day for ₹1L" value={isProfit ? `${dailyFor1L}/day` : "∞"} color="#f59e0b" sub={isProfit ? `${ordersFor1L}/month` : "not profitable"} />
        </div>

        {/* Mini stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 7, marginBottom: 14 }}>
          {[
            { l: "Revenue", v: "₹" + (totalRev >= 100000 ? (totalRev / 100000).toFixed(1) + "L" : totalRev.toLocaleString("en-IN")), c: "#22c55e" },
            { l: "Ad Spend", v: "₹" + (totalAds >= 100000 ? (totalAds / 100000).toFixed(1) + "L" : totalAds.toLocaleString("en-IN")), c: "#ef4444" },
            { l: "Delivered", v: totalDelivered, c: "#06b6d4" },
            { l: "Total RTO", v: totalRTO, c: "#f97316" },
          ].map((m, i) => (
            <div key={i} style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, padding: "8px 8px" }}>
              <div style={{ fontSize: 9, color: "#475569", marginBottom: 2, textTransform: "uppercase", letterSpacing: 0.3 }}>{m.l}</div>
              <div style={{ fontSize: 12, fontWeight: 800, color: m.c, fontFamily: "'DM Mono', monospace" }}>{m.v}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 14, overflowX: "auto", paddingBottom: 2 }}>
          {tabs.map(t => <button key={t.id} className={`tb ${tab === t.id ? "act" : ""}`} onClick={() => setTab(t.id)}>{t.label}</button>)}
        </div>

        {/* ── INPUTS TAB ── */}
        {tab === "inputs" && (
          <div style={{ background: "linear-gradient(135deg,#0f172a,#1e293b)", border: "1px solid #1e293b", borderRadius: 14, padding: "18px 16px" }}>

            <div className="st">📦 Product & Selling Prices</div>
            <InputField label="Product Cost per unit" value={s.productCost} onChange={update("productCost")} color="#ef4444" hint="Your supplier cost" />
            <InputField label="Prepaid Selling Price" value={s.sellingPricePrepaid} onChange={update("sellingPricePrepaid")} color="#22c55e" hint="Discounted price" />
            <InputField label="Partial COD Selling Price" value={s.sellingPricePartial} onChange={update("sellingPricePartial")} color="#f59e0b" hint="Standard price" />
            <InputField label="Full COD Selling Price" value={s.sellingPriceCOD} onChange={update("sellingPriceCOD")} color="#f97316" hint="Premium price" />
            <InputField label="Partial COD Token Amount" value={s.tokenAmount} onChange={update("tokenAmount")} color="#a78bfa" hint="Upfront token" />

            <div className="divider">
              <div className="st">💸 Costs</div>
            </div>
            <InputField label="CPA — Cost Per Purchase" value={s.cpa} onChange={update("cpa")} color="#ef4444" hint="Ad cost per order" />
            <InputField label="Forward Shipping per order" value={s.shipping} onChange={update("shipping")} color="#06b6d4" />
            <InputField label="RTO Shipping Loss per return" value={s.rtoShippingLoss} onChange={update("rtoShippingLoss")} color="#f97316" hint="Return charge only" />

            <div className="divider">
              <div className="st">📦 Monthly Orders — Set Manually</div>
            </div>
            <InputField label="Prepaid Orders / month" value={s.prepaidOrders} onChange={update("prepaidOrders")} prefix="#" color="#22c55e" hint="Set your own number" />
            <InputField label="Partial COD Orders / month" value={s.partialOrders} onChange={update("partialOrders")} prefix="#" color="#f59e0b" hint="Set your own number" />
            <InputField label="Full COD Orders / month" value={s.codOrders} onChange={update("codOrders")} prefix="#" color="#f97316" hint="Set your own number" />

            {/* Total orders display */}
            <div style={{ background: "#020617", border: "1px solid #1e293b", borderRadius: 8, padding: "10px 14px", marginBottom: 14, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, color: "#64748b" }}>Total Monthly Orders</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: "#e2e8f0", fontFamily: "'DM Mono', monospace" }}>{totalOrders}</span>
            </div>

            {/* Order mix visual */}
            <div style={{ display: "flex", height: 22, borderRadius: 6, overflow: "hidden", gap: 2, marginBottom: 8 }}>
              {[
                { val: s.prepaidOrders || 0, color: "#22c55e" },
                { val: s.partialOrders || 0, color: "#f59e0b" },
                { val: s.codOrders || 0, color: "#f97316" },
              ].map((seg, i) => (
                <div key={i} style={{ flex: seg.val || 0.01, background: seg.color + "33", border: `1px solid ${seg.color}44`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", minWidth: 0, transition: "flex 0.3s" }}>
                  {seg.val > totalOrders * 0.1 && <span style={{ fontSize: 9, color: seg.color, fontWeight: 700 }}>{totalOrders > 0 ? Math.round(seg.val / totalOrders * 100) : 0}%</span>}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              {[{ c: "#22c55e", l: "Prepaid" }, { c: "#f59e0b", l: "Partial COD" }, { c: "#f97316", l: "Full COD" }].map((m, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 7, height: 7, borderRadius: 2, background: m.c }} />
                  <span style={{ fontSize: 10, color: "#64748b" }}>{m.l}</span>
                </div>
              ))}
            </div>

            <div className="divider">
              <div className="st">📉 RTO Rates</div>
            </div>
            <InputField label="Prepaid Delivery Rate %" value={s.prepaidDeliveryRate} onChange={update("prepaidDeliveryRate")} prefix="%" color="#22c55e" hint="Typically 95%" />
            <InputField label="Partial COD RTO Rate %" value={s.partialRTORate} onChange={update("partialRTORate")} prefix="%" color="#f59e0b" hint="Typically 20%" />
            <InputField label="Full COD RTO Rate %" value={s.codRTORate} onChange={update("codRTORate")} prefix="%" color="#f97316" hint="Typically 50%" />

            <div className="divider">
              <div className="st">💰 Net Profit Per Segment</div>
            </div>
            {[
              { label: "Prepaid", color: "#22c55e", orders: s.prepaidOrders || 0, profit: prepaidProfit, delivered: prepaidDelivered },
              { label: "Partial COD", color: "#f59e0b", orders: s.partialOrders || 0, profit: partialProfit, delivered: partialDelivered },
              { label: "Full COD", color: "#f97316", orders: s.codOrders || 0, profit: codProfit, delivered: codDelivered },
            ].map((seg, i) => {
              const perOrder = seg.orders > 0 ? Math.round(seg.profit / seg.orders) : 0;
              return (
                <div key={i} style={{ background: "#020617", border: `1px solid ${seg.color}22`, borderRadius: 10, padding: "11px 13px", marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: seg.color }} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: seg.color }}>{seg.label}</span>
                    </div>
                    <span style={{ fontSize: 10, color: "#475569" }}>{seg.orders} orders · {seg.delivered} delivered</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                    <div style={{ background: "#0f172a", borderRadius: 6, padding: "7px 8px" }}>
                      <div style={{ fontSize: 9, color: "#475569", marginBottom: 2 }}>Net Profit</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: seg.profit >= 0 ? seg.color : "#ef4444", fontFamily: "'DM Mono', monospace" }}>
                        {seg.profit >= 0 ? "₹" : "-₹"}{Math.abs(seg.profit).toLocaleString("en-IN")}
                      </div>
                    </div>
                    <div style={{ background: "#0f172a", borderRadius: 6, padding: "7px 8px" }}>
                      <div style={{ fontSize: 9, color: "#475569", marginBottom: 2 }}>Per Order</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: perOrder >= 0 ? seg.color : "#ef4444", fontFamily: "'DM Mono', monospace" }}>
                        {perOrder >= 0 ? "₹" : "-₹"}{Math.abs(perOrder).toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <button onClick={() => setS(DEFAULT)} style={{ marginTop: 8, width: "100%", padding: "10px", background: "transparent", border: "1px solid #1e293b", borderRadius: 8, color: "#475569", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Reset to defaults
            </button>
          </div>
        )}

        {/* ── P&L TAB ── */}
        {tab === "breakdown" && (
          <div style={{ background: "linear-gradient(135deg,#0f172a,#1e293b)", border: "1px solid #1e293b", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ padding: "14px 16px 12px", borderBottom: "1px solid #0f172a" }}>
              <div className="st" style={{ marginBottom: 0 }}>Monthly P&L Breakdown</div>
            </div>
            {rows.map((r, i) => (
              <div key={i} className="ri">
                <span style={{ color: "#64748b", fontSize: 11, flex: 1, paddingRight: 8, lineHeight: 1.5 }}>{r.label}</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 700, color: r.plus ? "#22c55e" : "#ef4444", flexShrink: 0 }}>
                  {r.plus ? "+" : ""}{r.amt < 0 ? "-₹" + Math.abs(r.amt).toLocaleString("en-IN") : "₹" + r.amt.toLocaleString("en-IN")}
                </span>
              </div>
            ))}
            <div style={{ padding: "14px", background: `${verdictColor}11`, borderTop: `2px solid ${verdictColor}44`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: verdictColor }}>Net Monthly Profit</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, fontWeight: 800, color: verdictColor }}>
                {monthlyProfit < 0 ? "-₹" + Math.abs(monthlyProfit).toLocaleString("en-IN") : "₹" + monthlyProfit.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        )}

        {/* ── CHARTS TAB ── */}
        {tab === "charts" && (
          <div>
            <BarChart title="Revenue vs Costs Breakdown" data={[
              { label: "Revenue", value: totalRev, color: "#22c55e" },
              { label: "Product", value: totalPC, color: "#ef4444" },
              { label: "Ads", value: totalAds, color: "#f97316" },
              { label: "Shipping", value: totalShip, color: "#06b6d4" },
              { label: "RTO Loss", value: totalRTOLoss, color: "#a78bfa" },
              { label: "Profit", value: Math.abs(monthlyProfit), color: monthlyProfit >= 0 ? "#22c55e" : "#ef4444" },
            ]} />

            <HBarChart title="Profit Per Segment" data={[
              { label: "Prepaid", value: prepaidProfit, color: "#22c55e" },
              { label: "Partial COD", value: partialProfit, color: "#f59e0b" },
              { label: "Full COD", value: codProfit, color: "#f97316" },
            ]} />

            <DonutChart title="Order Mix" segments={[
              { label: "Prepaid", value: s.prepaidOrders || 0, color: "#22c55e" },
              { label: "Partial COD", value: s.partialOrders || 0, color: "#f59e0b" },
              { label: "Full COD", value: s.codOrders || 0, color: "#f97316" },
            ]} />

            <DonutChart title="Delivered vs RTO" segments={[
              { label: "Delivered", value: totalDelivered, color: "#22c55e" },
              { label: "RTO", value: totalRTO, color: "#ef4444" },
              { label: "Prepaid Lost", value: (s.prepaidOrders || 0) - prepaidDelivered, color: "#475569" },
            ]} />

            <BarChart title="Profit Per Segment (Monthly)" data={[
              { label: "Prepaid", value: prepaidProfit, color: prepaidProfit >= 0 ? "#22c55e" : "#ef4444" },
              { label: "Partial", value: partialProfit, color: partialProfit >= 0 ? "#f59e0b" : "#ef4444" },
              { label: "Full COD", value: codProfit, color: codProfit >= 0 ? "#f97316" : "#ef4444" },
              { label: "Total", value: monthlyProfit, color: monthlyProfit >= 0 ? "#22c55e" : "#ef4444" },
            ]} />
          </div>
        )}

        {/* ── SEGMENTS TAB ── */}
        {tab === "segments" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "Prepaid", orders: s.prepaidOrders || 0, delivered: prepaidDelivered, rto: (s.prepaidOrders || 0) - prepaidDelivered, rev: prepaidRev, profit: prepaidProfit, price: s.sellingPricePrepaid, color: "#22c55e", rtoRate: (100 - (s.prepaidDeliveryRate || 95)) + "%" },
              { label: "Partial COD", orders: s.partialOrders || 0, delivered: partialDelivered, rto: partialRTO, rev: partialRev + tokenKept, profit: partialProfit, price: s.sellingPricePartial, color: "#f59e0b", rtoRate: (s.partialRTORate || 20) + "%" },
              { label: "Full COD", orders: s.codOrders || 0, delivered: codDelivered, rto: codRTO, rev: codRev, profit: codProfit, price: s.sellingPriceCOD, color: "#f97316", rtoRate: (s.codRTORate || 50) + "%" },
            ].map((seg, i) => {
              const perOrder = seg.orders > 0 ? Math.round(seg.profit / seg.orders) : 0;
              return (
                <div key={i} style={{ background: "linear-gradient(135deg,#0f172a,#1e293b)", border: `1px solid ${seg.color}33`, borderRadius: 14, padding: "16px", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, right: 0, width: 70, height: 70, borderRadius: "0 14px 0 70px", background: `${seg.color}08` }} />
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: seg.color }}>{seg.label}</span>
                    <span style={{ fontSize: 11, color: seg.color + "88", fontFamily: "'DM Mono', monospace" }}>₹{seg.price} · RTO {seg.rtoRate}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 10 }}>
                    {[
                      { l: "Orders", v: seg.orders, c: "#e2e8f0" },
                      { l: "Delivered", v: seg.delivered, c: "#22c55e" },
                      { l: "RTO", v: seg.rto, c: "#ef4444" },
                    ].map((m, j) => (
                      <div key={j} style={{ background: "#020617", borderRadius: 6, padding: "7px 8px" }}>
                        <div style={{ fontSize: 9, color: "#475569", marginBottom: 2 }}>{m.l}</div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: m.c, fontFamily: "'DM Mono', monospace" }}>{m.v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, paddingTop: 10, borderTop: "1px solid #0f172a" }}>
                    {[
                      { l: "Revenue", v: "₹" + seg.rev.toLocaleString("en-IN"), c: "#22c55e" },
                      { l: "Net Profit", v: (seg.profit >= 0 ? "₹" : "-₹") + Math.abs(seg.profit).toLocaleString("en-IN"), c: seg.profit >= 0 ? seg.color : "#ef4444" },
                      { l: "Per Order", v: (perOrder >= 0 ? "₹" : "-₹") + Math.abs(perOrder).toLocaleString("en-IN"), c: perOrder >= 0 ? seg.color : "#ef4444" },
                    ].map((m, j) => (
                      <div key={j} style={{ background: "#020617", borderRadius: 6, padding: "7px 8px" }}>
                        <div style={{ fontSize: 9, color: "#475569", marginBottom: 2 }}>{m.l}</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: m.c, fontFamily: "'DM Mono', monospace" }}>{m.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
