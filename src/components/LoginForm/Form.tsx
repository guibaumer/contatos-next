'use client';

import { FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
import styles from './styles.module.css';
import validator from 'validator';
import { API_URL } from '../../../config/app-config';
import { useAuth } from '@/contexts/AuthContext';
import ClipLoader from "react-spinners/ClipLoader";
import { useRouter } from 'next/navigation';

type FormData = {
    email: string;
    password: string;
}

export default function Form() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, setId, setName } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        if (email && password) {
            if (validateValues({ email, password })) {
                try {
                    const response = await fetch(`${API_URL}/user/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email, password }),
                        credentials: 'include',
                    });

                    const {message, user} = await response.json();

                    if (!response.ok) {
                        toast.error(message);
                        setPassword('');
                    } else {
                        login();
                        setName(user.name);
                        setId(user._id);
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

    const validateValues = ({ email, password }: FormData): boolean => {
        const errors = [];

        if (!(validator.isEmail(email))) errors.push('Email inválido.');
        if (password.length < 8) errors.push('Senha precisa ter pelo menos 8 caracteres.');

        if (errors[0]) {
            toast.error(errors[0]);
            return false;
        } else {
            return true;
        }
    }

    return (
        <>
            <h2>Login</h2>

            <form className={styles.form} onSubmit={handleSubmit}>
                <input type="email" autoComplete='username' placeholder="Seu email" className={styles.input} value={email} onChange={e => setEmail(e.target.value)} />
                <input type="password" autoComplete='current-password' placeholder="Sua senha" className={styles.input} value={password} onChange={e => setPassword(e.target.value)} />
                <button type="submit" className={`${styles.input} ${styles.submit}`} disabled={loading} >
                    {loading ? <ClipLoader size={25} /> : "ENVIAR"}
                </button>
            </form>
        </>
    );
}
