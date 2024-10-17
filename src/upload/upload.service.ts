import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { nanoid } from "nanoid";

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {}

  async s3UploadFile(file: Express.Multer.File, basePath?: string) {
    const accessKeyId = this.configService.get("AWS_ACCESS_KEY_ID");
    const secretAccessKey = this.configService.get("AWS_SECRET_ACCESS_KEY");
    const bucketRegion = this.configService.get("AWS_BUCKET_REGION");
    const bucketName = this.configService.get("AWS_BUCKET_NAME");
    //console.log(accessKeyId, secretAccessKey, bucketRegion);

    try {
      const s3Client = new S3Client({
        region: bucketRegion,
        credentials: {
          accessKeyId: accessKeyId,
          secretAccessKey: secretAccessKey,
        },
      });

      const randomKey = nanoid();
      await s3Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: `${basePath ? basePath + "/" : ""}${randomKey}-${file.originalname}`,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      return {
        originalname: file.originalname,
        filename: file.filename,
        fileUrl: `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${basePath ? basePath + "/" : ""}${randomKey}-${file.originalname}`,
      };
    } catch (error) {
      console.log(error);
    }
    // return {
    //   originalname: file.originalname,
    //   filename: file.filename,
    // };
  }
}
