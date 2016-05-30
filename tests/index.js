// do not add tests to this file, add tests to other .spec.js
const req = require.context('.', false, /\.spec\.js$/);
req.keys().forEach(req);
