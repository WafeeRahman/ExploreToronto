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
    res.status(200).json(spot);

    //req.flash('success', 'Post Successful!')
    // res.redirect(`/spotgrounds/${spot._id}`) //Redirects to details page

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
        return res.status(401).json({ success: false, message: 'Post Not Found.' }); // Authentication failed
    }
    //console.log(spot)
    //res.render('spotgrounds/show', { spot }); //Render show page with spotground details passed in for EJS Manipulation
    res.status(200).json(spot);

}

module.exports.renderEditForm = async (req, res) => {

    //Take Id and find spot
    const id = req.params.id;
    const spot = await spotGround.findById(id);


    //If spot doesnt exists, flash error and redirect back to /spotgrounds
    if (!spot) {
        req.flash('error', 'Spot Not Found.');
        return res.status(401).json({ success: false, message: 'Post Not Found.' }); // Authentication failed
    }

    //Render Edit Page with Spot Details passed in
    //res.render('spotgrounds/edit', { spot });

}

module.exports.updateSpot = async (req, res, next) => {
    try {
        const id = req.params.id;

        // Update the spot with new data
        const spot = await spotGround.findByIdAndUpdate(id, { ...req.body.spotgrounds }, { new: true });

        // Handle new files if they exist
        if (req.files && req.files.length > 0) {
            const thmbs = req.files.map(f => ({ url: f.path, filename: f.filename }));
            spot.thumbnail.push(...thmbs);
        }

        await spot.save(); // Save the updated spot

        // Handle deletion of images if provided
        if (req.body.deleteImages && Array.isArray(req.body.deleteImages)) {
            for (let filename of req.body.deleteImages) {
                // Ensure that `filename` is valid and not empty
                if (filename) {
                    await cloudinary.uploader.destroy(filename);
                }
            }
            // Remove deleted images from the thumbnail array
            await spotGround.updateOne(
                { _id: id },
                { $pull: { thumbnail: { filename: { $in: req.body.deleteImages } } } }
            );
        }

        console.log("Success");
        res.status(200).json(spot);
    } catch (error) {
        console.error('Error updating spot:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports.deleteSpot = async (req, res) => {
    // Take ID, Find Spot, Delete from DB, Redirect.
    const { id } = req.params;
    const deleted = await spotGround.findByIdAndDelete(id);
    console.log(`Deleted. ${deleted}`)
    res.status(200).json({ success: true, message: 'Delete Successful' }); // Authentication failed





}