const express = require('express')
const router = express.Router();


const postsController = require("../controllers/postsController")


//Crud - Create 

//router.post('/', postsController.index)

router.post('/', postsController.store)

//cRud - Read 

router.get('/', postsController.index)

router.get('/:id', postsController.show)

//crUd - Update 

router.put('/:id', postsController.update)

router.patch('/:id', postsController.modify)


//cruD - Delete

router.delete('/:id', postsController.destroy)








module.exports = router;