// Ported from researchere/src/components/ui/activity-field.tsx (shader and behaviour unchanged).
// Zeal Dev uses it as the hero backdrop, recoloured to the Zeal orange ramp. Differences from the
// source: it renders nothing when WebGL is unavailable, and it takes an optional style prop.
//
// Activity field: the workspace's activity heatmap turned into a landscape.
// Each column is a bar of rounded cells in the heat ramp; the skyline rises left to right
// (idea → publication) and rolls slowly, cells flicker on like new activity, and the pointer
// adds activity where it moves. Rendered in one WebGL fragment shader.
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';

const MAX_DPR = 2;

const VERT_SRC = `
attribute vec2 a_pos;
void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG_SRC = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2  uRes;
uniform float uTime, uDpr, uCell, uInset;
uniform vec3  uBg, uH0, uH1, uH2, uH3, uH4;
uniform vec2  uMouse;
uniform float uMouseRadius, uMouseActive;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

vec3 heat(float i){
  if (i < 1.0) return uH0;
  if (i < 2.0) return uH1;
  if (i < 3.0) return uH2;
  if (i < 4.0) return uH3;
  return uH4;
}

void main(){
  float cs = uCell * uDpr;
  vec2 ci = floor(gl_FragCoord.xy / cs);
  vec2 cc = (ci + 0.5) * cs;

  // CSS pixels, y measured up from the bottom edge.
  float w = uRes.x / uDpr;
  float h = uRes.y / uDpr;
  float x = cc.x / uDpr;
  float y = cc.y / uDpr;
  float xn = x / w;

  // Skyline: a rising trend plus two slow rolling swells, shaped against the visible height
  // (anything under uInset is covered). Sampled per column, so it steps like bars.
  float t = uTime;
  float vh = max(h - uInset, 1.0);
  float surface = vh * (0.26 + 0.30 * xn
    + 0.09 * sin(xn * 5.0 - t * 0.45)
    + 0.05 * sin(xn * 11.0 + t * 0.7 + 1.3));
  float band = vh * 0.42;
  float depth = (surface - (y - uInset)) / band;

  float n = hash(ci);
  float v = depth + (n - 0.5) * 0.45;
  float level = clamp(v, 0.0, 1.0) * 4.0;

  // Sparse cells flare up for a moment, like new commits.
  float spark = step(0.86, hash(ci + 17.0)) * pow(max(0.0, sin(t * 0.9 + n * 40.0)), 12.0);
  level += spark * 2.2 * step(-0.6, depth);

  // The pointer adds activity around it.
  vec2 md = vec2(x, y) - uMouse;
  level += 2.6 * uMouseActive * exp(-dot(md, md) / (2.0 * uMouseRadius * uMouseRadius));

  level = clamp(level, 0.0, 4.0);

  // Empty cells above the skyline read as the calendar grid, fading out with height.
  float alpha = level < 0.5 ? clamp(1.0 + depth * 1.4, 0.0, 1.0) * 0.9 : 1.0;

  // Blend neighbouring levels a little so steps change softly as the skyline moves.
  float lo = floor(level);
  vec3 col = mix(heat(lo), heat(min(lo + 1.0, 4.0)), smoothstep(0.6, 1.0, fract(level)));

  // Rounded square inside the cell.
  float half_ = cs * 0.36;
  float r = cs * 0.14;
  vec2 q = abs(gl_FragCoord.xy - cc) - vec2(half_ - r);
  float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  float cov = 1.0 - smoothstep(-0.6, 0.6, d);

  gl_FragColor = vec4(mix(uBg, col, cov * alpha), 1.0);
}
`;

type RGB = [number, number, number];

const compile = (gl: WebGLRenderingContext, type: number, src: string) => {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error('ActivityField shader:', gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
};

const hexToRgb = (hex: string): RGB => {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.replace(/./g, (c) => c + c);
  const n = parseInt(h.slice(0, 6), 16);
  return Number.isNaN(n) ? [0, 0, 0] : [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

export interface ActivityFieldProps {
  className?: string;
  /** Hex colour of whatever the field sits on. */
  background: string;
  /** Hex colours for heat levels 0 (empty) to 4 (busiest). */
  heat: [string, string, string, string, string];
  /** Cell pitch in CSS pixels. */
  cellSize?: number;
  /** 0 freezes the motion; 1 is the default pace. */
  speed?: number;
  /** CSS pixels at the bottom that something else covers; the skyline is shaped above them. */
  bottomInset?: number;
  pointerRadius?: number;
  style?: React.CSSProperties;
}

export const ActivityField: React.FC<ActivityFieldProps> = ({
  className,
  background,
  heat,
  cellSize = 8,
  speed = 1,
  bottomInset = 0,
  pointerRadius = 90,
  style,
}) => {
  const [supported, setSupported] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Read every frame, so a theme switch applies without rebuilding the GL program.
  const params = useRef({ bg: [0, 0, 0] as RGB, heat: [] as RGB[], cellSize, speed, bottomInset, pointerRadius });
  params.current = { bg: hexToRgb(background), heat: heat.map(hexToRgb), cellSize, speed, bottomInset, pointerRadius };

  const pointer = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, active: 0, targetActive: 0 });

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const p = pointer.current;
    p.targetX = e.clientX - rect.left;
    p.targetY = rect.bottom - e.clientY;
    if (p.active < 0.01) {
      p.x = p.targetX;
      p.y = p.targetY;
    }
    p.targetActive = 1;
  };
  const onPointerLeave = () => {
    pointer.current.targetActive = 0;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const getGl = (): WebGLRenderingContext | null => {
      try {
        return canvas.getContext('webgl', { alpha: false, antialias: false, depth: false });
      } catch {
        return null;
      }
    };
    const gl = getGl();
    if (!gl) {
      setSupported(false);
      return;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT_SRC);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) {
      setSupported(false);
      return;
    }
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('ActivityField link:', gl.getProgramInfoLog(prog));
      setSupported(false);
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const locs = new Map<string, WebGLUniformLocation | null>();
    const u = (name: string) => {
      if (!locs.has(name)) locs.set(name, gl.getUniformLocation(prog, name));
      return locs.get(name)!;
    };

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let last = performance.now();
    // Start mid-cycle so the first frame already has a shape.
    let clock = 12;
    let visible = true;

    const render = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const v = params.current;
      if (!reduceMotion) clock += dt * v.speed;

      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const bw = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const bh = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
      }
      gl.viewport(0, 0, bw, bh);

      const p = pointer.current;
      p.x += (p.targetX - p.x) * Math.min(1, dt * 10);
      p.y += (p.targetY - p.y) * Math.min(1, dt * 10);
      p.active += (p.targetActive - p.active) * Math.min(1, dt * 4);

      gl.uniform2f(u('uRes'), bw, bh);
      gl.uniform1f(u('uTime'), clock);
      gl.uniform1f(u('uDpr'), dpr);
      // Whole device pixels keep every square the same size.
      gl.uniform1f(u('uCell'), Math.max(3, Math.round(v.cellSize * dpr)) / dpr);
      gl.uniform1f(u('uInset'), v.bottomInset);
      gl.uniform2f(u('uMouse'), p.x, p.y);
      gl.uniform1f(u('uMouseRadius'), v.pointerRadius);
      gl.uniform1f(u('uMouseActive'), p.active);
      gl.uniform3f(u('uBg'), ...v.bg);
      v.heat.forEach((c, i) => gl.uniform3f(u(`uH${i}`), ...c));

      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = visible ? requestAnimationFrame(render) : 0;
    };

    // Stop drawing while scrolled out of view.
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(render);
      }
    });
    observer.observe(canvas);
    raf = requestAnimationFrame(render);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  if (!supported) return null;

  return (
    <div
      aria-hidden
      className={cn('relative overflow-hidden', className)}
      style={{ background, ...style }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onPointerCancel={onPointerLeave}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
    </div>
  );
};
