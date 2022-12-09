const mongoose = require('mongoose');


const dataSchema = new mongoose.Schema({
    matricule: {
        required: false,
        type: String
    },
    nom: {
        required: false,
        type: String
    },
    roles: {
        required: false,
        type: String
    },
    prenom: {
        required: false,
        type: String
    },
   
    email: {
        required: false,
        type: String
    },
    
    password:{
        required: false,
        type: String
    },

    etat:{
        required: false,
        type: Boolean
    },

    date_inscri:{
        required: false,
        type: Date
    },

    date_modif:{
        required: false,
        type: Date
    },

    date_archive:{
        required: false,
        type: Date
    },

    img:{
		required: false,
		type: String
	}
})

module.exports = mongoose.model('users', dataSchema);
