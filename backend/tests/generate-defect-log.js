const fs = require('fs');

const results = JSON.parse(fs.readFileSync('../notificationController-defectLog.json', 'utf8'));

const defects = [];
let defectId = 1;

// Function to remove ANSI escape codes
function stripAnsi(str) {
  return str.replace(
    // eslint-disable-next-line no-control-regex
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    ''
  );
}

results.testResults.forEach(suite => {
  suite.assertionResults.forEach(test => {
    if (test.status === 'failed') {
      // Split the failure message into description and stack trace
      const fullMessage = stripAnsi(test.failureMessages.join(' | ').replace(/\r/g, ''));
      const firstLineEnd = fullMessage.indexOf('\n');
      let description = fullMessage;
      let stackTrace = '';
      if (firstLineEnd !== -1) {
        description = fullMessage.substring(0, firstLineEnd).trim();
        stackTrace = fullMessage.substring(firstLineEnd + 1).trim();
      }
      defects.push({
        defectId: `D${defectId.toString().padStart(3, '0')}`,
        testFile: suite.name,
        testCase: test.fullName,
        description: description.replace(/"/g, '""'),
        stackTrace: stackTrace.replace(/"/g, '""'),
        status: 'Open'
      });
      defectId++;
    }
  });
});

const csv = [
  'Defect ID,Test File,Test Case,Description,Stack Trace,Status',
  ...defects.map(d => `"${d.defectId}","${d.testFile}","${d.testCase}","${d.description}","${d.stackTrace}","${d.status}"`)
].join('\n');

fs.writeFileSync('workLogController-defectLog.csv', csv);
console.log('Defect log generated: defect_log.csv');