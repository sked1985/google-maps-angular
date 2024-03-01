import { Injectable } from '@angular/core';
import { BlobSASPermissions, BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, newPipeline } from '@azure/storage-blob';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  private readonly accountName = 'googlemapsimagestorage';
  private readonly accountKey = '6A5jk9A2zDRWASv4GNt4zNrxjqrLOnSJOw5ZXvudNZ';
  private readonly containerName = 'images';
  private readonly sasToken = 'your_sas_token';

  async uploadFile(file: File): Promise<string> {
    // const accountName = 'your_storage_account_name';
    const accountKey = 'K/L/6A5jk9A2zDRWASv4GNt4zNrxjqrLOnSJOw5ZXvudNZ/fKol/qp25Y2Qq78tzVC7F17PttDxw+AStpBElYA=='; // Replace with your storage account key
    const expiryDate = new Date(new Date().getTime() + 86400); // Expiry date (24 hours from now)
    const permissions = {
      read: true, // Allow read access
      write: true, // Allow write access
      delete: true // Allow delete access
    };

    const sasToken = "sp=racwdl&st=2024-03-01T12:04:24Z&se=2024-03-03T20:04:24Z&sv=2022-11-02&sr=c&sig=kaQ4j92NywKFLWoidiBflQkwotEfsygnqlxcJhIBA1A%3D"
    const blobServiceClient = new BlobServiceClient(
      `https://googlemapsimagestorage.blob.core.windows.net/images?sp=racwdl&st=2024-03-01T12:04:24Z&se=2024-03-03T20:04:24Z&sv=2022-11-02&sr=c&sig=kaQ4j92NywKFLWoidiBflQkwotEfsygnqlxcJhIBA1A%3D`
    );
    const containerClient = blobServiceClient.getContainerClient(this.containerName);
    const blobName = file.name;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    try {
      const response = await blockBlobClient.uploadData(file, {
        blockSize: 4 * 1024 * 1024, // 4MB block size
        concurrency: 20, // 20 concurrent requests
        onProgress: (ev) => console.log(ev)
      });
      console.log('File uploaded successfully', response);
      return blockBlobClient.url; // Return the URL of the uploaded blob
    } catch (error) {
      console.error('Error uploading file', error);
      throw error;
    }
  }
  
}


