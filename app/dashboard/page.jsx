import LeftSecurityControlPanel from "../../dashboard/components/LeftSecurityControlPanel";
import RightSocAnalyticsPanel from "../../dashboard/components/RightSocAnalyticsPanel";
import "../globals.css";

export const metadata = {
  title: "SOC Dashboard",
};

export default function DashboardPage() {
  return (
    <main className="mx-auto grid max-w-7xl gap-6 p-6 lg:grid-cols-[360px_1fr]">
      <LeftSecurityControlPanel />
      <RightSocAnalyticsPanel />
    </main>
  );
}
