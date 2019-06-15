const bcrypt = require('bcryptjs')
const saltRounds = 10


//start of hash password function
let hashpassword = (myPlaintextPassword) => {
    let salt = bcrypt.genSaltSync(saltRounds)
    let hash = bcrypt.hashSync(myPlaintextPassword, salt)
    return hash;
  }; //end of hash password function
  
  
  //start of comapare password function
  let comparePassword = (oldPassword, hashpassword, cb) => {
    bcrypt.compare(oldPassword, hashpassword, (err, res) => {
      if (err) {
        cb(err, null)
      } else {
        cb(null, res)
      }
    })
  }; //end of compare password function
  
  
module.exports = {
    hashpassword: hashpassword,
    comparePassword: comparePassword
  }
  