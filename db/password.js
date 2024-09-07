const crypto = require('crypto');

const hash1 = crypto.createHash('sha256').update('John1234!').digest('hex');
const hash2 = crypto.createHash('sha256').update('Kelly2024#').digest('hex');
const hash3 = crypto.createHash('sha256').update('Monica@789').digest('hex');
const hash4 = crypto.createHash('sha256').update('Jacob_4567').digest('hex');
const hash5 = crypto.createHash('sha256').update('Alice#1234').digest('hex');
const hash6 = crypto.createHash('sha256').update('Bob@5678').digest('hex');
const hash7 = crypto.createHash('sha256').update('Charlie_2024').digest('hex');
const hash8 = crypto.createHash('sha256').update('David!4321').digest('hex');


console.log(hash1);
console.log(hash2);
console.log(hash3);
console.log(hash4);
console.log(hash5);
console.log(hash6);
console.log(hash7);
console.log(hash8);




