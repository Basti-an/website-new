import React from "react";
import Config from "../config";
import { getIsMobileOS } from "../utils";

const { hostUrl } = Config;

// this stuff is wild
// we have an image being used as the source graphic for a discplacement map
// which is being displaced by a turbulence pattern which is itself being animated through
// thereby creating an illusion of a moving turbulence akin to flowing water

function Background(): JSX.Element {
  const isMobileDevice = getIsMobileOS();

  return (
    <>
      {!isMobileDevice && (
        <>
          <img
            id="background-dummy"
            alt="water shore background"
            src={`${hostUrl}/images/mainBg.jpg`}
          />
          <img id="background" alt="water shore background" src={`${hostUrl}/images/mainBg.jpg`} />
        </>
      )}
      <div id="container">
        <svg className="animated" height="100%" width="100%" viewBox="0 0 450 920">
          {!isMobileDevice && (
            <filter id="noise" x="0" y="0%" width="100%" height="100%">
              <feTurbulence
                id="turbulence"
                baseFrequency="0.02 0.04"
                result="NOISE"
                numOctaves="2"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="NOISE"
                scale="20"
                xChannelSelector="R"
                yChannelSelector="R"
              />
              <animate
                id="animation"
                xlinkHref="#turbulence"
                attributeName="baseFrequency"
                dur="85s"
                keyTimes="0;0.25;0.5;0.75;1.0"
                // values chosen by what felt "right" on my overclocked dev machine
                values="0.02 0.08;0.015 0.06;0.010 0.04;0.015 0.06;0.02 0.08"
                repeatCount="indefinite"
                keySplines="0 0 0.3642 0 ; 0.3642 0 0.6358 1 ; 0.6358 1 1 1; 1 1 0.6358 1; 0.6358 1 0.3642 0;  0.3642 0 0 0"
              />
            </filter>
          )}
          {isMobileDevice && (
            // mobile filter uses different turbulence pattern and animation due to differences in source image and device performance
            <filter id="noiseMobile" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence
                id="turbulence2"
                baseFrequency="0.02 0.04"
                result="NOISE2"
                numOctaves="1"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="NOISE2"
                scale="20"
                xChannelSelector="R"
                yChannelSelector="R"
              />
              <animate
                xlinkHref="#turbulence2"
                attributeName="baseFrequency"
                dur="110s"
                keyTimes="0;0.25;0.5;0.75;1.0"
                // values chosen by what looks "just fine" on a current iPhone
                values="0.02 0.04;0.02 0.08;0.02 0.12;0.02 0.08;0.02 0.04"
                repeatCount="indefinite"
                keySplines="0 0 0.3642 0 ; 0.3642 0 0.6358 1 ; 0.6358 1 1 1; 1 1 0.6358 1; 0.6358 1 0.3642 0;  0.3642 0 0 0"
              />
            </filter>
          )}
          {isMobileDevice && (
            <image
              id="mobileBg"
              xlinkHref={`${hostUrl}/images/mobileBg.jpg`}
              x="0"
              y="0"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              filter="url(#noiseMobile)"
            >
              {" "}
            </image>
          )}
        </svg>
      </div>
    </>
  );
}

export default Background;
