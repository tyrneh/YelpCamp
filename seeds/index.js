//// run this file whenever we want to seed our database

const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities.js');
const { places, descriptors } = require('./seedhelpers.js');

mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => {
  console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

// Delete everything, then create seed data by looping
const seedDB = async () => {
  // delete all previous data
  await Campground.deleteMany({});
  // loop to randomly select location
  for (let i = 0; i <= 300; i++) {
    // generate random number for choosing location
    const random1000 = Math.floor(Math.random() * 1000);
    // generate random price
    const price = Math.floor(Math.random() * 20) + 10;

    const camp = new Campground({
      author: '66750daa28fb57f37331c432', // id of user "Henry"
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      geometry: {
        type: 'Point',
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      // randomly combine titles to create a name of campground
      title: `${sample(descriptors)} ${sample(places)}`,
      description: 'lorem ipsum',
      price,
      images: [
        {
          url: 'https://res.cloudinary.com/davlk6kty/image/upload/v1719208261/YelpCamp/g0mdpbg8yxxryqaxwxim.jpg',
          filename: 'YelpCamp/g0mdpbg8yxxryqaxwxim',
        },
      ],
    });
    await camp.save();
  }
};

// run the function, then close the database connection
seedDB().then(() => {
  mongoose.connection.close();
});
