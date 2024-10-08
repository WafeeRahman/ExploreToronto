const express = require('express');
const router = express.Router();
const spotgrounds = require('../controllers/spotgrounds') // CONTROLLER: contains all methods for rendering forms

const wrapAsync = require('../utilities/wrapAsync')
// Wrap Async try-catches all async functions, and sends error to middleware



const spotGround = require('../models/spot');
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })



const { validateLogin } = require('../middleware') // Pass in login validation middleware

//Function Validates All put and post requests from async functions
const { validateSpot } = require('../middleware')


//Middleware for validating author
const { validateAuthor } = require('../middleware')



//All CRUD Routes for SpotGrounds

router.route('/')

    //Run the spotgrounds index method upon get requests to the root; renders spotground/index
    .get(wrapAsync(spotgrounds.index))


    //Run the validateLogin, Multer Upload, Spot Validation, or CreateSpot functions on post request
    .post(validateLogin, upload.array('thumbnail'), validateSpot, wrapAsync(spotgrounds.createSpot))






// Allows users to CREATE a new page with a form that sends a POST request to the spotGROUNDS page
router.get('/new', validateLogin, spotgrounds.renderNewForm); // Get REQ to new form



router.route('/:id') //Router Chain for get,put, and delete requests

    // Allows users to READ an existing spotGround page in more detail

    .get(wrapAsync(spotgrounds.showSpot)) // Get runs the showSpot method

    // Allows users to fill forms to UPDATE spotGround

    .put(validateLogin, validateAuthor, upload.array('thumbnail'), validateSpot, wrapAsync(spotgrounds.updateSpot)) //Put runs updateSpots and multer upload function

    //Delete Route

    .delete(validateLogin, validateAuthor,  wrapAsync(spotgrounds.deleteSpot)); //Delete Runs delete method






// Get requests to edit runs
router.get('/:id/edit', validateLogin, wrapAsync(spotgrounds.renderEditForm));




module.exports = router;