import DeleteAccountButton from "@/components/DeleteAccountButton/DeleteAccountButton";
import Header from "@/components/Header/Header";
import styles from './styles.module.css';

export default function AccountConfigs() {
  return (
    <>
    <Header />

    <h2>Configurações da conta</h2>

    <p className={styles.p}>Deletar conta: <DeleteAccountButton /></p>
    </>
  )
}
