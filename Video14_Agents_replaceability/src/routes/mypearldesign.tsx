import { Hono } from "hono";
import { MyPearlDesign } from "../pages/MyPearlDesign";

export function myPearlDesignRouter() {
  const router = new Hono();

  router.get("/", (c) => c.html(<MyPearlDesign />));

  return router;
}
