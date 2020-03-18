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

//GET POSTS
router.route('/').get((req, res) => {
    database.find()
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(err => {
            res.status(500).json({ error: "The posts information could not be retrieved." })
        })
})

//GET SINGLE POST
router.route('/:id').get((req, res) => {
    database.findById(req.params.id)
        .then(post => {
            if(post.length === 0) {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
                return;
            }
            res.status(200).json(post[0])
        })
        .catch(() => {
            res.status(500).json({ error: "The post information could not be retrieved" })
        })
})

//GET POSTS COMMENTS
router.route('/:id/comments').get((req, res) => {
    database.findById(req.params.id)
        .then(post => {
            if(post.length === 0) {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
                return;
            }
            database.findPostComments(req.params.id)
                .then(comments => {
                    res.status(200).json(comments)
                })
                .catch(() => {
                    res.status(500).json({error: "The comments information could not be retreived."})
                })
        })
})

//DELETE POST BY ID
router.route('/:id').delete((req, res) => {
    database.findById(req.params.id)
        .then(post => {
            if(post.length === 0) {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
                return;
            }
            database.remove(req.params.id)
                .then(() => {
                    res.status(200).json({ message: "Post has been deleted" })
                })
                .catch(() => {
                    res.status(500).json({ error: "the post could not be removed" })
                })
        })
})

//UPDATE POST BY ID
router.route('/:id').put((req, res) => {
    database.findById(req.params.id)
        .then(post => {
            if(post.length === 0) {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
                return;
            }
            if(!req.body.title || !req.body.contents) {
                res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
            }
            database.update(req.params.id, req.body)
                .then(count => {
                    if(count === 1) {
                        database.findById(req.params.id)
                            .then(post => {
                                res.status(200).json(post[0])
                            })
                    } else if(count === 0) {
                        res.status(500).json({ error: "The post information could not be modified." })
                        return;
                    }

                })
        })
})

module.exports = router;

