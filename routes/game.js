var path = require('path');
const mongo = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const url = 'mongodb://localhost:27017';

exports.listGames = function(req, res) {    
    mongo.connect(url, function(err, client) {
        if(err) throw err;
        var db = client.db('tictactoe');

        var user_query = { 'username': req.session.user };
        db.collection('user').findOne(user_query, function(err, result) {
            if(err) {
                console.log('Unexpected error occurred when listing games.');
                res.send({ 'status': 'ERROR' });
                client.close();
            }

            if(result != null) {
                res.send({ 
                    'status': 'OK',
                    'games': result.games
                });
                client.close();
            }
            else {
                res.send({ 'status': 'ERROR' });
                client.close();
            }
        });
    });
}

exports.getGame = function(req, res) {
    mongo.connect(url, function(err, client) {
        if(err) throw err;
        var db = client.db('tictactoe');

        var query = { 'games._id': new ObjectID(req.body.id) };
        db.collection('user').findOne(query, function(err, result) {
            if(err) {
                console.log('Unexpected error occurred when retrieving game record.');
                res.send({ 'status': 'ERROR' });
                client.close();
            }

            if(result != null) {
                res.send({
                    'status': 'OK',
                    'grid': result.grid,
                    'winner': result.winner
                });
                client.close();
            }
            else {
                res.send({ 'status': 'ERROR' });
                client.close();
            }
        }); 
    });
}

exports.getScore = function(req, res) {    
    mongo.connect(url, function(err, client) {
        if(err) throw err;
        var db = client.db('tictactoe');

        var query = { 'username': req.session.user };
        db.collection('user').findOne(query, function(err, result) {
            if(err) {
                console.log('Unexpected error occurred when retrieving game records of current user.');
                res.send({ 'status': 'ERROR' });
                client.close();
            }

            if(result != null) {
                var human = 0, wopr = 0, tie = 0;
                for(var i = 0; i < result.games.length; i++) {
                    if(result.games[i].winner == 'X')  human++;
                    else if(result.games[i].winner == 'O')  wopr++;
                    else if(result.games[i].winner == ' ')   tie++;
                }

                res.send({
                    'status': 'OK',
                    'human': human,
                    'wopr': wopr,
                    'tie': tie
                });
                client.close();
            }
            else {
                res.send({ 'status': 'ERROR' });
                client.close();
            }
        });
    })
}

exports.recordGame = function(user, grid, winner) {

}