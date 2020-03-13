const express = require('express')
const cors = require('cors')

const server = express();

const postsRouter = require('./routes/postsRouter')

server.use(express.json())

server.use(cors())

server.use('/api/posts', postsRouter)

server.listen(5000, () => {
    console.log('server is runnnning')
})