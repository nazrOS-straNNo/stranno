import { useState } from "react";
import styles from "./МодульБиблиотека.module.css";

type РежимВида = "сетка" | "список";

interface Ассет {
  id: string;
  имя: string;
  тип: string;
  размер: string;
  дата: string;
  теги: string[];
  избранный: boolean;
}

const АССЕТЫ: Ассет[] = [
  { id:"a1",  имя:"кибер_персонаж_v3",    тип:"персонаж",   размер:"245 МБ", дата:"2026-06-01", теги:["персонаж","кибер","риг"], избранный:true  },
  { id:"a2",  имя:"город_модуль_01",       тип:"архитектура",размер:"128 МБ", дата:"2026-05-28", теги:["город","модуль"],         избранный:false },
  { id:"a3",  имя:"неон_вывеска_set",      тип:"декорации",  размер:"12 МБ",  дата:"2026-05-27", теги:["неон","вывеска"],         избранный:true  },
  { id:"a4",  имя:"кибер_материал_металл", тип:"материал",   размер:"8 МБ",   дата:"2026-05-26", теги:["материал","металл"],      избранный:false },
  { id:"a5",  имя:"взрыв_частицы_v2",      тип:"эффект",     размер:"34 МБ",  дата:"2026-05-25", теги:["эффект","частицы"],       избранный:true  },
  { id:"a6",  имя:"дрон_анимация",         тип:"анимация",   размер:"67 МБ",  дата:"2026-05-24", теги:["дрон","анимация"],        избранный:false },
  { id:"a7",  имя:"звук_атмосфера_ночь",   тип:"аудио",      размер:"22 МБ",  дата:"2026-05-23", теги:["звук","атмосфера"],       избранный:false },
  { id:"a8",  имя:"голограмма_шейдер",     тип:"шейдер",     размер:"3 МБ",   дата:"2026-05-22", теги:["шейдер","голограмма"],    избранный:true  },
  { id:"a9",  имя:"улица_ночная_сцена",    тип:"сцена",      размер:"512 МБ", дата:"2026-05-21", теги:["сцена","улица","ночь"],   избранный:false },
  { id:"a10", имя:"риг_лицо_advanced",     тип:"риг",        размер:"18 МБ",  дата:"2026-05-20", теги:["риг","лицо"],             избранный:false },
  { id:"a11", имя:"карбон_текстура_4k",    тип:"текстура",   размер:"45 МБ",  дата:"2026-05-19", теги:["текстура","карбон"],      избранный:false },
  { id:"a12", имя:"дождь_симуляция",       тип:"симуляция",  размер:"89 МБ",  дата:"2026-05-18", теги:["дождь","симуляция"],      избранный:false },
];

const КАТЕГОРИИ = [
  { имя:"Все ассеты",    иконка:"⊞", количество:247 },
  { имя:"Персонажи",     иконка:"👤", количество:34  },
  { имя:"Архитектура",   иконка:"🏢", количество:89  },
  { имя:"Декорации",     иконка:"✨", количество:156 },
  { имя:"Материалы",     иконка:"🎨", количество:312 },
  { имя:"Текстуры",      иконка:"🖼", количество:428 },
  { имя:"Эффекты",       иконка:"💥", количество:67  },
  { имя:"Анимации",      иконка:"🎬", количество:89  },
  { имя:"Аудио",         иконка:"🔊", количество:143 },
  { имя:"Шейдеры",       иконка:"⚡", количество:54  },
  { имя:"Сцены",         иконка:"🌍", количество:23  },
  { имя:"Риги",          иконка:"🦴", количество:18  },
  { имя:"Симуляции",     иконка:"🌊", количество:31  },
  { имя:"Избранное",     иконка:"⭐", количество:12  },
];

const ЦВЕТ_ТИПА: Record<string,string> = {
  персонаж:"#7c3aed", архитектура:"#3b82f6", декорации:"#10b981",
  материал:"#f59e0b", текстура:"#ec4899", эффект:"#ef4444",
  анимация:"#14b8a6", аудио:"#8b5cf6", шейдер:"#22d3ee",
  сцена:"#6366f1", риг:"#f97316", симуляция:"#0ea5e9",
};

export function МодульБиблиотека() {
  const [активнаяКат, setАктивнаяКат] = useState("Все ассеты");
  const [выделенный, setВыделенный] = useState<string|null>("a1");
  const [режим, setРежим] = useState<РежимВида>("сетка");
  const [поиск, setПоиск] = useState("");
  const [ассеты, setАссеты] = useState<Ассет[]>(АССЕТЫ);

  const переключитьИзбранное = (id: string) => {
    setАссеты(prev => prev.map(а => а.id === id ? {...а, избранный: !а.избранный} : а));
  };

  const отфильтрованные = ассеты.filter(а =>
    (поиск === "" || а.имя.toLowerCase().includes(поиск.toLowerCase()) ||
     а.теги.some(т => т.includes(поиск.toLowerCase()))) &&
    (активнаяКат === "Все ассеты" || (активнаяКат === "Избранное" && а.избранный) ||
     а.тип === активнаяКат.toLowerCase().slice(0,-1))
  );

  const активный = ассеты.find(а => а.id === выделенный);

  return (
    <div className={styles.модуль}>
      <aside className={styles.левая}>
        <div className={styles.заг}>БИБЛИОТЕКА</div>
        <input
          placeholder="поиск ассетов..."
          value={поиск}
          onChange={e => setПоиск(e.target.value)}
          className={styles.поиск}/>

        <div className={styles.заг} style={{marginTop:8}}>КАТЕГОРИИ</div>
        {КАТЕГОРИИ.map(к => (
          <div key={к.имя}
            className={[styles.категория, активнаяКат===к.имя?styles.катАкт:""].join(" ")}
            onClick={() => setАктивнаяКат(к.имя)}>
            <span className={styles.катИкона}>{к.иконка}</span>
            <span className={styles.катИмя}>{к.имя}</span>
            <span className={styles.катКол}>{к.количество}</span>
          </div>
        ))}

        <div className={styles.заг} style={{marginTop:8}}>ОБЛАЧНОЕ ХРАНИЛИЩЕ</div>
        <div className={styles.хранилище}>
          <div className={styles.хранилищеПолоса}>
            <div className={styles.хранилищеЗаполнение} style={{width:"67%"}}/>
          </div>
          <div className={styles.хранилищеИнфо}>
            <span>6.7 ТБ</span>
            <span>из 10 ТБ</span>
          </div>
        </div>
        <button className={styles.загрузитьКнопка}>↑ загрузить ассеты</button>
      </aside>

      <div className={styles.центр}>
        <div className={styles.тулбар}>
          <span className={styles.акцент}>{активнаяКат.toUpperCase()}</span>
          <span className={styles.количество}>{отфильтрованные.length} ассетов</span>
          <div style={{flex:1}}/>
          <div className={styles.режимКнопки}>
            <button
              className={[styles.режимКнопка, режим==="сетка"?styles.режимАкт:""].join(" ")}
              onClick={() => setРежим("сетка")}>⊞</button>
            <button
              className={[styles.режимКнопка, режим==="список"?styles.режимАкт:""].join(" ")}
              onClick={() => setРежим("список")}>☰</button>
          </div>
          <select className={styles.сортировка}>
            <option>по дате</option>
            <option>по имени</option>
            <option>по размеру</option>
            <option>по типу</option>
          </select>
        </div>

        <div className={режим === "сетка" ? styles.сетка : styles.список}>
          {отфильтрованные.map(а => (
            режим === "сетка" ? (
              <div key={а.id}
                className={[styles.ассетКарточка, выделенный===а.id?styles.ассетАкт:""].join(" ")}
                onClick={() => setВыделенный(а.id)}>
                <div className={styles.ассетПревью}
                  style={{borderTop:`3px solid ${ЦВЕТ_ТИПА[а.тип]||"#7c3aed"}`}}>
                  <div className={styles.ассетИкона} style={{color:ЦВЕТ_ТИПА[а.тип]||"#7c3aed"}}>
                    {а.тип==="персонаж"?"👤":а.тип==="архитектура"?"🏢":
                     а.тип==="эффект"?"💥":а.тип==="аудио"?"🔊":"📦"}
                  </div>
                </div>
                <div className={styles.ассетИнфо}>
                  <span className={styles.ассетИмя}>{а.имя}</span>
                  <span className={styles.ассетМета}>{а.тип} · {а.размер}</span>
                </div>
                <button
                  className={[styles.избранноеКнопка, а.избранный?styles.избрАкт:""].join(" ")}
                  onClick={e=>{e.stopPropagation();переключитьИзбранное(а.id)}}>
                  {а.избранный?"⭐":"☆"}
                </button>
              </div>
            ) : (
              <div key={а.id}
                className={[styles.ассетСтрока, выделенный===а.id?styles.ассетСтрокаАкт:""].join(" ")}
                onClick={() => setВыделенный(а.id)}>
                <div className={styles.ассетСтрокаЦвет}
                  style={{background:ЦВЕТ_ТИПА[а.тип]||"#7c3aed"}}/>
                <span className={styles.ассетСтрокаИмя}>{а.имя}</span>
                <span className={styles.ассетСтрокаТип}>{а.тип}</span>
                <span className={styles.ассетСтрокаРазмер}>{а.размер}</span>
                <span className={styles.ассетСтрокаДата}>{а.дата}</span>
                <button
                  className={[styles.избранноеКнопка, а.избранный?styles.избрАкт:""].join(" ")}
                  onClick={e=>{e.stopPropagation();переключитьИзбранное(а.id)}}>
                  {а.избранный?"⭐":"☆"}
                </button>
              </div>
            )
          ))}
        </div>

        <div className={styles.строкаСостояния}>
          <span>выбрано: {выделенный?1:0}</span>
          <span>всего: {отфильтрованные.length}</span>
          <span>хранилище: 6.7 / 10 ТБ</span>
          <div style={{flex:1}}/>
          <button className={styles.импортКнопка}>↑ импорт</button>
          <button className={styles.экспортКнопка}>↓ экспорт</button>
        </div>
      </div>

      <aside className={styles.правая}>
        {активный ? (
          <>
            <div className={styles.заг}>ДЕТАЛИ АССЕТА</div>
            <div className={styles.детальПревью}
              style={{borderTop:`3px solid ${ЦВЕТ_ТИПА[активный.тип]||"#7c3aed"}`}}>
              <div className={styles.детальИкона} style={{color:ЦВЕТ_ТИПА[активный.тип]||"#7c3aed"}}>
                {активный.тип==="персонаж"?"👤":активный.тип==="архитектура"?"🏢":
                 активный.тип==="эффект"?"💥":активный.тип==="аудио"?"🔊":"📦"}
              </div>
            </div>

            <div className={styles.детальИмя}>{активный.имя}</div>

            {[["тип",активный.тип],["размер",активный.размер],["дата",активный.дата]].map(([м,з])=>(
              <div key={м} className={styles.строка}>
                <span className={styles.м}>{м}</span>
                <span className={styles.з}>{з}</span>
              </div>
            ))}

            <div className={styles.заг} style={{marginTop:8}}>ТЕГИ</div>
            <div className={styles.теги}>
              {активный.теги.map(т=>(
                <span key={т} className={styles.тег}>{т}</span>
              ))}
            </div>

            <div className={styles.заг} style={{marginTop:8}}>ДЕЙСТВИЯ</div>
            <button className={styles.действиеКнопка}>📥 добавить в сцену</button>
            <button className={styles.действиеКнопка}>📋 дублировать</button>
            <button className={styles.действиеКнопка}>✏️ редактировать</button>
            <button className={styles.действиеКнопка}>🔗 поделиться</button>
            <button className={styles.действиеКнопка}>↓ скачать</button>
            <button className={[styles.действиеКнопка,styles.удалитьКнопка].join(" ")}>🗑 удалить</button>

            <div className={styles.заг} style={{marginTop:8}}>ВЕРСИИ</div>
            {["v3 (текущая)","v2","v1"].map(в=>(
              <div key={в} className={styles.версия}>{в}</div>
            ))}
          </>
        ) : (
          <div className={styles.пусто}>Выберите ассет</div>
        )}
      </aside>
    </div>
  );
}