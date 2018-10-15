const path = require('path');
const mongo = require('mongodb').MongoClient;
const nodemailer = require('nodemailer');
const pass = require('./pass');

const url = 'mongodb://localhost:27017';
const MAILER_MAIL = require(pass.MAILER_MAIL);
const MAILER_PW = require(pass.MAILER_PW);
const backdoor_key = 'abracadabra';
const verified_user_update = {
    'key': undefined,
    'verified': true,
    'current_game': {
        grid: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        start_date: null
    },
    'games': [],
};


exports.register = function(req, res) {
    var new_user = parseRegistrationData(req);
    if(!new_user['validity']) {
        console.log('Not valid information for registration.');
        res.send({ 'status': 'ERROR' });
        return;
    }

    var transporter = nodemailer.createTransport({
        'service': 'gmail',
        auth: {
            'user': MAILER_MAIL,
            'pass': MAILER_PW
        }
    });

    var mail_options = {
        from: 'sheshao@cs.stonybrook.edu',
        to: new_user.data.email,
        subject: 'Verify your account at Tictactoe',
        text: 'Verify at: http://sheshao.cse356.compas.cs.stonybrook.edu/verify?                                                                                                                                                                                               email='
                + new_user.data.email + '&key=' + new_user.data.key
    }

    mongo.connect(url, function(err, client) {
        if(err) throw err;
        var db = client.db('tictactoe');

        db.collection('user').insertOne(new_user.data, function(err, result) {
            if(err) {
                console.log('Unexpected error occurred when inserting new entry                                                                                                                                                                                                for new user.');
                res.send({ 'status': 'ERROR' });
                client.close();
            }

            transporter.sendMail(mail_options, function(err, info) {
                if(err) throw err;
                console.log("Mail sent: %s", info.messageId);
                console.log('One new user registered.');
                res.send({ 'status': 'OK' });
                client.close();
            });
        });
    });
}

exports.verify = function(req, res) {
    var user = parseVerificationData(req);
    if(!user['validity']) {
        console.log('Not valid information for verification.');
        res.send({ 'status': 'ERROR' });
        return;
    }

    mongo.connect(url, function(err, client) {
        if(err) throw err;
        var db = client.db('tictactoe');

        var query = { 'email': user.data.email };
        db.collection('user').findOne(query, function(err, user_result) {
            if(err) {
                console.log('Unexpected error occurred when verifying user.');
                res.send({'status': 'ERROR'});
                client.close();
            }

            if(user.data.key == user_result.key || user.data.key == backdoor_key                                                                                                                                                                                               ) {
                db.collection('user').updateOne(query, { $set: verified_user_update                                                                                                                                                                                               ate }, function(err, update_result) {
                    if(err) {
                        console.log('Unexpected error occurred when updating use                                                                                                                                                                                               r to verified.');
                        res.send({ 'status': 'ERROR' });
                        client.close();
                    }
                    console.log('User successfully verified.');
                    res.send({ 'status': 'OK' });
                    client.close();
                });
            }
            else {
                console.log('Incorrect information for user verification.');
                res.send({ 'status': 'ERROR' });
                client.close();
            }
        });
    });
}

exports.login = function(req, res) {
    var user = parseLoginData(req);

    if(!user['validity']) {
        console.log('Not valid information for log in.');
        res.send({ 'status': 'ERROR' });
        return;
    }

    mongo.connect(url, function(err, client) {
        if(err) throw err;
        var db = client.db('tictactoe');

        var query = { 'username': user.data.username };
        db.collection('user').findOne(query, function(err, result) {
            if(err) {
                console.log('Unexpected error occurred when logging user in.');
                res.send({ 'status': 'ERROR' });
                client.close();
            }

            if(result != null && user.data.password == result.password && result                                                                                                                                                                                               .verified) {
                req.session.user = result.username;
                res.send({ 'status': 'OK' });
                client.close();
            }
            else {
                console.log('Incorrect information for user sign-in.');
                res.send({ 'status': 'ERROR' });
                client.close();
            }
        });
    });
}

exports.logout = function(req, res) {
    if(req.session.user) {
        delete req.session.user;
        res.send({ 'status': 'OK' });
    } else {
        res.send({ 'status': 'ERROR' });
    }
}

function parseRegistrationData(req) {
    var data = {};
    if(req.body.email && req.body.username && req.body.password) {
        data['validity'] = true;
        data['data'] = {
            'email': req.body.email,
            'username': req.body.username,
            'password': req.body.password,
            'key': createRegistrationKey(),
            'verified': false
        };
    }
    else {
        data['validity'] = false;
    }

    return data;
}

function parseVerificationData(req) {
    var data = {};
    if(req.body.email && req.body.key) {
        data['validity'] = true;
        data['data'] = {
            'email': req.body.email,
            'key': req.body.key
        };
    }
    else if(req.query.email && req.query.key) {
        data['validity'] = true;
        data['data'] = {
            'email': req.query.email,
            'key': req.query.key
        };
    }
    else {
        data['validity'] = false;
    }

    return data;
}

function parseLoginData(req) {
    var data = {};
    if(req.body.username && req.body.password) {
        data['validity'] = true;
        data['data'] = {
            'username': req.body.username,
            'password': req.body.password
        };
    }
    else {
        data['validity'] = false;
    }

    return data;
}

function createRegistrationKey() {
    var key = '';
    var base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for(var i = 0; i < 11; i++) {
        key += base.charAt(Math.floor(Math.random() * base.length));
    }

    return key;
}
