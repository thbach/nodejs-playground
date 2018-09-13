// const {SHA256} = require('crypto-js');
// const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const password = '123abc!';

bcrypt.genSalt(10, (e, salt) => {
  bcrypt.hash(password, salt, (e, hash) => {
    console.log(hash);
  });
});

const hashedPassword = '$2a$10$SvjDUg/7.z11B82gkGRhu.AjZ.7v1gCdtY.A9zNDqUxc3pB0afxBS';

bcrypt.compare(password, hashedPassword, (e, res) => {
  console.log(res);
});

// const data = {
//   id: 10,
// };

// const secret = '123';
// const token = jwt.sign(data, secret);
// console.log(token);

// // secret = '1234';
// const decoded = jwt.verify(token, secret);
// console.log(decoded);

// const message = '! am user number 3';
// const hash = SHA256(message).toString();

// console.log(`message: ${message}`);
// console.log(`hash: ${hash}`);

// const data = {
//   id: 4,
// };

// const secret = 'somesecret';

// const token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + secret).toString(),
// };

// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

// const resultHash = SHA256(JSON.stringify(token.data) + secret).toString();

// if (resultHash === token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.log('Data was changed, dont trust');
// }
