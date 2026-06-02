import { useAppStore } from "../../store/appStore";
import styles from "./StatusBar.module.css";

export function StatusBar() {
  const ядро    = useAppStore((s) => s.ядро);
  const модуль  = useAppStore((s) => s.активныйМодуль);

  const автосохр = ядро.автосохранениеМинутНазад !== null
    ? `autosave: ${ядро.автосохранениеМинутНазад}:${String(Math.floor(Math.random()*60)).padStart(2,"0")} назад`
    : "autosave: никогда";

  return (
    <footer className={styles.статусбар}>
      {/* Левая часть — контекст сцены */}
      <div className={styles.группа}>
        <span className={styles.сцена}>сцена: КИБЕР_ПЕРСОНАЖ_01</span>
        <span className={styles.разделитель}>|</span>
        <span className={styles.мета}>полигоны: 24 560 982</span>
        <span className={styles.разделитель}>|</span>
        <span className={styles.мета}>память: 4.72 ГБ</span>
      </div>

      {/* Центр — автосохранение */}
      <div className={styles.центр}>
        <span className={styles.автосохр}>{автосохр}</span>
      </div>

      {/* Правая часть — FPS и модуль */}
      <div className={styles.группа}>
        <span className={styles.мета}>модуль: {модуль.toUpperCase()}</span>
        <span className={styles.разделитель}>|</span>
        <span className={[
          styles.фпс,
          ядро.fps >= 60 ? styles.фпсОК : styles.фпсНизкий
        ].join(" ")}>
          FPS {ядро.fps}
        </span>
      </div>
    </footer>
  );
}
