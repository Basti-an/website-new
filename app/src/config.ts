/* allow loading of backend resources regardless of host
 */
const hostname = window && window.location && window.location.hostname;
let host = `https://wiendlocha.org`;
const env = process.env.NODE_ENV;

if (env === "development" || hostname === "localhost") {
  host = `http://${hostname}:8080`;
}

const Config = {
  hostUrl: host,
};

export default Config;
