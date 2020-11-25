const mongoose = require('mongoose');
require('dotenv').config({ path: 'vars.env' });

const connectDataBase = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });

        console.log('DataBase On');
    } catch (error) {
        console.log(error);
        process.exit(2);
    }
}

module.exports = connectDataBase;