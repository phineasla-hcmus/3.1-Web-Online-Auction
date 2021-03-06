import {
  DeliveryType,
  ResourceType,
  UploadApiOptions,
  UploadApiResponse,
  v2,
} from 'cloudinary';
import { Readable } from 'stream';

/**
 * Upload multiple file buffers asynchronously.
 * @see [lodash#zip](https://lodash.com/docs/4.17.15#zip)
 * @param buffers
 * @param options
 * If `UploadApiOptions` is provided, `options` will be applied to all file buffers,
 * If an array of `UploadApiOptions` is provided, act like `_.zip(buffers, options)`
 * @returns
 */
export function bulkUpload(
  buffers: Buffer[],
  options?: UploadApiOptions | UploadApiOptions[]
) {
  return Array.isArray(options)
    ? buffers.map((buffer, i) => {
        return singleUpload(buffer, options[i]);
      })
    : buffers.map((buffer, i) => {
        return singleUpload(buffer, options);
      });
}

/**
 * Upload `Buffer` to Cloudinary, useful for Multer `req.file.buffer`.
 * This function promistified `cloudinary.v2.uploader.upload_stream`.
 * @see [Correct way of uploading from buffer?](https://support.cloudinary.com/hc/en-us/community/posts/360007581379/comments/360001388480)
 * @see [Cloudinary Github](https://github.com/cloudinary/cloudinary_npm#cloudinaryupload_stream)
 * @param buffer
 * @param options
 * @returns
 */
export function singleUpload(buffer: Buffer, options?: UploadApiOptions) {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    const upload_stream = v2.uploader.upload_stream(options, (err, res) => {
      res ? resolve(res) : reject(err);
    });
    Readable.from(buffer).pipe(upload_stream);
  });
}

export interface DestroyOptions {
  resource_type?: ResourceType;
  type?: DeliveryType;
  invalidate?: boolean;
}

export function bulkDestroy(
  publicIds: string[],
  options?: DestroyOptions | DestroyOptions[]
) {
  return Array.isArray(options)
    ? publicIds.map((id, i) => {
        return singleDestroy(id, options[i]);
      })
    : publicIds.map((id, i) => {
        return singleDestroy(id, options);
      });
}

/**
 * https://cloudinary.com/documentation/image_upload_api_reference#destroy
 * @param publicId
 * @param options
 * @returns
 */
export function singleDestroy(publicId: string, options?: DestroyOptions) {
  return new Promise<any>((resolve, reject) => {
    v2.uploader.destroy(publicId, options, (err, res) => {
      res ? resolve(res) : reject(err);
    });
  });
}
