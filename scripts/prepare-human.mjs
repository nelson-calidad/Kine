import fs from 'node:fs';
import { Color } from 'three';

const sourcePath = fs.existsSync('scripts/assets/makehuman-source.glb')
  ? 'scripts/assets/makehuman-source.glb'
  : 'public/models/rehab-human.glb';
const source = fs.readFileSync(sourcePath);
const j = JSON.parse(source.subarray(20, 20 + source.readUInt32LE(12)));
const binStart = 20 + source.readUInt32LE(12) + 8;
const bin = source.subarray(binStart);

function smoothstep(edge0, edge1, x) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

// Remove unused TEXCOORD_0 to reduce size
for (const m of j.meshes) {
  for (const p of m.primitives) {
    delete p.attributes.TEXCOORD_0;
  }
}

// Keep the original anatomical mesh and rig; discard all unrelated motion and cameras.
const used = new Set();
for (const m of j.meshes) {
  for (const p of m.primitives) {
    Object.values(p.attributes).forEach((a) => used.add(a));
    used.add(p.indices);
  }
}
for (const s of j.skins) used.add(s.inverseBindMatrices);

const am = new Map([...used].map((v, i) => [v, i]));
j.accessors = [...used].map((i) => j.accessors[i]);
for (const m of j.meshes) {
  for (const p of m.primitives) {
    for (const k in p.attributes) p.attributes[k] = am.get(p.attributes[k]);
    p.indices = am.get(p.indices);
  }
}
for (const s of j.skins) s.inverseBindMatrices = am.get(s.inverseBindMatrices);

const views = [...new Set(j.accessors.map((a) => a.bufferView))];
const vm = new Map(views.map((v, i) => [v, i]));
let offset = 0;
const chunks = [];
j.bufferViews = views.map((i) => {
  const v = j.bufferViews[i];
  const b = Buffer.from(bin.subarray(v.byteOffset || 0, (v.byteOffset || 0) + v.byteLength));
  const result = { ...v, buffer: 0, byteOffset: offset };
  chunks.push(b);
  offset += b.length;
  const pad = (4 - (offset % 4)) % 4;
  if (pad) {
    chunks.push(Buffer.alloc(pad));
    offset += pad;
  }
  return result;
});
j.accessors.forEach((a) => (a.bufferView = vm.get(a.bufferView)));

const output = Buffer.concat(chunks);
const attr = j.meshes[0].primitives[0].attributes;
const pa = j.accessors[attr.POSITION];
const ca = j.accessors[attr.COLOR_0];
const ja = j.accessors[attr.JOINTS_0];
const wa = j.accessors[attr.WEIGHTS_0];

const pv = j.bufferViews[pa.bufferView];
const cv = j.bufferViews[ca.bufferView];
const jv = j.bufferViews[ja.bufferView];
const wv = j.bufferViews[wa.bufferView];

const jointNames = j.skins[0].joints.map((idx) => j.nodes[idx].name);

const navy = new Color('#1d425c');
const shorts = new Color('#285e6d');
const skin = new Color('#ddb9a0');
const hair = new Color('#352f2b');
const shoe = new Color('#e4ecf0');
const tempColor = new Color();

for (let i = 0; i < pa.count; i++) {
  const o = pv.byteOffset + (pa.byteOffset || 0) + i * (pv.byteStride || 12);
  const x = output.readFloatLE(o);
  const y = output.readFloatLE(o + 4);
  const z = output.readFloatLE(o + 8);

  const jo = jv.byteOffset + (ja.byteOffset || 0) + i * 4;
  const wo = wv.byteOffset + (wa.byteOffset || 0) + i * 16;

  let forearmHandWeight = 0;
  let upperArmWeight = 0;
  let legPelvisWeight = 0;
  let torsoWeight = 0;

  for (let k = 0; k < 4; k++) {
    const jIdx = output.readUInt8(jo + k);
    const w = output.readFloatLE(wo + k * 4);
    if (w <= 0) continue;
    const jName = jointNames[jIdx] || '';
    if (/lowerarm|wrist|metacarpal|finger/.test(jName)) forearmHandWeight += w;
    else if (/upperarm/.test(jName)) upperArmWeight += w;
    else if (/pelvis|upperleg|lowerleg|foot|toe/.test(jName)) legPelvisWeight += w;
    else if (/spine|clavicle|shoulder|breast|root/.test(jName)) torsoWeight += w;
  }

  tempColor.copy(skin);

  if (forearmHandWeight > 0.3) {
    tempColor.copy(skin);
  } else if (upperArmWeight > 0.35) {
    const sleeveBlend = smoothstep(1.255, 1.29, y) * (1 - smoothstep(0.3, 0.6, forearmHandWeight));
    tempColor.copy(skin).lerp(navy, sleeveBlend);
  } else if (torsoWeight >= legPelvisWeight && y > 0.94 && y < 1.46) {
    const collarBlend = 1 - smoothstep(1.425, 1.455, y);
    const waistBlend = smoothstep(0.94, 0.975, y);
    tempColor.copy(shorts).lerp(navy, waistBlend);
    tempColor.lerp(skin, 1 - collarBlend);
  } else if (y > 0.615 && y <= 0.975 && Math.abs(x) < 0.26) {
    const hemBlend = smoothstep(0.615, 0.65, y);
    tempColor.copy(skin).lerp(shorts, hemBlend);
  } else if (y < 0.105 && z > -0.09) {
    const sockBlend = 1 - smoothstep(0.08, 0.105, y);
    tempColor.copy(skin).lerp(shoe, sockBlend);
  }

  if (y > 1.635 && (z < 0.088 || y > 1.68)) {
    const hairBlend = smoothstep(1.635, 1.66, y);
    tempColor.lerp(hair, hairBlend);
  }

  const co = cv.byteOffset + (ca.byteOffset || 0) + i * (cv.byteStride || (ca.type === 'VEC4' ? 16 : 12));
  output.writeFloatLE(tempColor.r, co);
  output.writeFloatLE(tempColor.g, co + 4);
  output.writeFloatLE(tempColor.b, co + 8);
  if (ca.type === 'VEC4') output.writeFloatLE(1, co + 12);
}

delete j.animations;
delete j.cameras;
j.nodes.forEach((n) => delete n.camera);
j.materials = [
  {
    name: 'Sportswear and skin',
    doubleSided: false,
    pbrMetallicRoughness: { metallicFactor: 0.02, roughnessFactor: 0.82 }
  }
];
j.asset = {
  version: '2.0',
  generator: 'Tu rodilla: optimized MakeHuman character',
  copyright: 'MakeHuman core mesh and rig CC0-1.0; OpenGym3D export; original garment colours. See THIRD_PARTY.md.'
};
j.buffers = [{ byteLength: output.length }];

const json = Buffer.from(JSON.stringify(j));
const jsonPadded = Buffer.concat([json, Buffer.alloc((4 - (json.length % 4)) % 4, 32)]);
const header = Buffer.alloc(20);
header.writeUInt32LE(0x46546c67, 0);
header.writeUInt32LE(2, 4);
header.writeUInt32LE(28 + jsonPadded.length + output.length, 8);
header.writeUInt32LE(jsonPadded.length, 12);
header.writeUInt32LE(0x4e4f534a, 16);
const bh = Buffer.alloc(8);
bh.writeUInt32LE(output.length, 0);
bh.writeUInt32LE(0x004e4942, 4);

fs.writeFileSync('public/models/rehab-human.glb', Buffer.concat([header, jsonPadded, bh, output]));
console.log('Model bytes:', 28 + jsonPadded.length + output.length);
