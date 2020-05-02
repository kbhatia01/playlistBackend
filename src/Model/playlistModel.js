const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let playlistSchema = new Schema({
    name: { type: String, required: true },
    tags: { type: [String], default: [] },
    songs: {
        type: [{
            id: mongoose.Schema.Types.ObjectId,
            name: { type: String, required: true },
            url: String
        }], default: []
    },
    updated: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now },
    created_by: { type: String, required: true },
    shared_with: [String],
    image: { type: String, default: "default.png" }
});

const playlist = mongoose.model('playlist', playlistSchema);
// make this available to our users in our Node applications
module.exports = playlist;