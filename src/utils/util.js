const fs = require('fs');
const path = require('path');

function logger(log) {
  if (typeof log === "object") {
    log = JSON.stringify(log)
  }
  const callerFile = module.parent.filename;
  console.log(` ${callerFile}: ${log}`);
}

function logToFile(logData) {
  const logFilePath = path.join(__dirname, 'logs.json');
  
  // Read existing log data, or initialize an empty array if the file doesn't exist
  let existingLogs = [];
  if (fs.existsSync(logFilePath)) {
    existingLogs = JSON.parse(fs.readFileSync(logFilePath, 'utf8'));
  }

  // Add new log data to the array
  existingLogs.push(logData);

  // Write updated log data to the file
  fs.writeFileSync(logFilePath, JSON.stringify(existingLogs, null, 2));

  console.log('Log added to file:', logData);
}

module.exports = {
  logger,
  logToFile
}