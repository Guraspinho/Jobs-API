
const mongoose = require('mongoose');
const bcrypt= require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
    {
        name:
        {
            type: String,
            required: [true, 'Please provide a name'],
            minlength: 2,
            maxlength: 20
        },
        email:
        {
            type: String,
            required: [true, 'Please provide an email'],
            unique: [true, 'Email already in use'],
            match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'Please provide a valid email'
              ]
        },
        password:
        {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: 8
        }
    }
)

// encrypt the password

userSchema.pre('save', async function()
{
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
})

//create jwt

userSchema.methods.createJWT = function ()
{
    return jwt.sign({userID:this._id, name:this.name}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME});
}

// compare provided password to the one that is in db.

userSchema.methods.comparePasswords = async function(candidatePassword)
{
    const isMatch = await bcrypt.compare(candidatePassword,this.password);
    return isMatch;
}

module.exports = mongoose.model( 'User',userSchema )