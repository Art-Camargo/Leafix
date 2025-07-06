import { google } from 'googleapis';
import fs from 'fs';
import { config as initializeEnvs } from 'dotenv';
import path from 'path';

initializeEnvs();

export default class GoogleDriveService {
  constructor() {
    this.auth = null;
    this.drive = null;
  }

  async initialize() {
    const rawPrivateKey = process.env.GOOGLE_PRIVATE_KEY;
    const formattedPrivateKey = rawPrivateKey?.replace(/\\r\\n/g, '\n');

    console.log("GOOGLE_PRIVATE_KEY defined?", !!rawPrivateKey);
    console.log("GOOGLE_PRIVATE_KEY starts with:", rawPrivateKey?.slice(0, 30));
    console.log("Formatted private key starts with:", formattedPrivateKey?.slice(0, 30));
    console.log("GOOGLE_CLIENT_EMAIL:", process.env.GOOGLE_CLIENT_EMAIL);
    console.log("Formatted private key snippet:\n", formattedPrivateKey?.slice(0, 150));


    const credentials = {
      type: process.env.GOOGLE_TYPE,
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: formattedPrivateKey,
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
      auth_uri: process.env.GOOGLE_AUTH_URI,
      token_uri: process.env.GOOGLE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
    };

    try {
      this.auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/drive.file'],
      });

      this.drive = google.drive({ version: 'v3', auth: this.auth });

      console.log('✅ Google Drive initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Google Drive:', error.message);
      console.error(error.stack);
      throw new Error('Failed to initialize Google Drive');;
    }
  }


  async uploadFile(localFilePath, fileName, folderId) {
    if (!this.drive) {
      throw new Error('GoogleDriveService not initialized. Call initialize() first.');
    }

    const resolvedPath = path.resolve(localFilePath);
    console.log("📁 Verificando se arquivo existe:", resolvedPath);

    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`Arquivo não encontrado: ${resolvedPath}`);
    }

    console.log("📤 Uploading file...");
    console.log("📎 Nome do arquivo:", fileName);
    console.log("📂 Folder ID:", folderId);

    try {
      const fileStream = fs.createReadStream(resolvedPath);
      console.log("✅ File stream created.");
      console.log('Node:', process.version, 'OpenSSL:', process.versions.openssl);

      const res = await this.drive.files.create({
        requestBody: {
          name: fileName,
          parents: [folderId],
        },
        media: {
          mimeType: 'image/jpeg',
          body: fileStream,
        },
        fields: 'id, webContentLink, webViewLink',
      });

      console.log("✅ File uploaded successfully:", res.data);
      return res.data;
    } catch (err) {
      console.error("❌ Failed to upload file:", err.message);
      console.error(err.stack);
      throw err;
    }
  }
}
