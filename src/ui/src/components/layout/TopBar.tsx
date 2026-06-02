import { useAppStore, МодульИд } from "../../store/appStore";
import styles from "./TopBar.module.css";

/** Все вкладки в шапке — порядок как на скриншотах */
const ВКЛАДКИ: { id: МодульИд; метка: string; готов: boolean }[] = [
  { id: "путь",       метка: "ПУТЬ",      готов: false },
  { id: "проекты",    метка: "ПРОЕКТЫ",   готов: false },
  { id: "миры",       метка: "МИРЫ",      готов: false },
  { id: "сцены",      метка: "СЦЕНЫ",     готов: false },
  { id: "руки",       метка: "РУКИ",      готов: true  },
  { id: "мульт",      метка: "МУЛЬТ",     готов: false },
  { id: "яблочко",    метка: "ЯБЛОЧКО",   готов: false },
  { id: "точки",      метка: "ТОЧКИ",     готов: false },
  { id: "глюк",       метка: "ГЛЮК",      готов: false },
  { id: "студия",     метка: "СТУДИЯ",    готов: false },
  { id: "поле",       метка: "ПОЛЕ",      готов: false },
  { id: "шина",       метка: "ШИНА",      готов: false },
  { id: "колодец",    метка: "КОЛОДЕЦ",   готов: false },
  { id: "библиотека", метка: "БИБЛИОТЕКА",готов: false },
  { id: "лавка",      метка: "ЛАВКА",     готов: false },
  { id: "клуб",       метка: "КЛУБ",      готов: false },
];

export function TopBar() {
  const активный        = useAppStore((s) => s.активныйМодуль);
  const переключить     = useAppStore((s) => s.переключитьМодуль);
  const ядро            = useAppStore((s) => s.ядро);
  const имя             = useAppStore((s) => s.имяПользователя);
  const роль            = useAppStore((s) => s.рольПользователя);

  return (
    <header className={styles.шапка}>
      {/* Логотип */}
      <div className={styles.лого}>
        <span className={styles.логоИкона}>✕</span>
        <div className={styles.логоТекст}>
          <span className={styles.логоНазвание}>СТРАННО</span>
          <span className={styles.логоВерсия}>nazrOS CORE v0.1</span>
        </div>
      </div>

      {/* Навигация по модулям */}
      <nav className={styles.навигация}>
        {ВКЛАДКИ.map((вкладка) => (
          <button
            key={вкладка.id}
            className={[
              styles.вкладка,
              активный === вкладка.id ? styles.активная : "",
              !вкладка.готов ? styles.скоро : "",
            ].join(" ")}
            onClick={() => переключить(вкладка.id)}
            title={вкладка.готов ? undefined : "В разработке"}
          >
            {вкладка.метка}
          </button>
        ))}
      </nav>

      {/* Статус ядра */}
      <div className={styles.статусЯдра}>
        <div className={styles.статусСтрока}>
          <span className={ядро.стабильно ? styles.точкаОК : styles.точкаОшибка} />
          <span className={styles.статусТекст}>
            {ядро.стабильно ? "ядро стабильно" : "ядро нестабильно"}
          </span>
        </div>
        <div className={styles.статусСтрока}>
          <span className={styles.статусТекст}>память мира</span>
          <span className={styles.статусЗначение}>{ядро.памятьПроцент}%</span>
          <div className={styles.памятьБар}>
            <div
              className={styles.памятьЗаполнение}
              style={{ width: `${ядро.памятьПроцент}%` }}
            />
          </div>
        </div>
      </div>

      {/* Пользователь */}
      <div className={styles.пользователь}>
        <div className={styles.пользовательИнфо}>
          <span className={styles.пользовательИмя}>{имя}</span>
          <span className={styles.пользовательРоль}>{роль}</span>
        </div>
        <div className={styles.аватар}>{имя[0]}</div>
      </div>
    </header>
  );
}
