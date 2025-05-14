import express from "express";
import { create, getProfile, login } from "../Controllers/user.controllers.js";
import authenticateToken from "../Middlewares/auth.middleware.js";
const Router = express.Router();

Router.post("/create", create);
Router.post("/login", login);
Router.post("/profile", authenticateToken(["jobseeker"]), getProfile);

export default Router;
