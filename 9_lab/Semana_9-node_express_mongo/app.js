var express = require("express");
// Concatenar paths
var path = require("path"); //viene por dejecto en node

// Modulo para realizas validaciones en formularios
const { check, validationResult } = require('express-validator');

// Modulo para conectar con una base de datos MongoDB
const mongojs = require('mongojs')
// Objeto exportado de mongojs para identificar un elemento de una tabla de una BD
var ObjectId = mongojs.ObjectId;

// Conexion con la base de datos: nombre de la BD y de la tabla
const db = mongojs('clientesapp', ['users']); // base de datos y collection

//ejecutamos express y lo guradamos
app = express();

// Middleware que carga ficheros estaticos de un directorio (public en este caso).
// Es decir, podemos cargar los elementos que haya en public/
app.use(express.static(path.join(__dirname, "public")));

// View Engine 
app.set('view engine', 'ejs'); // motor de plantillas
app.set('views', path.join(__dirname, "views")); // carpeta donde guardar las vistas

// Middleware para el parseo de req.body
// coge los datos en crudo y los pasa a json y los deja en un atributo nuevo: request.body
app.use(express.json()); 

// Que parsee datos que lleguen en la query HTTP y los deje como un objeto JSON 
app.use(express.urlencoded({extended: false})); 

// Declaracion y definicion de variables globales: en este caso errors
app.use(function (req, res, next) {
	res.locals.errors = null;
	next();
 });

app.post('/users/add', [
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
				users: users,
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

app.delete('/users/delete/:id', function(req, res) {
	db.users.remove({_id: ObjectId(req.params.id)}, function(err, result) {
		if(err) {
			console.log(err);
		}
		res.redirect(303, '/');
	});
});

app.put('/users/edit/:id', function(req, res) {
	db.users.remove({_id: ObjectId(req.params.id)}, function(err, result) {
		if(err) {
			console.log(err);
		}
		res.redirect(303, '/');
	});
});

//enrutamiento: función callback a una petición de la página raiz
app.get("/", function(req, res) { // peticion y respuesta como parametros
    db.users.find(function(err, docs) {
    	if(err) {
    		console.log(err);
    	} else {
    		console.log(docs); // lo que mongodb nos devuelva
    		// para rellenar la plantilla
    		res.render('index', { //JSON con tuplas que se pasan como variables
			title: 'clientes',
			users: docs
    		});
    	}
    });
    
});
    
app.listen(3000, function(){ // a la escucha en el puerto 3000
	console.log("Servidor lanzado en el puerto 3000");
});