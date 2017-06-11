/**
 * Initiation de Express
 */

let express = require('express')
let app = express()


/**
 * Modules de Securité d'une API (logs, XSS securité etc...)
 */
let cors = require('cors');
let bodyParser = require('body-parser');
let logger = require('morgan');
let helmet = require('helmet');
let passport = require('passport');
app.use(logger('dev'));
app.use(require('cookie-parser')());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('express-session')({ secret: 'hK34B23B4HJ', resave: false, saveUninitialized: false }));
app.use(bodyParser.json());
app.use(cors());
logger('tiny')
app.use(helmet());


/**
 * Module RethinkDb
 */
let r = require('rethinkdb');



// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());




/**
 * Erreur 500 sortie en JSON
 */
app.use(function (error, request, response, next) {
	response.status(error.status || 500);
	response.json({ error: error.message });
});




let connection = r.connect({
	db: "test", //your database
	host: '127.0.0.1',
}).then((connection) => { // une fois qu'il a effectuer une connexion


	// app.get('/', (req, res) => {

	// });


	app.get('/', (req, res) => {
		r.table('users').pluck('name', 'email', 'id').run(connection, (err, cursor) => {
			//	if（err）throw err;

			cursor.toArray((err, result) => {
				res.json(result);
			})
		})
	});

	app.post('/newUser', (req, res) => {
		let user = req.body;
		r.table('users').insert(user).run(connection, (err, cursor) => {
			r.table('users').pluck('name', 'email', 'id').run(connection, (err, cursor) => {
				cursor.toArray((err, result) => {
					res.json(result);
				})
			})
		})
	});

	app.get('/remove/:id', (req, res) => {
		let id = req.params.id;

		r.table('users').get(id).delete().run(connection, (err, cursor) => {
			//	if（err）throw err;

			r.table('users').pluck('id', 'name', 'email').run(connection, (err, cursor) => {
				cursor.toArray((err, result) => {
					res.json(result);
				})
			})
		});

	});

	app.get('/detail/:id', (req, res) => {

		let id = parseInt(req.params.id);

		r.table('users').get(id).run(connection, (err, result) => {
			res.json(result);
		})
	})


});

app.listen(3000, function () {
	console.log('Listened on port 3000!')
})
