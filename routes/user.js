import express from 'express'
// import "../db/users.json"

const router = express.Router()

router.get('/test', (_, res) => {
	res.json({msg: true})
})

export default router