const sum = require('../index');
const expect = require('expect.js');

it('can add a lot of things', () => {
  expect(sum(2, 4)).to.be(6);
});
