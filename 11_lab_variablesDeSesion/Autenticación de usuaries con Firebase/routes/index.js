var express = require('express');


// Modulo para realizas validaciones en formularios
const { check, validationResult } = require('express-validator');

// Modulo para conectar con una base de datos MongoDB
const mongojs = require('mongojs')
// Objeto exportado de mongojs para identificar un elemento de una tabla de una BD
var ObjectId = mongojs.ObjectId;

// Conexion con la base de datos: nombre de la BD y de la tabla
const db = mongojs('clientesrouter', ['users']); // base de datos y collection


var router = express.Router();
var session = require('express-session');
const MongoStore = require('connect-mongo');

// Declaracion y definicion de variables globales: en este caso errors
router.use(function (req, res, next) {
	res.locals.errors = null;
	next();
 });

var admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

// Use the session middleware
router.use(session({
  secret: 'clavesecretaparaexpresss',
  saveUninitialized: true, // create session even if there is nothing stored
  resave: true, // save session even if unmodified
  cookie: { maxAge: 60 * 60 * 1000 },
  store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/test-router'})
}));

router.get('/',(req,res) => {
  if(req.session.email) {
    return res.redirect('/admin');
  }
  res.render('index', { title : 'title'});
});

router.post('/sesion',(req,res) => {
  req.session.email = req.body.email;
  res.end('done');
});

router.post('/users/add', [
	//validamos que los campos no están vacíos con el módulo que hemos instalado y cargado
	check("first_name", "El nombre es obligatorio").notEmpty(),
	check("last_name", "El apellido es obligatorio").notEmpty(),
	check("email", "El email es obligatorio").notEmpty()
	],
	function(req, res) {
		const errors = validationResult(req); //obtenemos posibles errores
		if (!errors.isEmpty()) { //en caso de que el array de errores contenga algún error
			res.render('index',  //index nombre del archivo, manda la vista renderizada al cliente
			//pasamos variables locales a la vista en formato JSON
			{	title:'clientes',
				users: users, //esta mal
				errors: errors.array()
			});
		} else {
			var newUser = {
				"first_name" : req.body.first_name,
				"last_name" : req.body.last_name,
				"email" : req.body.email,
			};
			db.users.insertOne(newUser, function(err, resp) {
				if(err) {
					console.log(err);
				} else {
					db.users.insertOne(newUser);
				}
				res.redirect('/');
			});
			console.log(newUser)
		}
	}
);

router.delete('/users/delete/:id', function(req, res) {
	db.users.remove({_id: ObjectId(req.params.id)}, function(err, result) {
		if(err) {
			console.log(err);
		}
		res.redirect(303, '/');
	});
});

router.post('/user/edit/:id', function(req, res) {
	
	db.users.update(
		{_id: ObjectId(req.params.id)},
	 	{$set: {first_name: req.body.first_name,
				last_name: req.body.last_name,
				email : req.body.email
			   }
		},  
		function(err, result) {
			if(err) {
				console.log(err);
			}
			res.redirect(303, '/');
	});
	
});

router.get('/users/getUser/:id', function(req, res) {
	//db.users.findOne({_id:ObjectId("642736c4e08120bee822d931")})
	db.users.findOne({_id: ObjectId(req.params.id)}, function(err, result) {
		if(err) {
    		console.log(err);
    	} else {
    		//console.log(result); // lo que mongodb nos devuelva
    		
    		// mandar los datos en texto plano
    		res.send(result);
			//manda la repsuesta en json
			//res.json(usuario);
    	}
	});
	
});

//enrutamiento: función callback a una petición de la página raiz
router.get("/admin", function(req, res) { // peticion y respuesta como parametros
  if(req.session.email) {
    db.users.find(function(err, docs) { // si la consulta falla-> error tendrá un objeto de error; en caso contrario, docs contendrá el documento encontrado
      if(err) {
        console.log(err);
      } else {
        //console.log(docs); // lo que mongodb nos devuelva
        // para rellenar la plantilla
        res.render('index', { //JSON con tuplas que se pasan como variables
        title2: 'Insertar cliente',
        title: 'clientes',
        users: docs,
        helloemail: req.session.email
        });
      }
    });
  }else {
    res.write('<h1>Please login first.</h1>');
    res.end('<a href='+'/email-password.html'+'>Login</a>');
  }
  
});
/*
router.get('/admin',(req,res) => {
  if(req.session.email) {
    res.write(`<h1>Hello ${req.session.email} </h1><br>`);
    res.end('<a href='+'/?logout'+'>Logout</a>');
  }
  else {
    res.write('<h1>Please login first.</h1>');
    res.end('<a href='+'/'+'>Login</a>');
  }
});*/

router.get('/logout',(req,res) => {
  req.session.destroy((err) => {
    if(err) {
      return console.log(err);
    }
    res.redirect('/email-password.html?logout');
  });

});

router.post('/getToken', (req, res) => {
  const idToken = req.body.idToken; // capturar parámetro

// idToken comes from the client router
// verificamos el idToken para ver si es válido
  admin.auth().verifyIdToken(idToken)
      .then(function (decodedToken) {
// si es válido, lo decodificamos
        let uid = decodedToken.uid;

// y obtenemos los datos asociados a ese usuario
        admin.auth().getUser(uid)
            .then(function(userRecord) {
              // See the UserRecord reference doc for the contents of userRecord.
              console.log('Successfully fetched user data:', userRecord.toJSON());
              req.session.email = userRecord.email;
              req.session.emailVerified = userRecord.emailVerified;
              res.send('{"status": "done"}');
            })
            .catch(function(error) {
              console.log('Error fetching user data:', error);
              res.send('{"status": "error"}');
            });

      }).catch(function (error) {
    // Handle error
    res.render('error', {error: error, message: "You must be signed-up"});
  });


});

module.exports = router;
