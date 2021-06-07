var express = require('express');
var router = express.Router();
var {fire} =  require('../fire');
var {languageOptions} = require('../data/languageOptions')
var {countryOptions}= require('../data/countryOptions')
var {timezoneOptions} = require('../data/timezoneOptions')

/* GET users listing. */
router.post('/register', function(req, res, next) {
  console.log(req.get('Accept-Language'))
  fire.auth().createUserWithEmailAndPassword(req.body.email, req.body.password)
  .then((userCredential) => {
    const target = [languageOptions.filter((e) => e.value === req.body.target)[0].key]
    const native = languageOptions.filter((e) => e.value === req.body.native)[0].key
    const country = countryOptions.filter((e) => e.value === req.body.country)[0].key
    const timezone = timezoneOptions.filter((e) => e.value === req.body.timezone)[0].key

    fire.firestore().collection('users').doc(userCredential.user.uid).set({
      name: req.body.name,
      email: req.body.email,
      target: target,
      native: native,
      country: country,
      timezone: timezone,
      username: req.body.username
    }).then((data) => {
      res.json({status: 200, message: 'successfully registered user', user: {
        name: req.body.name,
        email: req.body.email,
        target: target,
        native: native,
        country: country,
        timezone: timezone,
        username: req.body.username,
      }});
    }).catch((error) => {
      res.json({status: 200, message: 'could not upload user data to firestore'})
    })
  })
  .catch((error) => {
    res.json({status: 200, message: 'could not register user'})
  });
});

router.get('/login', function(req, res, nex) {
  fire.auth().signInWithEmailAndPassword(req.query.email, req.query.password)
  .then((userCredential) => {
    fire.firestore().collection('users').doc(userCredential.user.uid).get().then((doc) => {
      res.json({status: 200, message: 'successfully logged user in', user: doc.data()})
    }).catch((error) => {
      console.log(error)
      res.json({status: 400, message: 'could not get user object', user: null})
    })
  })
  .catch((error) => {
    console.log(error)
    res.json({status: 400, message: 'could not get user object', user: null})
  });
})

router.get('/check/username', function(req, res, next) {
  fire.firestore().collection('users').where("username", "==", req.query.username).get().then((querySnapshot) => {
    if (querySnapshot.docs.length > 0) {
      res.json({status: 200, message: 'username is not available.', available: false})
    } else {
      res.json({status: 200, message: 'username is available.', available: true})
    }
  }).catch((error) => {
    console.log(error)
    res.json({status: 400, message: 'could not check if username is available.'})
  })
})

router.get('/check/email', function(req, res, next) {
  fire.firestore().collection('users').where("email", "==", req.query.email).get().then((querySnapshot) => {
    if (querySnapshot.docs.length > 0) {
      res.json({status: 200, message: 'email is already in use.', available: false})
    } else {
      res.json({status: 200, message: 'email is available.', available: true})
    }
  }).catch((error) => {
    console.log(error)
    res.json({status: 400, message: 'could not check if username is available.'})
  })
})



module.exports = router;
