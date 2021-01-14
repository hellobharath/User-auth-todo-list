// to hold top level routes

const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth_mid')

const Task = require('../models/Task')

// @desc   Login/Landing page
// @route  GET /
router.get('/', ensureGuest, (req, res) => {
    res.render('login',{
        layout: 'login'
    })
})

// @desc   Dashboard page
// @route  GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id }).lean()
        res.render('dashboard', {
            name: req.user.firstName,
            tasks: tasks
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})


module.exports = router