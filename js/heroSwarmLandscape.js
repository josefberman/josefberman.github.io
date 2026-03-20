/**
 * Hero: periodic smooth height field (scrolling chunk) + stream-flow swarm;
 * origin + camera follow the flock so small robotic vehicles stay in view.
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

/** Low-profile rover: wheels + deck + hull + forward cabin + mast (local +Z = forward). */
function buildRobotGeometry() {
  const parts = [];
  const wr = 0.07;
  const wy = wr;
  const track = 0.118;
  const wb = 0.105;

  function addWheel(x, z) {
    const w = new THREE.CylinderGeometry(wr, wr, 0.036, 10);
    w.rotateZ(Math.PI / 2);
    w.translate(x, wy, z);
    parts.push(w);
  }
  addWheel(-track, wb);
  addWheel(track, wb);
  addWheel(-track, -wb);
  addWheel(track, -wb);

  const wheelTop = wy + wr;
  const deckHalf = 0.019;
  const deckY = wheelTop + 0.02;
  const deckTop = deckY + deckHalf;
  const hullHalf = 0.0275;
  const hullY = deckTop + hullHalf;
  const hullTop = hullY + hullHalf;
  const cabinHalf = 0.031;
  const cabinGap = 0.026;
  const cabinY = hullTop + cabinGap + cabinHalf;
  const mastHalf = 0.036;
  const mastGap = 0.016;
  const mastY = cabinY + cabinHalf + mastGap + mastHalf;

  const deck = new THREE.BoxGeometry(0.3, deckHalf * 2, 0.22);
  deck.translate(0, deckY, -0.015);
  parts.push(deck);

  const hull = new THREE.BoxGeometry(0.28, hullHalf * 2, 0.24);
  hull.translate(0, hullY, -0.02);
  parts.push(hull);

  const bumper = new THREE.BoxGeometry(0.26, 0.036, 0.048);
  bumper.translate(0, deckTop + 0.014, 0.128);
  parts.push(bumper);

  const cabin = new THREE.BoxGeometry(0.14, cabinHalf * 2, 0.12);
  cabin.translate(0, cabinY, 0.065);
  parts.push(cabin);

  const mast = new THREE.CylinderGeometry(0.016, 0.02, mastHalf * 2, 8);
  mast.translate(0, mastY, 0.055);
  parts.push(mast);

  const sensor = new THREE.CylinderGeometry(0.032, 0.026, 0.02, 10);
  sensor.rotateX(Math.PI / 2);
  sensor.translate(0, mastY + mastHalf + 0.018, 0.095);
  parts.push(sensor);

  const merged = mergeGeometries(parts, false);
  merged.computeVertexNormals();
  merged.computeBoundingBox();
  return merged;
}

const canvas = document.getElementById('hero-swarm-canvas');
if (!canvas) {
  // eslint-disable-next-line no-console
  console.warn('hero-swarm-canvas not found');
} else if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  canvas.style.display = 'none';
} else {
  const CHUNK = 26;
  const SEG = 66;
  const N = 42;
  const DT = 0.018;
  const STREAM = 2.15;
  const DAMP = 0.972;
  const REPULSE = 0.032;
  const NOISE = 0.16;
  const MAX_R = 5.45;
  const SOFT_SPRING = 0.24;
  const ORIGIN_LERP = 0.065;
  /** Recentre world when drift is large — Float32 positions lose sub-chunk detail at ~1e6+; earlier you get banding/flat relief. */
  const MAX_ORIGIN_DRIFT = 20;

  /**
   * Periodic terrain: sum of smooth sine/cosine layers (incommensurate frequencies)
   * so every neighborhood has hills and valleys — no Gaussian tails or flat basins.
   */
  function potential(x, z) {
    const k = 0.36;
    return (
      1.08 * Math.sin(k * x) * Math.cos(k * z * 1.04) +
      0.7 * Math.sin(k * x * 2.09 + 0.85) * Math.sin(k * z * 1.91) +
      0.44 * Math.cos(k * (0.52 * x + 0.48 * z) * 2.65) +
      0.34 * Math.sin(k * (x - 0.62 * z) * 1.5 + 1.15) +
      0.2 * Math.cos(k * x * 3.15) * Math.cos(k * z * 2.98)
    );
  }

  function heightAt(x, z) {
    return potential(x, z) * 0.82;
  }

  /** Stream ψ — simpler than before; time-varying so motion doesn’t lock. */
  function streamPsi(x, z, t) {
    return (
      1.08 * Math.sin(0.36 * x + 0.11 * t) * Math.cos(0.33 * z - 0.09 * t) +
      0.85 * Math.cos(0.24 * x - 0.14 * z + 0.22 * t) +
      0.55 * Math.sin(0.48 * x + 0.41 * z + 0.17 * t) +
      0.28 * Math.sin(0.71 * x - 0.55 * z) * Math.sin(0.13 * t)
    );
  }

  function streamVel(x, z, t, phase) {
    const e = 0.065;
    const xp = x + 0.31 * Math.sin(phase);
    const zp = z + 0.27 * Math.cos(phase * 1.3);
    const dpsidx = (streamPsi(xp + e, zp, t) - streamPsi(xp - e, zp, t)) / (2 * e);
    const dpsidz = (streamPsi(xp, zp + e, t) - streamPsi(xp, zp - e, t)) / (2 * e);
    return { sx: dpsidz, sz: -dpsidx };
  }

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf5f0ea);
  scene.fog = new THREE.Fog(0xf5f0ea, 12, 38);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 120);
  camera.position.set(0, 9.2, 13.5);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0xf5f0ea, 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const hemi = new THREE.HemisphereLight(0xfff5eb, 0x5c4d3d, 0.75);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffffff, 0.95);
  sun.position.set(6, 14, 5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 2;
  sun.shadow.camera.far = 40;
  sun.shadow.camera.left = -12;
  sun.shadow.camera.right = 12;
  sun.shadow.camera.top = 12;
  sun.shadow.camera.bottom = -12;
  scene.add(sun);
  scene.add(sun.target);
  const fill = new THREE.DirectionalLight(0xa8e6cf, 0.35);
  fill.position.set(-8, 6, -4);
  scene.add(fill);
  scene.add(fill.target);

  const terrainGeo = new THREE.PlaneGeometry(CHUNK, CHUNK, SEG, SEG);
  terrainGeo.rotateX(-Math.PI / 2);
  const pos = terrainGeo.attributes.position;
  const colorAttr = new THREE.BufferAttribute(new Float32Array(pos.count * 3), 3);
  terrainGeo.setAttribute('color', colorAttr);

  const cLow = new THREE.Color(0xccfbf1);
  const cMid = new THREE.Color(0xe7e5e4);
  const cHigh = new THREE.Color(0xfdba74);

  let originX = 0;
  let originZ = 0;
  /** Accumulated offset so recenters keep small Float32 coords but heightAt/stream see fixed world space. */
  let worldBiasX = 0;
  let worldBiasZ = 0;

  function updateTerrainMesh() {
    let hMin = Infinity;
    let hMax = -Infinity;
    const tmpH = new Float32Array(pos.count);
    for (let i = 0; i < pos.count; i++) {
      const lx = pos.getX(i);
      const lz = pos.getZ(i);
      const wx = lx + originX + worldBiasX;
      const wz = lz + originZ + worldBiasZ;
      const h = heightAt(wx, wz);
      tmpH[i] = h;
      pos.setY(i, h);
      hMin = Math.min(hMin, h);
      hMax = Math.max(hMax, h);
    }
    pos.needsUpdate = true;
    const colors = colorAttr.array;
    const hr = hMax - hMin + 1e-6;
    for (let i = 0; i < pos.count; i++) {
      const tn = (tmpH[i] - hMin) / hr;
      const c = new THREE.Color().lerpColors(cLow, cMid, Math.min(1, tn * 1.4)).lerp(cHigh, Math.max(0, (tn - 0.45) * 1.8));
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    colorAttr.needsUpdate = true;
    terrainGeo.computeVertexNormals();
    terrainGeo.computeBoundingSphere();
    terrain.position.set(originX + worldBiasX, 0, originZ + worldBiasZ);
  }

  function recenterWorldIfNeeded() {
    if (Math.hypot(originX, originZ) < MAX_ORIGIN_DRIFT) return;
    const ox = originX;
    const oz = originZ;
    worldBiasX += ox;
    worldBiasZ += oz;
    originX = 0;
    originZ = 0;
    for (let i = 0; i < N; i++) {
      px[i] -= ox;
      pz[i] -= oz;
    }
  }

  const terrainMat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.88,
    metalness: 0.06,
    flatShading: false,
  });
  const terrain = new THREE.Mesh(terrainGeo, terrainMat);
  terrain.receiveShadow = true;
  scene.add(terrain);
  updateTerrainMesh();

  const robotGeo = buildRobotGeometry();
  const robotFootClear = -robotGeo.boundingBox.min.y + 0.008;
  const robotMat = new THREE.MeshPhysicalMaterial({
    color: 0x8b9099,
    emissive: 0x3d4046,
    emissiveIntensity: 0.1,
    roughness: 0.42,
    metalness: 0.42,
    clearcoat: 0.28,
    clearcoatRoughness: 0.45,
  });
  const agents = new THREE.InstancedMesh(robotGeo, robotMat, N);
  agents.castShadow = true;
  // InstancedMesh frustum test uses this object's transform only (stays at origin);
  // instances live at px/pz near originX/originZ, so the mesh was culled from the main
  // camera while the (wider) shadow frustum still drew casters → visible shadows, no mesh.
  agents.frustumCulled = false;
  scene.add(agents);

  const px = new Float32Array(N);
  const pz = new Float32Array(N);
  const vx = new Float32Array(N);
  const vz = new Float32Array(N);
  const phase = new Float32Array(N);
  const dummy = new THREE.Object3D();
  const rng = (s) => {
    let x = Math.sin(s * 12.9898 + 78.233) * 43758.5453;
    return x - Math.floor(x);
  };
  for (let i = 0; i < N; i++) {
    const t = i * 0.713;
    px[i] = (rng(t) - 0.5) * 7.5;
    pz[i] = (rng(t + 1) - 0.5) * 7.5;
    vx[i] = (rng(t + 2) - 0.5) * 0.12;
    vz[i] = (rng(t + 3) - 0.5) * 0.12;
    phase[i] = rng(t + 4) * Math.PI * 2;
  }

  let camAngle = 0.35;
  let running = true;
  const clock = new THREE.Clock();

  document.addEventListener('visibilitychange', () => {
    running = document.visibilityState === 'visible';
  });

  function resize() {
    const el = canvas.parentElement;
    const w = el.clientWidth;
    const h = el.clientHeight;
    if (w < 2 || h < 2) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  resize();
  window.addEventListener('resize', resize);

  function step(t) {
    const dt = DT;
    for (let i = 0; i < N; i++) {
      const ax = px[i] + worldBiasX;
      const az = pz[i] + worldBiasZ;
      const { sx, sz } = streamVel(ax, az, t, phase[i]);
      vx[i] += sx * STREAM * dt;
      vz[i] += sz * STREAM * dt;
      vx[i] += (Math.random() - 0.5) * NOISE * dt;
      vz[i] += (Math.random() - 0.5) * NOISE * dt;
      phase[i] += dt * (0.35 + 0.25 * Math.sin(t * 0.4 + i));
    }
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = px[i] - px[j];
        const dz = pz[i] - pz[j];
        const d2 = dx * dx + dz * dz + 0.08;
        const f = REPULSE / d2;
        const fx = (dx / Math.sqrt(d2)) * f;
        const fz = (dz / Math.sqrt(d2)) * f;
        vx[i] += fx * dt;
        vz[i] += fz * dt;
        vx[j] -= fx * dt;
        vz[j] -= fz * dt;
      }
    }
    for (let i = 0; i < N; i++) {
      vx[i] *= DAMP;
      vz[i] *= DAMP;
      px[i] += vx[i] * dt * 8;
      pz[i] += vz[i] * dt * 8;
      const dx = px[i] - originX;
      const dz = pz[i] - originZ;
      const r = Math.hypot(dx, dz);
      if (r > MAX_R) {
        const pen = r - MAX_R;
        const nx = dx / (r + 1e-6);
        const nz = dz / (r + 1e-6);
        vx[i] -= nx * SOFT_SPRING * pen * dt * 12;
        vz[i] -= nz * SOFT_SPRING * pen * dt * 12;
      }
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    if (!running) return;
    const t = clock.getElapsedTime();
    step(t);

    let sx = 0;
    let sz = 0;
    for (let i = 0; i < N; i++) {
      sx += px[i];
      sz += pz[i];
    }
    sx /= N;
    sz /= N;
    originX += (sx - originX) * ORIGIN_LERP;
    originZ += (sz - originZ) * ORIGIN_LERP;
    recenterWorldIfNeeded();
    updateTerrainMesh();

    const absOx = originX + worldBiasX;
    const absOz = originZ + worldBiasZ;
    sun.target.position.set(absOx, 0, absOz);
    sun.position.set(absOx + 7, 14, absOz + 6);
    fill.target.position.set(absOx, 0, absOz);
    fill.position.set(absOx - 8, 6, absOz - 4);

    for (let i = 0; i < N; i++) {
      const ax = px[i] + worldBiasX;
      const az = pz[i] + worldBiasZ;
      const y = heightAt(ax, az) + robotFootClear;
      dummy.position.set(ax, y, az);
      const spd = Math.hypot(vx[i], vz[i]);
      if (spd > 0.025) {
        dummy.rotation.y = Math.atan2(vx[i], vz[i]);
      } else {
        dummy.rotation.y = phase[i] * 0.8;
      }
      dummy.rotation.x = 0;
      dummy.rotation.z = 0;
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      agents.setMatrixAt(i, dummy.matrix);
    }
    agents.instanceMatrix.needsUpdate = true;

    const fx = absOx;
    const fz = absOz;
    const fy = heightAt(fx, fz) + 0.55;
    camAngle += 0.00055;
    const distH = 8.4;
    const distZ = 12.6;
    camera.position.x = fx + Math.sin(camAngle + 0.9) * distH;
    camera.position.z = fz + Math.cos(camAngle + 0.9) * distZ;
    camera.position.y = fy + 7.4 + Math.sin(t * 0.12) * 0.35;
    camera.lookAt(fx, fy * 0.25 + 0.5, fz);

    renderer.render(scene, camera);
  }

  animate();
}
