import { МодульИд } from "../../store/appStore";
import { МодульРуки }   from "../modules/МодульРуки";
import { МодульТочки }  from "../modules/МодульТочки";
import { МодульСтудия } from "../modules/МодульСтудия";
import { МодульШина }   from "../modules/МодульШина";
import { МодульМульт }  from "../modules/МодульМульт";
import { МодульПоле }   from "../modules/МодульПоле";
import { МодульГлюк }   from "../modules/МодульГлюк";
import styles from "./WorkspaceArea.module.css";

interface Props { модуль: МодульИд; }

const ГОТОВЫЕ: МодульИд[] = ["руки","точки","студия","шина","мульт","поле","глюк"];

export function WorkspaceArea({ модуль }: Props) {
  return (
    <main className={styles.рабочаяОбласть}>
      {модуль === "руки"   && <МодульРуки />}
      {модуль === "точки"  && <МодульТочки />}
      {модуль === "студия" && <МодульСтудия />}
      {модуль === "шина"   && <МодульШина />}
      {модуль === "мульт"  && <МодульМульт />}
      {модуль === "поле"   && <МодульПоле />}
      {модуль === "глюк"   && <МодульГлюк />}
      {!ГОТОВЫЕ.includes(модуль) && <МодульЗаглушка имя={модуль} />}
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
