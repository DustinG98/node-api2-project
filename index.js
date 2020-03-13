const express = require('express')
const cors = require('cors')

const server = express();

const postsRouter = require('./routes/postsRouter')


const corsOptions = {
    origin: "*",
    methods: ['GET', 'PUT', 'POST', 'DELETE']
}
server.use(cors(corsOptions))

server.use(express.json())

server.use('/api/posts', postsRouter)

server.listen(5000, () => {
    console.log('server is runnnning')
})