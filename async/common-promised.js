const {
  // callbacks to covert to promises
  doStep: doStepCallback,
  waitForFriend: waitForFriendCallback,
  waitForRide: waitForRideCallback,
  doTravel: doTravelCallback,

  ...rest
} = require('./common');


function promisify(fn) {
  return (...args) => new Promise((resolve, reject) => {
    fn(...args, (err, ...result) => {
      if (err) return reject(err);
      resolve(...result);
    })
  });
}

function doStep(step) {
  return new Promise(function(resolve, reject) {
    doStepCallback(step, (err, next) => {
      err ? reject(err) : resolve(next) ;
    });
  });
}

const waitForFriend = promisify(waitForFriendCallback);
const waitForRide = promisify(waitForRideCallback);
const doTravel = promisify(doTravelCallback);

module.exports = {
  ...rest,

  waitForFriend,
  waitForRide,
  doTravel,
  doStep,
};
