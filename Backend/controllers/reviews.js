
//Import Review and spotGround JSON models
const Review = require('../models/review')
const spotGround = require('../models/spot');


//Create Review Route takes request, res, and next middleware
module.exports.createReview = async (req, res, next) => {

    // Find spot with given ID, and create new review.

    const spot = await spotGround.findById(req.params.id);
    const review = new Review(req.body.review);

    //Fill out review object with details given from post request, add to spot reviews array
    review.author = req.user._id;
    spot.reviews.push(review);

    await review.save(); //Save Review 
    await spot.save();  //Resave Spot

    console.log(`Author: ${req.user._id}, Review: ${review}`)
    req.flash('success', 'Review Added!') //Flash after saves occur and redirect to spot page w/ id
    // If this route somehow fails, next middleware will take it to error handler
    res.status(200).json({ data: spot });

}

module.exports.deleteReview = async (req, res) => {
    try {
        const { id, revID } = req.params;

        // Remove the review from the spot and delete the review from the database
        await spotGround.findByIdAndUpdate(id, { $pull: { reviews: revID } });
        await Review.findByIdAndDelete(revID);

        console.log(`Author: ${req.user._id}, Deleted Review ID: ${revID}`);

        // Respond with success
        res.status(200).json({ success: true, message: 'Review deleted successfully' });
    } catch (err) {
        console.error('Error deleting review:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
