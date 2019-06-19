const User = require('../../models/User');
const UserSession = require('../../models/UserSession')

module.exports = (app) => {
  app.post('/api/account/signup', (request, result, next) => {
    const { body } = request
    var { firstName, lastName, email, password } = body

    // TODO: DRY 
    if (!firstName) {
      return result.send({
        success: false,
        message: 'Error: First name can not be blank.'
      })
    }

    if (!lastName) {
      return result.send({
        success: false,
        message: 'Error: Last name can not be blank.'
      })
    }

    if (!email) {
      return result.send({
        success: false,
        message: 'Error: Email can not be blank.'
      })
    }

    if (!password) {
      return result.send({
        success: false,
        message: 'Error: Password can not be blank.'
      })
    }

    email = email.toLowerCase()

    // Verify email doesn't exist

    // Save
    User.find({
      email: email
    }, (error, previousUsers) => {
      if(error) {
        return result.send({
          success: false,
          message: 'Error: Server error with email.'
        }) // TODO: Better error message
      } else if(previousUsers.length > 0 ) {
        return result.send({
          success: false,
          message: 'Error: Email is already in use.'
        })
      }

      // Save the new User
      var user = new User()

      user.email = email
      user.firstName = firstName;
      user.lastName = lastName;
      user.password = user.generateHash(password)
      user.save((error, user) => {
        if(error){
          return result.send({
            success: false,
            message: `Error: Server error: ${error}`
          })
        }

        return result.send({
          success: true,
          message: 'Signed up'
        })
      })
    })
  })

  app.post('/api/account/signin', ({ body }, result, next) => {
    let { password, email } = body
    email = email.toLowerCase()
    
    if (!email) {
      return result.send({
        success: false,
        message: 'Error: Email can not be blank.'
      })
    }

    if (!password) {
      return result.send({
        success: false,
        message: 'Error: Password can not be blank.'
      })
    }

    User.find({ email }, (error, users) => {
      if(error){
        return result.send({
          success: false,
          message: `Error: ${error}` // Accurate?
        })
      }

      if(users.length != 1){
        return result.send({
          success: false,
          message: `Error: Email not in use`
        })
      }

      const user = users[0]
      if(!user.validPassword(password)){
        return result.send({
          success: false,
          message: `Error: Invalid password`
        })
      }

      // User is correct
      const userSession = new UserSession()
      userSession.id = user.id
      userSession.save((error, document) => {
        if (error) {
          return result.send({
            success: false,
            message: `User Session Error: ${error}`
          })
        }

        return result.send({
          success: true,
          message: 'Valid sign in',
          token: document._id
        })
      })
    })
  })

  app.get('/api/account/verify', (request, result, next) => {
    // Get token
    const { query } = request
    const { token } = query // ?token=test
    
    // Verify the token is one of a kind and not deleted
    UserSession.find({
      _id: token,
      isDeleted: false
    }, (error, sessions) => {
      if(error){
        return result.send({
          success: false,
          message: `User Session Error: ${error}`
        })
      }

      if(sessions.length != 1){
        return result.send({
          success: false,
          message: 'User Session Error: Session not found'
        })
      }else{
        return result.send({
          success: true,
          message: 'User Session Verified'
        })
      }
    })
  })

  app.get('/api/account/logout', (request, result, next) => {
    // Get token
    const { query } = request
    const { token } = query // ?token=test
    
    // Verify the token is one of a kind and not deleted
    UserSession.findOneAndUpdate({
      _id: token,
      isDeleted: false
    }, {
      $set: {isDeleted: true}
    }, null, (error, sessions) => {
      if(error){
        return result.send({
          success: false,
          message: `User Session Error: ${error}`
        })
      }

      return result.send({
        success: true,
        message: 'User logged out successfully'
      })
    })
  })
}