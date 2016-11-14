const Twitter = require('twitter');
const chalk = require('chalk');
const fs = require('fs');
const Datastore = require('nedb');

const env = require('dotenv').config();
const db = new Datastore({ filename: 'tweets.db' });


const streamParameters = {
  locations: '-74,40,-73,41'
}

const client = new Twitter({
  consumer_key: env.consumer_key,
  consumer_secret: env.consumer_secret,
  access_token_key: env.access_token_key,
  access_token_secret: env.access_token_secret
});



db.loadDatabase((err) => {
  if (err) {
    console.error("Unable to work with database", e);
    return;
  }
  console.log(`Database is       [${chalk.green('online')}]`);


  client.stream('statuses/filter', streamParameters, (stream) => {
    stream.on('data', (event) => {
      console.log(event && event.text);
      if (!event.coordinates){
        return;
      }
      db.insert(event, ()=>{
        console.log(`Tweet has been    [${chalk.green('inserted')}]`);
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
