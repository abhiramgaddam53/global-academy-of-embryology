import {
  S3Client,
  PutObjectCommand
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

export const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS!,
    secretAccessKey: process.env.AWS_SECRET!
  }
});

// UPDATED: Added 'folder' parameter with a default
export const uploadToS3 = async (
  file: Buffer, 
  fileType: string, 
  folder: string = "Webinar-photos" // Default to existing behavior
) => {
  // Use the provided folder name in the key
  const key = `${folder}/${randomUUID()}.${fileType}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET!,
    Key: key,
    Body: file,
    ContentType: `image/${fileType}`, // Fix: use explicit content type if possible, or leave as is
  });

  await s3.send(command);

  return `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};