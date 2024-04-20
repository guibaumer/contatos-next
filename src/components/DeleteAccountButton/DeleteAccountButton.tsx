'use client'

import { useState } from 'react';
import styles from './styles.module.css';
import { API_URL } from '../../../config/app-config';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function DeleteAccountButton() {
  const [confirm, setConfirm] = useState(false);
  const { username, userId, logout, setId, setName } = useAuth();
  const router = useRouter();

  console.log(username, userId)

  const handleClick = async () => {
    if (!confirm) return setConfirm(true);

    if (!userId) return toast.error('Não foi possível excluir sua conta agora');

    const response = await fetch(`${API_URL}/user/delete`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const {message} = await response.json();
      toast.error(message);
    } else {
      const {message, user} = await response.json();
      logout();
      setName('');
      setId('');
      toast.success(message);
      console.log(response);
      console.log(user);
      router.push('/');
    }

  }

  return (
    <button
      type="button"
      className={styles.delete_button}
      onClick={handleClick}
    >
      {confirm ? <p>CONFIRMAR</p> : <p>DELETAR</p>}
    </button>


  )
}
