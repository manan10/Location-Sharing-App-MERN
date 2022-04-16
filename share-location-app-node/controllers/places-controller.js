const { validationResult } = require('express-validator')
const mongoose = require('mongoose')
const fs = require('fs')

const HttpError = require('../models/http-error')
const getCoordinatesFromAddress = require('../util/location')
const getCoodrinatesFromAddress = require('../util/location')
const Place = require('../models/place')
const User = require('../models/user')

const getPlaceById = (req, res, next) => {
    const placeId = req.params.placeId
    Place
        .findById(placeId)
        .then((place) => {
            if(!place)
                return next(new HttpError("Could not find a place with given ID", 404))    
            res.json({ place: place.toObject({ getters: true }) })
        })
        .catch(() => next(new HttpError('Something went wrong', 500))) 
}

const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.userId
    User
        .findById(userId)
        .populate('places')
        .then((userPlaces) => {
            if(!userPlaces || userPlaces.places.length === 0)
                return next(new HttpError("Could not find any place for selected user"), 404)
            res.json({ places: userPlaces.places.map(place => place.toObject({ getters: true })) })
        })
        .catch(() => next(new HttpError('Something went wrong', 500)))
}

const createPlace = async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty())
        return next(new HttpError("Invalid Inputs", 422))

    const { title, description, address } = req.body

    let coordinates 
    try {
        coordinates = await getCoodrinatesFromAddress(address)
    } catch(error) {
        return next(error)
    }

    const newPlace = new Place({
        title: title,
        description: description,
        address: address,
        location: coordinates,
        image: req.file.path,
        creator: req.userData.userId
    })

    let user
    try {
        user = await User.findById(req.userData.userId)
    } catch (error) {
        return next(new HttpError('Create Place Failed', 500))    
    }

    if(!user){
        return next(new HttpError('User doesnt exist', 404))
    }

    try{
        const sess = await mongoose.startSession()
        sess.startTransaction()
        await newPlace.save({ session: sess })
        user.places.push(newPlace)
        await user.save({ session: sess })
        await sess.commitTransaction() 
    } catch(err){
        return next(new HttpError('Could not create place, please try again', 500))
    }
    res.status(201).json({ place: newPlace })
}
  
const updatePlaceById = (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty())
        return next(new HttpError("Invalid Inputs", 422))

    const { title, description } = req.body
    const placeId = req.params.placeId

    Place
        .findById(placeId)
        .then((place) => {
            if(place.creator.toString() !== req.userData.userId)
                next(new HttpError("You are not allowed to edit this place", 401))

            place.title = title
            place.description = description
            
            place
                .save()
                .then(() => res.status(200).json({ place: place.toObject({ getters: true })}))
                .catch(() => next(new HttpError('Something went wrong here', 500)))
        })
        .catch(() => next(new HttpError('Something went wrong here', 500)))
}

const deletePlaceById = async (req, res, next) => {
    const placeId = req.params.placeId;
  
    let place;
    try {
        place = await Place.findById(placeId).populate('creator');
    } catch (err) {
        return next(new HttpError('Something went wrong', 500))
    }
  
    if (!place)
      return next(new HttpError('Could not find place for this id.', 404))
    
    if(place.creator.id !== req.userData.userId)
        return next(new HttpError('You are not allowed to edit this place', 401))
        
    const imagePath = place.image;
    
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.remove({session: sess});
        place.creator.places.pull(place);
        await place.creator.save({session: sess});
        await sess.commitTransaction();
    } catch (err) {
        return next(new HttpError('Something went wrong, could not delete place.', 500))
    }

    fs.unlink(imagePath, () => {})
    res.status(200).json({ message: 'Deleted place.' });
};

exports.getPlaceById = getPlaceById
exports.getPlacesByUserId = getPlacesByUserId
exports.createPlace = createPlace
exports.updatePlaceById = updatePlaceById
exports.deletePlaceById = deletePlaceById