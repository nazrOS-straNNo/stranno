import { МодульИд } from "../../store/appStore";
import { МодульРуки } from "../modules/МодульРуки";
import { МодульТочки } from "../modules/МодульТочки";
import styles from "./WorkspaceArea.module.css";

interface Props {
  модуль: МодульИд;
}

export function WorkspaceArea({ модуль }: Props) {
  return (
    <main className={styles.рабочаяОбласть}>
      {модуль === "руки"  && <МодульРуки />}
      {модуль === "точки" && <МодульТочки />}
      {модуль !== "руки" && модуль !== "точки" && <МодульЗаглушка имя={модуль} />}
    </main>
  );
}

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
