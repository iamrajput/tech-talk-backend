//try catch async - await || use promiss everywhere

module.exports = func => (req,res,next) => 
Promise.resolve(func(req,res,next)).catch(next);