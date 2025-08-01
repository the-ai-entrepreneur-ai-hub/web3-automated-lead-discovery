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
      console.log('Initializing shader canvas:', canvas);
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setClearColor(0x000000, 0); // Transparent background
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      console.log('Canvas size:', window.innerWidth, window.innerHeight);

      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      // Match site palette: cyan/teal colors from site theme
      const fragmentShader = `
        uniform float iTime;
        uniform vec3 iResolution;

        #define TAU 6.2831853071795865

        // Parameters - fewer layers and points for better performance and visibility
        #define TUNNEL_LAYERS 48
        #define RING_POINTS 64
        #define POINT_SIZE 3.0

        // Very bright cyan colors for maximum visibility
        #define POINT_COLOR_A vec3(0.0, 2.0, 2.0)  // bright cyan
        #define POINT_COLOR_B vec3(2.0, 2.0, 2.0)  // bright white

        // Slower base speed
        #define SPEED 0.7

        float sq(float x) { return x*x; }

        vec2 AngRep(vec2 uv, float angle) {
          vec2 polar = vec2(atan(uv.y, uv.x), length(uv));
          polar.x = mod(polar.x + angle / 2.0, angle) - angle / 2.0;
          return polar.y * vec2(cos(polar.x), sin(polar.x));
        }

        float sdCircle(vec2 uv, float r) {
          return length(uv) - r;
        }

        vec3 MixShape(float sd, vec3 fill, vec3 target) {
          float blend = smoothstep(0.0, 1.0/iResolution.y, sd);
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
          vec2 uv = gl_FragCoord.xy / iResolution.xy;
          
          // Simple animated test pattern - this should be VERY visible
          float pulse = sin(iTime * 2.0) * 0.5 + 0.5;
          vec3 color = vec3(0.0, pulse, pulse); // Animated cyan
          
          // Add some movement
          float wave = sin(uv.x * 10.0 + iTime) * 0.5 + 0.5;
          color.r = wave;
          
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

      const speedMultiplier = 0.5; // Set speed to 0.5x to match HTML example

      const animate = (t: number) => {
        animationId = requestAnimationFrame(animate);
        const time = t * 0.001;
        const delta = Math.min(time - lastTime, 1 / 20); // clamp to avoid spikes
        lastTime = time;

        material.uniforms.iTime.value += delta * speedMultiplier;
        
        // Debug log every few seconds
        if (Math.floor(time) % 5 === 0 && Math.floor(time) !== Math.floor(time - delta)) {
          console.log('Shader rendering - time:', material.uniforms.iTime.value);
        }
        
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
      className="fixed inset-0 pointer-events-none block"
      style={{
        width: "100vw",
        height: "100vh",
        display: "block",
        zIndex: -1,
      }}
    />
  );
}