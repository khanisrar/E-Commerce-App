
const express = require('express');
const cors = require('cors')
require('./db/config');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', require('./routers/user.router'));

app.use('/api/products', require('./routers/product.router'));

app.use('/api/vendors', require('./routers/vendor.router'));

app.listen(5000);