/* allow loading of backend resources regardless of host
 */
// insert networkIp here to test on mobile devices while using react start
const currentLocalIp = "";

const hostname = window && window.location && window.location.hostname;
let backendHost;

if (hostname === currentLocalIp) {
  backendHost = "http://" + currentLocalIp + ":8080";
} else if (hostname === "localhost") {
  backendHost = "http://localhost:8080";
} else {
  backendHost = "https://" + hostname;
}

const Config = {
  hostUrl: backendHost
};

export default Config;
