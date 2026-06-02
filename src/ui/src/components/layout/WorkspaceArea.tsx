import { МодульИд } from "../../store/appStore";
import { МодульРуки } from "../modules/МодульРуки";
import styles from "./WorkspaceArea.module.css";

interface Props {
  модуль: МодульИд;
}

/** Роутер модулей — показывает нужный модуль по активной вкладке */
export function WorkspaceArea({ модуль }: Props) {
  return (
    <main className={styles.рабочаяОбласть}>
      {модуль === "руки"  && <МодульРуки />}
      {модуль !== "руки"  && <МодульЗаглушка имя={модуль} />}
    </main>
  );
}

/** Заглушка для модулей в разработке */
function МодульЗаглушка({ имя }: { имя: string }) {
  return (
    <div className={styles.заглушка}>
      <div className={styles.заглушкаКонтент}>
        <div className={styles.заглушкаИкона}>⬡</div>
        <div className={styles.заглушкаНазвание}>{имя.toUpperCase()}</div>
        <div className={styles.заглушкаСтатус}>модуль в разработке</div>
        <div className={styles.заглушкаВерсия}>nazrOS CORE v0.1</div>
      </div>
    </div>
  );
}
