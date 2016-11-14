const Twitter = require('twitter');
const chalk = require('chalk');
const env = require('dotenv').config();


const client = new Twitter({
  consumer_key: env.consumer_key,
  consumer_secret: env.consumer_secret,
  access_token_key: env.access_token_key,
  access_token_secret: env.access_token_secret
});


client.stream('statuses/filter', {track: 'javascript'}, function(stream) {
  stream.on('data', function(event) {
    console.log(event && event.text);
  });

  stream.on('error', function(error) {
    throw error;
  });
});

console.log(chalk.blue('================================================================================'));
console.log('');
console.log(chalk.blue('================================================================================'));
console.log(`Twitter stream is [${chalk.green('online')}]`);
