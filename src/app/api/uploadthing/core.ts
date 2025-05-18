// src/app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

/**
 * Ejemplo mínimo:
 *  - acepta cualquier tipo (blob) hasta 16 MB
 */
export const ourFileRouter = {
  uploads: f({ blob: { maxFileSize: "16MB" } }).onUploadComplete(
    async ({ file }) => {
      // file.url y file.name quedan disponibles en el front
      console.log("✅ Archivo subido:", file.url);
    }
  ),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
