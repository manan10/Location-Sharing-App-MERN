const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const HttpError = require('../models/http-error')
const User = require('../models/user')

const getUsers = async (req, res, next) => {
    User
        .find({}, '-password')
        .then((users) => res.json({ users: users.map(user => user.toObject({ getters: true }))}))
        .catch(() => next(new HttpError('Something went wrong', 500)))
}

const signup = (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty())
        return next(new HttpError("Invalid Inputs", 422))

    const { name, email, password } = req.body

    User
        .findOne({ email: email })
        .then((existingUser) => {
            if(existingUser)
                return next(new HttpError('User already exists', 422))

            bcrypt
                .hash(password, 12)
                .then((hashedPassword) => {
                    const newUser = new User({ name, email, password: hashedPassword, places: [], image: req.file.path})            
                    newUser
                        .save()
                        .then(() => {
                            let token
                            try {
                                token = jwt.sign(
                                    { userId: newUser.id, email: newUser.email },
                                    process.env.JWT_KEY,
                                    { expiresIn: '1h' }
                                )
                            } catch (error) {
                                return next(new HttpError('Something Went Wrong', 500))
                            }
                            res.status(201).json({ userId: newUser.id, email: newUser.email, token: token })
                        })
                        .catch(() => next(new HttpError('Could not sign up', 500)))
                })
                .catch(() => next(new HttpError('Hashing Failed', 500)))
        })
        .catch(() => next(new HttpError('Could not sign up', 500)))
}  

const login = (req, res, next) => {
    const { email, password } = req.body

    User
        .findOne({ email: email })
        .then((existingUser) => {
            if(!existingUser)
                return next(new HttpError('Invalid Email', 401))
            
            bcrypt
                .compare(password, existingUser.password)
                .then((isValid) => {
                    if(!isValid)
                        next(new HttpError('Invalid Password', 401))

                    let token
                    try {
                        token = jwt.sign(
                            { userId: existingUser.id, email: existingUser.email },
                            process.env.JWT_KEY,
                            { expiresIn: '1h' }
                        )
                    } catch (error) {
                        return next(new HttpError('Something Went Wrong', 500))
                    }
                    res.json({ userId: existingUser.id, email: existingUser.email, token: token })
                })
                .catch(() => next(new HttpError('Could not log in', 500))) 
        })
        .catch(() => next(new HttpError('Could not sign up', 500)))
}

exports.getUsers = getUsers
exports.signup = signup
exports.login = login
