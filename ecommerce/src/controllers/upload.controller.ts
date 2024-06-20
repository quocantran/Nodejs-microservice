"use strict";

import { Request, Response } from "express";
import { OK } from "../core/success.response";
import UploadService from "../services/upload.service";
import { BadRequestError } from "../core/error.response";

interface RequestWithFile extends Request {
  file: Express.Multer.File;
}

class UploadController {
  uploadFile = async (req: RequestWithFile, res: Response) => {
    const { file } = req;
    if (!file) {
      throw new BadRequestError("File is required");
    }
    new OK({
      message: "Success",
      metadata: await UploadService.uploadFile({ file }),
    }).sendResponse(res);
  };
}

export default new UploadController();
