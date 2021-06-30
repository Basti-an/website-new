import { detect } from "detect-browser";

const browser = detect();

function getIsMobileOS(): boolean {
  if (!browser) {
    return false;
  }

  const { os } = browser;
  if (!os) {
    return false;
  }

  const mobileOSes = ["iOS", "Android OS", "BlackBerry OS", "Windows Mobile"];
  if (mobileOSes.includes(os)) {
    return true;
  }

  return false;
}

function getIsGoodBrowser(): boolean {
  if (!browser) {
    return false;
  }

  const { name } = browser;

  const goodBrowsers = ["chrome", "safari", "samsung"];

  if (goodBrowsers.includes(name) || getIsMobileOS()) {
    return true;
  }

  return false;
}

function checkForDevicePerformance(setFancyAnimations: React.Dispatch<boolean>): void {
  // count fps and stop background animation if fps dips below 24, based on:
  // https://www.growingwiththeweb.com/2017/12/fast-simple-js-fps-counter.html (Daniel Imms)
  let lastCalledTime: number;
  let fps: number;
  let done = false;

  // calculates fps based on time elapsed since last frame
  function refreshLoop() {
    window.requestAnimationFrame(() => {
      if (!lastCalledTime) {
        lastCalledTime = performance.now();
        fps = 0;
        refreshLoop();
        return;
      }

      const delta = (performance.now() - lastCalledTime) / 1000;
      lastCalledTime = performance.now();
      fps = 1 / delta;

      if (!done) {
        refreshLoop();
      }
    });
  }

  // start fps counter
  refreshLoop();

  // sample FPS after component had time to ramp up rendering
  const cookFor = 3000;
  setTimeout(() => {
    done = true;
    console.log(`FPS after ${Math.floor(cookFor / 1000)} seconds:`, Math.floor(fps));

    // disable "flowing" background
    // @TODO trigger a snackbar message, informing about feature being disabled
    // due to poor performance, basically telling the user that his device sucks XD
    if (getIsMobileOS()) {
      if (fps < 10) {
        // mobile animation uses different turbulence values and still looks nice™ even at lower fps
        setFancyAnimations(false);
        window.prohibitFlowing = true;
      }
    } else if (fps < 18) {
      setFancyAnimations(false);
    }
  }, cookFor);
}

function getLinValue(sliderValue: number, min: number, max: number): number {
  const maxp = 280;
  const linVal = sliderValue / maxp;
  const range = max - min;
  const inRangeVal = linVal * range;
  return min + inRangeVal;
}

function getLogRemapped(value: number, min: number, max: number, minp: number, maxp: number) {
  if (min === 0) {
    min += 1;
    max += 1;
  }
  const minv = Math.log(min);
  const maxv = Math.log(max);

  // calculate adjustment factor
  const scale = (maxv - minv) / (maxp - minp);
  return Math.exp(minv + scale * (value - minp));
}

function getLogValue(sliderValue: number, min: number, max: number): number {
  return getLogRemapped(sliderValue, min, max, 0, 280);
}

export {
  getIsMobileOS,
  getIsGoodBrowser,
  checkForDevicePerformance,
  getLinValue,
  getLogValue,
  getLogRemapped,
};
