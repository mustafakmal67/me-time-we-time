(function() {
  // Initialize WebGL background shader
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Create canvas element dynamically if not present
    let canvas = document.getElementById('shader-bg');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'shader-bg';
      // Prepend to body so it stays behind all content
      document.body.prepend(canvas);
    }

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      console.warn("WebGL not supported in this browser. Falling back to CSS background.");
      return;
    }

    // 2. Vertex Shader Source (Full-screen quad)
    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // 3. Fragment Shader Source (Cinematic Domain Warping with Brand Colors)
    const fsSource = `
      precision mediump float;
      uniform float u_time;
      uniform vec2 u_resolution;

      // Pseudo-random noise helper
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      // 2D Value Noise
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      // Fractional Brownian Motion (4 octaves)
      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        vec2 shift = vec2(100.0);
        // Rotate to reduce axial alignment bias
        mat2 rot = mat2(0.87758, 0.47942, -0.47942, 0.87758);
        for (int i = 0; i < 4; ++i) {
          v += a * noise(p);
          p = rot * p * 2.0 + shift;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        // Normalize coordinates and correct aspect ratio
        vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
        
        // Scale coordinate system for aesthetic detail density
        p *= 1.2;

        // Domain Warping: offset coordinate lookup using multi-layered noise
        vec2 q = vec2(
          fbm(p + vec2(0.0, 0.0) + u_time * 0.015),
          fbm(p + vec2(5.2, 1.3) + u_time * 0.012)
        );

        vec2 r = vec2(
          fbm(p + 3.0 * q + vec2(1.7, 9.2) + u_time * 0.008),
          fbm(p + 3.0 * q + vec2(8.3, 2.8) + u_time * 0.005)
        );

        float f = fbm(p + 3.5 * r);

        // Palette definitions:
        // Charcoal (#080b09) -> rgb(8, 11, 9)
        // Sunset Orange (#F58220) -> rgb(245, 130, 32)
        // Forest Green (#2F5D50) -> rgb(47, 93, 80)
        vec3 c_charcoal = vec3(0.031, 0.043, 0.035);
        vec3 c_orange   = vec3(0.961, 0.510, 0.125);
        vec3 c_green    = vec3(0.184, 0.365, 0.314);
        vec3 c_ambient  = vec3(0.015, 0.023, 0.019);

        // Mix the colors based on warped coordinates
        vec3 color = mix(c_charcoal, c_green, clamp(f * 1.4, 0.0, 1.0));
        color = mix(color, c_orange, clamp(length(q) * 0.7, 0.0, 1.0));
        color = mix(color, c_ambient, clamp(r.x * 0.5, 0.0, 1.0));

        // Output final color with full opacity (CSS rules control transparency and blending)
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    // 4. Helper to compile and link shader program
    function createShader(gl, type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compilation error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Shader program linking error:", gl.getProgramInfoLog(program));
      return;
    }

    // 5. Quad buffer setup
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "position");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");

    // 6. Resize handling
    let width = 0;
    let height = 0;
    function resize() {
      // Set display size and WebGL viewport
      width = window.innerWidth;
      height = window.innerHeight;
      
      // Reduce resolution slightly on low-dpi displays or for performance optimization
      let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      if (width < 768) {
        dpr = 0.85; // Low resolution rendering on mobile to save GPU power
      }
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    window.addEventListener('resize', resize, { passive: true });
    resize();

    // 7. Performance & Accessibility checks
    let animationFrameId = null;
    let startTime = Date.now();
    let isPageVisible = true;
    let prefersReducedMotion = false;

    // Check visibility API
    document.addEventListener('visibilitychange', () => {
      isPageVisible = document.visibilityState === 'visible';
      manageRenderLoop();
    });

    // Check media queries for reduced motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion = motionQuery.matches;
    motionQuery.addEventListener('change', () => {
      prefersReducedMotion = motionQuery.matches;
      manageRenderLoop();
    });

    function draw() {
      if (!gl) return;

      const elapsedSeconds = (Date.now() - startTime) / 1000.0;

      gl.useProgram(program);

      // Bind attributes and uniforms
      gl.enableVertexAttribArray(positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      gl.uniform1f(timeLocation, elapsedSeconds);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      // Loop
      animationFrameId = requestAnimationFrame(draw);
    }

    function manageRenderLoop() {
      const shouldRun = isPageVisible && !prefersReducedMotion;
      if (shouldRun) {
        if (!animationFrameId) {
          // Adjust start time to prevent sudden jump in animation
          startTime = Date.now() - (elapsedTimeBeforePause || 0);
          draw();
        }
      } else {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
          elapsedTimeBeforePause = Date.now() - startTime;
        }
      }
    }

    let elapsedTimeBeforePause = 0;
    
    // Start loop
    manageRenderLoop();
  });
})();
