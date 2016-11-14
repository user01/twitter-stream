const Twitter = require('twitter');
const chalk = require('chalk');
const fs = require('fs');
const Datastore = require('nedb');
const moment = require('moment');


const env = require('dotenv').config();
const db = new Datastore({ filename: 'tweets.db' });


const streamParameters = {
  locations: '-74,40,-73,41' // New York City
}

const client = new Twitter({
  consumer_key: env.consumer_key,
  consumer_secret: env.consumer_secret,
  access_token_key: env.access_token_key,
  access_token_secret: env.access_token_secret
});


const userToLocal = (user) => {
  return {
    id: user["id_str"],
    screen_name: user["screen_name"],
    location: user["location"],
    name: user["name"]
  }
}
const tweetToLocal = (tweet) => {
  return {
    timestamp: moment(+tweet["timestamp_ms"]).toDate(),
    timestamp_ms: tweet["timestamp_ms"],
    user: userToLocal(tweet["user"]),
    text: tweet["text"],
    coordinates: tweet["coordinates"]
  }
}

db.loadDatabase((err) => {
  if (err) {
    console.error("Unable to work with database", e);
    return;
  }
  console.log(`Database is       [${chalk.green('online')}]`);


  client.stream('statuses/filter', streamParameters, (stream) => {
    stream.on('data', (event) => {
      if (!event.coordinates){
        return;
      }
      const tweet = tweetToLocal(event);
      db.insert(tweet, ()=>{
        // console.log(event && event.text);
        console.log(chalk.blue('________________________________________________________________________________'));
        console.log(` ${chalk.cyan('>>')} ${tweet.user.name}`);
        console.log(`    ${tweet.text}`);
        // console.log(`Tweet has been    [${chalk.green('inserted')}]`);
      });
    });

    stream.on('error', function(error) {
      console.log(`Twitter stream is [${chalk.red('offline')}]`);
      throw error;
    });

    console.log(`Twitter stream is [${chalk.green('online')}]`);
  });

});



console.log(chalk.blue('================================================================================'));
console.log('');
console.log(chalk.blue('================================================================================'));
console.log(`Main program is   [${chalk.green('online')}]`);
