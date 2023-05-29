const mongoose = require('mongoose');

const dbConnection = async()=> {

    try {
       await mongoose.connect(process.env.MONGODB_ATLAS, {
        useNewUrlParser: true,
        useUnifiedTopology: true
       });        

    } catch (error) {
        console.log(error)
        throw new Error('Error a la hora de inicializar el proceso.');
    }

}

module.exports= {
    dbConnection
}