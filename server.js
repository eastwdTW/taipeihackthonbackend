import express from 'express'
import cors from 'cors'
import userRoute from './routes/user'
import driverRoute from './routes/driver'
import orderRoute from './routes/order'

const app = express()

app.use(cors())

app.use('/api/user', userRoute)
app.use('/api/driver', driverRoute)
app.use('/api/order', orderRoute)

const port = process.env.PORT || 4000
app.listen(port, () => {
	console.log(`Server is up on port ${port}.`)
})