import express from 'express';
import { getAllPeriodes } from "../controllers/periodeController.js";

const router = express.Router();

router.get('/', getAllPeriodes);

export default router;
