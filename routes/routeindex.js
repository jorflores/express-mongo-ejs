const express = require('express');
const app = express();
const Task = require('../model/task');
const User = require('../model/user');
const Image = require('../model/image');
const verify = require("../middleware/verifyAccess");
var multer = require('multer');
var fs = require('fs');
var path = require('path');
var jwt = require("jsonwebtoken");


var storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now())
  }
});

var upload = multer({ storage: storage });


app.get('/image-upload', (req, res) => {
  Image.find({}, (err, items) => {
      if (err) {
          console.log(err);
          res.status(500).send('An error occurred', err);
      }
      else {
          res.render('images', { items: items });
      }
  });
});

app.post('/image-upload', upload.single('image'), (req, res, next) => {
 
  //console.log(req)
  var obj = {
      name: req.body.name,
      desc: req.body.desc,
      img: {
          data: fs.readFileSync(path.join('./uploads/' + req.file.filename)),
          contentType: 'image/png'
      }
  }
  Image.create(obj, (err, item) => {
      if (err) {
          console.log(err);
      }
      else {
          // item.save();
          res.redirect('/image-upload');
      }
  });
});


app.get('/login', function(req,res){

  res.render('login')
});


app.post('/login', async function(req,res){

  var email = req.body.email;
  var password = req.body.password;
  
  /*
  var {email,password} = req.body;
  */

  var user = await User.findOne({email:email});

  //si no existe
  if(!user) {
    return res.status(404).send("El usuario no existe");
  }
  // si existe, validar la contraseña
  else {

    var valid = await user.validatePassword(password);

    // si la contraseña es valida. Crear un token
    if (valid) {

      var token = jwt.sign({id:user.email,permission:true},"abcd1234",{expiresIn: "1h"});
      console.log(token);
      res.cookie("token",token,{httpOnly: true})
      res.redirect("/");
    }
    // si no es valida
    else {
      console.log("Password is not valid")
      res.redirect("/login")
    }

  }

 // res.send("ok");

});




  app.get('/register', function(req,res){

    res.render('register')
    });

    app.post('/addUser', async function(req,res){

     var user = new User(req.body);
    user.password = user.encryptPassword(user.password);

     await user.save()

      res.redirect("/login")

      });    


// Nos regresaria las tareas guardadas en la BD con el método find(). Una vez obtenidas las tareas las regresamos a la pagina principal.
app.get('/',verify, async function(req,res){

  console.log("El usuario es: " + req.userId);
  console.log("Permisos? : " + req.permission)

var tasks = await Task.find({user_id: req.userId});
console.log(tasks)
res.render('index',{tasks})
});

// Ruta que nos permita agregar nuevas tareas que vienen desde un metodo post. Una vez enviada la tarea podemos redireccionar a la pagina principal con res.redirect('/')
app.post('/add',verify, async  (req,res) => {
var task = new Task(req.body);
task.user_id = req.userId;

await task.save();
res.redirect('/')
});

// Ruta para editar los datos. Primero necesitamos buscarlos en base a un id que ya me llega desde la ruta. Metodo de busqueda findById(). 
// Los editaremos en una pagina aparte llamada 'edit'
app.get('/edit/:id',   async(req,res) =>{

var id = req.params.id;
var task = await Task.findById(id);
res.render('edit',{task})
})


// Ruta para efectuar la actualizacion de los datos utilizando el metodo update()
app.post('/edit/:id',   async(req,res) =>{

  //req.body
  var id = req.params.id;
  await Task.updateOne({_id: id}, req.body)
  res.redirect('/')
    })

// Esta ruta permita modificar el estatus de una tarea por medio de su propiedad status. 
// Necesitamos buscar el task en la BD por medio de findById, una vez encontrado el registro hay que modificar el status y guardar con save(). 
app.get('/turn/:id', async (req, res) => {

  var id  = req.params.id;
  var task = await Task.findById(id);
  task.status = !task.status;
  await task.save();
  res.redirect('/')
  });

// Ruta que nos permita eliminar tareas con el método "deleteOne"
app.get('/delete/:id',  async (req,res) =>{

  var id = req.params.id;
  await Task.remove({_id: id});
  res.redirect('/')
})


// Ruta que nos permita eliminar tareas con el método "deleteOne"
app.get('/logoff',  async (req,res) =>{

res.clearCookie("token");
res.redirect('/')
})

module.exports = app;