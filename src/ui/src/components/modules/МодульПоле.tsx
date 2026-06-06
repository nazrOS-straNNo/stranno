
import { useState } from "react";
import styles from "./МодульПоле.module.css";

interface ОбъектМира {
  id: string;
  имя: string;
  тип: string;
  группа: string;
  x: number;
  y: number;
  видимый: boolean;
}

interface НПС {
  тип: string;
  количество: number;
}

interface ИгроваяЗона {
  имя: string;
  тип: "безопасная" | "боевая" | "торговая" | "событие";
  x: number;
  y: number;
  размер: number;
}

const ОБЪЕКТЫ: ОбъектМира[] = [
  { id: "o1", имя: "build_mod_01",     тип: "Статический Меш",  группа: "Архитектура", x: 45, y: 30, видимый: true },
  { id: "o2", имя: "build_mod_02",     тип: "Статический Меш",  группа: "Архитектура", x: 62, y: 28, видимый: true },
  { id: "o3", имя: "neon_sign_07",     тип: "Динамический Меш", группа: "Декорации",   x: 55, y: 22, видимый: true },
  { id: "o4", имя: "holo_screen_03",   тип: "Blueprint",        группа: "Декорации",   x: 40, y: 40, видимый: true },
  { id: "o5", имя: "street_lamp_05",   тип: "Статический Меш",  группа: "Освещение",   x: 70, y: 35, видимый: true },
  { id: "o6", имя: "ventilation_02",   тип: "Статический Меш",  группа: "Архитектура", x: 30, y: 50, видимый: false },
  { id: "o7", имя: "pipe_set_01",      тип: "Статический Меш",  группа: "Архитектура", x: 80, y: 45, видимый: true },
  { id: "o8", имя: "door_cyber_01",    тип: "Blueprint",        группа: "Архитектура", x: 50, y: 55, видимый: true },
  { id: "o9", имя: "window_big_02",    тип: "Статический Меш",  группа: "Архитектура", x: 65, y: 25, видимый: true },
  { id: "o10",имя: "antenna_01",       тип: "Динамический Меш", группа: "Декорации",   x: 20, y: 20, видимый: true },
  { id: "o11",имя: "road_straight",    тип: "Статический Меш",  группа: "Навигация",   x: 50, y: 70, видимый: true },
  { id: "o12",имя: "road_corner",      тип: "Статический Меш",  группа: "Навигация",   x: 30, y: 70, видимый: true },
  { id: "o13",имя: "box_cct_09",       тип: "Физ. Объект",      группа: "Декорации",   x: 75, y: 60, видимый: true },
  { id: "o14",имя: "decal_graffiti",   тип: "Декаль",           группа: "Декорации",   x: 35, y: 42, видимый: true },
];

const НПС_СПИСОК: НПС[] = [
  { тип: "NPC_Citizen_01",   количество: 12 },
  { тип: "NPC_Guard_01",     количество: 6  },
  { тип: "NPC_Merchant_01",  количество: 3  },
  { тип: "NPC_Drone_02",     количество: 8  },
  { тип: "Vehicle_Hover_01", количество: 2  },
];

const ЗОНЫ: ИгроваяЗона[] = [
  { имя: "Safe_Zone",    тип: "безопасная", x: 20, y: 20, размер: 20 },
  { имя: "Combat_Zone",  тип: "боевая",     x: 60, y: 30, размер: 25 },
  { имя: "Cyber_Market", тип: "торговая",   x: 40, y: 60, размер: 18 },
  { имя: "Event_Area_01",тип: "событие",    x: 70, y: 65, размер: 15 },
];

const ЦВЕТ_ЗОНЫ: Record<string, string> = {
  безопасная: "rgba(16,185,129,0.25)",
  боевая:     "rgba(239,68,68,0.25)",
  торговая:   "rgba(245,158,11,0.25)",
  событие:    "rgba(124,58,237,0.25)",
};

const БОРДЕР_ЗОНЫ: Record<string, string> = {
  безопасная: "#10b981",
  боевая:     "#ef4444",
  торговая:   "#f59e0b",
  событие:    "#7c3aed",
};

export function МодульПоле() {
  const [выделенный, setВыделенный] = useState<string | null>("o1");
  const [активнаяВкладка, setАктивнаяВкладка] = useState("БРАУЗЕР КОНТЕНТА");
  const [режимРед, setРежимРед] = useState("выделение");

  const активный = ОБЪЕКТЫ.find(о => о.id === выделенный);

  return (
    <div className={styles.модуль}>
      {/* ─── Левая — иерархия мира ─── */}
      <aside className={styles.левая}>
        <div className={styles.заг}>ИЕРАРХИЯ МИРА <span className={styles.хелп}>?</span></div>

        <div className={styles.дерево}>
          {[
            { имя: "КИБЕР_ГОРОД_07", уровень: 0, иконка: "🌍" },
            { имя: "ГЕОМЕТРИЯ",      уровень: 1, иконка: "⬡" },
            { имя: "СТАТИКА",        уровень: 2, иконка: "📦" },
            { имя: "СТРОЕНИЯ",       уровень: 2, иконка: "🏢", активный: true },
            { имя: "МОДУЛИ_ГОРОДА",  уровень: 1, иконка: "🏙" },
            { имя: "ДЕКОРАЦИИ",      уровень: 1, иконка: "✨" },
            { имя: "СВЕТ_И_АТМОСФЕРА",уровень: 1, иконка: "💡" },
            { имя: "ЗОНЫ_ИГРОКА",    уровень: 1, иконка: "🎮" },
            { имя: "NPC_СЛОИ",       уровень: 1, иконка: "🤖" },
            { имя: "ЛОГИКА_МИРА",    уровень: 1, иконка: "⚙" },
            { имя: "СОБЫТИЯ",        уровень: 1, иконка: "⚡" },
            { имя: "КВЕСТЫ",         уровень: 1, иконка: "📜" },
            { имя: "АУДИО_ЗОНЫ",     уровень: 1, иконка: "🔊" },
            { имя: "ПОГОДА",         уровень: 1, иконка: "🌧" },
            { имя: "СЕТЕВЫЕ_ТОЧКИ",  уровень: 1, иконка: "🔗" },
          ].map((э, i) => (
            <div key={i}
              className={[styles.элДерева, э.активный ? styles.элАктивный : ""].join(" ")}
              style={{paddingLeft: `${8 + э.уровень * 12}px`}}>
              <span className={styles.элИкона}>{э.иконка}</span>
              <span className={styles.элИмя}>{э.имя}</span>
              <span className={styles.элВид}>👁</span>
            </div>
          ))}
        </div>

        <div className={styles.заг} style={{marginTop:8}}>БЫСТРОЕ СОЗДАНИЕ <span className={styles.хелп}>?</span></div>
        <div className={styles.примитивы}>
          {[["плоскость","▬"],["куб","⬛"],["цилиндр","⬤"],["сфера","●"],["капсула","⬭"],["лестница","≡"],["точка слияния","⊕"],["точка триггер","⊗"]].map(([н,и]) => (
            <div key={н} className={styles.примитив} title={н}>
              <span>{и}</span>
            </div>
          ))}
        </div>

        <div className={styles.заг} style={{marginTop:8}}>РЕЖИМ РЕДАКТИРОВАНИЯ <span className={styles.хелп}>?</span></div>
        {[["⊞","мультиред"],["✥","перемещение"],["↻","вращение"],["⊡","масштаб"]].map(([и,н]) => (
          <div key={н}
            className={[styles.режим, режимРед === н ? styles.режимАкт : ""].join(" ")}
            onClick={() => setРежимРед(н)}>
            <span>{и}</span><span>{н}</span>
          </div>
        ))}

        <div className={styles.заг} style={{marginTop:8}}>ПРИВЯЗКА</div>
        <div className={styles.примитивы}>
          {["сетка","угол","поверхность"].map(п => (
            <div key={п} className={styles.привязка}>{п}</div>
          ))}
        </div>
        <div className={styles.строка}>
          <span className={styles.м}>размер сетки</span>
          <span className={styles.з}>100 см</span>
        </div>
        <div className={styles.строка}>
          <span className={styles.м}>привязка к углам</span>
          <span className={styles.з} style={{color:"#10b981"}}>ВКЛ</span>
        </div>
      </aside>

      {/* ─── Центр — viewport мира ─── */}
      <div className={styles.центр}>
        {/* Тулбар */}
        <div className={styles.тулбар}>
          <span className={styles.акцент}>РЕДАКТОР УРОВНЕЙ // КИБЕР_ГОРОД_07</span>
          <span className={styles.сохранено}>сохранено</span>
          <div style={{flex:1}}/>
          <div className={styles.тулбарГруппа}>
            {["▶","◉","✡","💡","🔗"].map((и,i) => (
              <button key={i} className={styles.тулбарКнопка}>{и}</button>
            ))}
          </div>
          <select className={styles.видСелект}><option>локальная</option><option>мировая</option></select>
          <div className={styles.тулбарГруппа}>
            <button className={styles.тулбарКнопка}>вид</button>
            <button className={styles.тулбарКнопка}>коллизии</button>
            <button className={styles.тулбарКнопка}>свет</button>
            <button className={styles.тулбарКнопка}>навигация</button>
          </div>
        </div>

        {/* Viewport */}
        <div className={styles.viewport}>
          {/* Фон города */}
          <div className={styles.cityBG}>
            {/* Здания */}
            {[
              {left:"5%",bottom:"0",w:"8%",h:"55%",цвет:"#0a1520"},
              {left:"14%",bottom:"0",w:"6%",h:"70%",цвет:"#0d1825"},
              {left:"21%",bottom:"0",w:"10%",h:"45%",цвет:"#0a1520"},
              {left:"32%",bottom:"0",w:"7%",h:"80%",цвет:"#0f1e30"},
              {left:"40%",bottom:"0",w:"5%",h:"60%",цвет:"#0a1520"},
              {left:"46%",bottom:"0",w:"9%",h:"50%",цвет:"#0d1825"},
              {left:"56%",bottom:"0",w:"8%",h:"75%",цвет:"#0f1e30"},
              {left:"65%",bottom:"0",w:"6%",h:"55%",цвет:"#0a1520"},
              {left:"72%",bottom:"0",w:"11%",h:"65%",цвет:"#0d1825"},
              {left:"84%",bottom:"0",w:"7%",h:"48%",цвет:"#0a1520"},
              {left:"92%",bottom:"0",w:"8%",h:"72%",цвет:"#0f1e30"},
            ].map((з,i) => (
              <div key={i} className={styles.здание} style={{
                left:з.left, bottom:з.bottom, width:з.w, height:з.h, background:з.цвет
              }}>
                {/* Окна */}
                <div className={styles.окна}/>
                {/* Неон вывеска */}
                {i % 3 === 0 && <div className={styles.неонВывеска}>nazrOS</div>}
              </div>
            ))}

            {/* Улица */}
            <div className={styles.улица}/>

            {/* Игровые зоны */}
            {ЗОНЫ.map(з => (
              <div key={з.имя} className={styles.зона} style={{
                left: `${з.x}%`, top: `${з.y}%`,
                width: `${з.размер}%`, height: `${з.размер * 0.6}%`,
                background: ЦВЕТ_ЗОНЫ[з.тип],
                borderColor: БОРДЕР_ЗОНЫ[з.тип],
              }}>
                <span className={styles.зонаМетка} style={{color: БОРДЕР_ЗОНЫ[з.тип]}}>{з.имя}</span>
              </div>
            ))}

            {/* Объекты на сцене */}
            {ОБЪЕКТЫ.filter(о => о.видимый).map(о => (
              <div key={о.id}
                className={[styles.объектТочка, выделенный === о.id ? styles.объектВыделен : ""].join(" ")}
                style={{left: `${о.x}%`, top: `${о.y}%`}}
                onClick={() => setВыделенный(о.id)}
                title={о.имя}/>
            ))}

            {/* Gizmo выделенного */}
            {активный && (
              <div className={styles.gizmo} style={{left: `${активный.x}%`, top: `${активный.y}%`}}>
                <div className={styles.gizmoX}/>
                <div className={styles.gizmoY}/>
              </div>
            )}
          </div>

          {/* Инфо */}
          <div className={styles.viewportИнфо}>
            <span>fps: 60</span>
            <span>перспектива</span>
            <span>перетаскивай объекты, зажимай ALT для дублирования</span>
          </div>

          {/* Мини-карта */}
          <div className={styles.миниКарта}>
            <div className={styles.миниКартаЗаг}>МИНИ-КАРТА</div>
            <div className={styles.миниКартаОбласть}>
              {ЗОНЫ.map(з => (
                <div key={з.имя} className={styles.миниЗона} style={{
                  left: `${з.x}%`, top: `${з.y}%`,
                  width: `${з.размер * 0.8}%`, height: `${з.размер * 0.5}%`,
                  background: ЦВЕТ_ЗОНЫ[з.тип],
                  borderColor: БОРДЕР_ЗОНЫ[з.тип],
                }}/>
              ))}
              {/* Игрок */}
              <div className={styles.миниИгрок}/>
            </div>
          </div>

          {/* Нав. меш инфо */}
          <div className={styles.навМеш}>
            <div className={styles.строка}><span className={styles.м}>тип навмеша</span><span className={styles.з}>Recast</span></div>
            <div className={styles.строка}><span className={styles.м}>размер ячейки</span><span className={styles.з}>50</span></div>
            <div className={styles.строка}><span className={styles.м}>высота шага</span><span className={styles.з}>45</span></div>
            <div className={styles.строка}><span className={styles.м}>макс. угол подъёма</span><span className={styles.з}>45°</span></div>
            <button className={styles.пересчитатьКнопка}>пересчитать навмеш</button>
          </div>
        </div>

        {/* Нижние вкладки */}
        <div className={styles.нижнееПанель}>
          <div className={styles.нижниеВкладки}>
            {["БРАУЗЕР КОНТЕНТА","ИГРОВЫЕ АССЕТЫ","ЛОГИКА","СЦЕНАРИИ","BLUEPRINTS","ИИ-ПОВЕДЕНИЕ"].map(в => (
              <button key={в}
                className={[styles.вкл, активнаяВкладка === в ? styles.вклАкт : ""].join(" ")}
                onClick={() => setАктивнаяВкладка(в)}>{в}</button>
            ))}
          </div>
          <div className={styles.браузер}>
            <div className={styles.браузерДерево}>
              {["Архитектура","Декорации","Материалы","Освещение","FX","Звуки","NPC","Текстуры"].map(п => (
                <div key={п} className={styles.браузерПапка}>📁 {п}</div>
              ))}
            </div>
            <div className={styles.браузерАссеты}>
              {ОБЪЕКТЫ.slice(0,8).map(о => (
                <div key={о.id} className={styles.ассет} title={о.имя}>
                  <div className={styles.ассетПревью}/>
                  <span className={styles.ассетИмя}>{о.имя}</span>
                </div>
              ))}
            </div>
            <div className={styles.браузерИнфо}>
              <span>элементов: 1428</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Правая — свойства ─── */}
      <aside className={styles.правая}>
        <div className={styles.заг}>СВОЙСТВА ОБЪЕКТА <span className={styles.хелп}>?</span></div>
        {активный ? (
          <>
            <div className={styles.строка}><span className={styles.м}>имя</span><span className={styles.з}>{активный.имя}</span></div>
            <div className={styles.строка}><span className={styles.м}>тип</span><span className={styles.з}>{активный.тип}</span></div>
            <div className={styles.строка}><span className={styles.м}>слой</span><span className={styles.з}>Строения</span></div>

            <div className={styles.раздел}>трансформация</div>
            {[["положение",`X ${активный.x * 12}.00`,`Y 0.00`,`Z -${активный.y * 3}.00`],
              ["поворот","X 0°","Y 90°","Z 0°"],
              ["масштаб","X 1.00","Y 1.00","Z 1.00"]].map(([м,...знач]) => (
              <div key={м} className={styles.трансформСтрока}>
                <span className={styles.м}>{м}</span>
                <span className={styles.тX}>{знач[0]}</span>
                <span className={styles.тY}>{знач[1]}</span>
                <span className={styles.тZ}>{знач[2]}</span>
              </div>
            ))}
            <button className={styles.добавитьКомпКнопка}>+ добавить компонент</button>

            <div className={styles.раздел}>компоненты</div>
            {["Transform","Static Mesh","Materials","Collision","Navigation","HLOD","Audio Reverb","Logic Trigger"].map(к => (
              <div key={к} className={styles.компонент}>
                <span className={styles.чекбокс}>✓</span>
                <span className={styles.компИмя}>{к}</span>
                {к === "Static Mesh" && <span className={styles.компЗнач}>building_modular_23</span>}
                {к === "Materials" && <span className={styles.компЗнач}>3 элемента</span>}
                {к === "Collision" && <span className={styles.компЗнач}>Box</span>}
                {к === "Logic Trigger" && <span className={styles.компЗнач}>building_enter</span>}
              </div>
            ))}
          </>
        ) : (
          <div className={styles.пусто}>Выберите объект в сцене</div>
        )}

        <div className={styles.заг} style={{marginTop:8}}>NPC И СПАВНЫ</div>
        {НПС_СПИСОК.map(н => (
          <div key={н.тип} className={styles.нпс}>
            <span className={styles.нпсТип}>👤 {н.тип}</span>
            <span className={styles.нпсКол}>спавн: {н.количество}</span>
          </div>
        ))}
        <button className={styles.добавитьКнопка}>+ добавить NPC</button>

        <div className={styles.заг} style={{marginTop:8}}>ИГРОВЫЕ ЗОНЫ</div>
        {ЗОНЫ.map(з => (
          <div key={з.имя} className={styles.зонаСтрока}>
            <div className={styles.зонаЦвет} style={{background: БОРДЕР_ЗОНЫ[з.тип]}}/>
            <span className={styles.зонаИмя}>{з.имя}</span>
            <span className={styles.зонаТип}>тип: {з.тип}</span>
          </div>
        ))}
        <button className={styles.добавитьКнопка}>+ создать зону</button>

        <button className={styles.запуститьМир}>▶ ЗАПУСТИТЬ МИР</button>
      </aside>
    </div>
  );
}
