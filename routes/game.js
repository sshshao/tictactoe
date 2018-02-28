var path = require('path');
const mongo = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const url = 'mongodb://localhost:27017';

const current_game_update = {
    'current_game': { 
        grid: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], 
        start_date: null
    }
};

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
                console.log('22222222');
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
                console.log('333333333333');
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
                console.log('44444');
                res.send({ 'status': 'ERROR' });
                client.close();
            }
        });
    });
}

/* Internal functions */
exports.getCurrentGame = function(user, callback) {
    mongo.connect(url, function(err, client) {
        if(err) throw err;
        var db = client.db('tictactoe');

        var query = { 'username': user };

        console.log('cookie is~~~' + user);
        db.collection('user').findOne(query, function(err, result) {
            if(err) {
                console.log('Unexpected error occurred when retrieving current game of user.');
                client.close();
                callback(null);
            }

            if(result != null) {
                client.close();
                callback(result.current_game);
            }
            else {
                console.log('~~~~~~');
                client.close();
                callback(null);
            }
        });
    }); 
}


exports.saveCurrentGame = function(user, game, callback) {
    mongo.connect(url, function(err, client) {
        if(err) throw err;
        var db = client.db('tictactoe');

        var query = { 'username': user };
        var user_game_update = {
            'current_game': {
                'start_date': game.start_date,
                'grid': game.grid
            }
        }

        db.collection('user').updateOne(query, { $set: user_game_update }, function(err, result) {
            if(err) {
                console.log('Unexpected error occurred when saving current game of user.');
                client.close();
                callback(false);
            }

            client.close();
            callback(true);
        });
    });
}


exports.saveEndedGame = function(user, game, winner, callback) {
    mongo.connect(url, function(err, client) {
        if(err) throw err;
        var db = client.db('tictactoe');

        var query = { 'username': user };

        db.collection('user').findOne(query, function(err, user_result) {
            if(err) {
                console.log('Unexpected error occurred when saving game of user.');
                client.close();
                calback(false);
            }

            if(user_result != null) {
                var user_game_update = {
                    'games': [{
                        'id': user_result.games.length + 1,
                        'start_date': game.start_date,
                        'grid': game.grid,
                        'winner': winner
                    }]
                }
                db.collection('user').updateOne(query, { $set: current_game_update, $push: user_game_update }, function(err, result) {
                    if(err) {
                        console.log('Unexpected error occurred when saving game of user.');
                        client.close();
                        calback(false);
                    }
        
                    client.close();
                    callback(true);
                });
            }
            else {
                client.close();
                callback(false);
            }
        });
    });
}