const express = require('express');
const router = express.Router();
const { 
    getAlljobs,
    getSinglejob,
    createJob,
    deleteJob,
    editJob
} = require('../controllers/jobs');

router.route('/').post(createJob).get(getAlljobs);
router.route('/:id').get(getSinglejob).delete(deleteJob).patch(editJob);

module.exports = router;

