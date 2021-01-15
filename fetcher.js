const request = require('request');
const fs = require('fs');
const readline = require('readline');
const input = process.argv.splice(2);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const req = (write) => {
  request(input[0], (err, body) => {
    if (err) {
      console.log('error: ', err);
    } else {
      if (fs.existsSync(input[1])) {
        overwrite(() => {
          write(body.body, input[1]);
          rl.close();
        });
      } else {
        write(body.body, input[1]);
        rl.close();
      }
    }
  });
};

const overwrite = (callback) => {
  rl.question('File already exists, would you like to overwrite the file? (Y/N)', (ans) => {
    if (ans === 'y' || ans === 'Y'){
      callback();
    } else {
      process.exit;
    }
  });
};

const writeFile = (data, output) => {
  fs.writeFile(output, data, 'utf8', (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Downloaded and saved ${(fs.statSync(output)).size} bytes to ${output}`);
    }
  });
};

req(writeFile);

