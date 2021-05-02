const mongoose = require("mongoose");

const plantSchema = new mongoose.Schema(
  {
    name: {
      type: "string",
      required: true,
      trim: true,
    },
    placement: {
      building: {
        type: "string",
        required: true,
        trim: true,
      },
      floor: {
        type: "string",
        required: true,
        trim: true,
      },
      room: {
        type: "string",
        required: true,
        trim: true,
      },
    },
    watering: {
      waterFrequency: {
        type: Number,
        required: true,
      },
      waterNext: {
        type: Number,
      },
      responsible: {
        type: "string",
        trim: true,
      },
      lastWateredBy: {
        type: "string",
        trim: true,
      },
      lastWateredDate: {
        type: Number,
      },
      lastPostponedReason: {
        type: "string",
        trim: true,
      },
    },
    fertilization: {
      fertFrequency: {
        type: Number,
        required: true,
      },
      fertNext: {
        type: Date,
      },
    },
    lighting: {
      type: "string",
      trim: true,
    },
    information: {
      description: String,
      placement: String,
      water: String,
      nutrition: String,
    },
  },
  { timestamps: true }
);

plantSchema.set("toJson", {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    // remove these props when object is serialized
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model("Plant", plantSchema);
