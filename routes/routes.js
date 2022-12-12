const express = require('express');
const Model = require('../models/userModel');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var fs = require('fs');
var path = require('path');
const check = require("./midleware");

const router = express.Router()

module.exports = router;

var multer = require('multer');

var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, __dirname+'/uploads/')
	},
	filename: (req, file, cb) => {
		cb(null, file.fieldname + '-' + Date.now())
	}
});

var upload = multer({ storage: storage })


router.post("/login", async (req, res, next) => {
    
    let { email, password } = req.body;

    let existingUser;
 
    existingUser = await Model.findOne({ email: email });
    if (!existingUser) {
      return res.status(400).send("email doesn't exist...!");
    }else if(existingUser.etat == false){
      return res.status(401).send("user is disabled...!");
    }
    //check if password is correct
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(400).send("password is invalid");
    }


    let token;
    try {
      //Creating jwt token
      token = jwt.sign(
        { userId: existingUser.id, email: existingUser.email },
          process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
    } catch (err) {
      console.log(err);
      const error = new Error("Erreur! Quelque chose s'est mal passée.");
      return next(error);
    }
   
    res
      .status(200)
      .json({
        success: true,
        data: {
          userId: existingUser.id,
          email: existingUser.email,
          nom: existingUser.nom,
          prenom: existingUser.prenom,
          date_inscri: existingUser.date_inscri,
          roles: existingUser.roles,
          matricule: existingUser.matricule,
          img: existingUser.img,
          token: token,
        },
      });
});


router.post('/test',upload.single('img'), async (req, res) => {
    const { email,password,prenom,nom,date_inscri,roles,etat,matricule } = req.body;
    const users = [];
  
    const newUser = new Model({
		email,
        password, 
        prenom, 
        nom, 
        date_inscri,
        roles,
        etat, 
        matricule,  
		img: {
			data:fs.readFileSync(path.join(__dirname+'/uploads/' + req.file.filename)),
			contentType: 'image/png'
		}
	})

        try {

            const hash = await bcrypt.hash(newUser.password, 10);
            newUser.password = hash;
            users.push(newUser);
            // res.json(newUser);
            await newUser.save();
        
            res.status(201).json(newUser);
        
        } catch(error) {
            res.status(400).json({message: error.message})
        }
	
});

//Post Method
router.post('/post',   async(req, res) => {

const { email, password, prenom, nom, date_inscri, roles, etat, matricule, img } = req.body;

const users = [];

const newUser = Model({
    email,
    password, 
    prenom, 
    nom, 
    date_inscri,
    roles,
    etat, 
    matricule,
    img
});

try {

    const oldUser = await Model.findOne({ email });

    if (oldUser) {
      return res.status(409).send("Email Already Exist. Please Login");
    }

    const hash = await bcrypt.hash(newUser.password, 10);
    newUser.password = hash;
    users.push(newUser);
    // res.json(newUser);
    await newUser.save();

    res.status(201).json(newUser);

} catch(error) {
    res.status(400).json({message: error.message})
}

})

//Get all Method
router.get('/getAll',check, async(req, res) => {
    try{        
        const data = await Model.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Get by ID Method
router.get('/getOne/:id', async(req, res) => {
    const data = await Model.findById(req.params.id);
    res.json(data)
})

//Update by ID Method
router.patch('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };
        
        if (updatedData.password){
            const hash = await bcrypt.hash(updatedData.password, 10);
            updatedData.password = hash;
            
            const result = await Model.findByIdAndUpdate(
            id, updatedData, options
            );
        
            res.send(result);
           
        }
        
        const result = await Model.findByIdAndUpdate(
            id, updatedData, options
        )

        res.send(result)
        
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Delete by ID Method
router.delete('/delete/:id',check, async(req, res) => {
    try {
        const id = req.params.id;
        const data = await Model.findByIdAndDelete(id)
        res.send(`Le Document avec le nom ${data.prenom} ${data.nom} a été supprimé..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

