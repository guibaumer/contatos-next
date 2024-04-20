'use client';

import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styles from './styles.module.css';
import { API_URL } from '../../../config/app-config';
import ClipLoader from "react-spinners/ClipLoader";
import { useRouter, useSearchParams } from 'next/navigation';

type FormData = {
  name: string;
  lastname: string;
  number: string;
}

export default function Form() {
  const params = useSearchParams();
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [number, setNumber] = useState('');
  const [contactId, setContactId] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEdition, setIsEdition] = useState(false);
  const router = useRouter();
  const regex = /[^0-9\s]/;

  useEffect(() => {
    const id = params.get('id');

    if (id) {
      handleEdition(id);
      setIsEdition(true);
    }
  }, []);

  const handleEdition = async (id: string) => {
    const response = await fetch(`${API_URL}/contacts/find`, {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    const { message, contact } = await response.json();

          if (!response.ok) {
            toast.error(message);
          } else {
            setName(contact.name);
            setLastname(contact.lastname);
            setNumber(contact.number);
            setContactId(contact._id)
          }

  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (isEdition && !contactId) return toast.error('Erro ao editar este contato');

    if (name && lastname && number) {
      if (validateValues({ name, lastname, number })) {
        try {
          let response;
          if (!isEdition) {
            response = await fetch(`${API_URL}/contacts`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ name, lastname, number }),
              credentials: 'include',
            });
          } else {
            console.log(contactId);
            response = await fetch(`${API_URL}/contacts`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ name, lastname, number, contactId }),
              credentials: 'include',
            });
          }

          const { message } = await response.json();

          if (!response.ok) {
            toast.error(message);
          } else {
            toast.success(message);
            router.push('/');
          }

        } catch (err) {
          toast.error('Erro ao processar a requisição.');
          console.log(err);
        }
      }
    } else {
      toast.error('Campos não preenchidos.');
    }

    setLoading(false);
  }

  const validateValues = ({ name, lastname, number }: FormData): boolean => {
    const errors = [];

    if (name.length < 3) errors.push('Nome precisa ter pelo menos 8 caracteres');
    if (lastname.length < 3) errors.push('Sobrenome precisa ter pelo menos 8 caracteres');
    if (regex.test(number)) errors.push('Letras não são permitidas no número');

    const rightFormat = checkTelephone(number);
    // console.log(formatedTel)
    if (!rightFormat) {
      errors.push('Formato de telefone incorreto');
    }

    if (errors[0]) {
      toast.error(errors[0]);
      return false;
    }

    return true;
  }

  const checkTelephone = (tel: string) => {
    tel = tel.replace(/\s+/g, "");

    console.log(tel.length);

    if (tel.length === 10 || tel.length === 11) {
      return true
    }

    return false;
    // let res;
    // if (tel.length === 12) {
    //   if (numberRegex.test(tel)) {
    //     res = tel.replace(/(\d{2})(\d{5})-(\d{4})/, "($1) $2-$3");
    //   } else {
    //     return false;
    //   }
    // } else if (tel.length === 11) {
    //   res = tel.replace(/(\d{2})(\d{4})-(\d{4})/, "($1) 9$2-$3");
    // } else {
    //   return false;
    // }
    // return res;
  }

  return (
    <>
      <h2>Criar contato</h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input type="text" placeholder="Nome" className={styles.input} value={name} onChange={e => setName(e.target.value)} />
        <input type="text" placeholder="Sobrenome" className={styles.input} value={lastname} onChange={e => setLastname(e.target.value)} />
        <input type="tel" placeholder="Ex: 47 9999-9999" className={styles.input} value={number} onChange={e => setNumber(e.target.value)} />
        <button type="submit" className={`${styles.input} ${styles.submit}`} disabled={loading} >
          {loading ? <ClipLoader size={25} /> : "ENVIAR"}
        </button>
      </form>
    </>
  );
}
