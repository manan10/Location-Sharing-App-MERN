const express = require('express')
const { check } = require('express-validator')
const placesController = require('../controllers/places-controller')
const checkAuth = require('../middleware/check-auth')
const fileUpload = require('../middleware/file-upload')

const router = express.Router()

router.get('/:placeId', placesController.getPlaceById)
router.get('/user/:userId', placesController.getPlacesByUserId)

router.use(checkAuth) // The Position of this route is important as all routes below are now only available for authorized users

router.delete('/:placeId', placesController.deletePlaceById)

router.post(
    '/', 
    fileUpload.single('image'),
    [
        check("title").not().isEmpty(),
        check("description").isLength({ min: 5 }),
        check("address").not().isEmpty(),
    ], 
    placesController.createPlace
)

router.patch(
    '/:placeId', 
    [
        check("title").not().isEmpty(),
        check("description").isLength({ min: 5 })
    ],
    placesController.updatePlaceById)

module.exports = router
