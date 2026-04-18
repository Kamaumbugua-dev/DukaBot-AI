import {
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react'

export interface WaterRippleHandle {
  addRipple: (x: number, y: number, amplitude?: number) => void
}

// ── Shaders ────────────────────────────────────────────────────────────────

const VERT = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`

const FRAG = `
precision highp float;

uniform vec2  uRes;
uniform float uTime;
// each ripple: x, y (normalised 0-1), startTime, amplitude
// amplitude <= 0 means empty slot
uniform vec4  uRipples[8];

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;

  // aspect-corrected coords (centred on screen)
  float ar = uRes.x / uRes.y;
  vec2 uvA = vec2(uv.x * ar, uv.y);

  // ── ambient surface undulation ──────────────────────────────────────────
  float s = 0.0;
  s += sin(uvA.x * 3.1 + uTime * 0.22) * cos(uvA.y * 2.7 - uTime * 0.17) * 0.55;
  s += sin(uvA.x * 5.3 - uvA.y * 4.1 + uTime * 0.38) * 0.28;
  s += cos((uvA.x * 2.0 + uvA.y * 1.8) - uTime * 0.28) * 0.18;
  // subtle radial swell from centre
  float dist0 = length(uvA - vec2(ar * 0.5, 0.5));
  s += cos(dist0 * 3.5 - uTime * 0.45) * 0.12;
  s *= 0.07;

  // ── interactive ripples ─────────────────────────────────────────────────
  float r = 0.0;
  for (int i = 0; i < 8; i++) {
    float amp = uRipples[i].w;
    if (amp <= 0.0) continue;

    vec2 origin = vec2(uRipples[i].x * ar, uRipples[i].y);
    float age    = uTime - uRipples[i].z;
    if (age < 0.0 || age > 6.0) continue;

    float d      = length(uvA - origin);
    float front  = age * 0.30;                // ring travels outward
    float width  = 0.012 + age * 0.009;       // ring broadens with age
    float ring   = exp(-pow(d - front, 2.0) / (width * width));
    // concentric oscillation on the ring
    float osc    = cos((d - front) * 90.0 - age * 2.0);
    float decay  = exp(-age * 0.55) * amp;
    r += ring * osc * decay;

    // secondary weaker echo ring
    float front2 = age * 0.18;
    float ring2  = exp(-pow(d - front2, 2.0) / (width * width * 1.5));
    float osc2   = cos((d - front2) * 60.0 - age * 1.4);
    r += ring2 * osc2 * decay * 0.35;
  }

  float wave = s + r;

  // ── water colour palette — pearl/silver matching app white background ──
  vec3 abyss  = vec3(0.76, 0.79, 0.84);
  vec3 deep   = vec3(0.83, 0.85, 0.89);
  vec3 mid    = vec3(0.89, 0.91, 0.94);
  vec3 crest  = vec3(0.94, 0.95, 0.97);
  vec3 foam   = vec3(0.99, 0.99, 1.00);

  float t = clamp(wave * 0.5 + 0.5, 0.0, 1.0);
  vec3 col = mix(abyss,  deep,  smoothstep(0.00, 0.25, t));
  col       = mix(col,   mid,   smoothstep(0.25, 0.50, t));
  col       = mix(col,   crest, smoothstep(0.50, 0.75, t));
  col       = mix(col,   foam,  smoothstep(0.75, 1.00, t));

  // specular sparkle on high crests — subtle on light palette
  float spec = pow(max(0.0, wave - 0.3), 3.0) * 0.18;
  col += vec3(spec * 0.6, spec * 0.7, spec);

  gl_FragColor = vec4(col, 1.0);
}
`

// ── helpers ────────────────────────────────────────────────────────────────

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(s))
  }
  return s
}

function createProgram(gl: WebGLRenderingContext) {
  const prog = gl.createProgram()!
  gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT))
  gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG))
  gl.linkProgram(prog)
  return prog
}

// ── component ──────────────────────────────────────────────────────────────

interface Ripple { x: number; y: number; startTime: number; amplitude: number }

const MAX_RIPPLES = 8

const WaterRipple = forwardRef<WaterRippleHandle, { className?: string }>(
  function WaterRipple({ className }, ref) {
    const canvasRef  = useRef<HTMLCanvasElement>(null)
    const ripplesRef = useRef<Ripple[]>([])
    const rafRef     = useRef<number>(0)
    const startRef   = useRef<number>(performance.now())

    // expose addRipple to parent via ref
    useImperativeHandle(ref, () => ({
      addRipple(x: number, y: number, amplitude = 0.7) {
        const now = (performance.now() - startRef.current) / 1000
        ripplesRef.current.push({ x, y, startTime: now, amplitude })
        // keep newest MAX_RIPPLES
        if (ripplesRef.current.length > MAX_RIPPLES) {
          ripplesRef.current.shift()
        }
      },
    }))

    const resize = useCallback((canvas: HTMLCanvasElement, gl: WebGLRenderingContext) => {
      canvas.width  = canvas.offsetWidth  * devicePixelRatio
      canvas.height = canvas.offsetHeight * devicePixelRatio
      gl.viewport(0, 0, canvas.width, canvas.height)
    }, [])

    useEffect(() => {
      const canvas = canvasRef.current!
      const gl = canvas.getContext('webgl', { antialias: false })
      if (!gl) return

      const prog = createProgram(gl)
      gl.useProgram(prog)

      // fullscreen quad
      const buf = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buf)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1,  1, -1, -1,  1,
         1, -1,  1,  1, -1,  1,
      ]), gl.STATIC_DRAW)

      const aPosLoc = gl.getAttribLocation(prog, 'aPos')
      gl.enableVertexAttribArray(aPosLoc)
      gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, false, 0, 0)

      const uResLoc     = gl.getUniformLocation(prog, 'uRes')
      const uTimeLoc    = gl.getUniformLocation(prog, 'uTime')
      const uRipLocs    = Array.from({ length: MAX_RIPPLES }, (_, i) =>
        gl.getUniformLocation(prog, `uRipples[${i}]`)
      )

      resize(canvas, gl)

      const observer = new ResizeObserver(() => resize(canvas, gl))
      observer.observe(canvas)

      function render() {
        const t = (performance.now() - startRef.current) / 1000
        gl!.uniform2f(uResLoc, canvas.width, canvas.height)
        gl!.uniform1f(uTimeLoc, t)

        const rips = ripplesRef.current
        for (let i = 0; i < MAX_RIPPLES; i++) {
          const rip = rips[i]
          if (rip) {
            gl!.uniform4f(uRipLocs[i], rip.x, rip.y, rip.startTime, rip.amplitude)
          } else {
            gl!.uniform4f(uRipLocs[i], 0, 0, 0, 0)
          }
        }

        gl!.drawArrays(gl!.TRIANGLES, 0, 6)
        rafRef.current = requestAnimationFrame(render)
      }

      rafRef.current = requestAnimationFrame(render)

      return () => {
        cancelAnimationFrame(rafRef.current)
        observer.disconnect()
      }
    }, [resize])

    return (
      <canvas
        ref={canvasRef}
        className={className}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
    )
  }
)

export default WaterRipple
