import {Router, Request, Response} from 'express';
import * as service from "./service";

const router = Router();


router.post("/create", async (req: Request, res: Response) => {
    await service.create(req, res);
});

router.get("/getAll", async (req: Request, res: Response) => {
    await service.getAll(req, res);
})





export default router;