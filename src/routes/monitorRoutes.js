import express from 'express';
const router = express.Router();

router.post('/monitor', createMonitor);

export default router;