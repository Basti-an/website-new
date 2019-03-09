/* allow loading of backend resources regardless of host
 */
const localIp = "192.168.0.157";

const hostname = window && window.location && window.location.hostname;
let backendHost;

if (hostname === localIp) {
  backendHost = "http://" + localIp + ":8080";
} else if (hostname === "localhost") {
  backendHost = "http://localhost:8080";
} else {
  backendHost = "https://" + hostname;
}

const Config = {
  hostUrl: backendHost
};

export default Config;
