const fs = require('fs');

fs.readFile('config.json', 'utf-8', (err, data) => {
    if (err) throw err;

    return exports.data = JSON.parse(data);
});

