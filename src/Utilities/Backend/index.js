/**
 * Backend facade. Import Auth / Storage / Amplify from here instead of "aws-amplify":
 *
 *   import { Auth, Storage, Amplify } from "<...>/Utilities/Backend";
 *
 * Which implementation you get is decided once, by NEXT_PUBLIC_BACKEND (see ./config).
 */
import * as awsAmplify from "aws-amplify";
import * as standbyAmplify from "./standby";
import { isStandby } from "./config";

const impl = isStandby ? standbyAmplify : awsAmplify;

export const Amplify = impl.Amplify;
export const Auth = impl.Auth;
export const Storage = impl.Storage;
export default Amplify;

export { BACKEND, isStandby, ENDPOINTS, API_KEYS, STANDBY_API, STANDBY_SERVED } from "./config";
export { s3Url, s3UrlFromPath } from "./files";
