const mongooes = require('mongoose')


const connectionWithDb = () => {
    mongooes.connect(process.env.MONGO_URI,{
        useNewUrlParser: true,
        useUnifiedTopology:true
    })
    .then(console.log(`DB CONNECTED`))
    .catch(error => {
        console.log(`DB CONNECTED ISUUE`) 
        console.log(error)
        process.exit(1);
    })

}

module.exports = connectionWithDb