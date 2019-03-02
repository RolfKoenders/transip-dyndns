const chai = require('chai');

const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

// Make sure to expose expect as a global.
global.expect = chai.expect;

chai.should();