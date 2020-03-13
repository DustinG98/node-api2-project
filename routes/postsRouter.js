const router = require('express').Router();
const database = require('../data/db')

// ADD POSTS
router.route('/').post((req, res) => {
    if(!req.body.title || !req.body.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
        return;
    }
    database.insert(req.body)
        .then(id => {
            database.findById(id.id)
                .then(post => {
                    res.status(201).json(post)
                })
        })
        .catch(err => {
            res.status(500).json({ error: "There was an error while saving the post to the database" })
        })
})

//ADD COMMENTS
router.route('/:id/comments').post((req, res) => {
    if(!req.body.text) {
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
        return;
    }
    database.findById(req.params.id)
        .then(post => {
            if(post.length === 0) {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
                return;
            }
            database.insertComment(req.body)
                .then(idObj => {
                    database.findCommentById(idObj.id) 
                        .then(comment => {
                            res.status(201).json(comment[0])
                        })
                })
                .catch(err => {
                    res.status(500).json({ error: "There was an error while saving the comment to the database" })
                })

        })
})

module.exports = router;

