const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://root:root@cluster0.enim4.mongodb.net/test',
 {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', err=>console.log(err));
db.once('open', () =>{
  // we're connected!
  console.log('connected to mongo on localhost')
});

let Query = (q,params) =>{
  return new Promise((resolve,reject)=>{
      db.query(q,params,(err,results)=>{
          if (err){
              reject(err)   
              console.log(err)
          }else{ 
              resolve(results)
          }
      })
  })
}

module.exports = Query