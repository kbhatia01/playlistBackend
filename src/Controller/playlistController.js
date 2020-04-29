var express = require('express');
var router = express.Router();
var playlist = require('../Model/playlistModel');
const mongoose = require('mongoose');

router.post('/playlist', function (req, res, next) {
  let data = req.body
  data.shared_with = [req.body.created_by]
  let playlists = new playlist(data);
  console.log(playlists)
  playlists.save(function (err) {
    if (err) {
      res.json({ error: err.message });

    }
    else
      res.json({ response: 'User saved successfully!' });
  });
});



router.patch('/playlist', async function (req, res, next) {

  if (req.body && req.body.id) {
    var pid = mongoose.Types.ObjectId(req.body.id);
    delete req.body.id
    let update = await playlist.findOne({ _id: pid });
    if (update) {
      playlist.updateOne({ _id: pid }, req.body).then(result => {
        res.json({ status: 200, response: 'User saved successfully!' });
      }).catch(err => {
        res.json({ status: 400, error: err });

      });
    }
    else
      res.json({ status: 400, error: "no playlist found" });

  }
  else
    res.json({ status: 400, error: "Id required in body" });
});


router.get('/playlist', async function (req, res, next) {
  console.log(req.query)
  console.log(req.query.user_id)

  if (req.query && req.query.user_id) {
    playlist.find({ shared_with: [req.query.user_id] }, { shared_with: 0 }).then(result => {
      res.json({ status: 200, response: result });
    }).catch(err => {
      res.json({ status: 400, error: err });

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
    user_id = user_id;
  }
  const pid = mongoose.Types.ObjectId(req.params.playlistId);

  const aplaylist = playlist.findOne({ _id: pid }, { shared_with: 0 });

  if (aplaylist && user_id) {
    playlist.updateOne({ _id: pid }, { shared_with: aplaylist.shared_with.push(user_id) }).then(result => {
      console.log(result)
      res.json({ status: 200, response: 'Shared!' });
    }).catch(err => {
      res.json({ status: 400, error: err });
    });
  }
  else {
    res.json({ status: 404, response: "playlist Not Found " })
  }
});






module.exports = router;
