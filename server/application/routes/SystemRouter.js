const Router = require('express');
const router = new Router();

router.get('/health', (req, res) => res.status(200).send({ ok: {} }));

module.exports = router;