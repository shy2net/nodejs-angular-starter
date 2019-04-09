import * as cors from "cors";
import * as express from "express";
import { Request, Response, NextFunction } from "express";

import auth from "../auth";
import config from "../config";
import { AppRequest, AppResponse } from "../models";
import controller from "./api.controller";
import { RegisterForm } from "./forms";
import * as middlewares from "./middlewares";

const router = express.Router();

router.use(cors(config.CORS_OPTIONS));
router.use(middlewares.unhandledErrorMiddleware);

router.use("/social-login", require("./social-login/social-login.routes"));

router.get("/test", (req: Request, res: Response, next: (data) => void) => {
  // Move the promise response to be handled by the postResponseMiddleware
  next(controller.test());
});

router.get("/error-test", (req: Request, res: Response, next: NextFunction) => {
  // Move the error returned from the promise to be handled by the postResponseMiddleware
  next(controller.errorTest());
});

router.get(
  "/say-something",
  (req: Request, res: Response, next: NextFunction) => {
    // Ready the url param say
    const whatToSay = req.query["what"] as string;

    // Move the promise response to be handled by the postResponseMiddleware
    next(controller.saySomething(whatToSay));
  }
);

router.post("/login", (req: Request, res: Response, next: NextFunction) => {
  const loginForm: { username: string; password: string } = req.body;
  next(controller.login(loginForm.username, loginForm.password));
});

router.get(
  "/profile",
  auth.authenticationMiddleware,
  (req: AppRequest, res: AppResponse, next: NextFunction) => {
    next(controller.getProfile(req.user));
  }
);

// An example of a route which will only be accessible for users with the 'admin' role
router.get(
  "/admin_test",
  auth.authenticationMiddleware,
  auth.getHasRolesMiddlware("admin"),
  (req: AppRequest, res: AppResponse, next: NextFunction) => {
    next(controller.test());
  }
);

router.get(
  "/logout",
  auth.authenticationMiddleware,
  (req: AppRequest, res: AppResponse, next: NextFunction) => {
    next(controller.logout());
  }
);

router.post("/register", (req: Request, res: Response, next: NextFunction) => {
  const registerForm = new RegisterForm(req.body as RegisterForm);
  next(controller.register(registerForm));
});

router.use(middlewares.postResponseMiddleware);
router.use(middlewares.postErrorMiddleware);

module.exports = router;
