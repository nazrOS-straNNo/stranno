import { useEffect } from "react";
import { TopBar }          from "./components/layout/TopBar";
import { StatusBar }       from "./components/layout/StatusBar";
import { WorkspaceArea }   from "./components/layout/WorkspaceArea";
import { ПомощьКлавиш }    from "./components/layout/ПомощьКлавиш";
import { СтраницаВхода }   from "./components/auth/СтраницаВхода";
import { useAppStore }     from "./store/appStore";
import "./styles/globals.css";
import "./styles/theme-light.css";

export default function App() {
  const активныйМодуль = useAppStore(s => s.активныйМодуль);
  const авторизован    = useAppStore(s => s.авторизован);
  const войти           = useAppStore(s => s.войти);
  const тема            = useAppStore(s => s.тема);

  // Применяем тему к html элементу
  useEffect(() => {
    document.documentElement.setAttribute("data-тема", тема);
  }, [тема]);

  if (!авторизован) {
    return <СтраницаВхода onWход={войти} />;
  }

  return (
    <div className="stranno-shell">
      <TopBar />
      <WorkspaceArea модуль={активныйМодуль} />
      <StatusBar />
      <ПомощьКлавиш />
    </div>
  );
}
