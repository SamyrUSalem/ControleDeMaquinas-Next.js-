require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User } = require('../models/index');

const dbConfig = require('../config/db_config.json');
const { FORCE } = require('sequelize/lib/index-hints');
const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

const users = [
    { email: 'user1@gmail.com', password: 'password1' },
    { email: 'user2@gmail.com', password: 'password2' },
    { email: 'user3@gmail.com', password: 'password3' },
];

const seedUsers = async () => {
    try {
        // Conecta ao banco de dados usando as configurações do JSON
        await sequelize.authenticate();
        console.log('Conexão bem-sucedida com o banco de dados.');

        // Sincroniza o modelo com o banco de dados
        await sequelize.sync(); // Para garantir que o banco de dados está limpo

        for (const user of users) {
            // Verifica se o usuário já existe no banco de dados pelo endereço de e-mail
            const existingUser = await User.findOne({ where: { email: user.email } });

            if (existingUser) {
                // Se o usuário já existir, atualiza a senha dele
                const hashedPassword = await bcrypt.hash(user.password, 10);
                await existingUser.update({ password: hashedPassword });
                console.log(`Usuário ${user.email} atualizado com sucesso.`);
            } else {
                // Se o usuário não existir, cria um novo registro
                const hashedPassword = await bcrypt.hash(user.password, 10);
                await User.create({
                    email: user.email,
                    password: hashedPassword,
                });
                console.log(`Usuário ${user.email} criado com sucesso.`);
            }
        }

        // Chamada para a função checkUsers após criar/atualizar todos os usuários
        await checkUsers();
    } catch (error) {
        console.error('Erro ao salvar os usuários:', error);
    } finally {
        // Fecha a conexão com o banco de dados
        await sequelize.close();
        console.log('Conexão com o banco de dados encerrada.');
        process.exit();
    }
};

seedUsers();



const checkUsers = async () => {
    try {
        // Consulta todos os usuários no banco de dados
        const savedUsers = await User.findAll();

        // Verifica se existem usuários salvos
        if (savedUsers.length > 0) {
            console.log('Usuários salvos no banco de dados:');
            savedUsers.forEach(user => {
                console.log(`Email: ${user.email}`);
                console.log(`Senha: ${user.password}`);
            });
        } else {
            console.log('Nenhum usuário encontrado no banco de dados.');
        }
    } catch (error) {
        console.error('Erro ao verificar os usuários no banco de dados:', error);
    } finally {
        // Não é necessário fechar a conexão aqui, pois ela já foi fechada na função seedUsers
    }
};


