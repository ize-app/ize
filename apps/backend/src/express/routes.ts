import { Router } from "express";

const routes = Router();

routes.get("/", (_req, res) => {
  return res.json({ message: "Hello World" });
});

export default routes;
