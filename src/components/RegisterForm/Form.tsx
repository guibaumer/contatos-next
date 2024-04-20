'use client';

import 'react-toastify/dist/ReactToastify.css';
import styles from './styles.module.css';
import { FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
// import { ClipLoader } from 'react-spinners';
import { API_URL } from '../../../config/app-config';
import { useAuth } from '@/contexts/AuthContext';
import validator from 'validator';
import { useRouter } from 'next/navigation';

type FormData = {
    name: string;
    lastname: string;
    email: string;
    password: string;
}

export default function Form() {
    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, setName: setUsername, setId } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        if (name && lastname && email && password) {
            if (validateValues({ name, lastname, email, password })) {
                try {
                    const response = await fetch(`${API_URL}/user`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ name, lastname, email, password }),
                        credentials: 'include',
                    });

                    // let resMessages;
                    if (response.status === 400) {
                      // resMessages = await response.json();
                      const {errors} = await response.json();
                        errors.forEach((error: string) => {
                            toast.error(error);
                        });
                    } else if (response.status === 500) {
                        const {message} = await response.json();

                        toast.error(message);
                    } else {
                        const {message, user} = await response.json();
                        login();
                        setUsername(user.name);
                        setId(user._id);

                        toast.success(message);
                        router.push('/');
                    }

                } catch(err) {
                    console.log(err);
                }
            }
        } else {
            toast.error('Campos não preenchidos.');
        }

        setLoading(false);
    }

    const validateValues = ({ name, lastname, email, password }: FormData): boolean => {
        const errors = [];

        if (name.length < 3) errors.push('Nome deve ser maior ou igual a 3 caracteres.');
        if (lastname.length < 3) errors.push('Sobrenome deve ser maior ou igual a 3 caracteres.');
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
            <h2>Criar conta</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
                <input type="text" placeholder="Seu nome" className={styles.input} value={name} onChange={e => setName(e.target.value)} />
                <input type="text" placeholder="Seu sobrenome" className={styles.input} value={lastname} onChange={e => setLastname(e.target.value)} />
                <input type="email" placeholder="Seu email" className={styles.input} value={email} onChange={e => setEmail(e.target.value)} />
                <input type="password" placeholder="Sua senha" className={styles.input} value={password} onChange={e => setPassword(e.target.value)} />
                <button type="submit" className={`${styles.input} ${styles.submit}`} disabled={loading} >
                    {/* {loading ? <ClipLoader size={25} /> : "ENVIAR"} */}
                    Enviar
                </button>
            </form>
        </>
    );
}
