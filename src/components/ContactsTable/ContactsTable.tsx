import { useEffect, useState } from "react"
import { Contact } from "../../../types/custom-types";
import { API_URL } from "../../../config/app-config";
import { useAuth } from "@/contexts/AuthContext";
import styles from './styles.module.css';
import ClipLoader from 'react-spinners/ClipLoader';
import { FaPencil } from "react-icons/fa6";
import { FaTrashAlt } from "react-icons/fa";
import Link from "next/link";
import { toast } from "react-toastify";

export default function Contacts() {
  const [list, setList] = useState<Contact[] | []>([]);
  const [justDeletedAContact, setJustDeletedAContact] = useState<boolean>(false);
  const { isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setJustDeletedAContact(false);
    setLoading(true);
    getData()
  }, [isLoggedIn, justDeletedAContact]);

  const getData = async () => {
    const response = await fetch(`${API_URL}/contacts/`, { credentials: 'include' });
    const data = await response.json();

    if (!response.ok) {
      setLoading(false);
      return setList([]);
    }

    setLoading(false);
    setList(data);
  }

  const handleDelete = async (contact_id: string) => {
    const response = await fetch(`${API_URL}/contacts/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: contact_id }),
      credentials: 'include',
    });

    const { message } = await response.json();

    if (!response.ok) {
      toast.error(message);
    } else {
      toast.success(message);
      setJustDeletedAContact(true);
    }
  }

  if (loading) return <div className={styles.loading_div}><ClipLoader /></div>

  return (
    <div className={styles.responsive_div}>
      {
        list.length ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Sobrenome</th>
                <th className={styles.th}>Número</th>
              </tr>
            </thead>
            <tbody>
              {
                list.map((contact) => (
                  <tr className={styles.tr} key={contact._id}>
                    <td>{contact.name}</td>
                    <td>{contact.lastname}</td>
                    <td className={styles.num}>{contact.number}</td>

                    <td className={styles.hidden}>
                      <div className={styles.div_actions}>
                        <span className={`${styles.edit} pencil`}>
                          <Link className={styles.edit_a} href={{
                            pathname: '/editContact',
                            query: { id: contact._id },
                          }}>
                            <FaPencil className={styles.svg} />
                          </Link>
                        </span>
                        <span className={`${styles.delete} trash`}
                          onClick={() => handleDelete(contact._id)}>
                          <FaTrashAlt className={styles.svg} />
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        ) : (
          <p className={styles.main_p}>Faça login para criar, ver e editar seus contatos!</p>
        )
      }
    </div>
  )
}
