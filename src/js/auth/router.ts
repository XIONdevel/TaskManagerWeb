import {Router, Request, Response} from 'express';
import * as authService from "./service";

const router = Router();

router.post('/login', (req: Request, res: Response): void => {
    authService.makeAuthRequest(req, res, "http://localhost:8080/api/auth/authenticate");
})

router.post('/register', (req: Request, res: Response): void => {
    authService.makeAuthRequest(req, res, "http://localhost:8080/api/auth/register");
})

router.post('/logout-all', (req: Request, res: Response) => {
    authService.makeLogoutRequest(req, res, "http://localhost:8080/api/auth/logout-all");
})

router.post('/logout-here', (req: Request, res: Response): void => {
    authService.makeLogoutRequest(req, res, "http://localhost:8080/api/auth/logout-here");
})

export default router;