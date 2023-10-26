/* compile via emscripten: `emcc -O3 -s WASM=1  filterKernel.c -o filterKernelOB.wasm --no-entry`
*/
/*
	==============================================================================
	This file is part of Obxd synthesizer.

	Copyright © 2013-2014 Filatov Vadim
	
	Contact author via email :
	justdat_@_e1.ru

	This file may be licensed under the terms of of the
	GNU General Public License Version 2 (the ``GPL'').

	Software distributed under the License is distributed
	on an ``AS IS'' basis, WITHOUT WARRANTY OF ANY KIND, either
	express or implied. See the GPL for the specific language
	governing rights and limitations.

	You should have received a copy of the GPL along with this
	program. If not, go to http://www.gnu.org/licenses/gpl.html
	or write to the Free Software Foundation, Inc.,  
	51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.

    Ported to webassembly C by Sebastian Wiendlocha
	==============================================================================
 */
#include <emscripten.h>

float PI = 3.14159265359;
float SAMPLE_RATE = 44100;

float inputBuffer[128];
float outputBuffer[128];

float s1=0;
float s2=0;
float R=1;

EMSCRIPTEN_KEEPALIVE
void init() {
    return;
}

EMSCRIPTEN_KEEPALIVE
void setResonance(float res) {
    R = 1 - res;
}

EMSCRIPTEN_KEEPALIVE
void setCutoff(float _cutoff) {
    return;
}

EMSCRIPTEN_KEEPALIVE
float* inputBufferPtr() {
    return inputBuffer;
}
EMSCRIPTEN_KEEPALIVE
float* outputBufferPtr() {
    return outputBuffer;
}

inline float diodePairResistanceApprox(float x) {
    // Taylor approx of slightly mismatched diode pair
    return (((((0.0103592f)*x + 0.00920833f)*x + 0.185f)*x + 0.05f )*x + 1.0f);
}

inline double NR(float sample, float g) { 
    // calculating feedback non-linear transconducance and compensated for R (-1)
    // Boosting non-linearity
    float tCfb = diodePairResistanceApprox(s1*0.0876f) - 1.035f;
    // disable non-linearity == digital filter
    // resolve linear feedback
    double y = ((sample - 2*(s1*(R+tCfb)) - g*s1  - s2)/(1+ g*(2*(R+tCfb)+ g)));
    return y;
}

inline double fast_tanh(double x) {
	double x2 = x * x;
	return x * (27.0 + x2) / (27.0 + 9.0 * x2);
}

EMSCRIPTEN_KEEPALIVE
inline float Apply(float sample, double g)
{
    double v = NR(sample, g);

    // first pole
    double y1 = v*g + s1;
    s1 = v*g + y1;

    // second pole
    double y2 = y1*g + s2;
    s2 = y1*g + y2;

    return y2;
}

EMSCRIPTEN_KEEPALIVE
void filter(double cut) {
    cut = fast_tanh(cut * PI / SAMPLE_RATE);

    for (int i=0; i<128; i++) {
        double out = Apply(inputBuffer[i], cut);
        outputBuffer[i] = out;
    }
}