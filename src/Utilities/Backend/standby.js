/**
 * Drop-in replacement for the parts of `aws-amplify` the IQOS UI uses (Auth, Storage, Amplify.configure),
 * backed by the iqos-standby API instead of Cognito / S3. Only loaded when NEXT_PUBLIC_BACKEND=standby.
 */
import { STANDBY_API as API } from "./config";

const KEY = "iqos_standby_session";
const isBrowser = typeof window !== "undefined";

const read = () => {
  try {
    return isBrowser ? JSON.parse(localStorage.getItem(KEY) || "null") : null;
  } catch (e) {
    return null;
  }
};
const write = (s) => {
  try {
    if (!isBrowser) return;
    if (s) localStorage.setItem(KEY, JSON.stringify(s));
    else localStorage.removeItem(KEY);
  } catch (e) {
    /* storage unavailable */
  }
};

const decode = (jwt) => {
  try {
    const b = jwt.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(decodeURIComponent(escape(atob(b))));
  } catch (e) {
    return {};
  }
};

const err = (name, message) => Object.assign(new Error(message), { name, code: name });

async function post(path, body, token) {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json", ...(token ? { authorization: token } : {}) },
    body: JSON.stringify(body || {}),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw err(json.code || "Error", json.message || `Request failed (${res.status})`);
  return json;
}

function toUser(session) {
  const payload = decode(session.idToken);
  const attributes = { ...payload };
  delete attributes["cognito:username"];
  return {
    username: payload["cognito:username"],
    attributes,
    signInUserSession: {
      idToken: { jwtToken: session.idToken, payload },
      accessToken: { jwtToken: session.accessToken, payload: decode(session.accessToken) },
      refreshToken: { token: session.refreshToken },
    },
  };
}

function save(bundle) {
  const payload = decode(bundle.idToken);
  const s = { ...bundle, exp: payload.exp * 1000 };
  write(s);
  return s;
}

let refreshing;
async function session() {
  let s = read();
  if (!s) throw err("NotAuthorizedException", "The user is not authenticated");
  if (s.exp - Date.now() < 60 * 1000) {
    refreshing =
      refreshing ||
      post("/auth/refresh", { refreshToken: s.refreshToken })
        .then(save)
        .catch((e) => {
          // only drop the session when the server rejected the token, not on a network blip
          if (e && e.code === "NotAuthorizedException") write(null);
          throw e;
        })
        .finally(() => {
          refreshing = undefined;
        });
    s = await refreshing;
  }
  return s;
}

export const Auth = {
  async signIn(arg, pass) {
    const username = typeof arg === "string" ? arg : arg.username;
    const password = typeof arg === "string" ? pass : arg.password;
    const r = await post("/auth/login", { username, password });
    if (r.challenge === "NEW_PASSWORD_REQUIRED") {
      return { username, challengeName: "NEW_PASSWORD_REQUIRED", __password: password };
    }
    return toUser(save(r));
  },
  async completeNewPassword(user, newPassword) {
    const r = await post("/auth/new-password", { username: user.username, password: user.__password, newPassword });
    return toUser(save(r));
  },
  async signOut() {
    write(null);
  },
  async currentAuthenticatedUser() {
    return toUser(await session());
  },
  async currentSession() {
    const s = await session();
    const payload = decode(s.idToken);
    return {
      isValid: () => true,
      getIdToken: () => ({ getJwtToken: () => s.idToken, payload }),
      getAccessToken: () => ({ getJwtToken: () => s.accessToken }),
    };
  },
  async currentCredentials() {
    return {};
  },
  async changePassword(user, oldPassword, newPassword) {
    const s = await session();
    await post("/auth/change-password", { oldPassword, newPassword }, s.idToken);
    return "SUCCESS";
  },
  async forgotPassword(username) {
    await post("/auth/forgot-password", { username });
    return { CodeDeliveryDetails: {} };
  },
  async forgotPasswordSubmit(username, code, newPassword) {
    await post("/auth/forgot-password/confirm", { username, code, newPassword });
    return "SUCCESS";
  },
};

/** Synchronous read of the current id token (for <img src> links that cannot send headers). */
export const peekIdToken = () => {
  const s = read();
  return s ? s.idToken : "";
};

const prefixFor = async (opts = {}) => {
  const level = opts.level || "public";
  if (level === "public") return "public/";
  const s = await session();
  return `${level}/${decode(s.idToken)["cognito:username"]}/`;
};

export const Storage = {
  /** Uploads through a presigned URL (B2). Resolves { key } like Amplify. */
  async put(key, file, opts = {}) {
    const s = await session();
    const full = `${await prefixFor(opts)}${key}`;
    const contentType = opts.contentType || file.type || "application/octet-stream";
    const { url } = await post("/storage/presign", { bucket: "data", key: full, method: "PUT", contentType }, s.idToken);
    const res = await fetch(url, { method: "PUT", headers: { "Content-Type": contentType }, body: file });
    if (!res.ok) throw err("UploadFailed", `Upload failed (${res.status})`);
    return { key };
  },
  /** Resolves a temporary download URL. */
  async get(key, opts = {}) {
    const s = await session();
    const full = `${await prefixFor(opts)}${key}`;
    const { url } = await post("/storage/presign", { bucket: "data", key: full, method: "GET" }, s.idToken);
    return url;
  },
};

export const Amplify = { configure() {}, Auth, Storage };
export default Amplify;
