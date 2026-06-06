
import { useState, useRef } from "react";
import styles from "./МодульШина.module.css";

interface Трек {
  id: string;
  имя: string;
  цвет: string;
  громкость: number;
  панорама: number;
  мут: boolean;
  соло: boolean;
  клипы: { начало: number; конец: number; данные: number[] }[];
}

const ТРЕКИ: Трек[] = [
  { id: "t1", имя: "01_ДРАМЫ",    цвет: "#ef4444", громкость: 80, панорама: 0,  мут: false, соло: false,
    клипы: [{ начало: 0, конец: 18, данные: [0.3,0.8,0.2,0.9,0.1,0.7,0.4,0.8,0.2,0.6,0.9,0.3,0.7,0.5,0.8,0.2,0.6,0.4] }] },
  { id: "t2", имя: "02_БАС",      цвет: "#f59e0b", громкость: 75, панорама: -10,мут: false, соло: false,
    клипы: [{ начало: 0, конец: 18, данные: [0.5,0.5,0.7,0.7,0.4,0.4,0.6,0.6,0.5,0.5,0.8,0.8,0.4,0.4,0.7,0.7,0.5,0.5] }] },
  { id: "t3", имя: "03_ЛИДЫ",     цвет: "#10b981", громкость: 70, панорама: 15, мут: false, соло: false,
    клипы: [{ начало: 2, конец: 12, данные: [0.2,0.6,0.8,0.4,0.9,0.3,0.7,0.5,0.8,0.2] }, { начало: 14, конец: 18, данные: [0.4,0.7,0.5,0.8] }] },
  { id: "t4", имя: "04_ПАДЫ",     цвет: "#6366f1", громкость: 60, панорама: 0,  мут: false, соло: false,
    клипы: [{ начало: 0, конец: 18, данные: [0.3,0.3,0.4,0.4,0.3,0.3,0.5,0.5,0.4,0.4,0.3,0.3,0.4,0.4,0.5,0.5,0.3,0.3] }] },
  { id: "t5", имя: "05_АРПЕДЖИО", цвет: "#8b5cf6", громкость: 55, панорама: -20,мут: false, соло: false,
    клипы: [{ начало: 4, конец: 16, данные: [0.6,0.3,0.7,0.2,0.8,0.1,0.9,0.2,0.7,0.3,0.6,0.4] }] },
  { id: "t6", имя: "06_ЭФФЕКТЫ",  цвет: "#ec4899", громкость: 65, панорама: 8,  мут: false, соло: false,
    клипы: [{ начало: 3, конец: 7, данные: [0.4,0.9,0.2,0.8] }, { начало: 11, конец: 14, данные: [0.7,0.3,0.8] }] },
  { id: "t7", имя: "07_ВОКАЛ",    цвет: "#14b8a6", громкость: 72, панорама: 0,  мут: false, соло: false,
    клипы: [{ начало: 0, конец: 18, данные: [0.1,0.3,0.6,0.8,0.7,0.5,0.3,0.4,0.6,0.7,0.5,0.3,0.4,0.6,0.8,0.6,0.4,0.2] }] },
  { id: "t8", имя: "08_АТМОСФЕРЫ",цвет: "#0ea5e9", громкость: 50, панорама: 0,  мут: false, соло: false,
    клипы: [{ начало: 0, конец: 18, данные: [0.2,0.2,0.3,0.3,0.2,0.2,0.3,0.3,0.2,0.2,0.3,0.3,0.2,0.2,0.3,0.3,0.2,0.2] }] },
];

const ВСЕГО_КЛЕТОК = 18;

export function МодульШина() {
  const [треки, setТреки] = useState<Трек[]>(ТРЕКИ);
  const [воспроизведение, setВоспроизведение] = useState(false);
  const [курсор, setКурсор] = useState(9);
  const [бпм] = useState(120);
  const [активныйТрек, setАктивныйТрек] = useState<string | null>("t2");

  // Осциллятор синтезатора
  const [осц1Форма] = useState("saw");
  const [осц2Форма] = useState("square");
  const [осц1Тон] = useState(-3.2);
  const [осц2Тон] = useState(2.1);

  const переключитьМут = (id: string) => {
    setТреки(prev => prev.map(т => т.id === id ? {...т, мут: !т.мут} : т));
  };

  const переключитьСоло = (id: string) => {
    setТреки(prev => prev.map(т => т.id === id ? {...т, соло: !т.соло} : т));
  };

  const изменитьГромкость = (id: string, знач: number) => {
    setТреки(prev => prev.map(т => т.id === id ? {...т, громкость: знач} : т));
  };

  const активный = треки.find(т => т.id === активныйТрек);

  return (
    <div className={styles.модуль}>
      {/* ─── Левая — библиотека звуков ─── */}
      <aside className={styles.левая}>
        <div className={styles.заг}>БИБЛИОТЕКА ЗВУКОВ</div>
        <input placeholder="поиск звуков..." className={styles.поиск}/>
        {[["синтезаторы","1287"],["ударные","945"],["басы","732"],["эффекты","2341"],["поля","512"],["текстуры","873"],["вокал","342"],["глитч","665"],["атмосферы","1124"],["цифровые","988"],["industrial","421"],["коллекции","264"]].map(([н,к]) => (
          <div key={н} className={styles.категория}>
            <span>{н}</span>
            <span className={styles.счётчик}>{к}</span>
          </div>
        ))}

        <div className={styles.заг} style={{marginTop:8}}>ИЗБРАННОЕ</div>
        {["neon_pulse_01","cyber_riser_07","bass_impact_09","vocal_ghost_02"].map(з => (
          <div key={з} className={styles.избранный}>
            <span className={styles.избрИмя}>{з}</span>
          </div>
        ))}
      </aside>

      {/* ─── Центр ─── */}
      <div className={styles.центр}>
        {/* Тулбар */}
        <div className={styles.тулбар}>
          <span className={styles.бпм}>{бпм} BPM</span>
          <span className={styles.тактПодпись}>4 / 4</span>
          <span className={styles.тональность}>C min</span>
          <div style={{flex:1}}/>
          <button className={styles.кнопкаТулбар}>⏮</button>
          <button className={styles.кнопкаТулбар} onClick={() => setВоспроизведение(v=>!v)}>
            {воспроизведение ? "⏸" : "▶"}
          </button>
          <button className={styles.кнопкаТулбар}>⏺</button>
          <div style={{flex:1}}/>
          <span className={styles.таймкод}>
            {String(Math.floor(курсор / бпм * 60)).padStart(2,"0")}:
            {String(Math.floor(курсор % бпм)).padStart(2,"0")}
          </span>
        </div>

        {/* Таймлайн треков */}
        <div className={styles.таймлайн}>
          {/* Шкала */}
          <div className={styles.шкала}>
            <div className={styles.шкалаОтступ}/>
            <div className={styles.шкалаПолосы}>
              {Array.from({length: ВСЕГО_КЛЕТОК}, (_, i) => (
                <div key={i} className={styles.шкалаЕд} onClick={() => setКурсор(i)}>
                  {i % 4 === 0 && <span>{i+1}</span>}
                </div>
              ))}
              <div className={styles.курсорЛиния}
                style={{left: `${(курсор/ВСЕГО_КЛЕТОК)*100}%`}}/>
            </div>
          </div>

          {/* Треки */}
          <div className={styles.трекиОбёртка}>
            {треки.map(трек => (
              <div key={трек.id}
                className={[styles.трек, активныйТрек === трек.id ? styles.трекАктивный : ""].join(" ")}
                onClick={() => setАктивныйТрек(трек.id)}>
                {/* Заголовок трека */}
                <div className={styles.трекЗаг} style={{borderLeft: `3px solid ${трек.цвет}`}}>
                  <span className={styles.трекИмя}>{трек.имя}</span>
                  <div className={styles.трекКнопки}>
                    <button className={[styles.мутКнопка, трек.мут ? styles.мутАктивен : ""].join(" ")}
                      onClick={e => { e.stopPropagation(); переключитьМут(трек.id); }}>М</button>
                    <button className={[styles.солоКнопка, трек.соло ? styles.солоАктивен : ""].join(" ")}
                      onClick={e => { e.stopPropagation(); переключитьСоло(трек.id); }}>S</button>
                    <button className={styles.рКнопка}>R</button>
                  </div>
                  <input type="range" min={0} max={100} value={трек.громкость}
                    className={styles.громкостьСлайдер}
                    onChange={e => изменитьГромкость(трек.id, +e.target.value)}
                    onClick={e => e.stopPropagation()}/>
                </div>

                {/* Волна трека */}
                <div className={styles.трекПолосы}>
                  {трек.клипы.map((к, i) => (
                    <div key={i} className={[styles.клип, трек.мут ? styles.клипМут : ""].join(" ")}
                      style={{
                        left: `${(к.начало/ВСЕГО_КЛЕТОК)*100}%`,
                        width: `${((к.конец-к.начало)/ВСЕГО_КЛЕТОК)*100}%`,
                        borderColor: трек.цвет + "80",
                      }}>
                      <svg width="100%" height="100%" preserveAspectRatio="none">
                        <polyline
                          points={к.данные.map((v,j) =>
                            `${(j/к.данные.length)*100}%,${(1-v)*100}%`).join(" ")}
                          fill="none"
                          stroke={трек.цвет}
                          strokeWidth="1"
                          opacity={трек.мут ? "0.2" : "0.8"}/>
                      </svg>
                    </div>
                  ))}
                  <div className={styles.курсорЛиния}
                    style={{left: `${(курсор/ВСЕГО_КЛЕТОК)*100}%`}}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Граф-редактор */}
        <div className={styles.графРедактор}>
          <span className={styles.графМетка}>ГРАФ-РЕДАКТОР: кривая позиция X</span>
          <svg width="100%" height="100%">
            <path d="M 0,50 C 20,50 30,10 50,30 S 70,70 90,40 S 110,20 130,35"
              fill="none" stroke="#7c3aed" strokeWidth="1.5"/>
          </svg>
        </div>
      </div>

      {/* ─── Правая — синтезатор и микшер ─── */}
      <aside className={styles.правая}>
        {/* Синтезатор */}
        <div className={styles.заг}>СИНТЕЗАТОР: CYBER_BASS_07</div>

        <div className={styles.синтВкладки}>
          {["ОСЦИЛЛЯТОРЫ","ФИЛЬТР","ОГИБАЮЩИЕ","МАТРИЦА","ЭФФЕКТЫ"].map(в => (
            <button key={в} className={styles.синтВкладка}>{в}</button>
          ))}
        </div>

        <div className={styles.осцилляторы}>
          {[
            { имя: "OSC 1", форма: осц1Форма, тон: осц1Тон, дет: 0.76 },
            { имя: "OSC 2", форма: осц2Форма, тон: осц2Тон, дет: 0.42 },
          ].map(о => (
            <div key={о.имя} className={styles.осц}>
              <span className={styles.осцИмя}>{о.имя}</span>
              <div className={styles.осцПарамы}>
                <div className={styles.осцПар}><span className={styles.пМ}>форма</span><span className={styles.пЗ}>{о.форма}</span></div>
                <div className={styles.осцПар}><span className={styles.пМ}>тон</span><span className={styles.пЗ}>{о.тон}</span></div>
                <div className={styles.осцПар}><span className={styles.пМ}>детюн</span><span className={styles.пЗ}>{о.дет}</span></div>
              </div>
              <svg width="100%" height="24" className={styles.осцВолна}>
                <polyline points={
                  Array.from({length:40},(_,i) => {
                    const x = (i/40)*100;
                    const y = 12 - Math.sin(i * 0.5) * 10;
                    return `${x}%,${y}`;
                  }).join(" ")
                } fill="none" stroke="#7c3aed" strokeWidth="1"/>
              </svg>
            </div>
          ))}
        </div>

        {/* Микшер */}
        <div className={styles.заг} style={{marginTop:8}}>МИКШЕР</div>
        <div className={styles.микшер}>
          {треки.slice(0,8).map(т => (
            <div key={т.id} className={styles.канал}>
              <div className={styles.фейдерОбёртка}>
                <div className={styles.уровень}
                  style={{height: `${т.громкость}%`, background: т.цвет}}/>
              </div>
              <span className={styles.каналИмя}>{т.имя.split("_")[1]?.slice(0,4) || т.имя.slice(0,4)}</span>
            </div>
          ))}
          <div className={[styles.канал, styles.мастер].join(" ")}>
            <div className={styles.фейдерОбёртка}>
              <div className={styles.уровень} style={{height:"78%", background:"linear-gradient(0deg,#7c3aed,#22d3ee)"}}/>
            </div>
            <span className={styles.каналИмя}>МАСТЕР</span>
          </div>
        </div>

        {/* Экспорт */}
        <button className={styles.экспортКнопка}>ЭКСПОРТ АУДИО</button>
      </aside>
    </div>
  );
}
