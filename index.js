const express = require('express')
const path = require('path')
require('./db')

const app = express()
app.use(express.json())
app.use(require('cors')())

app.use('/users',require('./router/users'))
app.use('/flights',require('./router/flights'))
app.use("/public",express.static("public"))

const port = process.env.PORT || 1777;
app.get('/**', (req, res) => {
 res.sendFile(path.join(__dirname, 'public', 'index.html'));
})
app.listen(port, () => {
 console.log(`App listening on port ${port}!`)
});
//  app.listen(1777,()=>console.log('1777 is run'))