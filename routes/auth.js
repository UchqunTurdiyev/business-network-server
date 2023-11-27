const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const User = mongoose.model('User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../keys');
const login = require('../midlware/login');

router.get('/protected', login, (req, res) => {
	res.send('Hello Auth');
});

router.post('/signup', (req, res) => {
	const { name, email, password } = req.body;
	if (!name || !email || !password) {
		res.status(422).json({ error: 'Please all the fields' });
	}

	User.findOne({ email }).then(savedUser => {
		if (savedUser) {
			return res.status(422).json({ error: 'User already exist with email 😱' });
		}
		bcrypt.hash(password, 10).then(hashedPassword => {
			const user = new User({ email, name, password: hashedPassword });

			user
				.save()
				.then(user => {
					res.json({ msg: 'added successfully' });
				})
				.catch(err => {
					console.log(err);
				});
		});
	});
});

router.post('/signin', (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		res.status(422).json({ error: 'Please add email or password 😱' });
	}
	User.findOne({ email }).then(savedUser => {
		if (!savedUser) {
			res.status(422).json({ error: 'Invalid email or password 😱' });
		}
		bcrypt
			.compare(password, savedUser.password)
			.then(doPassword => {
				if (doPassword) {
					// return res.json({ msg: 'Successfully sign' });
					const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
					const { _id, name, email } = savedUser;
					res.json({ token, user: { _id, name, email } });
				} else {
					return res.status(422).json({ error: 'Invalid or password 😱' });
				}
			})
			.catch(err => {
				console.log(err);
			});
	});
});

module.exports = router;
