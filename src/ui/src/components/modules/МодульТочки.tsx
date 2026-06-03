import { useState, useRef, useCallback, useEffect } from "react";
import styles from "./МодульТочки.module.css";

interface Нод {
  id: string;
  тип: string;
  имя: string;
  x: number;
  y: number;
}

interface Соединение {
  id: string;
  из: string;
  в: string;
}

const НОДЫ_НАЧАЛО: Нод[] = [
  { id: "n1", тип: "Read",       имя: "Read_01",       x: 60,  y: 80  },
  { id: "n2", тип: "Read",       имя: "Read_02",       x: 60,  y: 220 },
  { id: "n3", тип: "Merge",      имя: "Merge_01",      x: 280, y: 140 },
  { id: "n4", тип: "Glow",       имя: "Glow_01",       x: 480, y: 80  },
  { id: "n5", тип: "ColorGrade", имя: "ColorGrade_01", x: 480, y: 220 },
  { id: "n6", тип: "Output",     имя: "Final_Out",     x: 700, y: 150 },
];

const СОЕДИНЕНИЯ: Соединение[] = [
  { id: "c1", из: "n1", в: "n3" },
  { id: "c2", из: "n2", в: "n3" },
  { id: "c3", из: "n3", в: "n4" },
  { id: "c4", из: "n3", в: "n5" },
  { id: "c5", из: "n4", в: "n6" },
];

const ЦВЕТА: Record<string, string> = {
  Read: "#1a2535",
  Merge: "#1a2a1a",
  Glow: "#2a2a1a",
  ColorGrade: "#2a1a2a",
  Output: "#1a1a2a",
};

export function МодульТочки() {
  const [ноды, setНоды] = useState<Нод[]>(НОДЫ_НАЧАЛО);
  const [активный, setАктивный] = useState<string | null>("n5");
  const тащим = useRef<{id:string; нх:number; ны:number; мх:number; мы:number} | null>(null);

  const начать = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const н = ноды.find(n => n.id === id)!;
    тащим.current = { id, нх: н.x, ны: н.y, мх: e.clientX, мы: e.clientY };
    setАктивный(id);
  };

  const двигать = useCallback((e: MouseEvent) => {
    if (!тащим.current) return;
    const { id, нх, ны, мх, мы } = тащим.current;
    setНоды(prev => prev.map(n =>
      n.id === id ? { ...n, x: нх + e.clientX - мх, y: ны + e.clientY - мы } : n
    ));
  }, []);

  const отпустить = useCallback(() => { тащим.current = null; }, []);

  useEffect(() => {
    window.addEventListener("mousemove", двигать);
    window.addEventListener("mouseup", отпустить);
    return () => {
      window.removeEventListener("mousemove", двигать);
      window.removeEventListener("mouseup", отпустить);
    };
  }, [двигать, отпустить]);

  const позиция = (id: string, выход: boolean) => {
    const н = ноды.find(n => n.id === id)!;
    return { x: н.x + (выход ? 180 : 0), y: н.y + 20 };
  };

  const активныйНод = ноды.find(n => n.id === активный);

  return (
    <div className={styles.модуль}>
      <aside className={styles.левая}>
        <div className={styles.заг}>БИБЛИОТЕКА ЭФФЕКТОВ</div>
        {["ЦВЕТ","СВЕТ","ГАМ","ТУМАН","ЧАСТИЦЫ","ГЛЮК","СТИЛИЗАЦИЯ","ИИ-ЭФФЕКТЫ"].map(э => (
          <div key={э} className={styles.элемент}>{э}</div>
        ))}
        <div className={styles.заг} style={{marginTop:12}}>БЫСТРЫЕ НОДЫ</div>
        {["Read","Merge","Glow","ColorGrade","Output"].map(т => (
          <div key={т} className={styles.быстрый} style={{background:ЦВЕТА[т]}}>{т}</div>
        ))}
      </aside>

      <div className={styles.центр}>
        <div className={styles.тулбар}>
          <span className={styles.имяСети}>СЕТЬ КОМПОЗИТИНГА: <span className={styles.акцент}>КИБЕР_ГОРОД_НОЧЬ</span></span>
          <div style={{flex:1}}/>
          {["2D","3D","LUT"].map(б => <button key={б} className={styles.кнопка}>{б}</button>)}
        </div>

        <div className={styles.холст}>
          <svg className={styles.svg}>
            {СОЕДИНЕНИЯ.map(с => {
              const из = позиция(с.из, true);
              const в = позиция(с.в, false);
              return (
                <path key={с.id}
                  d={`M${из.x},${из.y} C${из.x+60},${из.y} ${в.x-60},${в.y} ${в.x},${в.y}`}
                  stroke="#7c3aed" strokeWidth="1.5" fill="none" opacity="0.6"/>
              );
            })}
          </svg>

          {ноды.map(нод => (
            <div key={нод.id}
              className={[styles.нод, активный === нод.id ? styles.активный : ""].join(" ")}
              style={{ left: нод.x, top: нод.y, background: ЦВЕТА[нод.тип] }}
              onMouseDown={e => начать(e, нод.id)}>
              <div className={styles.нодЗаг}>{нод.имя}</div>
              <div className={styles.нодТип}>{нод.тип}</div>
              <div className={styles.портыРяд}>
                <div className={styles.портВход}/>
                <div className={styles.портВыход}/>
              </div>
            </div>
          ))}
        </div>
      </div>

      <aside className={styles.правая}>
        <div className={styles.заг}>ПРОСМОТР</div>
        <div className={styles.превью}/>
        {активныйНод && (
          <>
            <div className={styles.заг} style={{marginTop:8}}>СВОЙСТВА</div>
            <div className={styles.строка}><span className={styles.м}>имя</span><span className={styles.з}>{активныйНод.имя}</span></div>
            <div className={styles.строка}><span className={styles.м}>тип</span><span className={styles.з}>{активныйНод.тип}</span></div>
            {активныйНод.тип === "ColorGrade" && <>
              <div className={styles.заг} style={{marginTop:8}}>ЦВЕТОКОРРЕКЦИЯ</div>
              {[["экспозиция","0.15"],["контраст","1.23"],["насыщенность","1.08"],["гамма","1.02"]].map(([м,з]) => (
                <div key={м} className={styles.строка}>
                  <span className={styles.м}>{м}</span>
                  <span className={styles.з} style={{color:"#b87ef7"}}>{з}</span>
                </div>
              ))}
            </>}
          </>
        )}
      </aside>
    </div>
  );
}
