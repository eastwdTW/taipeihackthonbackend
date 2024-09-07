import express from 'express'
import cors from 'cors'
import userRoute from './routes/userapi'
import driverRoute from './routes/driverapi'
import otherRoute from './routes/otherapi'

const app = express()

app.use(cors())

app.use('/api', otherRoute)
app.use('/api/user', userRoute)
app.use('/api/driver', driverRoute)

const port = process.env.PORT || 4000
app.listen(port, () => {
	console.log(`Server is up on port ${port}.`)
})