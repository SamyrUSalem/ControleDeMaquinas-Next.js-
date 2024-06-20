// pages/api/login.js
import { User } from '../../../../../models/index';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConfig from '../../../../../config/db_config.json';
require('dotenv').config();

const JWT_SECRET = dbConfig[process.env.NODE_ENV].JWT_SECRET;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método não Permitido' });
    }

    const { email, password } = req.body;

    console.log('Email recebido:', email);
    console.log('Senha recebida:', password);

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: 'Erro de Credencial' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Erro de Credencial' });
        }

        // Gerar o token JWT
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        console.error('Erro de Login', error);
        res.status(500).json({ message: 'Erro do Servidor Interno' });
    }
}

