import { useEffect, useRef } from "react";

// Three.js is only used in this component; import lazily to avoid bundle weight elsewhere.
export default function BackgroundShader() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cleanupRef = useRef<() => void>();

  useEffect(() => {
    let renderer: any;
    let scene: any;
    let camera: any;
    let material: any;
    let mesh: any;
    let animationId: number;
    let lastTime = 0;

    let three: typeof import("three") | null = null;

    let disposed = false;

    const init = async () => {
      // Dynamic import so SSR and fast cold-starts work better
      const THREE = await import("three");
      three = THREE;

      if (disposed) return;

      const canvas = canvasRef.current!;
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);

      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      // Match site palette: soft cyan/teal whites over dark bg
      const fragmentShader = `
        uniform float iTime;
        uniform vec3 iResolution;

        #define TAU 6.2831853071795865

        // Tunables
        #define TUNNEL_LAYERS 96
        #define RING_POINTS 128
        #define POINT_SIZE 1.8

        // Colors matched to site palette (hues of cyan/teal-ish whites)
        const vec3 POINT_COLOR_A = vec3(0.86, 0.96, 1.0); // soft cool white
        const vec3 POINT_COLOR_B = vec3(0.65, 0.90, 0.95); // subtle cyan tint

        // Base speed (reduced), further scaled by JS multiplier for fine control
        #define SPEED 0.45

        float sq(float x) { return x*x; }

        vec2 AngRep(vec2 uv, float angle) {
          vec2 polar = vec2(atan(uv.y, uv.x), length(uv));
          polar.x = mod(polar.x + angle * 0.5, angle) - angle * 0.5;
          return polar.y * vec2(cos(polar.x), sin(polar.x));
        }

        float sdCircle(vec2 uv, float r) {
          return length(uv) - r;
        }

        vec3 MixShape(float sd, vec3 fill, vec3 target, float px) {
          float blend = smoothstep(0.0, px, sd);
          return mix(fill, target, blend);
        }

        vec2 TunnelPath(float x) {
          vec2 offs = vec2(0.0);
          offs.x = 0.2 * sin(TAU * x * 0.5) + 0.4 * sin(TAU * x * 0.2 + 0.3);
          offs.y = 0.3 * cos(TAU * x * 0.3) + 0.2 * cos(TAU * x * 0.1);
          offs *= smoothstep(1.0, 4.0, x);
          return offs;
        }

        void main() {
          vec2 res = iResolution.xy / iResolution.y;
          vec2 uv = gl_FragCoord.xy / iResolution.y;
          uv -= res * 0.5;

          vec3 color = vec3(0.0);

          float repAngle = TAU / float(RING_POINTS);
          float pointSize = POINT_SIZE / 2.0 / iResolution.y;

          float camZ = iTime * SPEED;
          vec2 camOffs = TunnelPath(camZ);

          // Pixel size in world for smoother AA
          float px = 1.0 / iResolution.y;

          for (int i = 1; i <= TUNNEL_LAYERS; i++) {
            float pz = 1.0 - (float(i) / float(TUNNEL_LAYERS));
            pz -= mod(camZ, 4.0 / float(TUNNEL_LAYERS));

            vec2 offs = TunnelPath(camZ + pz) - camOffs;

            float ringRad = 0.15 * (1.0 / sq(pz * 0.8 + 0.4));

            if (abs(length(uv + offs) - ringRad) < pointSize * 1.6) {
              vec2 aruv = AngRep(uv + offs, repAngle);
              float pdist = sdCircle(aruv - vec2(ringRad, 0.0), pointSize);

              // Alternate stripes softly between two brand-consistent tints
              vec3 ptColor = (mod(float(i / 2), 2.0) == 0.0) ? POINT_COLOR_A : POINT_COLOR_B;

              // Distance fade
              float shade = (1.0 - pz);

              color = MixShape(pdist, ptColor * shade, color, px);
            }
          }

          // Gentle vignette to blend with dark background
          float vignette = smoothstep(0.9, 0.2, length(uv) * 0.9);
          color *= vignette;

          gl_FragColor = vec4(color, 1.0);
        }
      `;

      const vertexShader = `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `;

      material = new THREE.ShaderMaterial({
        uniforms: {
          iTime: { value: 0 },
          iResolution: { value: new THREE.Vector3(window.innerWidth, window.innerHeight, 1) },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthTest: false,
        depthWrite: false,
      });

      const geometry = new THREE.PlaneGeometry(2, 2);
      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const onResize = () => {
        if (!three) return;
        renderer.setSize(window.innerWidth, window.innerHeight);
        material.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight, 1);
      };

      window.addEventListener("resize", onResize);

      const speedMultiplier = 0.4; // Slightly slower than provided snippet

      const animate = (t: number) => {
        animationId = requestAnimationFrame(animate);
        const time = t * 0.001;
        const delta = Math.min(time - lastTime, 1 / 20); // clamp to avoid spikes
        lastTime = time;

        material.uniforms.iTime.value += delta * speedMultiplier;
        renderer.render(scene, camera);
      };

      animate(0);

      cleanupRef.current = () => {
        if (animationId) cancelAnimationFrame(animationId);
        window.removeEventListener("resize", onResize);
        if (scene && mesh) {
          scene.remove(mesh);
          mesh.geometry.dispose();
          mesh = null;
        }
        if (material) {
          material.dispose();
        }
        if (renderer) {
          renderer.dispose();
        }
      };
    };

    init();

    return () => {
      disposed = true;
      if (cleanupRef.current) cleanupRef.current();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none block"
      style={{
        width: "100vw",
        height: "100vh",
        display: "block",
      }}
    />
  );
}