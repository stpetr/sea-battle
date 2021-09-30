const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const USER_TYPE_REGULAR = 'regular'
const USER_TYPE_ANONYMOUS = 'anonymous'

const userSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        default: USER_TYPE_REGULAR,
        enum: [USER_TYPE_REGULAR, USER_TYPE_ANONYMOUS],
        immutable: function () {
            return this.type !== USER_TYPE_ANONYMOUS
        }
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: function () {
            return this.type !== USER_TYPE_ANONYMOUS
        },
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        },
        immutable: function () {
            return this.type !== USER_TYPE_ANONYMOUS
        }
    },
    password: {
        type: String,
        required: function () {
            return this.type !== USER_TYPE_ANONYMOUS
        },
        minLength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error(`Password cannot contain "password"`)
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error(`Age must be a positive number`)
            }
        }
    },
    score: {
        type: Number,
        default: 0,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.statics = {
    types: {
        USER_TYPE_REGULAR: USER_TYPE_REGULAR,
        USER_TYPE_ANONYMOUS: USER_TYPE_ANONYMOUS
    }
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    const errorMessage = 'Unable to login'

    if (!user) {
        throw new Error(errorMessage)
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error(errorMessage)
    }

    return user
}

userSchema.statics.createAnonymousUser = () => {
    const userId = mongoose.Types.ObjectId(),
        userData = {
            _id: userId,
            type: USER_TYPE_ANONYMOUS,
            name: 'Anonymous',
            email: `${userId}@sea-battle.game`
        }

    return new mongoose.model('User')(userData)
}

const User = mongoose.model('User', userSchema)

module.exports = User
