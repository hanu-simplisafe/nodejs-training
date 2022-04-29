/** Promises approach
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
  doStep,
  waitForFriend,
  waitForRide,
  doTravel,
  promiseTimeout,
  } = require('./common-promised');

function waitForAllFriends() {
  console.log(`${player.name} walking is done. Waiting for friends.`);
  return Promise.all(friends.map(friend => waitForFriend(friend)));
}

function waitForFirstRide(party) {
  console.log(`Party (${party.join(', ')}) is complete. Waiting for the first ride.`);

  const rideWaitPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!player.ride) return reject(new Error(`No ride has arrived for ${RIDE_WAIT}ms.`));
    }, RIDE_WAIT);
  });

  return Promise.race([
    ...rides.map(ride => waitForRide(ride)),
    rideWaitPromise,
  ]);
}

async function init() {
  try {
    const step2 = await doStep(1);
    const step3 = await doStep(step2);
    const step4 = await doStep(step3);
    await doStep(step4);
    const party = await waitForAllFriends();
    const ride = await waitForFirstRide(party);
    await doTravel(ride);
    console.log('Success!');
  } catch(err) {
    console.error(err.message, `${player.name} is dead.`);

  } finally {
    console.log('The end.')
  }
}

init()
