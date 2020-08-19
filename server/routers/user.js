const express = require('express')
const auth = require('../middleware/auth')
const User = require('../models/user')

const router = new express.Router()

router.post('/api/user/check-auth', auth, async (req, res) => {
    res.send({ user: req.user })
})

router.post('/api/user/login', async  (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/api/user/login-as-anonymous', async (req, res) => {
    try {
        const user = User.createAnonymousUser()
        await user.save()
        const token = await user.generateAuthToken()

        res.send({ user, token })
    } catch (e) {
        res.status(400).send(e.message)
    }
})

router.post('/api/user/register', async (req, res) => {
    try {
        const user = new User({
            ...req.body,
            type: User.types.USER_TYPE_REGULAR
        })

        await user.save()
        const token = await user.generateAuthToken()

        res.send({ user, token })
    } catch (e) {
        res.status(400).send(e.message)
    }
})

router.post('/api/user/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.post('/api/user/logout-all', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router
