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
      try {
        console.log('🚀 BackgroundShader: Starting initialization...');
        
        // Dynamic import so SSR and fast cold-starts work better
        const THREE = await import("three");
        three = THREE;
        console.log('✅ Three.js loaded successfully');

        if (disposed) return;

        const canvas = canvasRef.current!;
        console.log('🎨 Canvas element:', canvas);
        console.log('📐 Window dimensions:', window.innerWidth, 'x', window.innerHeight);
        
        renderer = new THREE.WebGLRenderer({ canvas });
        renderer.setSize(window.innerWidth, window.innerHeight);
        console.log('🖥️ WebGL renderer created and sized');

        scene = new THREE.Scene();
        camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        console.log('🎬 Scene and camera created');

      // Match site palette: cyan/teal colors from site theme
      const fragmentShader = `
        uniform float iTime;
        uniform vec3 iResolution;

        #define TAU 6.2831853071795865

        //Parameters
        #define TUNNEL_LAYERS 96
        #define RING_POINTS 128
        #define POINT_SIZE 2.5
        #define POINT_COLOR_A vec3(3.0, 3.0, 3.0)  // Very bright white
        #define POINT_COLOR_B vec3(0.0, 2.0, 2.0)  // Bright cyan

        #define SPEED 0.7

        //Square of x
        float sq(float x) {
            return x*x;   
        }

        //Angular repeat
        vec2 AngRep(vec2 uv, float angle) {
            vec2 polar = vec2(atan(uv.y, uv.x), length(uv));
            polar.x = mod(polar.x + angle / 2.0, angle) - angle / 2.0; 
            return polar.y * vec2(cos(polar.x), sin(polar.x));
        }

        //Signed distance to circle
        float sdCircle(vec2 uv, float r) {
            return length(uv) - r;
        }

        //Mix a shape defined by a distance field 'sd' with a 'target' color using the 'fill' color.
        vec3 MixShape(float sd, vec3 fill, vec3 target) {
            float blend = smoothstep(0.0, 1.0/iResolution.y, sd);
            return mix(fill, target, blend);
        }

        //Tunnel/Camera path
        vec2 TunnelPath(float x) {
            vec2 offs = vec2(0, 0);
            
            offs.x = 0.2 * sin(TAU * x * 0.5) + 0.4 * sin(TAU * x * 0.2 + 0.3);
            offs.y = 0.3 * cos(TAU * x * 0.3) + 0.2 * cos(TAU * x * 0.1);
            
            offs *= smoothstep(1.0, 4.0, x);
            
            return offs;
        }

        void main() {
            vec2 uv = gl_FragCoord.xy / iResolution.xy;
            
            // Create a bright animated gradient that MUST be visible
            float time = iTime * 0.5;
            
            // Animated colors - very bright
            vec3 color1 = vec3(2.0, 0.0, 2.0); // Bright magenta
            vec3 color2 = vec3(0.0, 2.0, 2.0); // Bright cyan
            vec3 color3 = vec3(2.0, 2.0, 0.0); // Bright yellow
            
            // Create animated waves
            float wave1 = sin(uv.x * 10.0 + time * 2.0) * 0.5 + 0.5;
            float wave2 = cos(uv.y * 8.0 + time * 1.5) * 0.5 + 0.5;
            float wave3 = sin((uv.x + uv.y) * 6.0 + time) * 0.5 + 0.5;
            
            // Mix colors based on waves
            vec3 finalColor = mix(color1, color2, wave1);
            finalColor = mix(finalColor, color3, wave2 * wave3);
            
            gl_FragColor = vec4(finalColor, 1.0);
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
        });
        console.log('🎨 Shader material created');

        const geometry = new THREE.PlaneGeometry(2, 2);
        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        console.log('🔺 Geometry and mesh created and added to scene');

      const onResize = () => {
        if (!three) return;
        renderer.setSize(window.innerWidth, window.innerHeight);
        material.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight, 1);
      };

      window.addEventListener("resize", onResize);

      const speedMultiplier = 0.5; // Set speed to 0.5x

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
        console.log('🎬 Animation started successfully!');

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
        
      } catch (error) {
        console.error('❌ BackgroundShader initialization failed:', error);
      }
    };

    init();

    return () => {
      disposed = true;
      if (cleanupRef.current) cleanupRef.current();
    };
  }, []);

  return null;
}