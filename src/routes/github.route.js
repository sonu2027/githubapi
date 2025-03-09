import { Router } from "express";
import {
  userDetails,
  projectData,
  createIssue,
} from "../controllers/github.controller.js";

const router = Router();

router.route("/github").get(userDetails);
router.route("/github/:repoName").get(projectData);
router.route("/github/:repoName/issues").post(createIssue);

export default router;