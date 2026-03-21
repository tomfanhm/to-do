import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage"

import { storage } from "@/lib/firebase/firebase-config"

export const storageService = {
  buildAttachmentPath(
    userId: string,
    taskId: string,
    attachmentId: string
  ): string {
    return `attachments/${userId}/${taskId}/${attachmentId}`
  },

  async upload(path: string, file: File): Promise<string> {
    const fileRef = ref(storage, path)
    await uploadBytes(fileRef, file)
    return getDownloadURL(fileRef)
  },

  async delete(path: string): Promise<void> {
    const fileRef = ref(storage, path)
    await deleteObject(fileRef)
  },
}
