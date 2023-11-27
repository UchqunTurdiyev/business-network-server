const { Router } = require('express');
const router = Router();
const mongoose = require('mongoose');
const login = require('../midlware/login');
const Post = mongoose.model('Post');

router.post('/createpost', login, (req, res) => {
	const { title, body } = req.body;
	if (!title || !body) {
		return res.status(422).json({ error: 'Please add oll the fields' });
	}
	req.user.password = undefined;
	const post = new Post({
		title,
		body,
		postedBy: req.user,
	});

	post
		.save()
		.then(result => {
			res.json({ post: result });
		})
		.catch(err => {
			console.log(err);
		});
});

module.exports = router;
