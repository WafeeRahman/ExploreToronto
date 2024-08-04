// Testing a Seed DB Function


const mongoose = require('mongoose'); //Req Mongoose
const spotGround = require('../models/spot');
const Review = require('../models/review');

//Connect to Mongoose and Acquire Courtground Schema
mongoose.connect('mongodb://127.0.0.1:27017/spot-grounds', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


//SeedHelpers Function
const cities = require('./cities') //pass in cities array
const { places, descriptors } = require('./seedHelpers')


const db = mongoose.connection; //shorthand for db

db.on('error', console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("MongoDB Connected");
})


// Sample will return a random indeex for places and descriptor arrays both imported from seedHelpers
const sample = array => array[Math.floor(Math.random() * array.length)]



// Test Seeding With Random Location Data from Cities.js
const seedDB = async () => {

    await spotGround.deleteMany({}); //Delete All Entries in DB and their reviews
    await Review.deleteMany({});
    const price = Math.floor(Math.random() * 20) + 10 //Create random Prices
    for (let i = 0; i <= 200; i++) { //Randomly seed 200 entries into the databases
        const random1000 = Math.floor(Math.random() * 1000);

        let spot = new spotGround({
            author: '6656b0418ad44ce768f232f3',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `Example #${i}: Spot Based In ${cities[random1000].city} ${cities[random1000].state}`,
            geometry: {
                type: 'Point',
                coordinates: [cities[random1000].longitude, cities[random1000].latitude] //Geocode coordinates

            },
            thumbnail: [
                {

                    url: "https://res.cloudinary.com/djgibqxxv/image/upload/v1697060327/Hang/fxieuywuplxkjaamicbk.jpg",
                    filename: "Hang/eqknka5bxlemz7hzo54g"
                },
                {

                    url: "https://res.cloudinary.com/djgibqxxv/image/upload/v1696999583/Hang/vpn3p3mphuxhg1xxbjfo.png",
                    filename: "Hang/vpn3p3mphuxhg1xxbjfo"
                }
            ],
            description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur laoreet dui in leo dictum cursus. Sed a blandit urna. Morbi ultricies, ante vitae gravida consectetur`,
            price
        });
        await spot.save(); // Create New Spot and Save
    }

}

seedDB().then(() => {
    mongoose.connection.close() //close DB
}); //Call Seed Function