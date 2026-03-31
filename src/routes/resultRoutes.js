import express from 'express';
const router = express.Router();

router.get('/result', getResult);

export default router;