const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bcrypt = require('bcrypt');

const usuariosSchema = new mongoose.Schema({
    email:{
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
    },
    nombre: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    token: String,
    expira: Date,
    imagen: String
});

//metodo para hashear los passwords
usuariosSchema.pre('save', async function(next) {
    //si el password ya esta hasheado no hacemos nada
    if(!this.isModified('password')) {
        return next(); //deten la ejecucion
    }
    //si no esta hasheado
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
});

//envia alerta cuando un usuario ya esta registrado
usuariosSchema.post('save', function(error, doc, next) {
   if(error.name = 'MongoError' && error.code === 11000) {
        next('Ese correo ya esta registrado');
    } else {
        next(error);
 }
});

//autenticar usuario
usuariosSchema.methods = {
    compararPassword: function(password) {
        return bcrypt.compareSync(password, this.password);
    }
}

module.exports = mongoose.model('Usuarios', usuariosSchema);