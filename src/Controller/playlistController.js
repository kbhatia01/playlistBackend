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
    console.log(req.body)
    var pid = mongoose.Types.ObjectId(req.body.id);
    delete req.body.id
    let update = await playlist.findOne({ _id: pid });
    if (update) {
      console.log(req.headers['user_id'])
      if ((req.headers['user_id']) != update.created_by) {
        res.json({ status: 401, response: "UnAuthorised" });
      }
      else {
        playlist.updateOne({ _id: pid }, req.body).then(result => {
          res.json({ status: 200, response: 'Playlist updated successfully!' });
        }).catch(err => {
          res.json({ status: 400, response: err });

        });
      }
    }
    else
      res.json({ status: 400, response: "no playlist found" });

  }
  else
    res.json({ status: 400, response: "playlist Id required" });
});


router.patch('/deletesong', async function (req, res, next) {
  console.log(req.body)
  if (req.body && req.body.id && req.body.songId) {

    var pid = mongoose.Types.ObjectId(req.body.id);
    delete req.body.id
    let update = await playlist.findOne({ _id: pid });
    if (update) {
      if (req.headers['user_id'] != update.created_by) {
        res.json({ status: 401, response: "UnAuthorised" });
      }
      else {
        playlist.updateOne({ _id: pid }, { $pull: { 'songs': { '_id': mongoose.Types.ObjectId(req.body.songId) } } }).then(resp => {
          res.json({ status: 200, response: resp });
        }).catch(err => {
          console.log(err)
          res.json({ status: 500, response: err });
        })
      }

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
    playlist.find({ shared_with: { $all: [req.headers['user_id']] }, state: "ACTIVE" }, { shared_with: 0 }).then(result => {
      res.json({ status: 200, response: result });
    }).catch(err => {
      res.json({ status: 500, response: err });

    });
  }
  else
    res.json({ status: 400, error: "params required user_id" });
});
router.get('/id', async function (req, res, next) {
  console.log(req.query.id)
  console.log(req.headers['user_id'])

  if (req.headers && req.headers['user_id'] && req.query.id) {
    let play = await playlist.findOne({ shared_with: { $all: [req.headers['user_id']] }, _id: mongoose.Types.ObjectId(req.query.id), state: "ACTIVE" }, { shared_with: 0 });
    console.log("playss", play)
    if (!play) {
      sharePlaylist(req, res);
    }
    else {
      res.json({ status: 200, response: play })
    }
  }
  else
    res.json({ status: 400, response: "params required user_id" });
});


router.get('/share/', async function (req, res, next) {
  if (!req.headers && !(req.headers.user_id || req.headers.access_token)) {
    res.json({ status: 401, response: "UnAuthorised" });
  }

  sharePlaylist(req, res);
});
async function sharePlaylist(req, res) {
  let user_id;
  if (req.headers.user_id) {
    user_id = req.headers.user_id;
  }
  console.log("uid", user_id)
  console.log("play", req.query.id)

  console.log("req", req.query.id)
  const pid = mongoose.Types.ObjectId(req.query.id);
  console.log("pid", pid)

  const sharelist = await playlist.findOne({ _id: pid, state: "ACTIVE" });
  console.log("sharewith", sharelist)
  if (sharelist && user_id) {
    sharelist.shared_with.push(user_id)
    playlist.updateOne({ _id: pid }, { $addToSet: { shared_with: sharelist.shared_with } }).then(result => {
      res.json({ status: 200, response: sharelist });
    }).catch(err => {
      res.json({ status: 400, response: err });
    });
  }
  else {
    res.json({ status: 404, response: "playlist Not Found or user not found" })
  }
}





module.exports = router;
