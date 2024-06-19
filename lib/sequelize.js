import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql',
});

sequelize.authenticate()
    .then(() => {
        console.log('Conexão bem-sucedida com o banco de dados.');
    })
    .catch((error) => {
        console.error('Erro ao conectar-se ao banco de dados:', error);
    });

export { sequelize };
