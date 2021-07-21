import { search } from "@controllers/searchController";
import { Router } from "express";

const router = Router();

router.route("/")
  .get(search);

export default router;