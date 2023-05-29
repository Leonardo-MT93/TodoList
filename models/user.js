const {Schema, model} = require('mongoose')


const userSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatorio'],
    },
    img: {
        type: String,
    },
    google: {
        type: Boolean,
        default: false
    },
});

//Podemos crear metodos y/o modificar los existentes. En este caso eliminamos de pantalla la contraseña y la version al utilizar el .json

userSchema.methods.toJSON = function(){
    const {__v, password, _id, ...user} = this.toObject();
    user.uid = _id;
    return user;
}




module.exports = model('User', userSchema);