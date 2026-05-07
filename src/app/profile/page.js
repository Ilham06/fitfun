import Link from "next/link";
import BottomNav from "@/components/bottom-nav";

export const metadata = { title: "Profile | FitScan" };

function ProfileHeader() {
  return (
    <div className="bg-surface border border-border rounded-[14px] p-5 shadow-sm flex items-center gap-4">
      <div className="w-14 h-14 rounded-full bg-accent-light flex items-center justify-center text-2xl">
        👤
      </div>
      <div className="flex-1">
        <h2 className="font-display font-extrabold text-base">John Doe</h2>
        <p className="text-xs text-muted">john.doe@gmail.com</p>
      </div>
      <div className="text-right">
        <div className="font-display font-black text-accent text-lg">2,783</div>
        <div className="text-[10px] text-muted">daily kcal</div>
      </div>
    </div>
  );
}

function StatsCards() {
  const stats = [
    { label: "Program", value: "Bulking", icon: "💪" },
    { label: "Activity", value: "Moderate", icon: "⚡" },
    { label: "Weight", value: "74.8 kg", icon: "⚖️" },
    { label: "Height", value: "178 cm", icon: "📏" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="bg-surface border border-border rounded-[14px] p-4 shadow-sm">
          <span className="text-lg">{s.icon}</span>
          <div className="text-[10px] text-muted mt-2">{s.label}</div>
          <div className="font-semibold text-sm text-text mt-0.5">{s.value}</div>
        </div>
      ))}
    </div>
  );
}

function MacroTargets() {
  const macros = [
    { label: "Protein", value: "209g", pct: "30%", color: "text-protein" },
    { label: "Carbs", value: "313g", pct: "45%", color: "text-carb" },
    { label: "Fat", value: "77g", pct: "25%", color: "text-fat" },
  ];

  return (
    <div className="bg-surface border border-border rounded-[14px] p-5 shadow-sm">
      <h3 className="font-display font-extrabold text-sm mb-4">Daily Targets</h3>
      <div className="grid grid-cols-3 gap-3">
        {macros.map((m) => (
          <div key={m.label} className="text-center p-3 bg-surface2 rounded-lg">
            <div className="text-[10px] text-muted mb-1">{m.label}</div>
            <div className={`font-display font-black text-lg ${m.color}`}>
              {m.value}
            </div>
            <div className="text-[10px] text-muted2">{m.pct}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsList() {
  const items = [
    { icon: "✏️", label: "Edit Profile", desc: "Name, age, weight, height" },
    { icon: "🎯", label: "Change Program", desc: "Bulking, Cutting, Maintenance" },
    { icon: "🔔", label: "Notifications", desc: "Reminders & alerts" },
    { icon: "📤", label: "Export Data", desc: "Download as CSV" },
  ];

  return (
    <div className="bg-surface border border-border rounded-[14px] shadow-sm overflow-hidden">
      {items.map((item, i) => (
        <button
          key={item.label}
          className={`w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-surface2 transition-colors ${
            i < items.length - 1 ? "border-b border-border" : ""
          }`}
        >
          <span className="text-lg">{item.icon}</span>
          <div className="flex-1">
            <div className="text-sm font-semibold text-text">{item.label}</div>
            <div className="text-[11px] text-muted">{item.desc}</div>
          </div>
          <span className="text-muted2 text-sm">›</span>
        </button>
      ))}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-bg pb-28">
      <div className="px-5 pt-6 pb-4">
        <h1 className="font-display text-xl font-black text-text">Profile</h1>
      </div>

      <div className="px-5 flex flex-col gap-4">
        <ProfileHeader />
        <StatsCards />
        <MacroTargets />
        <SettingsList />

        {/* Sign Out */}
        <Link
          href="/login"
          className="w-full h-12 flex items-center justify-center rounded-xl border border-[rgba(192,57,43,0.18)] bg-[rgba(192,57,43,0.08)] text-protein font-semibold text-sm hover:bg-[rgba(192,57,43,0.14)] transition-colors"
        >
          Sign Out
        </Link>
      </div>

      <BottomNav />
    </div>
  );
}
