"use strict";

import { OK } from "../core/success.response";
import TemplateService from "../services/template.service";
import { Request, Response } from "express";

class EmailController {
  newTemplate = async (req: Request, res: Response) => {
    new OK({
      message: "Template created successfully!",
      metadata: await TemplateService.newTemplate(req.body),
    }).sendResponse(res);
  };
}

export default new EmailController();
