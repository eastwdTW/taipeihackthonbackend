import express from 'express'
import "../db/drivres.json"

const router = express.Router()

router.post('/start', (_, res) => {
	genNumber()
	res.json({msg: true})
})
router.get('/guess', (req, res) => {
	const number = getNumber()
	const guessed = roughScale(req.query.number, 10)

	if(!guessed || guessed < 1 || guessed > 100) {
		res.status(406).send({msg: 'Not a legal number.'})
	}else if(number === guessed){
		res.json({msg: 'Equal'})
	}else if(number > guessed){
		res.json({msg: 'Bigger'})
	}else{
		res.json({msg: 'Smaller'})
	}
})
router.post('/restart', (_, res) => {
	genNumber()
	res.json({msg: false})
})

export default router