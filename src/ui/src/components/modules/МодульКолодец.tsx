import { useState } from "react";
import styles from "./МодульКолодец.module.css";

const ГЕНЕРАТОРЫ = [
  { id:"g1", имя:"Город_Процедурный",   тип:"архитектура", прогресс:100 },
  { id:"g2", имя:"Ландшафт_Шум",        тип:"ландшафт",    прогресс:75  },
  { id:"g3", имя:"Лес_Распределение",   тип:"природа",     прогресс:0   },
  { id:"g4", имя:"Интерьер_Комнаты",    тип:"интерьер",    прогресс:45  },
  { id:"g5", имя:"Дорожная_Сеть",       тип:"навигация",   прогресс:100 },
  { id:"g6", имя:"НПС_Популяция",       тип:"персонажи",   прогресс:30  },
];

const АЛГОРИТМЫ = [
  "Perlin Noise","Simplex Noise","Voronoi","Wave Function Collapse",
  "L-Systems","Markov Chain","Cellular Automata","Поиск пути A*",
  "Делоне триангуляция","Случайное блуждание",
];

const НОДЫ_ГРАФА = [
  { id:"n1", имя:"Seed",         x:20,  y:30  },
  { id:"n2", имя:"Noise",        x:160, y:20  },
  { id:"n3", имя:"Terrain",      x:160, y:100 },
  { id:"n4", имя:"Buildings",    x:300, y:30  },
  { id:"n5", имя:"Roads",        x:300, y:110 },
  { id:"n6", имя:"Population",   x:440, y:70  },
  { id:"n7", имя:"Output",       x:580, y:70  },
];

const СВЯЗИ = [
  {из:"n1",в:"n2"},{из:"n1",в:"n3"},{из:"n2",в:"n4"},
  {из:"n3",в:"n4"},{из:"n3",в:"n5"},{из:"n4",в:"n6"},
  {из:"n5",в:"n6"},{из:"n6",в:"n7"},
];

export function МодульКолодец() {
  const [активный, setАктивный] = useState("g1");
  const [активныйНод, setАктивныйНод] = useState("n4");
  const [seed, setSeed] = useState(42);
  const [масштаб, setМасштаб] = useState(1.0);
  const [октавы, setОктавы] = useState(6);

  const позВыход = (id: string) => {
    const н = НОДЫ_ГРАФА.find(n=>n.id===id)!;
    return {x: н.x+100, y: н.y+20};
  };
  const позВход = (id: string) => {
    const н = НОДЫ_ГРАФА.find(n=>n.id===id)!;
    return {x: н.x, y: н.y+20};
  };

  return (
    <div className={styles.модуль}>
      <aside className={styles.левая}>
        <div className={styles.заг}>ГЕНЕРАТОРЫ</div>
        {ГЕНЕРАТОРЫ.map(г=>(
          <div key={г.id}
            className={[styles.генератор, активный===г.id?styles.генАкт:""].join(" ")}
            onClick={()=>setАктивный(г.id)}>
            <div className={styles.генИнфо}>
              <span className={styles.генИмя}>{г.имя}</span>
              <span className={styles.генТип}>{г.тип}</span>
            </div>
            <div className={styles.генПрогресс}>
              <div className={styles.генПолоса} style={{width:`${г.прогресс}%`}}/>
            </div>
            <span className={styles.генПроц}>{г.прогресс}%</span>
          </div>
        ))}
        <button className={styles.добавитьКнопка}>+ новый генератор</button>

        <div className={styles.заг} style={{marginTop:10}}>АЛГОРИТМЫ</div>
        {АЛГОРИТМЫ.map(а=>(
          <div key={а} className={styles.алгоритм}>{а}</div>
        ))}
      </aside>

      <div className={styles.центр}>
        <div className={styles.тулбар}>
          <span className={styles.акцент}>ПРОЦЕДУРНЫЙ ГРАФ: <span style={{color:"#22d3ee"}}>КИБЕР_ГОРОД_07</span></span>
          <div style={{flex:1}}/>
          <button className={styles.кнопкаТулбар} onClick={()=>setSeed(Math.floor(Math.random()*9999))}>🎲 рандом seed</button>
          <button className={styles.генерировать}>▶ ГЕНЕРИРОВАТЬ</button>
        </div>

        <div className={styles.нодХолст}>
          <svg className={styles.svg}>
            {СВЯЗИ.map((с,i)=>{
              const из=позВыход(с.из);
              const в=позВход(с.в);
              const cx=(из.x+в.x)/2;
              return(
                <path key={i}
                  d={`M${из.x},${из.y} C${cx},${из.y} ${cx},${в.y} ${в.x},${в.y}`}
                  stroke="#22d3ee" strokeWidth="1.5" fill="none" opacity="0.5"/>
              );
            })}
          </svg>
          {НОДЫ_ГРАФА.map(н=>(
            <div key={н.id}
              className={[styles.нод, активныйНод===н.id?styles.нодАкт:""].join(" ")}
              style={{left:н.x, top:н.y}}
              onClick={()=>setАктивныйНод(н.id)}>
              <div className={styles.нодЗаг}>{н.имя}</div>
              <div className={styles.нодПорты}>
                <div className={styles.портВход}/>
                <div className={styles.портВыход}/>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.превью}>
          <div className={styles.превьюЗаг}>ПРЕВЬЮ ГЕНЕРАЦИИ</div>
          <div className={styles.превьюОбласть}>
            {Array.from({length:30},(_,i)=>(
              <div key={i} className={styles.здание} style={{
                left:`${3+i*3.2}%`,
                height:`${20+Math.random()*50}%`,
                width:`${2+Math.random()*2}%`,
                background:`rgba(${10+Math.random()*20},${20+Math.random()*30},${40+Math.random()*30},0.9)`,
                borderTop:`1px solid rgba(124,58,237,${0.2+Math.random()*0.4})`,
              }}/>
            ))}
            <div className={styles.дорога}/>
            <div className={styles.превьюМетка}>seed: {seed} · масштаб: {масштаб.toFixed(1)} · октавы: {октавы}</div>
          </div>
        </div>

        <div className={styles.параметры}>
          <div className={styles.парамГруппа}>
            <span className={styles.парамМ}>seed</span>
            <input type="number" value={seed} onChange={e=>setSeed(+e.target.value)} className={styles.парамВвод}/>
          </div>
          <div className={styles.парамГруппа}>
            <span className={styles.парамМ}>масштаб {масштаб.toFixed(1)}</span>
            <input type="range" min={0.1} max={5} step={0.1} value={масштаб}
              onChange={e=>setМасштаб(+e.target.value)} className={styles.слайдер}/>
          </div>
          <div className={styles.парамГруппа}>
            <span className={styles.парамМ}>октавы {октавы}</span>
            <input type="range" min={1} max={12} value={октавы}
              onChange={e=>setОктавы(+e.target.value)} className={styles.слайдер}/>
          </div>
          <button className={styles.применить}>применить</button>
        </div>
      </div>

      <aside className={styles.правая}>
        <div className={styles.заг}>ПАРАМЕТРЫ НОДЫ</div>
        {[["тип","Buildings"],["алгоритм","WFC"],["итераций","1000"],["плотность","0.7"],["высота мин","20м"],["высота макс","150м"],["стиль","кибер"],["LOD","авто"]].map(([м,з])=>(
          <div key={м} className={styles.строка}>
            <span className={styles.м}>{м}</span>
            <span className={styles.з} style={{color:"#b87ef7"}}>{з}</span>
          </div>
        ))}

        <div className={styles.заг} style={{marginTop:8}}>РЕЗУЛЬТАТ</div>
        {[["объектов","12 458"],["вершин","45.8М"],["треугольников","78.3М"],["время генерации","2:18"],["версия мира","0.9.7b"],["сеть","подключена"]].map(([м,з])=>(
          <div key={м} className={styles.строка}>
            <span className={styles.м}>{м}</span>
            <span className={styles.з}>{з}</span>
          </div>
        ))}

        <div className={styles.заг} style={{marginTop:8}}>ЭКСПОРТ</div>
        {["GLTF 2.0","USD","Alembic","FBX","nazrOS .нзр"].map(ф=>(
          <button key={ф} className={styles.экспортКнопка}>{ф}</button>
        ))}

        <button className={styles.запуститьМир}>▶ ЗАПУСТИТЬ МИР</button>
      </aside>
    </div>
  );
}
