
import { useState } from "react";
import styles from "./МодульГлюк.module.css";

interface Слой {
  id: string;
  имя: string;
  видимый: boolean;
}

interface НодЭффекта {
  id: string;
  тип: string;
  x: number;
  y: number;
  параметры: Record<string, string>;
}

const СЛОИ_ЭФФЕКТА: Слой[] = [
  { id: "s1", имя: "glitch_overlay",    видимый: true  },
  { id: "s2", имя: "noise_layer",       видимый: true  },
  { id: "s3", имя: "chromatic_shift",   видимый: true  },
  { id: "s4", имя: "particle_core",     видимый: true  },
  { id: "s5", имя: "smoke_volume",      видимый: true  },
  { id: "s6", имя: "light_beams",       видимый: true  },
  { id: "s7", имя: "energy_field",      видимый: false },
  { id: "s8", имя: "distortion_waves",  видимый: true  },
  { id: "s9", имя: "holo_fracture",     видимый: true  },
  { id: "s10",имя: "bg_ambient",        видимый: true  },
];

const НОДЫ_ЭФФЕКТА: НодЭффекта[] = [
  { id: "e1", тип: "Audio_Input",   x: 20,  y: 30, параметры: { бас:"✓", средние:"✓", высокие:"✓" } },
  { id: "e2", тип: "Beat_Detect",   x: 20,  y: 120, параметры: { порог:"0.45", чувств:"0.78" } },
  { id: "e3", тип: "Force_Radial",  x: 20,  y: 210, параметры: { сила:"3.50", радиус:"12.0" } },
  { id: "e4", тип: "Emitter_Core",  x: 180, y: 30, параметры: { count:"250000", rate:"12000" } },
  { id: "e5", тип: "Turbulence",    x: 180, y: 140, параметры: { сила:"2.48", scale:"6.20", flow:"1.12" } },
  { id: "e6", тип: "Distortion_Waves",x:180,y:220, параметры: { амплитуда:"2.10", color:"↗" } },
  { id: "e7", тип: "Glitch_Shader", x: 340, y: 60, параметры: { type:"cyber", intensity:"1.24", octaves:"4" } },
  { id: "e8", тип: "Noise_Field",   x: 340, y: 170, параметры: { scale:"8.80", strength:"0.62", seed:"77" } },
  { id: "e9", тип: "Light_Volume",  x: 340, y: 260, параметры: { color:"↗", radius:"0.85" } },
  { id: "e10",тип: "Bloom",         x: 500, y: 90, параметры: { threshold:"1.18", radius:"0.65" } },
  { id: "e11",тип: "Output",        x: 500, y: 200, параметры: { beauty:"↗", glow:"↗", emission:"↗" } },
];

const СОЕДИНЕНИЯ_ЭФФЕКТА = [
  { из: "e1", в: "e4" }, { из: "e2", в: "e4" }, { из: "e2", в: "e7" },
  { из: "e3", в: "e5" }, { из: "e4", в: "e7" }, { из: "e5", в: "e7" },
  { из: "e6", в: "e8" }, { из: "e7", в: "e10"},{ из: "e8", в: "e10"},
  { из: "e9", в: "e10"},{ из: "e10",в: "e11"},
];

const ПРЕСЕТЫ = [
  { имя: "glitch_core_v2", превью: "#1a0a2e" },
  { имя: "void_smoke_01",  превью: "#0a0a0a" },
  { имя: "energy_burst",   превью: "#1a0a0a" },
  { имя: "neon_dust",      превью: "#0a1a0a" },
  { имя: "hola_break",     превью: "#0a0a1a" },
  { имя: "digital_rain",   превью: "#001a0a" },
];

const КАТЕГОРИИ = [
  ["глитч",128], ["частицы",256], ["дым",95], ["объёмный свет",72],
  ["неон",86], ["жидкости",34], ["искажения",41], ["атмосфера",63],
  ["перенос данных",22], ["цифровой шум",58], ["энергия",37], ["разрушение",41],
];

export function МодульГлюк() {
  const [слои, setСлои] = useState<Слой[]>(СЛОИ_ЭФФЕКТА);
  const [активныйНод, setАктивныйНод] = useState<string | null>("e4");
  const [воспроизведение, setВоспроизведение] = useState(false);
  const [кадр, setКадр] = useState(245);
  const [нодыПозиции, setНодыПозиции] = useState<Record<string,{x:number,y:number}>>(
    Object.fromEntries(НОДЫ_ЭФФЕКТА.map(н => [н.id, {x:н.x, y:н.y}]))
  );

  const переключитьСлой = (id: string) => {
    setСлои(prev => prev.map(с => с.id === id ? {...с, видимый: !с.видимый} : с));
  };

  const активный = НОДЫ_ЭФФЕКТА.find(н => н.id === активныйНод);

  const позНода = (id: string, выход: boolean) => {
    const поз = нодыПозиции[id];
    return { x: поз.x + (выход ? 140 : 0), y: поз.y + 20 };
  };

  return (
    <div className={styles.модуль}>
      {/* ─── Левая — библиотека эффектов ─── */}
      <aside className={styles.левая}>
        <div className={styles.заг}>БИБЛИОТЕКА ЭФФЕКТОВ</div>
        {КАТЕГОРИИ.map(([н,к]) => (
          <div key={н} className={styles.категория}>
            <span>{н}</span>
            <span className={styles.счётчик}>{к}</span>
          </div>
        ))}

        <div className={styles.заг} style={{marginTop:8}}>ПРЕСЕТЫ</div>
        <div className={styles.пресеты}>
          {ПРЕСЕТЫ.map(п => (
            <div key={п.имя} className={styles.пресет}>
              <div className={styles.пресетПревью} style={{background: п.превью}}>
                <div className={styles.пресетСвечение}/>
              </div>
              <span className={styles.пресетИмя}>{п.имя}</span>
            </div>
          ))}
        </div>
        <button className={styles.добавитьКнопка}>+ создать пресет</button>

        <div className={styles.заг} style={{marginTop:8}}>БЫСТРЫЕ ДЕЙСТВИЯ</div>
        {["новый глитч-слой","добавить эмиттер","добавить шейдер","добавить искажение","добавить объёмный свет","добавить камеру","запечь симуляцию","экспорт эффекта"].map(д => (
          <div key={д} className={styles.действие}>{д}</div>
        ))}
      </aside>

      {/* ─── Центр — превью + node-граф ─── */}
      <div className={styles.центр}>
        {/* Тулбар */}
        <div className={styles.тулбар}>
          <span className={styles.акцент}>ПРОСМОТР ЭФФЕКТА: <span style={{color:"#22d3ee"}}>КИБЕР_ВЗРЫВ_07</span></span>
          <div className={styles.камераСелект}>камера_главная ▾</div>
          <span className={styles.кадрМетка}>кадр {кадр}</span>
          <div style={{flex:1}}/>
          <span className={styles.инфо}>16:9</span>
          <span className={styles.инфо}>⊞</span>
          <span className={styles.инфо}>⊡</span>
        </div>

        {/* Превью эффекта */}
        <div className={styles.превью}>
          {/* Анимированный глитч-взрыв */}
          <div className={styles.взрывЦентр}>
            <div className={styles.взрывСфера}/>
            <div className={styles.взрывКольцо1}/>
            <div className={styles.взрывКольцо2}/>
            <div className={styles.взрывЛучи}>
              {Array.from({length: 12}, (_, i) => (
                <div key={i} className={styles.луч}
                  style={{transform: `rotate(${i*30}deg)`, opacity: 0.3 + Math.random()*0.7}}/>
              ))}
            </div>
            {/* Частицы */}
            {Array.from({length: 20}, (_, i) => (
              <div key={i} className={styles.частица} style={{
                left: `${50 + (Math.random()-0.5)*80}%`,
                top: `${50 + (Math.random()-0.5)*60}%`,
                width: `${2 + Math.random()*4}px`,
                height: `${2 + Math.random()*4}px`,
                opacity: Math.random(),
                animationDelay: `${Math.random()*2}s`,
              }}/>
            ))}
          </div>

          {/* Аннотации */}
          <div className={styles.аннотация} style={{top:"10%",left:"5%"}}>процедурный<br/>глитч-взрыв</div>
          <div className={styles.аннотация} style={{top:"10%",right:"5%"}}>несовые<br/>искажения</div>
          <div className={styles.аннотация} style={{bottom:"20%",left:"5%"}}>объёмный дым<br/>и частицы</div>
          <div className={styles.аннотация} style={{bottom:"20%",right:"5%"}}>цифровой шум<br/>и артефакты</div>
          <div className={styles.аннотация} style={{bottom:"20%",left:"40%"}}>реактивное<br/>освещение</div>

          {/* Параметры */}
          <div className={styles.превьюПарамы}>
            {[["длительность","03:12:00"],["разрешение","3840×2160"],["частота","60 fps"],["режим наложения","Экран"],["интенсивность","1.24"]].map(([м,з]) => (
              <div key={м} className={styles.парам}>
                <span className={styles.парамМ}>{м}</span>
                <span className={styles.парамЗ}>{з}</span>
              </div>
            ))}
          </div>

          {/* Превью контролы */}
          <div className={styles.превьюКонтролы}>
            <button className={styles.контрКнопка}>⏮</button>
            <button className={styles.контрКнопка}>⏭</button>
            <button className={styles.контрКнопка} onClick={() => setВоспроизведение(v=>!v)}>
              {воспроизведение ? "⏸" : "▶"}
            </button>
            <input type="range" min={0} max={512} value={кадр}
              onChange={e => setКадр(+e.target.value)}
              className={styles.прогрессСлайдер}/>
            <span className={styles.кадрМетка}>00:00:08:{String(кадр%60).padStart(2,"0")}</span>
          </div>
        </div>

        {/* Node-граф эффекта */}
        <div className={styles.нодГраф}>
          <div className={styles.нодГрафЗаг}>УЗЛОВАЯ СЕТЬ ЭФФЕКТА</div>
          <div className={styles.нодХолст}>
            {/* SVG соединения */}
            <svg className={styles.нодSVG}>
              {СОЕДИНЕНИЯ_ЭФФЕКТА.map((с, i) => {
                const из = позНода(с.из, true);
                const в = позНода(с.в, false);
                const cx = (из.x + в.x) / 2;
                return (
                  <path key={i}
                    d={`M${из.x},${из.y} C${cx},${из.y} ${cx},${в.y} ${в.x},${в.y}`}
                    stroke="#7c3aed" strokeWidth="1" fill="none" opacity="0.5"/>
                );
              })}
            </svg>

            {/* Ноды */}
            {НОДЫ_ЭФФЕКТА.map(нод => (
              <div key={нод.id}
                className={[styles.нод, активныйНод === нод.id ? styles.нодАкт : ""].join(" ")}
                style={{ left: нодыПозиции[нод.id].x, top: нодыПозиции[нод.id].y }}
                onClick={() => setАктивныйНод(нод.id)}>
                <div className={styles.нодЗаг}>{нод.тип}</div>
                {Object.entries(нод.параметры).slice(0,2).map(([к,в]) => (
                  <div key={к} className={styles.нодПар}>
                    <span className={styles.нодПарМ}>{к}</span>
                    <span className={styles.нодПарЗ}>{в}</span>
                  </div>
                ))}
                <div className={styles.нодПорты}>
                  <div className={styles.портВход}/>
                  <div className={styles.портВыход}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Правая — свойства ─── */}
      <aside className={styles.правая}>
        <div className={styles.заг}>ПАРАМЕТРЫ ЭФФЕКТА</div>
        <div className={styles.вкладки}>
          {["ОСНОВНЫЕ","ЧАСТИЦЫ","ИСКАЖЕНИЯ","ОСВЕЩЕНИЕ","ПОСТ-ОБРАБОТКА","АУДИО-РЕАКЦИЯ"].map(в => (
            <button key={в} className={styles.вкладка}>{в}</button>
          ))}
        </div>

        {активный && (
          <>
            <div className={styles.заг} style={{marginTop:4}}>{активный.тип}</div>
            {Object.entries(активный.параметры).map(([к,в]) => (
              <div key={к} className={styles.строка}>
                <span className={styles.м}>{к}</span>
                <span className={styles.з} style={{color:"#b87ef7"}}>{в}</span>
              </div>
            ))}
          </>
        )}

        <div className={styles.заг} style={{marginTop:8}}>РЕАЛ-ТАЙМ КОНТРОЛЛЕРЫ</div>
        <div className={styles.контрВкладки}>
          {["АУДИО","ДВИЖЕНИЕ","КОЛОР","ФИЗИКА"].map(в => (
            <button key={в} className={styles.контрВкл}>{в}</button>
          ))}
        </div>
        {[["чувствительность","0.78"],["диапазон частот","20Гц — 20кГц"],["реактивность","0.62"]].map(([м,з]) => (
          <div key={м} className={styles.строка}>
            <span className={styles.м}>{м}</span>
            <span className={styles.з}>{з}</span>
          </div>
        ))}
        <input type="range" min={0} max={1} step={0.01} defaultValue={0.78} className={styles.слайдер}/>

        <div className={styles.заг} style={{marginTop:8}}>СЛОИ ЭФФЕКТА</div>
        {слои.map(с => (
          <div key={с.id} className={styles.слойСтрока}>
            <button className={styles.видКнопка}
              onClick={() => переключитьСлой(с.id)}
              style={{opacity: с.видимый ? 1 : 0.3}}>👁</button>
            <span className={styles.слойИмя}>{с.имя}</span>
            <span className={styles.слойИнфо}>ⓘ</span>
          </div>
        ))}
        <button className={styles.добавитьКнопка}>+ добавить слой</button>

        <div className={styles.заг} style={{marginTop:8}}>ПРЕДПРОСМОТРЫ</div>
        <div className={styles.предпросмотры}>
          {["beauty","glitch","particles","depth","normal","emission"].map(п => (
            <div key={п} className={styles.предпросмотр}>
              <div className={styles.предпрПревью}/>
              <span className={styles.предпрИмя}>{п}</span>
            </div>
          ))}
        </div>

        <div className={styles.заг} style={{marginTop:8}}>ИСТОРИЯ ДЕЙСТВИЙ</div>
        {["12:45:02 создан слой particle_core","12:45:11 добавлен эмиттер core_burst","12:45:33 изменён шейдер glitch_noise_v3","12:45:44 настроено объёмное освещение","12:46:22 добавлен аудио-реактивный модуль","12:47:81 запечена симуляция частиц","12:47:18 экспорт пресета КИБЕР_ВЗРЫВ_07"].map((д,i) => (
          <div key={i} className={styles.историяСтрока}>{д}</div>
        ))}

        <button className={styles.отправитьКнопка}>ОТПРАВИТЬ В РЕНДЕР</button>
      </aside>
    </div>
  );
}
