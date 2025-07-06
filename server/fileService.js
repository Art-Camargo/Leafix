import fs from 'fs';
import sharp from 'sharp';
import path from 'path';
import GoogleDriveService from "./googleDriveService.js";

export default class FileService {
  constructor(serverConfig) {
    this.server = serverConfig;
    this.googleDriveService = new GoogleDriveService();
  }

  async upload() {
    const timestamp = new Date().getTime();

    // 🛠 Use diretório temporário (funciona em Render e local)
    const tempDir = '/tmp';
    const tempPath = path.join(tempDir, `temp_${timestamp}.jpg`);
    const finalPath = path.join(
      tempDir,
      process.env.IMAGE_NAME || `image_${timestamp}.jpg`
    );

    const { req } = this.server;

    return new Promise((resolve) => {
      const writeStream = fs.createWriteStream(tempPath);
      req.pipe(writeStream);

      writeStream.on('finish', async () => {
        console.log('Imagem recebida! Agora vamos rotacionar...');

        try {
          await sharp(tempPath)
            .rotate(180)
            .toFile(finalPath);

          console.log('Imagem rotacionada e salva como', finalPath);

          await this.googleDriveService.initialize();
          const folderId = process.env.GOOGLE_FOLDER_ID;
          const fileData = await this.googleDriveService.uploadFile(finalPath, path.basename(finalPath), folderId);

          console.log('✅ Upload feito com sucesso!');
          console.log('🆔 ID:', fileData.id);
          console.log('📥 Link para baixar (direto):', fileData.webContentLink);
          console.log('🔗 Link para visualizar (no Drive):', fileData.webViewLink);

          resolve({
            googleDriverLink: fileData.webViewLink,
            downloadLink: fileData.webContentLink
          });

        } catch (error) {
          console.error('Erro ao processar imagem:', error);
          resolve(false);
        } finally {
          // Apagar os arquivos locais
          fs.unlink(tempPath, (err) => {
            if (err) console.error('Erro ao deletar arquivo temporário:', err);
          });
          fs.unlink(finalPath, (err) => {
            if (err) console.error('Erro ao deletar arquivo final:', err);
          });
        }
      });

      writeStream.on('error', (err) => {
        console.error('Erro ao salvar imagem:', err);
        resolve(false);
      });
    });
  }
}
