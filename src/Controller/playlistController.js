var express = require('express');
var router = express.Router();
var playlist = require('../Model/playlistModel');
const mongoose = require('mongoose');

router.post('/', function (req, res, next) {
  let data = req.body
  data.created_by = req.headers['user_id']
  data.shared_with = [req.headers['user_id']]
  let playlists = new playlist(data);
  console.log(playlists)
  playlists.save(function (err) {
    if (err) {
      res.json({ response: err.message });

    }
    else
      res.json({ status: 201, response: 'Playlist saved successfully!' });
  });
});


router.patch('/', async function (req, res, next) {

  if (req.body && req.body.id) {
    var pid = mongoose.Types.ObjectId(req.body.id);
    delete req.body.id
    let update = await playlist.findOne({ _id: pid });
    if (update) {
      playlist.updateOne({ _id: pid }, req.body).then(result => {
        res.json({ status: 200, response: 'Playlist updated successfully!' });
      }).catch(err => {
        res.json({ status: 400, response: err });

      });
    }
    else
      res.json({ status: 400, response: "no playlist found" });

  }
  else
    res.json({ status: 400, response: "playlist Id required" });
});

router.patch('/deletesong', async function (req, res, next) {

  if (req.body && req.body.id && req.body.songId) {

    var pid = mongoose.Types.ObjectId(req.body.id);
    delete req.body.id
    let update = await playlist.findOne({ _id: pid });
    if (update) {
      playlist.updateOne({ _id: pid }, { $pull: { 'songs': { '_id': mongoose.Types.ObjectId(req.body.songId) } } }).then(resp => {
        res.json({ status: 200, response: resp });
      }).catch(err => {
        console.log(err)
        res.json({ status: 500, response: err });
      })

    }
    else {
      res.json({ status: 400, response: "no playlist to update" });

    }
  }

  else
    res.json({ status: 400, response: "no songID or playlist_id found" });
});

router.get('/', async function (req, res, next) {
  console.log(req.query)
  console.log(req.headers['user_id'])

  if (req.headers && req.headers['user_id']) {
    playlist.find({ shared_with: [req.headers['user_id']] }, { shared_with: 0 }).then(result => {
      res.json({ status: 200, response: result });
    }).catch(err => {
      res.json({ status: 500, response: err });

    });
  }
  else
    res.json({ status: 400, error: "params required user_id" });
});


router.get('/share/:playlistId', async function (req, res, next) {
  if (!req.header && !(req.headers.user_id || req.headers.access_token)) {
    res.json({ status: 401, error: "UnAuthorised" });
  }
  let user_id;
  if (req.headers.user_id) {
    user_id = req.headers.user_id;
  }
  console.log("uid", user_id)
  const pid = mongoose.Types.ObjectId(req.params.playlistId);
  console.log("pid", pid)

  const sharelist = await playlist.findOne({ _id: pid }, { shared_with: 1, _id: 0 });
  console.log(sharelist)
  if (sharelist && user_id) {
    sharelist.shared_with.push(user_id)
    playlist.updateOne({ _id: pid }, { $addToSet: sharelist }).then(result => {
      res.json({ status: 200, response: 'Shared!' });
    }).catch(err => {
      res.json({ status: 400, error: err });
    });
  }
  else {
    res.json({ status: 404, response: "playlist Not Found or user not found" })
  }
});






module.exports = router;
