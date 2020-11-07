/* allow loading of backend resources regardless of host
 */
const hostname = window && window.location && window.location.hostname;
let host;

if (hostname.indexOf(".com") !== -1) {
  host = `https://${hostname}`;
} else {
  host = `http://${hostname}:8080`;
}

const Config = {
  hostUrl: host,
};

export default Config;
