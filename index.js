// implement your API here
// import express from 'express'; // ES2015 module syntax
const express = require('express'); // CommonJS modules

const Users = require('./data/db.js'); // our users database library

const server = express();

// middleware: teaches express new things
server.use(express.json()); // needed to parse JSON

// routes or endpoints

// GET to "/"
server.get('/', function (request, response) {
    response.send({ hello: 'Web 25!' });
});

// see a list of users
server.get('/api/users', (req, res) => {
    // read the data from the database
    Users.find() // return a promise
        .then(users => {
            console.log('Users', users);
            res.status(200).json(users);
        })
        .catch(error => {
            console.log(error);
            // handle the error
            res.status(500).json({
                errorMessage: 'The users information could not be retrieved',
            });
        });
});

server.get('/api/users/:id', (req, res) => {
    // GET a user by its id, which is a parameter of the path
    const { id } = req.params
    Users.findById(id)
        .then(data => {
            // two things can happen: id exists or not
            // id exists: we just res.json the data
            // id does not exist: we just res.json a 404
            if (data) {
                res.status(200).json(data)
            } else {
                res.status(404).json({
                    errorMessage: `The user with the specified ID does not exist.` })
            }
        })
        .catch(error => {
            console.log(error);
            // handle the error
            res.status(500).json({
                errorMessage: "The user information could not be retrieved."
            });
        })
})
// create a User
server.post('/api/users', (req, res) => {
    //const userData = req.body; // for this to work you need the server.use(express.json()); above
    const { name, bio } = req.body;
    if (!name || !bio) {
        return res.status(400).json({ errorMessage: 'please provide user name and bio' });
    }
    //Users.update(id, { name, bio })
    // never trust the client, validate the data. for now we trust the data for the demo
    //Users.insert(userData)
    Users.insert({ name, bio })
        .then(user => {
            res.status(201).json(user);
        })
        .catch(error => {
            console.log(error);
            // handle the error
            res.status(500).json({
                errorMessage: 'sorry, we ran into an error creating the user',
            });
        });
});

// delete a user
server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;

    Users.remove(id)
        .then(deleted => {
            // res.status(204).end();
            //res.status(200).json(deleted);
            if (deleted) {
                res.status(200).json(deleted)
            } else {
                res.status(404).json({
                    errorMessage: `The user with the specified ID does not exist.`
                })
            }
        })
        .catch(error => {
            console.log(error);
            // handle the error
            res.status(500).json({
                errorMessage: "The user could not be removed" 
            });
        });
});

// update a user
server.put('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const {name, bio} = req.body;
    if (!name || !bio) {
        return res.status(400).json({ errorMessage: 'please provide user name and bio'});
    } 
    Users.update(id, {name, bio})
        .then(UpdatedUser => {
            if (UpdatedUser) {
                Users.findById(id)
                .then (user => {
                    res.status(201).json(user);
                }); 
            } else {
                res.status(404).json({errorMessage: `the user with id ${id} do not exists`});
            }
        })
        .catch(error => {
            console.log(error);
            // handle the error
            res.status(500).json({
                errorMessage: 'sorry, we ran into an error updating the user',
            });
        });
});


const port = 8000;
server.listen(port, () => console.log(`\n ** api on port: ${port} ** \n`));

// fork > clone > type: "npm i" in the project folder to get the dependencies.
// type: "npm i express" (no quotes) to install the express library
// add the "index.js" file with code the root folder
// to run the server type: "npm run server"
// make a GET request to localhost:8000 using Postman or Insomnia

// to solve the sqlite3 error just do npm i sqlite3
