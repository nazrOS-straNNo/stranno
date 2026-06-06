
import { useState } from "react";
import styles from "./МодульМульт.module.css";

interface Слой {
  id: string;
  имя: string;
  цвет: string;
  интенсивность: number;
  видимый: boolean;
}

interface Ключ {
  кадр: number;
  значение: number;
}

const СЛОИ: Слой[] = [
  { id: "s1", имя: "лицо",   цвет: "#7c3aed", интенсивность: 100, видимый: true },
  { id: "s2", имя: "тело",   цвет: "#10b981", интенсивность: 100, видимый: true },
  { id: "s3", имя: "руки",   цвет: "#3b82f6", интенсивность: 100, видимый: true },
  { id: "s4", имя: "волосы", цвет: "#f59e0b", интенсивность: 85,  видимый: true },
  { id: "s5", имя: "одежда", цвет: "#ec4899", интенсивность: 75,  видимый: true },
  { id: "s6", имя: "физика", цвет: "#ef4444", интенсивность: 60,  видимый: true },
  { id: "s7", имя: "камеры", цвет: "#22d3ee", интенсивность: 100, видимый: true },
  { id: "s8", имя: "звук",   цвет: "#a855f7", интенсивность: 80,  видимый: true },
];

const КОНТРОЛЛЕРЫ = [
  "CTRL_head","CTRL_neck","CTRL_chest","CTRL_spine",
  "CTRL_hips","CTRL_shoulder_L","CTRL_shoulder_R",
  "CTRL_arm_L","CTRL_arm_R","CTRL_hand_L","CTRL_hand_R",
  "CTRL_fingers","CTRL_legs","CTRL_feet",
];

const ВЫРАЖЕНИЯ = [
  { имя: "нейтральное", кл: "N" },
  { имя: "улыбка",      кл: "U" },
  { имя: "гнев",        кл: "G" },
  { имя: "удивление",   кл: "?" },
  { имя: "грусть",      кл: "P" },
  { имя: "страх",       кл: "S" },
  { имя: "сомнение",    кл: "C" },
  { имя: "цинично",     кл: "Z" },
  { имя: "кибер_прищур",кл: "K" },
];

const ДВИЖЕНИЯ = [
  "идти_вперёд","бежать","прыжок_вверх","паркур_стена",
  "уклонение_влево","боевая_стойка","танец_кибер",
  "сесть_на_корточки","встать_резко",
];

// Генерируем кривую анимации
const КРИВАЯ: Ключ[] = [
  {кадр:0,значение:0},{кадр:60,значение:5},{кадр:120,значение:-3},
  {кадр:180,значение:8},{кадр:240,значение:2},{кадр:300,значение:-5},
  {кадр:360,значение:0},{кадр:420,значение:6},{кадр:480,значение:-2},
  {кадр:540,значение:4},{кадр:600,значение:0},{кадр:660,значение:-4},
  {кадр:720,значение:7},
];

const ВСЕГО_КАДРОВ = 720;
const ВСЕГО_СЕКУНД = 12;

export function МодульМульт() {
  const [активныйКонтроллер, setАктивныйКонтроллер] = useState("CTRL_head");
  const [текущийКадр, setТекущийКадр] = useState(252);
  const [воспроизведение, setВоспроизведение] = useState(false);
  const [слои, setСлои] = useState<Слой[]>(СЛОИ);
  const [интенсивность] = useState(0.78);
  const [симметрия] = useState(0.92);

  const переключитьВидимость = (id: string) => {
    setСлои(prev => prev.map(с => с.id === id ? {...с, видимый: !с.видимый} : с));
  };

  // SVG кривая
  const точкиКривой = () => {
    const ш = 100;
    const в = 40;
    return КРИВАЯ.map(к => {
      const x = (к.кадр / ВСЕГО_КАДРОВ) * ш;
      const y = в/2 - к.значение * (в/20);
      return `${x}%,${y}`;
    }).join(" ");
  };

  return (
    <div className={styles.модуль}>
      {/* ─── Левая — анимация ─── */}
      <aside className={styles.левая}>
        <div className={styles.заг}>АНИМАЦИЯ <span className={styles.хелп}>?</span></div>
        {["позирование","ключи","motion-запись","процедуры","физика","лицевая анимация","симуляции","настройки"].map(п => (
          <div key={п} className={styles.пункт}>{п}</div>
        ))}

        <div className={styles.заг} style={{marginTop:8}}>ПЕРСОНАЖ</div>
        <div className={styles.персонаж}>
          <div className={styles.персонажПревью}>
            {/* Стилизованный силуэт */}
            <svg width="60" height="100" viewBox="0 0 60 100">
              <circle cx="30" cy="12" r="8" fill="none" stroke="#7c3aed" strokeWidth="1.5"/>
              <line x1="30" y1="20" x2="30" y2="55" stroke="#7c3aed" strokeWidth="1.5"/>
              <line x1="30" y1="30" x2="10" y2="48" stroke="#7c3aed" strokeWidth="1.5"/>
              <line x1="30" y1="30" x2="50" y2="48" stroke="#7c3aed" strokeWidth="1.5"/>
              <line x1="30" y1="55" x2="18" y2="80" stroke="#7c3aed" strokeWidth="1.5"/>
              <line x1="30" y1="55" x2="42" y2="80" stroke="#7c3aed" strokeWidth="1.5"/>
              {/* Контроллеры */}
              <circle cx="30" cy="12" r="3" fill="#b87ef7" opacity="0.8"/>
              <circle cx="30" cy="30" r="2.5" fill="#10b981" opacity="0.8"/>
              <circle cx="10" cy="48" r="2" fill="#3b82f6" opacity="0.8"/>
              <circle cx="50" cy="48" r="2" fill="#3b82f6" opacity="0.8"/>
              <circle cx="30" cy="55" r="2.5" fill="#f59e0b" opacity="0.8"/>
              <circle cx="18" cy="80" r="2" fill="#22d3ee" opacity="0.8"/>
              <circle cx="42" cy="80" r="2" fill="#22d3ee" opacity="0.8"/>
            </svg>
          </div>
          <div className={styles.персонажИнфо}>
            <div className={styles.персонажИмя}>кибер_девочка_v2</div>
            <div className={styles.персонажМета}>скелет: full_body_cyber</div>
            <div className={styles.персонажМета}>риг: advanced_face_rig</div>
            <button className={styles.выбратьКнопка}>выбрать персонажа</button>
          </div>
        </div>

        <div className={styles.заг} style={{marginTop:8}}>СЛОИ АНИМАЦИИ</div>
        {слои.map(с => (
          <div key={с.id} className={styles.слой}>
            <div className={styles.слойЦвет} style={{background: с.цвет}}/>
            <span className={styles.слойИмя}>{с.имя}</span>
            <span className={styles.слойИнт}>{с.интенсивность}%</span>
            <button className={styles.видКнопка}
              onClick={() => переключитьВидимость(с.id)}
              style={{opacity: с.видимый ? 1 : 0.3}}>👁</button>
          </div>
        ))}
        <button className={styles.добавитьКнопка}>+ новый слой</button>

        <div className={styles.заг} style={{marginTop:8}}>БЫСТРЫЕ ДЕЙСТВИЯ</div>
        {["записать motion","симуляция ткани","очистить ключи","зеркалить анимацию","конвертировать в цикл"].map(д => (
          <div key={д} className={styles.действие}>{д}</div>
        ))}
      </aside>

      {/* ─── Центр ─── */}
      <div className={styles.центр}>
        {/* Ригинг и контроллеры */}
        <div className={styles.верхняяПолоса}>
          <div className={styles.риг}>
            <div className={styles.заг}>РИГГИНГ И КОНТРОЛЛЕРЫ</div>
            <div className={styles.ригВкладки}>
              {["скелет","контроллеры","деформеры"].map(в => (
                <button key={в} className={[styles.ригВкл, в === "контроллеры" ? styles.ригВклАкт : ""].join(" ")}>{в}</button>
              ))}
            </div>
            <div className={styles.контроллерыСписок}>
              {КОНТРОЛЛЕРЫ.map(к => (
                <div key={к}
                  className={[styles.контроллер, активныйКонтроллер === к ? styles.контроллерАкт : ""].join(" ")}
                  onClick={() => setАктивныйКонтроллер(к)}>
                  {к}
                </div>
              ))}
            </div>
          </div>

          {/* Viewport */}
          <div className={styles.viewport}>
            <div className={styles.viewportТулбар}>
              <span className={styles.акцент}>камера_01</span>
              <div style={{flex:1}}/>
              <span className={styles.метаВьюпорт}>2.0x</span>
              <span className={styles.метаВьюпорт}>локальная</span>
              <span className={styles.метаВьюпорт}>⊹</span>
            </div>
            <div className={styles.viewportОбласть}>
              {/* Персонаж в viewport */}
              <div className={styles.персонажВьюпорт}>
                <svg width="200" height="320" viewBox="0 0 200 320">
                  {/* Тело */}
                  <ellipse cx="100" cy="60" rx="22" ry="26" fill="none" stroke="rgba(184,126,247,0.6)" strokeWidth="1.5"/>
                  <rect x="72" y="84" width="56" height="70" rx="8" fill="none" stroke="rgba(184,126,247,0.5)" strokeWidth="1.5"/>
                  {/* Руки */}
                  <line x1="72" y1="92" x2="40" y2="140" stroke="rgba(59,130,246,0.7)" strokeWidth="2"/>
                  <line x1="128" y1="92" x2="160" y2="140" stroke="rgba(59,130,246,0.7)" strokeWidth="2"/>
                  {/* Ноги */}
                  <line x1="86" y1="154" x2="75" y2="230" stroke="rgba(16,185,129,0.7)" strokeWidth="2"/>
                  <line x1="114" y1="154" x2="125" y2="230" stroke="rgba(16,185,129,0.7)" strokeWidth="2"/>
                  {/* Контроллеры активные */}
                  <circle cx="100" cy="60" r="6" fill="#b87ef7" opacity="0.9"/>
                  <circle cx="100" cy="95" r="5" fill="#10b981" opacity="0.8"/>
                  <circle cx="40" cy="140" r="4" fill="#3b82f6" opacity="0.8"/>
                  <circle cx="160" cy="140" r="4" fill="#3b82f6" opacity="0.8"/>
                  {/* Динамика волос */}
                  <path d="M 85 40 Q 80 20 90 15 Q 95 10 100 12 Q 108 8 115 18 Q 122 28 118 40"
                    fill="none" stroke="#f59e0b" strokeWidth="1.5" opacity="0.7"/>
                  {/* Деформеры */}
                  <rect x="68" y="80" width="64" height="78" rx="10" fill="none" stroke="rgba(124,58,237,0.3)" strokeWidth="1" strokeDasharray="4,2"/>
                </svg>
              </div>
              {/* Аннотации */}
              <div className={styles.аннотация} style={{top:"15%",left:"65%"}}>динамика волос<br/>на основе физики ядра</div>
              <div className={styles.аннотация} style={{top:"30%",left:"5%"}}>контроллеры лица<br/>для мимики и выражений</div>
              <div className={styles.аннотация} style={{top:"60%",left:"65%"}}>слои деформации<br/>и корректоры поверхностей</div>
            </div>
            <div className={styles.viewportИнфо}>
              <span>сцена: КИБЕР_ДЕВОЧКА_АНИМАЦИЯ</span>
              <span>кадров: 720 / 1024</span>
              <span>память: 5.6 ГБ</span>
              <span>render: не запущен</span>
            </div>
          </div>

          {/* Лицевая анимация */}
          <div className={styles.лицевая}>
            <div className={styles.заг}>ЛИЦЕВАЯ АНИМАЦИЯ</div>
            <div className={styles.выраженияСписок}>
              {ВЫРАЖЕНИЯ.map(в => (
                <div key={в.имя} className={styles.выражение}>
                  <div className={styles.выражениеКруг}>{в.кл}</div>
                  <span className={styles.выражениеИмя}>{в.имя}</span>
                </div>
              ))}
              <button className={styles.добавитьКнопка}>добавить выражение</button>
            </div>

            <div className={styles.заг} style={{marginTop:8}}>СВОЙСТВА АНИМАЦИИ</div>
            {[["режим","редактирование ключей"],["интерполяция","Bezier"],["частота кадров","60 fps"],["длительность","00:00:12:00"],["начало","00:00:00:00"],["конец","00:00:12:00"],["цикличность","ВКЛ"]].map(([м,з]) => (
              <div key={м} className={styles.строка}>
                <span className={styles.м}>{м}</span>
                <span className={styles.з}>{з}</span>
              </div>
            ))}

            <div className={styles.заг} style={{marginTop:8}}>ДВИЖЕНИЯ И ПРОЦЕДУРЫ</div>
            <div className={styles.движенияВкл}>
              {["библиотека","процедуры","мощ. слой"].map(в => (
                <button key={в} className={styles.движВкл}>{в}</button>
              ))}
            </div>
            {ДВИЖЕНИЯ.map(д => (
              <div key={д} className={styles.движение}>
                <span className={styles.движИкон}>⚡</span>
                <span className={styles.движИмя}>{д}</span>
              </div>
            ))}
            <button className={styles.применитьКнопка}>применить движение</button>

            <div className={styles.слайдерГруппа}>
              <div className={styles.слайдерМетка}><span>интенсивность</span><span>{интенсивность}</span></div>
              <input type="range" min={0} max={1} step={0.01} defaultValue={интенсивность} className={styles.слайдер}/>
            </div>
            <div className={styles.слайдерГруппа}>
              <div className={styles.слайдерМетка}><span>симметрия</span><span>{симметрия}</span></div>
              <input type="range" min={0} max={1} step={0.01} defaultValue={симметрия} className={styles.слайдер}/>
            </div>
          </div>
        </div>

        {/* Таймлайн */}
        <div className={styles.нижняяЧасть}>
          <div className={styles.таймлайнЗаг}>
            <span className={styles.акцент}>ТАЙМЛАЙН АНИМАЦИИ</span>
            <div style={{flex:1}}/>
            <div className={styles.контролы}>
              <button className={styles.контрКнопка}>⏮</button>
              <button className={styles.контрКнопка}>⏭</button>
              <button className={styles.контрКнопка} onClick={() => setВоспроизведение(v=>!v)}>
                {воспроизведение ? "⏸" : "▶"}
              </button>
              <button className={styles.контрКнопка}>⏩</button>
              <span className={styles.таймкод}>00:00:04:{String(текущийКадр % 60).padStart(2,"0")}</span>
            </div>
          </div>

          {/* Шкала кадров */}
          <div className={styles.шкала}>
            <div className={styles.шкалаОтступ}/>
            <div className={styles.шкалаПолосы}>
              {Array.from({length: ВСЕГО_СЕКУНД + 1}, (_, i) => (
                <div key={i} className={styles.шкалаЕд}>
                  <span>{String(i).padStart(2,"0")}:00</span>
                </div>
              ))}
              <div className={styles.курсорЛиния}
                style={{left: `${(текущийКадр / ВСЕГО_КАДРОВ) * 100}%`}}/>
            </div>
          </div>

          {/* Дорожки анимации */}
          {слои.map(с => (
            <div key={с.id} className={styles.дорожка}>
              <div className={styles.дорожкаМетка} style={{borderLeft: `2px solid ${с.цвет}`}}>
                <span>⚙</span><span>🔒</span><span>{с.имя}</span>
              </div>
              <div className={styles.дорожкаКлипы}>
                {/* Ключевые кадры */}
                {Array.from({length: Math.floor(Math.random() * 6) + 3}, (_, i) => (
                  <div key={i} className={styles.ключКадр}
                    style={{
                      left: `${(Math.random() * 90 + 5)}%`,
                      background: с.цвет,
                    }}/>
                ))}
                <div className={styles.курсорЛиния}
                  style={{left: `${(текущийКадр / ВСЕГО_КАДРОВ) * 100}%`}}/>
              </div>
            </div>
          ))}

          {/* Граф-редактор */}
          <div className={styles.графРедактор}>
            <div className={styles.графЗаг}>ГРАФ-РЕДАКТОР <span style={{color:"#b87ef7"}}>кривая: позиция X</span></div>
            <svg width="100%" height="60" className={styles.графSVG}>
              <line x1="0" y1="30" x2="100%" y2="30" stroke="rgba(45,61,90,0.5)" strokeWidth="1"/>
              <polyline points={точкиКривой()} fill="none" stroke="#7c3aed" strokeWidth="1.5"/>
              {КРИВАЯ.map((к, i) => (
                <circle key={i}
                  cx={`${(к.кадр/ВСЕГО_КАДРОВ)*100}%`}
                  cy={`${50 - к.значение * 4}%`}
                  r="3" fill="#b87ef7"/>
              ))}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
