'use strict';

const chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;
var assert = require('assert');
var User = require('../../app/models/user');
const mongoose = require('mongoose')

describe('User', function() {
    this.timeout(10000);
    before(async function() {
        await mongoose.connect('mongodb://localhost/test');
        await mongoose.connection.db.dropDatabase();
    });
    it('Should create user successfully', async function() {
        const user = await User.newLocalUser(
            'username', 'email@gmail.com', 'password');
        const foundUser = await User.findLocalUserByUsername('username');
        assert(foundUser.local.password == 'password');
    });
    it('Should fail to create user with the same name', async function() {
        await expect(User.newLocalUser('username', 'email@gmail.com', 'password'))
            .to.eventually.be.rejectedWith('User: username already exists');
    });
    it.skip('Should be able to insert many users', async function() {
        for (var i = 0; i < 3000; i++) {
            if (i % 100 == 0) {
                console.log(i + ' users created');
            }
            const user = await User.newLocalUser(
                'username'+i, 'email@gmail.com', 'password');
            const foundUser = await User.findLocalUserByUsername('username' + i);
            assert(foundUser.local.password == 'password');
        }
    });
    
    after(async function() {
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
    });
});
