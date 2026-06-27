import { useState } from "react";
import styles from "./МодульЯблочко.module.css";

const СИМУЛЯЦИИ = [
  { id: "s1", имя: "Ткань_Плащ_01",    тип: "ткань",     статус: "активна",  кадров: 240 },
  { id: "s2", имя: "Жидкость_Вода_02",  тип: "жидкость",  статус: "кэш",      кадров: 120 },
  { id: "s3", имя: "Дым_Взрыв_03",      тип: "дым",       статус: "активна",  кадров: 180 },
  { id: "s4", имя: "Тело_Падение_04",   тип: "твёрдое",   статус: "пауза",    кадров: 300 },
  { id: "s5", имя: "Волосы_Ветер_05",   тип: "волосы",    статус: "активна",  кадров: 360 },
  { id: "s6", имя: "Частицы_Огонь_06",  тип: "частицы",   статус: "кэш",      кадров: 150 },
];

const ТИПЫ_СИМУЛЯЦИЙ = ["ткань","жидкость","дым","твёрдое тело","мягкое тело","волосы","частицы","разрушение"];

export function МодульЯблочко() {
  const [активная, setАктивная] = useState("s1");
  const [воспроизведение, setВоспроизведение] = useState(false);
  const [кадр, setКадр] = useState(85);

  const сим = СИМУЛЯЦИИ.find(с => с.id === активная);

  return (
    <div className={styles.модуль}>
      <aside className={styles.левая}>
        <div className={styles.заг}>СИМУЛЯЦИИ</div>
        {СИМУЛЯЦИИ.map(с => (
          <div key={с.id}
            className={[styles.симуляция, активная === с.id ? styles.симАкт : ""].join(" ")}
            onClick={() => setАктивная(с.id)}>
            <div className={styles.симИконка}>{
              с.тип === "ткань" ? "🧵" :
              с.тип === "жидкость" ? "💧" :
              с.тип === "дым" ? "💨" :
              с.тип === "твёрдое" ? "⬛" :
              с.тип === "волосы" ? "〰" : "✨"
            }</div>
            <div className={styles.симИнфо}>
              <span className={styles.симИмя}>{с.имя}</span>
              <span className={styles.симТип}>{с.тип} · {с.кадров} кадров</span>
            </div>
            <div className={[styles.симСтатус,
              с.статус === "активна" ? styles.статусАкт :
              с.статус === "кэш" ? styles.статусКэш : styles.статусПауза
            ].join(" ")}>{с.статус}</div>
          </div>
        ))}
        <button className={styles.добавитьКнопка}>+ новая симуляция</button>

        <div className={styles.заг} style={{marginTop:12}}>ТИПЫ</div>
        {ТИПЫ_СИМУЛЯЦИЙ.map(т => (
          <div key={т} className={styles.тип}>{т}</div>
        ))}
      </aside>

      <div className={styles.центр}>
        <div className={styles.тулбар}>
          <span className={styles.акцент}>ФИЗИЧЕСКИЙ ДВИЖОК nazrOS</span>
          <div style={{flex:1}}/>
          <button className={styles.кнопкаТулбар}>Rapier</button>
          <button className={styles.кнопкаТулбар}>Bullet</button>
          <button className={styles.кнопкаТулбар}>GPU</button>
        </div>

        <div className={styles.viewport}>
          <div className={styles.симВизуал}>
            <div className={styles.объект1}/>
            <div className={styles.объект2}/>
            <div className={styles.объект3}/>
            <div className={styles.пол}/>
            {Array.from({length:12},(_,i)=>(
              <div key={i} className={styles.частица} style={{
                left:`${20+Math.random()*60}%`,
                top:`${20+Math.random()*50}%`,
                width:`${3+Math.random()*5}px`,
                height:`${3+Math.random()*5}px`,
                animationDelay:`${Math.random()*2}s`,
              }}/>
            ))}
          </div>

          <div className={styles.viewportИнфо}>
            <span>физ. движок: Rapier 3D</span>
            <span>подшаги: 8</span>
            <span>гравитация: -9.81</span>
            <span>кадр: {кадр}</span>
          </div>
        </div>

        <div className={styles.контролы}>
          <button className={styles.контрКнопка}>⏮</button>
          <button className={styles.контрКнопка} onClick={()=>setВоспроизведение(v=>!v)}>
            {воспроизведение?"⏸":"▶"}
          </button>
          <button className={styles.контрКнопка}>⏩</button>
          <input type="range" min={0} max={360} value={кадр}
            onChange={e=>setКадр(+e.target.value)}
            className={styles.прогресс}/>
          <span className={styles.кадрМетка}>кадр {кадр} / 360</span>
          <div style={{flex:1}}/>
          <button className={styles.запечьКнопка}>ЗАПЕЧЬ СИМУЛЯЦИЮ</button>
        </div>

        <div className={styles.параметры}>
          <div className={styles.парамГруппа}>
            <div className={styles.парамЗаг}>ОСНОВНЫЕ</div>
            {[["гравитация","-9.81 м/с²"],["подшаги","8"],["точность","высокая"],["collision","Box + Mesh"]].map(([м,з])=>(
              <div key={м} className={styles.парам}>
                <span className={styles.парамМ}>{м}</span>
                <span className={styles.парамЗ}>{з}</span>
              </div>
            ))}
          </div>
          <div className={styles.парамГруппа}>
            <div className={styles.парамЗаг}>МАТЕРИАЛ</div>
            {[["масса","1.5 кг"],["упругость","0.35"],["трение","0.72"],["демпфирование","0.1"]].map(([м,з])=>(
              <div key={м} className={styles.парам}>
                <span className={styles.парамМ}>{м}</span>
                <span className={styles.парамЗ} style={{color:"#b87ef7"}}>{з}</span>
              </div>
            ))}
          </div>
          <div className={styles.парамГруппа}>
            <div className={styles.парамЗаг}>ТКАНЬ (если активна)</div>
            {[["жёсткость","0.85"],["растяжимость","0.12"],["изгиб","0.45"],["коллизия","self+world"]].map(([м,з])=>(
              <div key={м} className={styles.парам}>
                <span className={styles.парамМ}>{м}</span>
                <span className={styles.парамЗ}>{з}</span>
              </div>
            ))}
          </div>
          <div className={styles.парамГруппа}>
            <div className={styles.парамЗаг}>ПРОИЗВОДИТЕЛЬНОСТЬ</div>
            {[["GPU ускорение","ВКЛ"],["потоков","8"],["кэш размер","2.4 ГБ"],["качество","высокое"]].map(([м,з])=>(
              <div key={м} className={styles.парам}>
                <span className={styles.парамМ}>{м}</span>
                <span className={styles.парамЗ} style={{color:"#10b981"}}>{з}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <aside className={styles.правая}>
        <div className={styles.заг}>СВОЙСТВА СИМУЛЯЦИИ</div>
        {сим && (
          <>
            {[["имя",сим.имя],["тип",сим.тип],["статус",сим.статус],["кадров",String(сим.кадров)]].map(([м,з])=>(
              <div key={м} className={styles.строка}>
                <span className={styles.м}>{м}</span>
                <span className={styles.з}>{з}</span>
              </div>
            ))}
          </>
        )}

        <div className={styles.заг} style={{marginTop:8}}>СИЛЫ</div>
        {[["гравитация","Y: -9.81"],["ветер","X: 2.5, Z: 1.2"],["турбулентность","0.45"],["вихрь","0.0"]].map(([м,з])=>(
          <div key={м} className={styles.строка}>
            <span className={styles.м}>{м}</span>
            <span className={styles.з} style={{color:"#22d3ee"}}>{з}</span>
          </div>
        ))}

        <div className={styles.заг} style={{marginTop:8}}>КОЛЛАЙДЕРЫ</div>
        {["Пол (plane)","Стена_L (box)","Стена_R (box)","Потолок (plane)","Персонаж (capsule)"].map(к=>(
          <div key={к} className={styles.коллайдер}>
            <span className={styles.колИкона}>⬡</span>
            <span className={styles.колИмя}>{к}</span>
          </div>
        ))}
        <button className={styles.добавитьКнопка}>+ добавить коллайдер</button>

        <div className={styles.заг} style={{marginTop:8}}>КЭШ</div>
        {[["размер","847 МБ"],["кадров","360"],["сжатие","zstd"],["путь","./cache/sim_01"]].map(([м,з])=>(
          <div key={м} className={styles.строка}>
            <span className={styles.м}>{м}</span>
            <span className={styles.з}>{з}</span>
          </div>
        ))}
        <button className={styles.очиститьКэш}>очистить кэш</button>
        <button className={styles.запечьКнопкаМал}>ЗАПЕЧЬ В КЭШ</button>
      </aside>
    </div>
  );
}
