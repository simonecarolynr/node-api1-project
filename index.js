const express = require("express")
const db = require("./database")

const server = express();

// This is installing some middleware to allow Express
// to parse JSON request bodies.
server.use(express.json())

server.get('/', (req, res) => {
    res.status(200).json({
        message: "Server running"
    })
})


server.post('/api/users', (req, res) => {
    if(!req.body.name || !req.body.bio){
        return res.status(400).json({
            errorMessage: "Please provide name and bio for the user"
        })
    } else if(req.body.name && req.body.bio){
        const newUser = db.createUser({
            name: req.body.name,
            bio: req.body.bio
        })
        res.status(201).json
        return res.json(newUser)
    } else {
        res.status(500).json({
            errorMessage: "There was an error while saving the user to the database"
        })
    }

})

server.get('/api/users', (req, res) => {
    const users = db.getUsers()

    if(!users){
        return res.status(500).json({
            errorMessage: "The users information could not be retrieved."
        })
    } else {
        return res.json(users)
    }

})

server.get('/api/users/:id', (req, res) => {
    const user = db.getUserById(req.params.id) //what are params

    if (user) {
        return res.json(user)
    } else if (!user) {
        return res.status(404).json({
            message: "The user with the specified ID does not exist."
        })
    } else {
        return res.status(500).json({
            errorMessage: "The user information could not be retrieved."
        })
    }

})

server.delete('/api/users/:id', (req, res) => {
    db.getUserById(req.params.id)
    .then(user => {
        if (!user) {
            res.status(404).json({
                errorMessage: "User does not exist"
            })
        } else {
            db.deleteUser(req.params.id)
            .then(user => {
                res.status(200).json(user)
            })
            .catch(err => {
                res.status(500).json({
                    errorMessage: "Error with the database"
                })
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            errorMessage: "Error with the database"
        })
    })

})

server.put('/api/users/:id', (req, res) => {
    db.getUserById(req.params.id)

    .then(user => {
        if (!user) {
            res.status(404).json({
                errorMessage: "User does not exist"
            }) 
        } else if (!req.body.name || req.body.bio) {
            res.status(400).json({
                errorMessage: "Please provide name and bio for the user"
            })
        } else {
            db.updateUser(req.params.id, req.body)
            .then(user => {
                res.status(200).json(user)
            })
        }
    })

})

server.listen(4040, () => {
    console.log("********* server started on port 4040 *********")
})