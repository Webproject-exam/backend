const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: true,
         trim: true,
      },
      responsible: {
         type: String,
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
            min: 0,
            required: true,
            trim: true,
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
         },
         waterAmount: {
            type: String,
            required: true,
            trim: true,
            enum: ['plentiful', 'average', 'sparse'],
         },
         lastWateredBy: {
            type: String,
            trim: true,
         },
         lastWateredDate: {
            type: Number,
            trim: true,
         },
         lastPostponedReason: {
            type: String,
            trim: true,
            default: 'No reason given',
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
         },
         fertAmount: {
            type: String,
            required: true,
            trim: true,
            enum: ['plentiful', 'average', 'sparse'],
         },
         lastFertBy: {
            type: String,
            trim: true,
         },
         lastFertDate: {
            type: Number,
            trim: true,
         },
         lastPostponedReason: {
            type: String,
            trim: true,
            default: 'No reason given',
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
