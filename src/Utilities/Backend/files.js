/**
 * Builds browser URLs for files the backend stored (receipts, signatures, CVs, templates).
 * Records keep `{ bucket, key, region }`; where that points differs per backend:
 *   aws     -> https://s3.ap-southeast-1.amazonaws.com/<bucket>/<key>   (exactly what the UI used before)
 *   standby -> <standby>/storage/file?bucket=&key=&token=               (redirects to a presigned Backblaze URL)
 */
import { isStandby, STANDBY_API } from "./config";
import { peekIdToken } from "./standby";

/** `region` given -> virtual-hosted style (PO attachments); omitted -> path style in ap-southeast-1. */
export const s3Url = (bucket, key, region) => {
  if (isStandby) {
    const q = new URLSearchParams({ bucket: String(bucket ?? ""), key: String(key ?? ""), token: peekIdToken() });
    return `${STANDBY_API}/storage/file?${q.toString()}`;
  }
  return region
    ? `https://${bucket}.s3.${region}.amazonaws.com/${key}`
    : `https://s3.ap-southeast-1.amazonaws.com/${bucket}/${key}`;
};

/** For values stored as a single "bucket/key" string. */
export const s3UrlFromPath = (path) => {
  const p = String(path ?? "");
  const i = p.indexOf("/");
  return s3Url(i < 0 ? p : p.slice(0, i), i < 0 ? "" : p.slice(i + 1));
};
