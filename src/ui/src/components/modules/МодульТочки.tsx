
import { useState, useRef, useCallback, useEffect } from "react";
import styles from "./МодульТочки.module.css";

interface Порт {
  id: string;
  имя: string;
  тип: "изображение" | "число" | "цвет" | "вектор";
  направление: "вход" | "выход";
}

interface Нод {
  id: string;
  тип: string;
  имя: string;
  x: number;
  y: number;
  порты: Порт[];
  активный?: boolean;
}

interface Соединение {
  id: string;
  из: string;
  изПорт: string;
  в: string;
  вПорт: string;
}

const ТИПЫ_НОДОВ: Record<string, { цвет: string; порты: Порт[] }> = {
  Read: {
    цвет: "#2d3d5a",
    порты: [{ id: "out", имя: "выход", тип: "изображение", направление: "выход" }],
  },
  Merge: {
    цвет: "#1a2d1a",
    порты: [
      { id: "a", имя: "A", тип: "изображение", направление: "вход" },
      { id: "b", имя: "B", тип: "изображение", направление: "вход" },
      { id: "out", имя: "выход", тип: "изображение", направление: "выход" },
    ],
  },
  ColorGrade: {
    цвет: "#2d1a2d",
    порты: [
      { id: "in", имя: "вход", тип: "изображение", направление: "вход" },
      { id: "out", имя: "выход", тип: "изображение", направление: "выход" },
    ],
  },
  Glow: {
    цвет: "#2d2a1a",
    порты: [
      { id: "in", имя: "вход", тип: "изображение", направление: "вход" },
      { id: "out", имя: "выход", тип: "изображение", направление: "выход" },
    ],
  },
  Output: {
    цвет: "#1a1a2d",
    порты: [{ id: "in", имя: "вход", тип: "изображение", направление: "вход" }],
  },
};

const НАЧАЛЬНЫЕ_НОДЫ: Нод[] = [
  { id: "n1", тип: "Read", имя: "Read_01", x: 60, y: 80, порты: ТИПЫ_НОДОВ.Read.порты },
  { id: "n2", тип: "Read", имя: "Read_02", x: 60, y: 220, порты: ТИПЫ_НОДОВ.Read.порты },
  { id: "n3", тип: "Merge", имя: "Merge_01", x: 280, y: 140, порты: ТИПЫ_НОДОВ.Merge.порты },
  { id: "n4", тип: "Glow", имя: "Glow_01", x: 480, y: 80, порты: ТИПЫ_НОДОВ.Glow.порты },
  { id: "n5", тип: "ColorGrade", имя: "ColorGrade_01", x: 480, y: 220, порты: ТИПЫ_НОДОВ.ColorGrade.порты, активный: true },
  { id: "n6", тип: "Output", имя: "Final_Out", x: 700, y: 150, порты: ТИПЫ_НОДОВ.Output.порты },
];

const НАЧАЛЬНЫЕ_СОЕДИНЕНИЯ: Соединение[] = [
  { id: "c1", из: "n1", изПорт: "out", в: "n3", вПорт: "a" },
  { id: "c2", из: "n2", изПорт: "out", в: "n3", вПорт: "b" },
  { id: "c3", из: "n3", изПорт: "out", в: "n4", вПорт: "in" },
  { id: "c4", из: "n3", изПорт: "out", в: "n5", вПорт: "in" },
  { id: "c5", из: "n4", изПорт: "out", в: "n6", вПорт: "in" },
];

const ЦВЕТ_ПОРТА: Record<string, string> = {
  изображение: "#7c3aed",
  число: "#10b981",
  цвет: "#f59e0b",
  вектор: "#3b82f6",
};

export function МодульТочки() {
  const [ноды, setНоды] = useState<Нод[]>(НАЧАЛЬНЫЕ_НОДЫ);
  const [соединения] = useState<Соединение[]>(НАЧАЛЬНЫЕ_СОЕДИНЕНИЯ);
  const [активныйНод, setАктивныйНод] = useState<string | null>("n5");
  const [смещение, setСмещение] = useState({ x: 0, y: 0 });
  const [масштаб] = useState(1);
  const тащим = useRef<{ id: string; нач_x: number; нач_y: number; мышь_x: number; мышь_y: number } | null>(null);
  const холст = useRef<HTMLDivElement>(null);

  const позицияПорта = (нод: Нод, портId: string) => {
    const порт = нод.порты.find(p => p.id === портId);
    if (!порт) return { x: 0, y: 0 };
    const индекс = нод.порты.filter(p => p.направление === порт.направление).indexOf(порт);
    const х = порт.направление === "выход" ? нод.x + 180 : нод.x;
    const y = нод.y + 36 + индекс * 22;
    return { x: х + смещение.x, y: y + смещение.y };
  };

  const начатьТащить = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const нод = ноды.find(n => n.id === id)!;
    тащим.current = { id, нач_x: нод.x, нач_y: нод.y, мышь_x: e.clientX, мышь_y: e.clientY };
    setАктивныйНод(id);
  };

  const тащитьМышью = useCallback((e: MouseEvent) => {
    if (!тащим.current) return;
    const { id, нач_x, нач_y, мышь_x, мышь_y } = тащим.current;
    setНоды(prev => prev.map(n =>
      n.id === id
        ? { ...n, x: нач_x + e.clientX - мышь_x, y: нач_y + e.clientY - мышь_y }
        : n
    ));
  }, []);

  const отпуститьМышь = useCallback(() => { тащим.current = null; }, []);

  useEffect(() => {
    window.addEventListener("mousemove", тащитьМышью);
    window.addEventListener("mouseup", отпуститьМышь);
    return () => {
      window.removeEventListener("mousemove", тащитьМышью);
      window.removeEventListener("mouseup", отпуститьМышь);
    };
  }, [тащитьМышью, отпуститьМышь]);

  const активный = ноды.find(n => n.id === активныйНод);

  return (
    <div className={styles.модуль}>
      {/* Левая панель */}
      <aside className={styles.левая}>
        <div className={styles.заголовокСекции}>БИБЛИОТЕКА ЭФФЕКТОВ</div>
        {["ЦВЕТ","СВЕТ","ГАМ","ТУМАН","ЧАСТИЦЫ","ИСКАЖЕНИЯ","ГЛЮК","СТИЛИЗАЦИЯ","ИИ-ЭФФЕКТЫ"].map(э => (
          <div key={э} className={styles.элементБиблиотеки}>{э}</div>
        ))}
        <div className={styles.заголовокСекции} style={{marginTop:12}}>БЫСТРЫЕ НОДЫ</div>
        <div className={styles.быстрыеНоды}>
          {Object.keys(ТИПЫ_НОДОВ).map(т => (
            <div key={т} className={styles.быстрыйНод}
              style={{background: ТИПЫ_НОДОВ[т].цвет}}>
              {т}
            </div>
          ))}
        </div>
      </aside>

      {/* Центр — холст нодов */}
      <div className={styles.центр}>
        <div className={styles.тулбар}>
          <span className={styles.имяСети}>СЕТЬ КОМПОЗИТИНГА: <span className={styles.акцент}>КИБЕР_ГОРОД_НОЧЬ</span></span>
          <div style={{flex:1}}/>
          <button className={styles.кнопкаТулбар}>2D</button>
          <button className={styles.кнопкаТулбар}>3D</button>
          <button className={styles.кнопкаТулбар}>LUT</button>
        </div>

        <div ref={холст} className={styles.холст}>
          {/* SVG для соединений */}
          <svg className={styles.svg}>
            {соединения.map(с => {
              const изНод = ноды.find(n => n.id === с.из)!;
              const вНод = ноды.find(n => n.id === с.в)!;
              const из = позицияПорта(изНод, с.изПорт);
              const в = позицияПорта(вНод, с.вПорт);
              const cx1 = из.x + 60;
              const cx2 = в.x - 60;
              return (
                <path
                  key={с.id}
                  d={`M ${из.x} ${из.y} C ${cx1} ${из.y} ${cx2} ${в.y} ${в.x} ${в.y}`}
                  stroke="#7c3aed"
                  strokeWidth="2"
                  fill="none"
                  opacity="0.7"
                />
              );
            })}
          </svg>

          {/* Ноды */}
          {ноды.map(нод => (
            <div
              key={нод.id}
              className={[styles.нод, активныйНод === нод.id ? styles.нодАктивный : ""].join(" ")}
              style={{
                left: нод.x + смещение.x,
                top: нод.y + смещение.y,
                background: ТИПЫ_НОДОВ[нод.тип]?.цвет,
              }}
              onMouseDown={e => начатьТащить(e, нод.id)}
            >
              <div className={styles.нодЗаголовок}>{нод.имя}</div>

              {/* Порты */}
              {нод.порты.map(порт => (
                <div
                  key={порт.id}
                  className={[
                    styles.порт,
                    порт.направление === "выход" ? styles.портВыход : styles.портВход
                  ].join(" ")}
                >
                  {порт.направление === "вход" && (
                    <div className={styles.точкаПорта}
                      style={{background: ЦВЕТ_ПОРТА[порт.тип]}} />
                  )}
                  <span className={styles.имяПорта}>{порт.имя}</span>
                  {порт.направление === "выход" && (
                    <div className={styles.точкаПорта}
                      style={{background: ЦВЕТ_ПОРТА[порт.тип]}} />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Правая панель — свойства активного нода */}
      <aside className={styles.правая}>
        <div className={styles.заголовокСекции}>ПРОСМОТР</div>
        <div className={styles.превью}>
          <div className={styles.превьюПлейсхолдер}>
            <span style={{color:"#4a5568",fontSize:10}}>превью</span>
          </div>
        </div>

        {активный && (
          <>
            <div className={styles.заголовокСекции} style={{marginTop:8}}>СВОЙСТВА</div>
            <div className={styles.свойство}>
              <span className={styles.метка}>имя</span>
              <span className={styles.значение}>{активный.имя}</span>
            </div>
            <div className={styles.свойство}>
              <span className={styles.метка}>тип</span>
              <span className={styles.значение}>{активный.тип}</span>
            </div>

            {активный.тип === "ColorGrade" && (
              <>
                <div className={styles.заголовокСекции} style={{marginTop:8}}>ЦВЕТОКОРРЕКЦИЯ</div>
                {[
                  ["экспозиция", "0.15"],
                  ["контраст", "1.23"],
                  ["насыщенность", "1.08"],
                  ["гамма", "1.02"],
                  ["температура", "-12"],
                  ["оттенок", "5.6"],
                ].map(([м, з]) => (
                  <div key={м} className={styles.свойство}>
                    <span className={styles.метка}>{м}</span>
                    <span className={styles.значение} style={{color:"#b87ef7"}}>{з}</span>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </aside>
    </div>
  );
}
