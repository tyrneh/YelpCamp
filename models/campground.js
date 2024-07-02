const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review.js');

const opts = { toJSON: { virtuals: true } };

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_200');
});

const CampgroundSchema = new Schema(
  {
    title: {
      type: String,
    },
    price: {
      type: Number,
    },
    description: {
      type: String,
    },
    location: {
      type: String,
    },
    images: [ImageSchema],
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    geometry: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  opts
);

CampgroundSchema.virtual('properties.popupMarkup').get(function () {
  return `<strong><a href='/campgrounds/${
    this._id
  }'>${this.title}</a></strong><p>${this.description.substring(0, 20)}...</p>`;
});

// mongoose delete middleware
CampgroundSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model('Campground', CampgroundSchema);
