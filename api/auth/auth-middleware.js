const Users = require('../users/users-model')

/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
function restricted(req, res, next) {
    const err = { status: 401, message: 'You shall not pass!' }
    req.session.user 
        ? next() 
        : next(err)
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
async function checkUsernameFree(req, res, next) {
    const err = { status: 422, message: 'Username taken' }
    const { username } = req.body
    const [ user ] = await Users.findBy({ username })
    user 
        ? next(err) 
        : next()
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
async function checkUsernameExists(req, res, next) {
    const err = { status: 401, message: 'Invalid credentials' }
    const { username } = req.body
    const [ user ] = await Users.findBy({ username })
    if (user) {
        req.user = user
        next()
    }
    else {
        next(err)
    }
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength(req, res, next) {
    const err = { status: 422, message: 'Password must be longer than 3 chars' }
    const { password } = req.body
    password && password.length > 3 
        ? next() 
        : next(err)
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
    restricted,
    checkUsernameFree,
    checkUsernameExists,
    checkPasswordLength
}