import { useAppStore, МодульИд } from "../../store/appStore";
import styles from "./TopBar.module.css";
import logo from "../../assets/logo.png";

const ВКЛАДКИ: { id: МодульИд; метка: string; готов: boolean }[] = [
  { id: "путь",       метка: "ПУТЬ",      готов: false },
  { id: "проекты",    метка: "ПРОЕКТЫ",   готов: false },
  { id: "миры",       метка: "МИРЫ",      готов: false },
  { id: "сцены",      метка: "СЦЕНЫ",     готов: false },
  { id: "руки",       метка: "РУКИ",      готов: true  },
  { id: "мульт",      метка: "МУЛЬТ",     готов: true  },
  { id: "яблочко",    метка: "ЯБЛОЧКО",   готов: true  },
  { id: "точки",      метка: "ТОЧКИ",     готов: true  },
  { id: "глюк",       метка: "ГЛЮК",      готов: true  },
  { id: "студия",     метка: "СТУДИЯ",    готов: true  },
  { id: "поле",       метка: "ПОЛЕ",      готов: true  },
  { id: "шина",       метка: "ШИНА",      готов: true  },
  { id: "колодец",    метка: "КОЛОДЕЦ",   готов: true  },
  { id: "библиотека", метка: "БИБЛИОТЕКА",готов: true  },
  { id: "лавка",      метка: "ЛАВКА",     готов: true  },
  { id: "клуб",       метка: "КЛУБ",      готов: true  },
];

export function TopBar() {
  const активный            = useAppStore(s => s.активныйМодуль);
  const переключить         = useAppStore(s => s.переключитьМодуль);
  const ядро                = useAppStore(s => s.ядро);
  const имя                 = useAppStore(s => s.имяПользователя);
  const роль                = useAppStore(s => s.рольПользователя);
  const тема                = useAppStore(s => s.тема);
  const переключитьТему     = useAppStore(s => s.переключитьТему);
  const масштаб             = useAppStore(s => s.масштабUI);
  const установитьМасштаб   = useAppStore(s => s.установитьМасштаб);
  const переключитьПомощь   = useAppStore(s => s.переключитьПомощьКлавиш);
  const выйти                = useAppStore(s => s.выйти);

  // Функция для открытия меню (заглушка, замени на реальную логику)
  const открытьМеню = () => {
    console.log("Меню открыто");
  };

  return (
    <header className={styles.шапка}>
      <div className={styles.лого}>
        <img src={logo} alt="nazrOS" className={styles.логоИкона} />
        <div className={styles.логоТекст}>
          <span className={styles.логоНазвание}>СТРАННО</span>
          <span className={styles.логоВерсия}>nazrOS CORE v0.2</span>
        </div>
      </div>

      {/* Кнопка гамбургер (меню) — вставлена после логотипа */}
      <button className={styles.менюКнопка} onClick={открытьМеню} title="Открыть меню">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

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

      {/* Zoom controls */}
      <div className={styles.zoomГруппа}>
        <button className={styles.zoomКнопка} onClick={() => установитьМасштаб(Math.max(масштаб-0.1,0.6))}>−</button>
        <span className={styles.zoomЗначение}>{Math.round(масштаб*100)}%</span>
        <button className={styles.zoomКнопка} onClick={() => установитьМасштаб(Math.min(масштаб+0.1,2))}>+</button>
      </div>

      {/* Theme toggle */}
      <button className={styles.темаКнопка} onClick={переключитьТему} title="Переключить тему">
        {тема === "тёмная" ? "🌙" : "☀️"}
      </button>

      {/* Hotkeys help */}
      <button className={styles.помощьКнопка} onClick={переключитьПомощь} title="Горячие клавиши (?)">⌨</button>

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
            <div className={styles.памятьЗаполнение} style={{ width: `${ядро.памятьПроцент}%` }} />
          </div>
        </div>
      </div>

      <div className={styles.пользователь}>
        <div className={styles.пользовательИнфо}>
          <span className={styles.пользовательИмя}>{имя}</span>
          <span className={styles.пользовательРоль}>{роль}</span>
        </div>
        <div className={styles.аватар} onClick={выйти} title="Выйти">{имя[0]}</div>
      </div>
    </header>
  );
}
