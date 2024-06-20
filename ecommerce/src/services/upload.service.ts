"use strict";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  s3,
  PutObjectCommand,
  GetObjectCommand,
} from "../configs/aws.s3.config";
import crypto from "crypto";

export default class UploadService {
  static uploadFile = async ({ file }: { file: Express.Multer.File }) => {
    try {
      const randomName = crypto.randomBytes(16).toString("hex");

      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: randomName,
        Body: file.buffer,
        ContentType: "image/jpeg",
      });

      const result = await s3.send(command);
      const signedUrl = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: randomName,
      });

      const publicUrl = `${process.env.AWS_CLOUD_FRONT_URL}/${randomName}`;
      return {
        url: publicUrl,
        result: result,
      };
    } catch (err) {
      console.log(err);
    }
  };
}
