import { useState } from "react";
import { TopBar } from "./components/layout/TopBar";
import { StatusBar } from "./components/layout/StatusBar";
import { WorkspaceArea } from "./components/layout/WorkspaceArea";
import { useAppStore } from "./store/appStore";
import "./styles/globals.css";

export default function App() {
  const активныйМодуль = useAppStore((s) => s.активныйМодуль);

  return (
    <div className="stranno-shell">
      <TopBar />
      <WorkspaceArea модуль={активныйМодуль} />
      <StatusBar />
    </div>
  );
}
