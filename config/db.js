const mongoose = require('mongoose');

module.exports = {
    
    // "username": "root",
    // "password": "s0cD4$h1129",
    "host": "localhost",
    "port": "27017",
    "database": "QuestionaireForm",
    
    async connect() {
        var connectionString = `mongodb://${module.exports.host}:${module.exports.port}/${module.exports.database}?authSource=admin`;
        await mongoose.connect(connectionString, { useUnifiedTopology: true, useNewUrlParser: true });
        console.log(`MongoDB connected at ${module.exports.port}!`);
        mongoose.set('useFindAndModify', false);
        mongoose.set('useCreateIndex', true);
    }
    
}