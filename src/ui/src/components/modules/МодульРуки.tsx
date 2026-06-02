import { useState } from "react";
import styles from "./МодульРуки.module.css";

type РежимРедактора =
  | "скульптинг"
  | "полигональное"
  | "параметрическое"
  | "процедурное"
  | "инженерная_точность";

type Кисть = "кисть" | "сгладить" | "вытянуть" | "надавить" | "сжать" | "гравировка" | "маска";

/** Модуль РУКИ — 3D моделирование и скульптинг */
export function МодульРуки() {
  const [режим, setРежим] = useState<РежимРедактора>("скульптинг");
  const [кисть, setКисть] = useState<Кисть>("кисть");
  const [радиус, setРадиус] = useState(125);
  const [интенсивность, setИнтенсивность] = useState(0.75);

  return (
    <div className={styles.модуль}>
      {/* ─── Левая панель — инструменты ─── */}
      <aside className={styles.панельЛевая}>
        <section className={styles.секция}>
          <div className={styles.секцияЗаголовок}>РЕЖИМЫ <span className={styles.хелп}>?</span></div>
          {([
            ["скульптинг",         "скульптинг"],
            ["полигональное",      "полигональное"],
            ["параметрическое",    "параметрическое"],
            ["процедурное",        "процедурное"],
            ["инженерная_точность","инженерная точность"],
          ] as [РежимРедактора, string][]).map(([id, метка]) => (
            <button
              key={id}
              className={[styles.режимКнопка, режим === id ? styles.активный : ""].join(" ")}
              onClick={() => setРежим(id)}
            >
              {метка}
            </button>
          ))}
        </section>

        <section className={styles.секция}>
          <div className={styles.секцияЗаголовок}>ИНСТРУМЕНТЫ <span className={styles.хелп}>?</span></div>
          {([
            ["кисть",      "кисть",      "B"],
            ["сгладить",   "сгладить",   "S"],
            ["вытянуть",   "вытянуть",   "E"],
            ["надавить",   "надавить",   "I"],
            ["сжать",      "сжать",      "O"],
            ["гравировка", "гравировка", "G"],
            ["маска",      "маска",      "M"],
          ] as [Кисть, string, string][]).map(([id, метка, хоткей]) => (
            <button
              key={id}
              className={[styles.инструментКнопка, кисть === id ? styles.активный : ""].join(" ")}
              onClick={() => setКисть(id)}
            >
              <span>{метка}</span>
              <span className={styles.хоткей}>{хоткей}</span>
            </button>
          ))}
        </section>

        <section className={styles.секция}>
          <div className={styles.секцияЗаголовок}>КИСТЬ <span className={styles.хелп}>?</span></div>
          <div className={styles.превьюКисти} />
          <div className={styles.слайдерГруппа}>
            <div className={styles.слайдерМетка}>
              <span>радиус</span><span>{радиус} px</span>
            </div>
            <input type="range" min={1} max={500} value={радиус}
              onChange={e => setРадиус(+e.target.value)}
              className={styles.слайдер} />
          </div>
          <div className={styles.слайдерГруппа}>
            <div className={styles.слайдерМетка}>
              <span>интенсивность</span><span>{интенсивность.toFixed(2)}</span>
            </div>
            <input type="range" min={0} max={1} step={0.01} value={интенсивность}
              onChange={e => setИнтенсивность(+e.target.value)}
              className={styles.слайдер} />
          </div>
        </section>
      </aside>

      {/* ─── Центр — viewport ─── */}
      <div className={styles.центр}>
        <div className={styles.viewportТулбар}>
          <span className={styles.кнопкаТулбар}>⊞</span>
          <span className={styles.кнопкаТулбар}>⊡</span>
          <span className={styles.кнопкаТулбар}>◈</span>
          <div className={styles.разделительТулбар} />
          <select className={styles.селектТулбар}>
            <option>локальная</option>
            <option>мировая</option>
          </select>
          <div style={{ flex: 1 }} />
          <span className={styles.кнопкаТулбар}>перспектива</span>
          <span className={styles.кнопкаТулбар}>⊹</span>
        </div>

        <div className={styles.viewport}>
          {/* Сетка */}
          <svg className={styles.сетка} width="100%" height="100%">
            <defs>
              <pattern id="сетка" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none"
                  stroke="rgba(26,32,53,0.8)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#сетка)" />
          </svg>

          {/* Навигационный куб */}
          <div className={styles.навКуб}>
            <span>Y</span>
            <span>X</span>
          </div>

          {/* Заглушка объекта */}
          <div className={styles.viewportЦентр}>
            <div className={styles.объектПлейсхолдер}>
              <div className={styles.объектМеш} />
              <div className={styles.gizmoX} />
              <div className={styles.gizmoY} />
              <div className={styles.gizmoZ} />
            </div>
          </div>

          {/* Инфо */}
          <div className={styles.viewportИнфо}>
            <span>сцена: КИБЕР_ПЕРСОНАЖ_01</span>
            <span className={styles.разделитель}>|</span>
            <span>полигоны: 24 560 982</span>
            <span className={styles.разделитель}>|</span>
            <span>память: 4.72 ГБ</span>
          </div>
        </div>

        {/* Нижняя панель — процедурный стек */}
        <div className={styles.нижняяПанель}>
          <div className={styles.нижниеВкладки}>
            {["ПРОЦЕДУРЫ","МАТЕРИАЛЫ","ДЕФОРМЕРЫ","СИМУЛЯЦИИ","ИСТОРИЯ"].map(в => (
              <button key={в} className={styles.нижняяВкладка}>{в}</button>
            ))}
          </div>
          <div className={styles.процедурныйСтек}>
            {[
              { имя: "шум_поверхности",  парам: "scale: 12.0" },
              { имя: "деформация_формы", парам: "сила: 0.45" },
              { имя: "скульпт_деформация", парам: "потёртость: 2s" },
            ].map((нод, i) => (
              <div key={i} className={styles.стекНод}>
                <span className={styles.стекНодИмя}>{нод.имя}</span>
                <span className={styles.стекНодПарам}>{нод.парам}</span>
                {i < 2 && <div className={styles.стекСтрелка}>→</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Правая панель — свойства ─── */}
      <aside className={styles.панельПравая}>
        <section className={styles.секция}>
          <div className={styles.секцияЗаголовок}>
            СПИСОК ОБЪЕКТОВ <span className={styles.хелп}>?</span>
          </div>
          {[
            { имя: "корень_персонаж", отступ: 0 },
            { имя: "группа_голова",   отступ: 1 },
            { имя: "голова_мейн",     отступ: 2, активный: true },
            { имя: "глаза",           отступ: 2 },
            { имя: "имплант_лоб",     отступ: 2 },
            { имя: "кабельная_система",отступ: 2 },
          ].map((объект, i) => (
            <div
              key={i}
              className={[styles.объектСтрока, объект.активный ? styles.активный : ""].join(" ")}
              style={{ paddingLeft: `${8 + объект.отступ * 12}px` }}
            >
              <span className={styles.объектИмя}>{объект.имя}</span>
              <span className={styles.видимостьИкона}>👁</span>
            </div>
          ))}
        </section>

        <section className={styles.секция}>
          <div className={styles.секцияЗаголовок}>СВОЙСТВА ОБЪЕКТА <span className={styles.хелп}>?</span></div>
          <div className={styles.свойствоСтрока}>
            <span className={styles.свойствоМетка}>имя</span>
            <span className={styles.свойствоЗначение}>голова_мейн</span>
          </div>
          <div className={styles.свойствоСтрока}>
            <span className={styles.свойствоМетка}>тип</span>
            <span className={styles.свойствоЗначение}>меш</span>
          </div>
          <div className={styles.свойствоСтрока}>
            <span className={styles.свойствоМетка}>слой</span>
            <span className={styles.свойствоЗначение}>персонаж</span>
          </div>
          <div className={styles.разделительСвойств}>трансформация</div>
          {[
            ["позиция",  "X 0.000", "Y 1.240", "Z 0.000"],
            ["поворот",  "X 0°",    "Y −15°",  "Z 0°"],
            ["масштаб",  "X 1.000", "Y 1.000", "Z 1.000"],
          ].map(([метка, x, y, z]) => (
            <div key={метка} className={styles.трансформСтрока}>
              <span className={styles.трансформМетка}>{метка}</span>
              <span className={styles.трансформX}>{x}</span>
              <span className={styles.трансформY}>{y}</span>
              <span className={styles.трансформZ}>{z}</span>
            </div>
          ))}
        </section>

        <section className={styles.секция}>
          <div className={styles.секцияЗаголовок}>МАТЕРИАЛЫ</div>
          <div className={styles.материалыСетка}>
            {["титан_мат","карбон_мат","керамика","нейро_гель","кожа_синт"].map(м => (
              <div key={м} className={styles.материалШар} title={м} />
            ))}
            <button className={styles.добавитьМатериал}>+</button>
          </div>
        </section>
      </aside>
    </div>
  );
}
