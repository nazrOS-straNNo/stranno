import { useState } from "react";
import styles from "./СтраницаВхода.module.css";

interface Props {
  onWход: () => void;
}

type Режим = "вход" | "регистрация";

export function СтраницаВхода({ onWход }: Props) {
  const [режим, setРежим] = useState<Режим>("вход");
  const [email, setEmail] = useState("");
  const [пароль, setПароль] = useState("");
  const [имя, setИмя] = useState("");

  const обработатьОтправку = (e: React.FormEvent) => {
    e.preventDefault();
    // Заглушка — позже подключим Supabase/реальный backend
    onWход();
  };

  return (
    <div className={styles.обёртка}>
      {/* Фоновая анимация */}
      <div className={styles.фон}>
        <div className={styles.сфера1}/>
        <div className={styles.сфера2}/>
        <div className={styles.сетка}/>
      </div>

      <div className={styles.карточка}>
        {/* Лого */}
        <div className={styles.лого}>
          <span className={styles.логоИкона}>✕</span>
          <div className={styles.логоТекст}>
            <span className={styles.логоНазвание}>СТРАННО</span>
            <span className={styles.логоПодпись}>nazrOS CORE</span>
          </div>
        </div>

        {/* Переключатель режима */}
        <div className={styles.переключатель}>
          <button
            className={[styles.переклКнопка, режим==="вход"?styles.переклАкт:""].join(" ")}
            onClick={() => setРежим("вход")}>
            вход
          </button>
          <button
            className={[styles.переклКнопка, режим==="регистрация"?styles.переклАкт:""].join(" ")}
            onClick={() => setРежим("регистрация")}>
            регистрация
          </button>
        </div>

        <form onSubmit={обработатьОтправку} className={styles.форма}>
          {режим === "регистрация" && (
            <div className={styles.поле}>
              <label className={styles.метка}>имя пользователя</label>
              <input
                type="text"
                value={имя}
                onChange={e => setИмя(e.target.value)}
                className={styles.ввод}
                placeholder="AJNA"
                required/>
            </div>
          )}

          <div className={styles.поле}>
            <label className={styles.метка}>email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={styles.ввод}
              placeholder="you@nazros.io"
              required/>
          </div>

          <div className={styles.поле}>
            <label className={styles.метка}>пароль</label>
            <input
              type="password"
              value={пароль}
              onChange={e => setПароль(e.target.value)}
              className={styles.ввод}
              placeholder="••••••••"
              required/>
          </div>

          {режим === "вход" && (
            <div className={styles.забылПароль}>
              <a href="#" className={styles.ссылка}>забыли пароль?</a>
            </div>
          )}

          <button type="submit" className={styles.отправитьКнопка}>
            {режим === "вход" ? "войти в СТРАННО" : "создать аккаунт"}
          </button>

          <div className={styles.разделитель}>
            <span>или</span>
          </div>

          <div className={styles.соцКнопки}>
            <button type="button" className={styles.соцКнопка}>
              <span>G</span> Google
            </button>
            <button type="button" className={styles.соцКнопка}>
              <span>GH</span> GitHub
            </button>
          </div>
        </form>

        <div className={styles.подвал}>
          {режим === "вход"
            ? <>Нет аккаунта? <a className={styles.ссылка} onClick={()=>setРежим("регистрация")}>Создать</a></>
            : <>Уже есть аккаунт? <a className={styles.ссылка} onClick={()=>setРежим("вход")}>Войти</a></>
          }
        </div>
      </div>
    </div>
  );
}
