# Telegram Image Proxy Server

A minimal Express + TypeScript server that proxies images through Telegram Private Groups.

## Setup

### 1. Create Telegram Bot

1. Open Telegram and search for **@BotFather**
2. Send `/newbot` command
3. Follow the instructions and get your **BOT_TOKEN**

### 2. Create Private Group

1. Create a new group in Telegram (can be private or public)
2. Add your bot to the group as an **administrator**
3. Send a message to the group to initialize it
4. Get the **CHAT_ID** by visiting:
   ```
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
   ```

### 3. Configure Environment

```bash
cp .env.template .env
```

Edit `.env`:
```env
PORT=3000
API_KEY=my_secret_key
TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN
TELEGRAM_CHAT_ID=YOUR_CHAT_ID
```

### 4. Install Dependencies

```bash
pnpm install
```

### 5. Run Server

```bash
pnpm start:dev
```

## API

### Health Check

```bash
curl http://localhost:3000/health
```

Response:
```json
{ "status": "ok" }
```

### Upload Image

```bash
curl -X POST http://localhost:3000/api/upload \
  -H "x-api-key: my_secret_key" \
  -F "image=@/path/to/your/image.jpg"
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "telegram_file_id"
  }
}
```

### Get Image

```bash
curl http://localhost:3000/api/image/:id \
  -H "x-api-key: my_secret_key" \
  --output image.jpg
```

Response: Streams the image directly with proper `Content-Type` header.

## Notes

- Max file size: 20MB
- Only `image/*` MIME types are accepted
- Images are stored in your Telegram group (no database required)