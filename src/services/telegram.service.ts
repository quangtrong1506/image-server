import { env } from '@/config/envConfig';
import axios from 'axios';
import FormData from 'form-data';

const TELEGRAM_API_URL = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}`;

interface TelegramFile {
   file_id: string;
   file_unique_id: string;
   file_size?: number;
   file_path?: string;
}

interface TelegramPhoto {
   file_id: string;
   file_unique_id: string;
   width: number;
   height: number;
   file_size?: number;
}

interface SendPhotoResponse {
   ok: boolean;
   result: {
      message_id: number;
      from: {
         id: number;
         is_bot: boolean;
         first_name: string;
         username: string;
      };
      chat: {
         id: number;
         title?: string;
         type: string;
      };
      date: number;
      photo: TelegramPhoto[];
   };
}

interface GetFileResponse {
   ok: boolean;
   result: TelegramFile;
}

export const telegramService = {
   async uploadImage(buffer: Buffer, filename: string, mimeType: string): Promise<TelegramPhoto[]> {
      const formData = new FormData();
      formData.append('chat_id', env.TELEGRAM_CHAT_ID);
      formData.append('photo', buffer, {
         filename,
         contentType: mimeType,
      });

      const response = await axios.post<SendPhotoResponse>(`${TELEGRAM_API_URL}/sendPhoto`, formData, {
         headers: {
            'Content-Type': formData.getHeaders()['content-type'],
         },
      });

      if (!response.data.ok) {
         throw new Error('Failed to upload image to Telegram');
      }

      const photos = response.data.result.photo;
      console.table(photos);
      photos.sort((a, b) => b.width - a.width);
      return photos;
   },

   async getFilePath(fileId: string): Promise<string> {
      const response = await axios.get<GetFileResponse>(`${TELEGRAM_API_URL}/getFile?file_id=${fileId}`);

      if (!response.data.ok) {
         throw new Error('File not found in Telegram');
      }

      return response.data.result.file_path as string;
   },

   async streamImage(fileId: string): Promise<{ stream: NodeJS.ReadableStream; contentType: string }> {
      const filePath = await this.getFilePath(fileId);

      const response = await axios.get(`https://api.telegram.org/file/bot${env.TELEGRAM_BOT_TOKEN}/${filePath}`, {
         responseType: 'stream',
      });

      const contentType = this.getContentType(filePath);
      return { stream: response.data, contentType };
   },

   getContentType(filePath: string): string {
      const ext = filePath.split('.').pop()?.toLowerCase() ?? '';
      const types: Record<string, string> = {
         jpg: 'image/jpeg',
         jpeg: 'image/jpeg',
         png: 'image/png',
         webp: 'image/webp',
         gif: 'image/gif',
      };
      return types[ext] || 'application/octet-stream';
   },
};
