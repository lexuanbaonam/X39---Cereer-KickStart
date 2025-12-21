import departController from "../controllers/Departs.Controllers.js";
import { Router } from "express";

const departRouter = Router();

departRouter.post('/create', departController.createDepart);
departRouter.get('/all', departController.getAllDeparts);
departRouter.get('/:id', departController.getDepartById);
departRouter.delete('/:id', departController.deleteDepart);

export default departRouter;
