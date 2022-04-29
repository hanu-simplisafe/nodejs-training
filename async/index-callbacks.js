/** Callbacks approach
 *  
 * Player should make 10 steps to meet all his friends and then get on the first ride that cames.
 * If the ride is delayed more than 2 seconds, he should walk.
 * 
 * Potential issues:
 * - A friend may arrive too fast and kill the player.
 * - A step may be done too fast and kill the player.
 */

const {
  // Setup
  player,
  friends,
  rides,
  RIDE_WAIT,

  // Actions
  waitForFriend,
  waitForRide,
  doTravel,
  doStep,
  } = require('./common');


function waitForAllFriends(callback) {
  console.log(`${player.name} walking is done. Waiting for friends.`);
  function checkForParty() {
    if (friendsArrived.length >= friends.length) {
      callback(null, friends);
    }
  }
  const friendsArrived = [];
  friends.forEach(friend => {
    waitForFriend(friend, (err) => {
      if (err) return callback(err);
      friendsArrived.push(friend);
      checkForParty();
    });
  })
}

function waitForFirstRide(party, callback) {
  console.log(`Party (${party.join(', ')}) is complete. Waiting for the first ride.`);
  let firstRide = null;

  rides.forEach((ride) => {
    waitForRide(ride, (err) => {
      if (err) return callback(err);
      if (firstRide) {
        return;
      };
      firstRide = ride;
      return callback(null, firstRide);
    });
  });

  setTimeout(() => {
    if (!firstRide) return callback(new Error(`No ride has arrived on for ${RIDE_WAIT}ms.`));
  }, RIDE_WAIT);
}


function init() {
  let errorShown = false;

  ((callback) => {
    doStep(1, (err, step) => {
      if (err) return callback(err);
      doStep(step, (err, step) => {
        if (err) return callback(err);
        doStep(step, (err, step) => {
          if (err) return callback(err);
          doStep(step, (err, step) => {
            if (err) return callback(err);
            doStep(step, (err) => {
              if (err) return callback(err);
              waitForAllFriends((err, party) => {
                if (err) return callback(err);
                waitForFirstRide(party, (err, ride) => {
                  if (err) return callback(err);
                  doTravel(ride, (err) => {
                    if (err) return callback(err);
                    callback(err);
                  });            
                });
              });
            });
          });
        });
      });
    });
  })((err) => {
    if (err) {
      if (errorShown) return;
      player.dead = err;
      errorShown = true;
      console.error(err.message, `${player.name} is dead.`);
    } else {
      console.log('Success!');
    }
    console.log('The end.');  
  });
}

init();
