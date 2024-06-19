import { User } from '../../../../../models/index';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método não Permitido' });
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: 'Error de Credencial' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Error de Credencial' });
        }

        // Crie uma sessão ou token aqui se necessário
        res.status(200).json({ message: 'Login realizado com Sucesso!' });
    } catch (error) {
        console.error('Login error', error);
        res.status(500).json({ message: 'Error do Servidor Interno' });
    }
}
