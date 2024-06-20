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
        await sequelize.authenticate();
        console.log('Conexão bem-sucedida com o banco de dados.');

        await sequelize.sync();
        for (const user of users) {
            const existingUser = await User.findOne({ where: { email: user.email } });

            if (existingUser) {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                await existingUser.update({ password: hashedPassword });
                console.log(`Usuário ${user.email} atualizado com sucesso.`);
            } else {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                await User.create({
                    email: user.email,
                    password: hashedPassword,
                });
                console.log(`Usuário ${user.email} criado com sucesso.`);
            }
        }

        await checkUsers();
    } catch (error) {
        console.error('Erro ao salvar os usuários:', error);
    } finally {
        await sequelize.close();
        console.log('Conexão com o banco de dados encerrada.');
        process.exit();
    }
};

seedUsers();



const checkUsers = async () => {
    try {
        const savedUsers = await User.findAll();

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
    }
};


