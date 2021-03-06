const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    lighting: {
      type: String,
      trim: true,
      required: true,
      enum: [
        'sunlight',
        'sunlight / half shade',
        'half shade',
        'half shade / shade',
        'shade',
      ],
      default: 'sunlight',
    },
    lastRequestedDate: Date,
    image: {
      type: String,
      trim: true,
    },
    placement: {
      building: {
        type: String,
        required: true,
        trim: true,
      },
      floor: {
        type: Number,
        max: 4,
        min: 1,
        required: true,
        default: 1,
      },
      room: {
        type: String,
        required: true,
        trim: true,
      },
    },
    watering: {
      waterFrequency: {
        type: Number,
        required: true,
        trim: true,
      },
      waterNext: {
        type: Date,
        trim: true,
        min: Date.now(),
      },
      waterAmount: {
        type: String,
        required: true,
        trim: true,
        enum: ['plentiful', 'average', 'sparse'],
        default: 'plentiful',
      },
      lastWateredBy: {
        type: String,
        trim: true,
      },
      lastWateredDate: {
        type: Date,
        trim: true,
      },
      lastPostponedBy: {
        type: String,
        trim: true,
      },
      lastPostponedReason: {
        type: String,
        trim: true,
        maxLength: 200,
      },
    },
    fertilization: {
      fertFrequency: {
        type: Number,
        required: true,
        trim: true,
      },
      fertNext: {
        type: Date,
        trim: true,
        min: Date.now(),
      },
      fertAmount: {
        type: String,
        required: true,
        trim: true,
        enum: ['plentiful', 'average', 'sparse'],
        default: 'plentiful',
      },
      lastFertBy: {
        type: String,
        trim: true,
      },
      lastFertDate: {
        type: Date,
        trim: true,
      },
      lastPostponedBy: {
        type: String,
        trim: true,
      },
      lastPostponedReason: {
        type: String,
        trim: true,
        maxLength: 200,
      },
    },
    information: {
      description: {
        type: String,
        trim: true,
      },
      placement: {
        type: String,
        trim: true,
      },
      watering: {
        type: String,
        trim: true,
      },
      nutrition: {
        type: String,
        trim: true,
      },
    },
  },
  { timestamps: true }
);

plantSchema.set('toJson', {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    // remove these props when object is serialized
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model('Plant', plantSchema);
