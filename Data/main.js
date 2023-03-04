const express = require('express');
var cors = require('cors')
const dataRouter=require('./routers/data')

let app = express();

require('./configs/database');

app.use(cors());

app.use(express.json());

app.use('/data', dataRouter);

app.listen(7000);