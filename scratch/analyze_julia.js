const fs = require('fs');

const juliaData = fs.readFileSync('leads/EGSS-juliamonir01.csv', 'utf8');
const uncoveredData = fs.readFileSync('leads/EGSS-juliamonir01_Uncovered_Leads.csv', 'utf8');
const targetData = fs.readFileSync('leads/high_potential/EGSS-juliamonir01_target_students.csv', 'utf8');

const ids = [
  '64129119', // Upgrade Base M2, 17 classes, 4 booked
  '63973446', // Upgrade Base M2, 16 classes, 0 booked
  '63854359', // 20 classes completed, 4 booked
  '63149661', // 18 classes completed, 9 booked, Exp Non-0
  '64157496', // Upgrade Base M2, 14 classes completed, 4 booked, EC booking
  '58824521', // Upgrade Base M2, 13 classes completed, 5 booked
  '63910713', // Upgrade Base M2, 13 classes completed, 4 booked
  '64007331', // Upgrade Base M2, 13 classes completed, 4 booked
  '64131292', // Upgrade Base M2, 12 classes completed, 2 booked, EC booking
  '63495185'  // 21 classes completed, #1 most active student
];

console.log('=== DETAILS FOR SELECTED 10 STUDENTS ===');
ids.forEach(id => {
  console.log(`\n==============================================`);
  console.log(`STUDENT ID: ${id}`);
  
  // Target
  const tLine = targetData.split(/\r?\n/).find(l => l.startsWith(id + ','));
  if (tLine) console.log('Target/Attendance:', tLine);

  // Uncovered
  const uLine = uncoveredData.split(/\r?\n/).find(l => l.includes(`"${id}"`));
  if (uLine) console.log('Uncovered Info:', uLine);

  // Rep file lines
  const rLines = juliaData.split(/\r?\n/).filter(l => l.includes(id));
  console.log('Rep Tasks:');
  rLines.forEach(l => console.log('  ->', l));
});
