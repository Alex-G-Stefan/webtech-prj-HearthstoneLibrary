var express = require('express');
var bodyParser = require("body-parser");
var cors = require('cors');

var app = express();
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(cors());

var data = [{
    id: 1
}, {
    id: 2
}, {
    id: 3
}];

var nodeadmin = require("nodeadmin");
app.use(nodeadmin(app));


var Sequelize = require("sequelize");

//Sequelize connection initialization
var sequelize = new Sequelize('projectDatabase', 'alexstefan', null, {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    logging: false
});

//Definition of entity Users
var User = sequelize.define('users', {
    user_name: {
        type: Sequelize.STRING,
        field: 'user_name'
    },
    user_password: {
        type: Sequelize.STRING,
        field: 'user_password'
    },
    status: {
        type: Sequelize.STRING,
        field: 'status'
    }
}, {
    timestamps: false
});

var Rank = sequelize.define('ranks', {
    c_rank: {
        type: Sequelize.STRING,
        field: 'c_rank'
    }
}, {
    timestamps: false
});
User.hasOne(Rank, {
    foreignKey: 'userID'
});
Rank.belongsTo(User, {
    foreignKey: 'userID'
});

//Create operation in database
app.post('/users', function(request, response) {
    User.create(request.body).then(function(article) {
        response.status(201).send(article);
    });
});

//READ ALL operation in databse
app.get('/users', function(request, response) {
    User.findAll().then(function(articles) {
        response.status(200).send(articles);
    });
});
app.get('/users/:id', (req, res) => {
    User
        .find({
            attributes: ['id', 'user_name'],
            where: {
                user_name: 'Alex'
            }
        })
        .then((author) => {
            res.status(200).send(author)
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send('error')
        })
})


app.get('/users/:id', (req, res) => {
    User
        .find({
            attributes: ['id', 'user_name', 'user_password'],
            where: {
                id: req.params.id
            }
        })
        .then((author) => {
            res.status(200).send(author)
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send('error')
        })
})


//READ one operation in database
/*app.get('/users/:user_name',function(request, response) {
    User.findById(request.params.user_name).then(function(article){
        if(article)
        {
            response.status(200).send(article);
        } else {
            response.status(404).send();
        }
    });
});*/

//UPDATE operation for database
app.put('/users/:id', function(request, response) {
    User.findById(request.params.id).then(function(article) {
        if (article) {
            article.updateAttributes(request.body).then(function() {
                    response.status(200).send('updated');
                })
                .catch(function(error) {
                    console.warn(error);
                    response.status(500).send('server error');
                });
        }
        else {
            response.status(404).send();
        }
    });
});

//DELETE operation for database
app.delete('/users/:id', function(request, response) {
    User.findById(request.params.id).then(function(article) {
        if (article) {
            article.destroy().then(function() {
                    response.status(204).send('updated');
                })
                .catch(function(error) {
                    console.warn(error);
                    response.status(500).send('server error');
                });
        }
        else {
            response.status(404).send();
        }
    });
});

//sequelize.sync();

app.get('/users/:id/ranks', (req, res) => {
    User.find({
            where: {
                id: req.params.id
            },
            include: [Rank]
        })
        .then((user) => {
            return user.getRank();
        })
        .then((rank) => {
            res.status(200).send(rank)
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send('error')
        })
});

app.post('/users/:id/ranks', (req, res) => {
    User.find({
            where: {
                id: req.params.id
            }
        })
        .then((user) => {
            return Rank.create({
                'c_rank': req.body.c_rank,
                'userID': user.id
            })
        })
        .then(() => {
            res.status(201).send('created')
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send('error')
        })
});

app.put('/users/:id/ranks/:userID', (req, res) => {
    Rank.find({
            where: {
                userID: req.params.userID
            }
        })
        .then((rank) => {
            rank.c_rank = req.body.c_rank
            return rank.save(['c_rank']);
        })
        .then(() => {
            res.status(201).send('updated')
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send('error')
        })
});

app.delete('/users/:id/ranks/:rId', (req, res) => {
    Rank.find({
            where: {
                userID: req.params.id
            }
        })
        .then((rank) => {
            return rank.destroy(['id', 'c_rank', 'userID']);
        })
        .then(() => {
            res.status(201).send('deleted')
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send('error')
        })
});

app.get('/users/:id/ranks/:rId', (req, res) => {
    Rank.find({
            where: {
                id: req.params.rId
            }
        })
        .then((rank) => {
            res.status(200).send(rank)
        })
        .catch((error) => {
            console.warn(error)
            res.status(500).send('error')
        })
});


app.listen(8080);
