const sinon = require('sinon');
const { expect } = require('chai');
const axios = require('axios');
const UserDataHandler = require('./user_data_handler');
const nock = require('nock');
const { responseBody,
  fakeUser,
  fakeSecUser,
  expectedUser,
  incorrectExpUser,
  emptyUserList,
  notSearchParamObject } = require('../../data/constants');



describe("unit tests with stub", async () => {
    let stub;
    const userDataHandler = new UserDataHandler();


 describe("unit tests with nock", async () => {   


    it("should return usersList with properties from loadUsers method - nock", async () => {
      nock('http://localhost:3000')
        .get('/users')
        .reply(200, responseBody);
      const response = await userDataHandler.loadUsers('http://localhost:3000/users');
      response.forEach(item => {
        expect(item).not.to.have.property('ids');
        expect(item).to.have.property('id');
        expect(item).to.have.property('name');
        expect(item).to.have.property('username');
        expect(item).to.have.property('email');
    })
  })

    it("should not return the list of users from loadUsers method - nock", async () =>{
      nock('http://localhost:3000')
        .get('/users1')
        .replyWithError("Sorry can't find that!"  );
        try{
        await userDataHandler.loadUsers('http://localhost:3000/users1');
        } catch (error) {
            expect(error.message).to.include(`Sorry can't find that!`);
        }
    })


    it("should return length of userList - nock", async () => {
      nock('http://localhost:3000')
        .get('/users')
        .reply(200, responseBody);
      const response = await userDataHandler.loadUsers('http://localhost:3000/users');
      expect(userDataHandler.getNumberOfUsers()).to.equal(response.length);
   
    })


    it("should return userEmails from userList - nock", async () => {
      nock('http://localhost:3000')
        .get('/users')
        .reply(200, responseBody);
        const response = await userDataHandler.loadUsers('http://localhost:3000/users');
        let responseList = response.map(item => 
            item.email)
       const listOfUSerEmails = responseList.join(';')    
       expect(userDataHandler.getUserEmailsList()).to.equal(listOfUSerEmails);
    })  


    it("should return No users loaded! if the userList is empty - nock", async () => {
        nock('http://localhost:3000')
          .get('/users')
          .reply(200, emptyUserList);
        await userDataHandler.loadUsers('http://localhost:3000/users');
        try{
          await userDataHandler.getUserEmailsList();
          } catch (error) {
            expect(error.message).to.equal('No users loaded!');
          }        
      })


    it("should return true if key parameters in users objects are matched - nock", async () => {
        nock('http://localhost:3000')
          .get('/users')
          .reply(200, fakeUser);
        const response = await userDataHandler.loadUsers('http://localhost:3000/users');
        let actUser = response;
        expect(userDataHandler.isMatchingAllSearchParams(actUser, expectedUser)).to.be.true;
      })


    it("should return false if key parameters in users objects are not matched - nock", async () => {
        nock('http://localhost:3000')
          .get('/users')
          .reply(200, fakeUser);
        const response = await userDataHandler.loadUsers('http://localhost:3000/users');
        let actUser = response;
        expect(userDataHandler.isMatchingAllSearchParams(actUser, incorrectExpUser)).to.be.false;
      })


    it("should return array of object - nock", async () => {
        nock('http://localhost:3000')
          .get('/users')
          .reply(200, fakeSecUser);
        await userDataHandler.loadUsers('http://localhost:3000/users');
        const expResponse = await userDataHandler.findUsers(expectedUser);
        expect(expResponse.length).not.to.equal(0);
        expect(expResponse.length).to.equal(1);
      })


    it("should return No matching users found - nock", async () => {
        nock('http://localhost:3000')
          .get('/users')
          .reply(200, fakeSecUser);
        await userDataHandler.loadUsers('http://localhost:3000/users');
          try{
        await userDataHandler.findUsers(incorrectExpUser);
            } catch (error) {
        expect(error.message).to.equal('No matching users found!');
      }
    })


    it("should return No users loaded! if the userList empty - nock", async () => {
      nock('http://localhost:3000')
        .get('/users')
        .reply(200, emptyUserList);
      await userDataHandler.loadUsers('http://localhost:3000/users');
        try{
      await userDataHandler.findUsers(incorrectExpUser);
        } catch (error) {
        expect(error.message).to.equal('No users loaded!');
      }
    })


    it("should return No search parameters provided! if not object is provided - nock", async () => {
      nock('http://localhost:3000')
        .get('/users')
        .reply(200, fakeSecUser);
      await userDataHandler.loadUsers('http://localhost:3000/users');
        try{
      await userDataHandler.findUsers(notSearchParamObject);
        } catch (error) {
      expect(error.message).to.equal('No search parameters provided!');
      }
    })

  })   


  describe("unit test with sinon stub", async () => {

    afterEach(() => {
      stub.restore();
    })


    it("should return usersList with properties from loadUsers method - sinon", async () => {
        stub = sinon.stub(axios, 'get').resolves(responseBody);
        const response = await userDataHandler.loadUsers('http://localhost:3000/users');
        response.forEach(item => {
            expect(item).not.to.have.property('ids');
            expect(item).to.have.property('id');
            expect(item).to.have.property('name');
            expect(item).to.have.property('username');
            expect(item).to.have.property('email');
        })
    })

    it("should not return the list of users from loadUsers method - sinon", async () =>{
        let expectedError = (new Error(`Sorry can't find that!`));
        stub = sinon.stub(axios, 'get').throws(expectedError);
        try{
        await userDataHandler.loadUsers('http://localhost:3000/users1');
        } catch (error) {
            expect(error.message).to.include(`Sorry can't find that!`);
        }
    })

    it("should return length of userList - sinon", async () => {
      stub = sinon.stub(axios, 'get').resolves(responseBody);
      const response = await userDataHandler.loadUsers('http://localhost:3000/users');
      expect(userDataHandler.getNumberOfUsers()).to.equal(response.length);
    })


    it("should return userEmails from userList - sinon", async () => {
        stub = sinon.stub(axios, 'get').resolves(responseBody);
        const response = await userDataHandler.loadUsers('http://localhost:3000/users');
        let responseList = response.map(item => 
            item.email)
       const listOfUSerEmails = responseList.join(';')    
       expect(userDataHandler.getUserEmailsList()).to.equal(listOfUSerEmails);
    })

    it("should return No users loaded! if the userList is empty - sinon", async () => {
        stub = sinon.stub(axios, 'get').resolves(emptyUserList);
        await userDataHandler.loadUsers('http://localhost:3000/users');
        try{
          await userDataHandler.getUserEmailsList();
          } catch (error) {
            expect(error.message).to.equal('No users loaded!');
          }       
    })


    it("should return true if key parameters in users objects are matched - sinon", async () => {
        stub = sinon.stub(axios, 'get').resolves(fakeUser);
        const response = await userDataHandler.loadUsers('http://localhost:3000/users');
        let actUser = response;
        expect(userDataHandler.isMatchingAllSearchParams(actUser, expectedUser)).to.be.true;
    })

    it("should return false if key parameters in users objects are not matched - sinon", async () => {
      stub = sinon.stub(axios, 'get').resolves(fakeUser);
      const response = await userDataHandler.loadUsers('http://localhost:3000/users');
      let actUser = response;
      expect(userDataHandler.isMatchingAllSearchParams(actUser, incorrectExpUser)).to.be.false;
    })


    it("should return array of object - sinon", async () => {
      stub = sinon.stub(axios, 'get').resolves(fakeSecUser);
      await userDataHandler.loadUsers('http://localhost:3000/users');
      const expResponse = await userDataHandler.findUsers(expectedUser);
      expect(expResponse.length).not.to.equal(0);
      expect(expResponse.length).to.equal(1);
    })


    it("should return No matching users found", async () => {
      stub = sinon.stub(axios, 'get').resolves(fakeSecUser);
      await userDataHandler.loadUsers('http://localhost:3000/users');
      try{
      await userDataHandler.findUsers(incorrectExpUser);
      } catch (error) {
        expect(error.message).to.equal('No matching users found!');
      }
    })


    it("should return No users loaded! if the userList empty", async () => {
      stub = sinon.stub(axios, 'get').resolves(emptyUserList);
      await userDataHandler.loadUsers('http://localhost:3000/users');
      try{
      await userDataHandler.findUsers(incorrectExpUser);
      } catch (error) {
        expect(error.message).to.equal('No users loaded!');
      }
    })


    it("should return No search parameters provided! if not object is provided", async () => {
      stub = sinon.stub(axios, 'get').resolves(fakeSecUser);
      await userDataHandler.loadUsers('http://localhost:3000/users');
      try{
      await userDataHandler.findUsers(notSearchParamObject);
      } catch (error) {
        expect(error.message).to.equal('No search parameters provided!');
      }
    })

  })  

})
