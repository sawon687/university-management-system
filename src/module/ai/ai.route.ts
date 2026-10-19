
import { Router } from "express";
import AIController from "./ai.controller";
import { auth } from '../../midileware/auth';


// Update these imports to match your project's actual middleware exports.


const routes = Router();

routes.post(
  "/chat",
  auth(),
  AIController.chat,
);

routes.get(
  "/academic-insights",
  auth('STUDENT'),
  AIController.generateAcademicInsights,
);

export const aiRouter = routes;