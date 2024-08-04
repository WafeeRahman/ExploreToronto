// Import Spot Schema, Cloudinary Storage, Mapbox API key and geoCoder
const spotGround = require('../models/spot');
const { cloudinary } = require("../cloudinary/index")
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken });


module.exports.index = async (req, res) => {
    //Find all spotGrounds in DB to pass into frontend as JSON
    
    const spotGrounds = await spotGround.find({}); 
    
    // Send Response
    res.status(200).json(spotGrounds);

} 

module.exports.renderNewForm = (req, res) => {

    res.render('spotgrounds/new'); //Render Creation form

}

module.exports.createSpot = async (req, res, next) => {
    req.files.map(f => ({ url: f.path, filename: f.filename })) //Map files into a json object

    //if (!req.body.spotgrounds) throw new ExpressError('Invalid Data', 400) //Check for Valid Data
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.spotgrounds.location,
        limit: 1
    }).send();


    const spot = new spotGround(req.body.spotgrounds); //Forms create a new spotground object
    spot.geometry = geoData.body.features[0].geometry; //Pass in Geometry to schema
    spot.thumbnail = req.files.map(f => ({ url: f.path, filename: f.filename }));
    spot.author = req.user._id;
    await spot.save(); //Save to DB
    console.log(spot);
    req.flash('success', 'Post Successful!')
    res.redirect(`/spotgrounds/${spot._id}`) //Redirects to details page

}

module.exports.showSpot = async (req, res) => {
    const id = req.params.id;
    const spot = await spotGround.findById(id).populate({
        path: 'reviews',  //Populate Reviews
        populate: {
            path: 'author' //Populate Review Author
        }
    }).populate('author'); //Populate Post Author

    if (!spot) {
        req.flash('error', 'Spot Not Found.'); //If no spot is found, flash an error and return to spotgrounds route
        return res.redirect('/spotgrounds');
    }
    console.log(spot)
    res.render('spotgrounds/show', { spot }); //Render show page with spotground details passed in for EJS Manipulation

}

module.exports.renderEditForm = async (req, res) => {

    //Take Id and find spot
    const id = req.params.id;
    const spot = await spotGround.findById(id);


    //If spot doesnt exists, flash error and redirect back to /spotgrounds
    if (!spot) {
        req.flash('error', 'Spot Not Found.');
        return res.redirect('/spotgrounds');
    }

    //Render Edit Page with Spot Details passed in
    res.render('spotgrounds/edit', { spot });

}


module.exports.updateSpot = async (req, res, next) => {

    //Use request parameter id to find spot ID and updating it by spreading the object into the new spot
    const id = req.params.id;
    // Spread req body into the database object with matching id
    const spot = await spotGround.findByIdAndUpdate(id, { ...req.body.spotgrounds }, { new: true });
    //Take new/existing thumbnail and push it into the spot.thumbnail with spread operator
    const thmbs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    spot.thumbnail.push(...thmbs)
    await spot.save(); // Save Spot

    //If we want to delete an image (given by put request & embedded javascript array)
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            //Use Cloudinary to destroy each filename
            await cloudinary.uploader.destroy(filename);
        }
        //Pull thumbnail out of thumbnail array
        await spotGround.updateOne({ $pull: { thumbnail: { filename: { $in: req.body.deleteImages } } } })

    }
    console.log("Success")
    console.log(spot)

    req.flash('success', 'Edit Successful!')
    res.redirect(`/spotgrounds/${spot._id}`) //Redirects to details page

}

module.exports.deleteSpot = async (req, res) => {
    // Take ID, Find Spot, Delete from DB, Redirect.
    const { id } = req.params;
    const deleted = await spotGround.findByIdAndDelete(id);
    console.log(`Deleted. ${deleted}`)
    req.flash('success', 'Deleted Spot')
    res.redirect(`/spotgrounds`)




}