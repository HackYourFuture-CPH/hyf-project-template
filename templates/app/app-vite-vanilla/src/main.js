import api from './api.js';

// This is the main function for your app. You can add more functionality here.
function main() {
  console.log('Hello, world!');
  console.log("API configured at: ", api('/'));
}

main();