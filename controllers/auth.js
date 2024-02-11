
const {UnauthenticatedError,BadRequestError} = require('../errors/everyError');
const user = require('../models/users');
const {StatusCodes} = require('http-status-codes');



const register = async (req,res) =>
{
    const singleUser = await user.create({...req.body});
    const token = singleUser.createJWT();

    res.status(StatusCodes.CREATED).json({singleUser:{name:singleUser.name},token});
};


const login = async (req,res) =>
{

    // extracts email and password from req.body

    const {email,password} = req.body;

    // checks if email and password are provided

    if(!email || !password)
    {
        throw new BadRequestError('Please provide email and password');
    }
    const userCredentials = await user.findOne({email});

    // checks wether the user with the provided email exists 

    if(!userCredentials)
    {
        throw new UnauthenticatedError('The user does not exist')
    }
    const token = userCredentials.createJWT();

    // checks if the provided password is correct

    const isPasswordCorrect = await userCredentials.comparePasswords(password);
    if(!isPasswordCorrect)
    {
        throw new UnauthenticatedError('The password is incorrect');
    }
    
    // returns statuscode, user's name and jwt token

    res.status(StatusCodes.OK).json({userCredentials:{name:userCredentials.name},token});
    
    
};

module.exports = 
{
    register,
    login
};