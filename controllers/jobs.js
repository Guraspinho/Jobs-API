const Job = require('../models/jobs');
const {StatusCodes} = require('http-status-codes');
const {NotFoundError,BadRequestError} = require('../errors/everyError');

// get post update and delete jobs
const getAlljobs = async (req,res) =>
{
    const jobs = await Job.find({createdBy: req.user.userID}).sort('createdAt');
    res.status(StatusCodes.OK).json({jobs, count: jobs.length});
}

const getSinglejob = async (req,res) =>
{
    const {user: {userID}, params:{id:jobID}} = req;
    const job = await Job.findOne({_id:jobID ,createdBy:userID});
    if(!job)
    {
        throw new NotFoundError(`No job found with ID: ${jobID}`);
    }
    res.status(StatusCodes.OK).json({job});
}

const createJob = async (req,res) =>
{
    req.body.createdBy = req.user.userID;
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({job});
}

const deleteJob = async (req,res) =>
{
    const {user: {userID}, params:{id:jobID}} = req;
    const job = await Job.findOneAndDelete({_id:jobID ,createdBy:userID});
    if(!job)
    {
        throw new NotFoundError(`No job found with ID: ${jobID}`);
    }
    res.status(StatusCodes.OK).json({msg:'the job was deleted'});
}

const editJob = async (req,res) =>
{
    const
    {
        body:{company,position},
        user: {userID},
        params:{id:jobID}
    } = req;

    if(company === '' || position === '')
    {
        throw new BadRequestError('Please provide valid values for both company and position');
    }
    const job = await Job.findByIdAndUpdate({_id:jobID ,createdBy:userID},req.body,{new:true, runValidators:true});

    if(!job)
    {
        throw new NotFoundError(`No job found with ID: ${jobID}`);
    }


    res.status(StatusCodes.OK).json({job});

}


module.exports = 
{
    getAlljobs,
    getSinglejob,
    createJob,
    deleteJob,
    editJob

}