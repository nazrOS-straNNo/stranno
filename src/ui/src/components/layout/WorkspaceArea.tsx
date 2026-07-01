import { useEffect } from "react";
import { МодульИд, useAppStore } from "../../store/appStore";
import { МодульРуки }      from "../modules/МодульРуки";
import { МодульМульт }     from "../modules/МодульМульт";
import { МодульЯблочко }   from "../modules/МодульЯблочко";
import { МодульТочки }     from "../modules/МодульТочки";
import { МодульГлюк }      from "../modules/МодульГлюк";
import { МодульСтудия }    from "../modules/МодульСтудия";
import { МодульПоле }      from "../modules/МодульПоле";
import { МодульШина }      from "../modules/МодульШина";
import { МодульКолодец }   from "../modules/МодульКолодец";
import { МодульБиблиотека }from "../modules/МодульБиблиотека";
import { МодульЛавка }     from "../modules/МодульЛавка";
import { МодульКлуб }      from "../modules/МодульКлуб";
import styles from "./WorkspaceArea.module.css";

const ВСЕ_МОДУЛИ: МодульИд[] = [
  "руки","мульт","яблочко","точки","глюк",
  "студия","поле","шина","колодец","библиотека","лавка","клуб",
];

interface Props { модуль: МодульИд; }

export function WorkspaceArea({ модуль }: Props) {
  const переключить = useAppStore(s => s.переключитьМодуль);
  const переключитьПомощь = useAppStore(s => s.переключитьПомощьКлавиш);
  const установитьМасштаб = useAppStore(s => s.установитьМасштаб);
  const масштаб = useAppStore(s => s.масштабUI);

  useEffect(() => {
    const обработать = (e: KeyboardEvent) => {
      const тег = (e.target as HTMLElement).tagName.toLowerCase();
      if (тег === "input" || тег === "textarea" || тег === "select") return;

      const КЛАВИШИ: Record<string, МодульИд> = {
        "1":"руки","2":"мульт","3":"яблочко","4":"точки","5":"глюк",
        "6":"студия","7":"поле","8":"шина","9":"колодец","0":"библиотека",
      };
      if (!e.ctrlKey && !e.metaKey && !e.altKey && КЛАВИШИ[e.key]) {
        переключить(КЛАВИШИ[e.key]);
        return;
      }

      if (e.key === "Tab" && !e.ctrlKey) {
        e.preventDefault();
        const i = ВСЕ_МОДУЛИ.indexOf(модуль);
        const следующий = e.shiftKey
          ? ВСЕ_МОДУЛИ[(i - 1 + ВСЕ_МОДУЛИ.length) % ВСЕ_МОДУЛИ.length]
          : ВСЕ_МОДУЛИ[(i + 1) % ВСЕ_МОДУЛИ.length];
        переключить(следующий);
        return;
      }

      if (e.key === "?" || e.key === "/") {
        переключитьПомощь();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        console.log("💾 СТРАННО: сохранение сцены...");
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        console.log("↩ СТРАННО: отмена");
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        console.log("↪ СТРАННО: повтор");
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === "+" || e.key === "=")) {
        e.preventDefault();
        установитьМасштаб(Math.min(масштаб + 0.1, 2));
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "-") {
        e.preventDefault();
        установитьМасштаб(Math.max(масштаб - 0.1, 0.6));
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "0") {
        e.preventDefault();
        установитьМасштаб(1);
      }
    };

    window.addEventListener("keydown", обработать);
    return () => window.removeEventListener("keydown", обработать);
  }, [модуль, переключить, переключитьПомощь, установитьМасштаб, масштаб]);

  useEffect(() => {
    document.documentElement.style.setProperty("--zoom", String(масштаб));
  }, [масштаб]);

  return (
    <main className={styles.рабочаяОбласть}>
      {модуль === "руки"       && <МодульРуки />}
      {модуль === "мульт"      && <МодульМульт />}
      {модуль === "яблочко"    && <МодульЯблочко />}
      {модуль === "точки"      && <МодульТочки />}
      {модуль === "глюк"       && <МодульГлюк />}
      {модуль === "студия"     && <МодульСтудия />}
      {модуль === "поле"       && <МодульПоле />}
      {модуль === "шина"       && <МодульШина />}
      {модуль === "колодец"    && <МодульКолодец />}
      {модуль === "библиотека" && <МодульБиблиотека />}
      {модуль === "лавка"      && <МодульЛавка />}
      {модуль === "клуб"       && <МодульКлуб />}
      {!ВСЕ_МОДУЛИ.includes(модуль) && <МодульЗаглушка имя={модуль} />}
    </main>
  );
}

function МодульЗаглушка({ имя }: { имя: string }) {
  return (
    <div className={styles.заглушка}>
      <div className={styles.заглушкаКонтент}>
        <div className={styles.заглушкаИкона}>⬡</div>
        <div className={styles.заглушкаНазвание}>{имя.toUpperCase()}</div>
        <div className={styles.заглушкаСтатус}>модуль в разработке</div>
        <div className={styles.заглушкаВерсия}>nazrOS CORE v0.1</div>
      </div>
    </div>
  );
}
