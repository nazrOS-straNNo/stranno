
import { useState } from "react";
import styles from "./МодульСтудия.module.css";

type РежимПросмотра = "камеры" | "свет" | "сетка";

interface Павильон {
  id: string;
  имя: string;
  статус: "активен" | "ожидание";
  превью: string;
}

interface Дубль {
  id: string;
  номер: string;
  начало: string;
  конец: string;
}

interface ДорожкаТаймлайна {
  id: string;
  имя: string;
  цвет: string;
  клипы: { начало: number; конец: number; имя: string }[];
}

const ПАВИЛЬОНЫ: Павильон[] = [
  { id: "p1", имя: "КИБЕР_ЗАЛ",    статус: "активен",  превью: "#0d1520" },
  { id: "p2", имя: "БЕЛЫЙ_ДУБ",    статус: "ожидание", превью: "#1a1a1a" },
  { id: "p3", имя: "НЕОН_УЛИЦА",   статус: "ожидание", превью: "#0a1510" },
  { id: "p4", имя: "КОСМОС_СТАНЦИЯ",статус: "ожидание", превью: "#050510" },
];

const ДУБЛИ: Дубль[] = [
  { id: "d1", номер: "ДУБЛЬ 01", начало: "00:00:00:00", конец: "00:00:08:12" },
  { id: "d2", номер: "ДУБЛЬ 02", начало: "00:00:08:12", конец: "00:00:14:05" },
  { id: "d3", номер: "ДУБЛЬ 03", начало: "00:00:14:05", конец: "00:00:22:17" },
  { id: "d4", номер: "ДУБЛЬ 04", начало: "00:00:22:17", конец: "00:00:31:03" },
  { id: "d5", номер: "ДУБЛЬ 05", начало: "00:00:31:03", конец: "00:00:48:00" },
];

const ДОРОЖКИ: ДорожкаТаймлайна[] = [
  { id: "t1", имя: "ВИДЕО",   цвет: "#1e3a5f",
    клипы: [{ начало: 0, конец: 35, имя: "" }] },
  { id: "t2", имя: "АУДИО",   цвет: "#1a3a1a",
    клипы: [{ начало: 0, конец: 35, имя: "" }] },
  { id: "t3", имя: "ЭФФЕКТЫ", цвет: "#3a1a3a",
    клипы: [{ начало: 3, конец: 12, имя: "ГЛЮК_ШТОРМ" }, { начало: 14, конец: 22, имя: "НЕОН_ИСКРА" }, { начало: 25, конец: 32, имя: "ДЫМ_ПЛАЗМА" }] },
  { id: "t4", имя: "МОНТАЖ",  цвет: "#2a2a1a",
    клипы: [{ начало: 2, конец: 10, имя: "МОНТАЖ_01" }, { начало: 16, конец: 28, имя: "ПЕРЕХОД_ГЛИЧ" }] },
  { id: "t5", имя: "СВЕТ",    цвет: "#1a2a3a",
    клипы: [{ начало: 5, конец: 20, имя: "LIGHT_АНИМАЦИЯ" }] },
  { id: "t6", имя: "КАМЕРЫ",  цвет: "#2a1a1a",
    клипы: [{ начало: 0, конец: 8, имя: "CAM_01" }, { начало: 8, конец: 16, имя: "CAM_02" }, { начало: 16, конец: 25, имя: "CAM_03" }, { начало: 25, конец: 35, имя: "CAM_01" }] },
  { id: "t7", имя: "СЦЕНЫ",   цвет: "#1a3a2a",
    клипы: [{ начало: 0, конец: 9, имя: "СЦЕНА_01" }, { начало: 9, конец: 18, имя: "СЦЕНА_02" }, { начало: 18, конец: 27, имя: "СЦЕНА_03" }, { начало: 27, конец: 35, имя: "СЦЕНА_04" }] },
];

export function МодульСтудия() {
  const [активныйПавильон, setАктивныйПавильон] = useState("p1");
  const [режим] = useState<РежимПросмотра>("камеры");
  const [воспроизведение, setВоспроизведение] = useState(false);
  const [курсор, setКурсор] = useState(12);

  const ВСЕГО_КЛЕТОК = 36;

  return (
    <div className={styles.модуль}>
      {/* ─── Левая панель — павильоны ─── */}
      <aside className={styles.левая}>
        <div className={styles.заг}>ПАВИЛЬОНЫ</div>
        {ПАВИЛЬОНЫ.map(п => (
          <div key={п.id}
            className={[styles.павильон, активныйПавильон === п.id ? styles.активен : ""].join(" ")}
            onClick={() => setАктивныйПавильон(п.id)}>
            <div className={styles.павильонПревью} style={{background: п.превью}}>
              {п.статус === "активен" && <span className={styles.лайвМетка}>LIVE</span>}
            </div>
            <div className={styles.павильонИмя}>{п.имя}</div>
            <div className={[styles.павильонСтатус,
              п.статус === "активен" ? styles.статусАктивен : styles.статусОжидание].join(" ")}>
              {п.статус}
            </div>
          </div>
        ))}
        <button className={styles.добавитьКнопка}>+ создать павильон</button>

        <div className={styles.заг} style={{marginTop:12}}>КАМЕРЫ</div>
        {["CAM_01 главная","CAM_02 боковая","CAM_03 кран_верх","CAM_04 стедикам"].map((к, i) => (
          <div key={i} className={[styles.камера, i === 0 ? styles.камераАктивна : ""].join(" ")}>
            {к}
          </div>
        ))}
        <button className={styles.добавитьКнопка}>+ добавить камеру</button>

        <div className={styles.заг} style={{marginTop:12}}>СВЕТОВЫЕ ПРИБОРЫ</div>
        {[["LIGHT_01","key_light","100%"],["LIGHT_02","fill_light","62%"],["LIGHT_03","rim_light","85%"],["LIGHT_04","neon_back","73%"],["LIGHT_05","practical_01","41%"]].map(([id, тип, инт]) => (
          <div key={id} className={styles.свет}>
            <span className={styles.светИмя}>{id}</span>
            <span className={styles.светТип}>{тип}</span>
            <span className={styles.светИнт}>{инт}</span>
          </div>
        ))}
      </aside>

      {/* ─── Центр ─── */}
      <div className={styles.центр}>
        {/* Viewport павильона */}
        <div className={styles.viewportОбёртка}>
          <div className={styles.viewportТулбар}>
            <span className={styles.павильонНазвание}>ПАВИЛЬОН: <span className={styles.акцент}>КИБЕР_ЗАЛ</span></span>
            <div className={styles.лайвБейдж}>LIVE</div>
            <div style={{flex:1}}/>
            {["камеры","свет","сетка","грид"].map(р => (
              <button key={р} className={styles.режимКнопка}>{р}</button>
            ))}
            <select className={styles.камераСелект}>
              <option>CAM_01</option>
              <option>CAM_02</option>
              <option>CAM_03</option>
            </select>
          </div>

          <div className={styles.viewport}>
            {/* Виртуальный павильон */}
            <div className={styles.сцена}>
              <div className={styles.пол}/>
              <div className={styles.экран}>
                <span className={styles.экранТекст}>nazrOS</span>
                <span className={styles.экранСаб}>CYBEREDEN</span>
              </div>
              <div className={styles.сфера}/>
              <div className={styles.ореол}/>
            </div>

            {/* Параметры камеры */}
            <div className={styles.камПарамы}>
              <span>ФОКУС 35.0мм</span>
              <span>ДИАФРАГМА f/2.8</span>
              <span>ВЫДЕРЖКА 1/50</span>
              <span>ISO 800</span>
              <span>ББ 4200K</span>
              <span>FPS 24</span>
            </div>

            <div className={styles.livePreview}>
              <span className={styles.liveТочка}/>
              live preview
            </div>
          </div>

          {/* Таймлайн */}
          <div className={styles.таймлайнОбёртка}>
            <div className={styles.таймлайнЗаголовок}>
              <span className={styles.проектНазвание}>ТАЙМЛАЙН ПРОЕКТА: <span className={styles.акцент}>КИБЕР_ФИЛЬМ_01</span></span>
              <div style={{flex:1}}/>
              <button className={styles.добавитьКнопка}>добавить трек</button>
            </div>

            <div className={styles.таймлайн}>
              {/* Шкала времени */}
              <div className={styles.шкала}>
                <div className={styles.шкалаМетка} style={{width:80}}>дорожка</div>
                {Array.from({length: ВСЕГО_КЛЕТОК}, (_, i) => (
                  <div key={i} className={styles.шкалаЕдиница}
                    onClick={() => setКурсор(i)}>
                    {i % 4 === 0 && <span>{String(Math.floor(i/4)).padStart(2,"0")}:00</span>}
                  </div>
                ))}
              </div>

              {/* Дорожки */}
              {ДОРОЖКИ.map(д => (
                <div key={д.id} className={styles.дорожка}>
                  <div className={styles.дорожкаИмя}>{д.имя}</div>
                  <div className={styles.дорожкаКлипы}>
                    {д.клипы.map((к, i) => (
                      <div key={i} className={styles.клип}
                        style={{
                          left: `${(к.начало / ВСЕГО_КЛЕТОК) * 100}%`,
                          width: `${((к.конец - к.начало) / ВСЕГО_КЛЕТОК) * 100}%`,
                          background: д.цвет,
                        }}>
                        <span className={styles.клипИмя}>{к.имя}</span>
                      </div>
                    ))}
                    {/* Курсор */}
                    <div className={styles.курсор}
                      style={{left: `${(курсор / ВСЕГО_КЛЕТОК) * 100}%`}}/>
                  </div>
                </div>
              ))}

              {/* Контролы воспроизведения */}
              <div className={styles.контролы}>
                <button className={styles.контрКнопка}>⏮</button>
                <button className={styles.контрКнопка}>⏭</button>
                <button className={styles.контрКнопка} onClick={() => setВоспроизведение(v => !v)}>
                  {воспроизведение ? "⏸" : "▶"}
                </button>
                <button className={styles.контрКнопка}>⏩</button>
                <span className={styles.таймкод}>00:00:{String(курсор).padStart(2,"0")}:00</span>
                <div style={{flex:1}}/>
                <button className={styles.рендерКнопка}>ОТПРАВИТЬ В РЕНДЕР</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Правая панель ─── */}
      <aside className={styles.правая}>
        <div className={styles.заг}>НАСТРОЙКИ КАМЕРЫ</div>
        {[["тип камеры","Virtual Cinema Cam"],["матрица","Full Frame"],["фокусное","35.0 мм"],["диафрагма","f/2.8"],["выдержка","1/50"],["ISO","800"],["ББ","4200 K"],["стабилизация","ВКЛ"]].map(([м,з]) => (
          <div key={м} className={styles.строка}>
            <span className={styles.м}>{м}</span>
            <span className={styles.з}>{з}</span>
          </div>
        ))}

        <div className={styles.заг} style={{marginTop:8}}>ДУБЛИ И СЦЕНЫ</div>
        <div className={styles.дублиВкладки}>
          {["Дубли","Сцены","Маркеры"].map(в => (
            <button key={в} className={styles.дублиВкладка}>{в}</button>
          ))}
        </div>
        {ДУБЛИ.map(д => (
          <div key={д.id} className={styles.дубль}>
            <span className={styles.дублНомер}>{д.номер}</span>
            <span className={styles.дублВремя}>{д.начало}</span>
            <span className={styles.дублВремя}>{д.конец}</span>
          </div>
        ))}
        <button className={styles.добавитьКнопка}>+ создать дубль</button>

        <div className={styles.заг} style={{marginTop:8}}>ЦВЕТОКОРРЕКЦИЯ</div>
        <div className={styles.колёса}>
          {["ТЕНИ","ПОЛУТОНА","СВЕТА","ОБЩИЙ"].map(к => (
            <div key={к} className={styles.колесо}>
              <div className={styles.колесоКруг}/>
              <span className={styles.колесоМетка}>{к}</span>
            </div>
          ))}
        </div>
        {[["насыщенность","1.15"],["контраст","1.20"],["фильмовая кривая","—"]].map(([м,з]) => (
          <div key={м} className={styles.строка}>
            <span className={styles.м}>{м}</span>
            <span className={styles.з} style={{color:"#b87ef7"}}>{з}</span>
          </div>
        ))}
        <button className={styles.рендерКнопкаМал}>применить ко всем сценам</button>

        <div className={styles.заг} style={{marginTop:8}}>ИСТОРИЯ ДЕЙСТВИЙ</div>
        {["12:46:01 добавлен свет LIGHT_05","12:45:48 изменён фокус камеры","12:45:22 изменён цвет сцены","12:45:12 загружен павильон кибер_зал","12:44:28 создан новый дубль 02"].map((д,i) => (
          <div key={i} className={styles.историяСтрока}>{д}</div>
        ))}
      </aside>
    </div>
  );
}
