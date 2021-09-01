const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const handlebars = require('express-handlebars');
const app = express();
const urlencode = bodyParser.urlencoded(extended= false);
const sql = mysql.createPool({
    user: "bed7924d635930",
    password: "ede49731",
    host: "us-cdbr-east-04.cleardb.com",
    database: "heroku_eae7a9fff149014"
})
let port=process.env.PORT || 300;
app.use('/img', express.static('img'))
app.use('/js', express.static('js'))
app.use('/css', express.static('css'))


// Template engine
app.engine("handlebars", handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Routes and Templates
app.get('/', function(req, res) {
    /*res.send('Essa é minha página inicial')*/
    /*res.sendFile(__dirname + "/index.html");*/
    //console.log(req.params.id);
    res.render('index');
});
app.get("/inserir", function(req,res) {
    res.render('inserir');
});
app.get("/select/:id?", function(req,res) {
    if(!req.params.id){
        sql.getConnection(function(err, connection){
            connection.query("select * from user order by id asc", function(err, results, fields){
                res.render('select', {data:results});
            });
        });
    }else {
        sql.getConnection(function(err, connection){
            sql.query("select * from user where id=? order by id asc", [req.params.id], function(err, results, fields){
                res.render('select', {data:results});
            });
        }); 
    }
});
app.post("/controllerForm", urlencode, function(req, res) {
    sql.getConnection(function(err, connection){
        connection.query('insert into user values (?, ?, ?)', [req.body.id, req.body.name, req.body.age]);
        res.render('controllerForm', {name: req.body.name});
    });
});
app.get('/deletar/:id', function(req, res){
    sql.getConnection(function(err, connection){
        connection.query("delete from user where id=?", [req.params.id]);
        res.render('deletar');    
    });
});
app.get("/update/:id", function(req,res) {
    sql.getConnection(function(err, connection){
        connection.query('select * from user where id=?', [req.params.id], function(err, results, fields) { 
        res.render('update', {id: req.params.id, name: results[0].name, age: results[0].age});
        });
    });
});
app.post("/controllerUpdate", urlencode, function(req, res) {
    sql.getConnection(function(err, connection){
        connection.query('update user set name=?, age=? where id=?', [req.body.name, req.body.age, req.body.id]);
        res.render('controllerUpdate');
    });
});


// Start server
app.listen(port, function(req, res) {
    //console.log('Servidor está rodando');
});;