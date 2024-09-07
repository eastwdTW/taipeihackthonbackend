import express from 'express'
import cors from 'cors'
import Route from './route'

const app = express()

app.use(cors())

app.use('/api', Route)

const port = process.env.PORT || 4000
app.listen(port, () => {
	console.log(`Server is up on port ${port}.`)
})