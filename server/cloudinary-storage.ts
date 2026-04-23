import crypto from 'node:crypto';

type CloudinaryConfig = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
};

type CloudinaryUploadResponse = {
  secure_url?: string;
  url?: string;
};

function parseCloudinaryUrl(): Partial<CloudinaryConfig> {
  const cloudinaryUrl = process.env.CLOUDINARY_URL;
  if (!cloudinaryUrl) return {};

  try {
    const parsed = new URL(cloudinaryUrl);
    if (parsed.protocol !== 'cloudinary:') return {};

    return {
      cloudName: parsed.hostname,
      apiKey: decodeURIComponent(parsed.username),
      apiSecret: decodeURIComponent(parsed.password),
    };
  } catch (error) {
    console.warn('[Cloudinary] Invalid CLOUDINARY_URL:', error);
    return {};
  }
}

function getCloudinaryConfig(): CloudinaryConfig | null {
  const fromUrl = parseCloudinaryUrl();
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || fromUrl.cloudName;
  const apiKey = process.env.CLOUDINARY_API_KEY || fromUrl.apiKey;
  const apiSecret = process.env.CLOUDINARY_API_SECRET || fromUrl.apiSecret;

  if (!cloudName || !apiKey || !apiSecret) return null;

  return { cloudName, apiKey, apiSecret };
}

function signUploadParams(params: Record<string, string>, apiSecret: string) {
  const signatureBase = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&');

  return crypto.createHash('sha1').update(`${signatureBase}${apiSecret}`).digest('hex');
}

function safePublicId(fileName: string) {
  const nameWithoutExtension = fileName.replace(/\.[a-zA-Z0-9]+$/, '');
  const safeName = nameWithoutExtension
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);

  return `${Date.now()}-${safeName || 'product-image'}`;
}

function optimizedCloudinaryUrl(url: string) {
  return url.replace('/image/upload/', '/image/upload/c_limit,w_1200/f_auto/q_auto/');
}

export function cloudinaryStorageEnabled() {
  return Boolean(getCloudinaryConfig());
}

export async function uploadCloudinaryImageDataUrl(input: {
  imageDataUrl: string;
  imageFileName: string;
}) {
  const config = getCloudinaryConfig();
  if (!config) return null;

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const paramsToSign = {
    folder: 'peaceful-taste/products',
    public_id: safePublicId(input.imageFileName),
    timestamp,
  };
  const signature = signUploadParams(paramsToSign, config.apiSecret);
  const body = new FormData();

  body.append('file', input.imageDataUrl);
  body.append('api_key', config.apiKey);
  body.append('folder', paramsToSign.folder);
  body.append('public_id', paramsToSign.public_id);
  body.append('timestamp', timestamp);
  body.append('signature', signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
    {
      method: 'POST',
      body,
    }
  );

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(`Cloudinary image upload failed: ${message}`);
  }

  const result = (await response.json()) as CloudinaryUploadResponse;
  const uploadedUrl = result.secure_url || result.url;

  if (!uploadedUrl) {
    throw new Error('Cloudinary image upload did not return a public image URL.');
  }

  return optimizedCloudinaryUrl(uploadedUrl);
}
