// to hold top level routes
const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth_mid')

const Task = require('../models/Task')

// @desc   Show add task page
// @route  GET /tasks/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('tasks/add')
})

// @desc   Show task details
// @route  GET /tasks/:id
router.get('/:id', ensureAuth, async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id
        }).lean()

        if(!task){
            return res.render('error/404')
        }
        res.render('tasks/show', {
            task,
        })
    } 
    catch (err) {
        console.error(err)
        //return res.render('error/500')
    }
})

// @desc   Process add form
// @route  POST /tasks
router.post ('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        await Task.create(req.body)
        res.redirect('/dashboard')
    } 
    catch (err) {
        console.error(err)
        //return res.render('error/500')
    }
})

// @desc   Show edit task page
// @route  GET /tasks/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id
        }).lean() // used to pass this route to handlebars template

        if(!task) { // task not present
            return res.render('error/404')
        }
        res.render('tasks/edit',{
            task,
        })
    } 
    catch (err) {
        console.error(err)
        //return res.render('error/500')
    }
    
})

// @desc   Update task
// @route  PUT /tasks/:id
router.put('/:id', ensureAuth, async (req, res) => {
    try {
        let task = await Task.findById(req.params.id).lean()

        if(!task) { // task not present
            return res.render('error/404')
        }
        task = await Task.findOneAndUpdate({_id: req.params.id}, req.body, {
            new: true,
            runValidators: true
        })
        res.redirect('/dashboard')
    } 
    catch (err) {
        console.error(err)
        //return res.render('error/500')
    }
    
})

// @desc   Delete task
// @route  DELETE /tasks/:id
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        await Task.remove({ _id: req.params.id })
        res.redirect('/dashboard')
    } 
    catch (err) {
        console.error(err)
        //return res.render('error/500')
    }
})

module.exports = router