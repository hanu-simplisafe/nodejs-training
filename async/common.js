const TOO_FAST = 50;
const RIDE_WAIT = 2000;

const player = {
  name: 'Dan',
  death: undefined,
  ride: undefined,
};

const friends = [
  'Jam',
  'AJ',
  'Tim',
];

const rides = [
  'Bus',
  'Cab',
  'Helicopter',
  'UFO'
];

function randomTimeout(min, max, callback) {
  const delay = min + Math.floor(Math.random() * (max - min));
  setTimeout(callback, delay);
  return delay;
}

function doStep(step, callback) {
  const foot = step % 2 === 0 ? 'right' : 'left';
  console.log(`${player.name} lifted ${foot} foot for step ${step}.`);
  const delay = randomTimeout(500, 1500, () => {
    try {
      if (delay < 500 + TOO_FAST) {
        throw new Error(`${player.name} stumpled on ${foot} foot.`);
      }
      console.log(`- ${player.name} dropped ${foot} foot for step ${step}. [${delay}ms]`);
      callback(null, step + 1);
    } catch (err) {
      callback(err);
    }
  });
}

function doTravel(ride, callback) {
  console.log(`Party is travelling on ${ride}.`);
  const delay = randomTimeout(1000, 3000, () => {
    try {
      throwIfDead();
      console.log(`- Party completed travel on ${ride}! [${delay}ms]`);
      callback();
    } catch (err) {
      callback(err);
    }
  });
}

function waitForRide(ride, callback) {
  console.log(`Party is waiting for ride ${ride}.`);
  const delay = randomTimeout(500, 2500, () => {
    try {
      throwIfDead();
      if (player.ride) {
        console.log(`- ${ride} arrived, but party already left [${delay}ms]`);
      } else {
        player.ride = ride;
        console.log(`! ${ride} arrived! [${delay}ms]`);
      }
      callback(null, ride);
    } catch (err) {
      callback(err);
    }
  });
}

function waitForFriend(friend, callback) {
  console.log(`${player.name} is waiting for ${friend}.`);
  const delay = randomTimeout(500, 4500, () => {
    try {
      throwIfDead();
      if (delay < 500 + TOO_FAST) return callback(new Error(`${friend} was too fast and bumped into ${player.name}.`));
      console.log(`- ${friend} arrived! [${delay}ms]`);
      callback(null, friend);
    } catch (err) {
      callback(err);
    }
  });
}

function throwIfDead() {
  if (player.dead) throw new Error(`${player.name} is already dead.`);
}

module.exports = {
  player,
  friends,
  rides,
  RIDE_WAIT,

  throwIfDead,
  waitForFriend,
  waitForRide,
  doTravel,
  doStep,
};
