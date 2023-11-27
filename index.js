const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = 5000;
const { MONGO_URI } = require('./keys');
const cors = require('cors');
const corsOptions = {
	origin: '*',
	credentials: true,
	optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

mongoose.connect(MONGO_URI);

require('./models/users');
require('./models/post');

app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/post'));

mongoose.connection.on('connected', () => {
	console.log('MongoDB connected successfully');
});

app.listen(PORT, () => {
	console.log(`Server has been started on port ${PORT}`);
});

// 9p0AUS1EAA8Hbrgr
// uchqunturdiev
