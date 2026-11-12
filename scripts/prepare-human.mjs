import fs from 'node:fs';
import { Color } from 'three';

const source = fs.readFileSync('scripts/assets/makehuman-source.glb');
const j = JSON.parse(source.subarray(20, 20 + source.readUInt32LE(12)));
const binStart = 20 + source.readUInt32LE(12) + 8;
const bin = source.subarray(binStart);

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
const shorts = new Color('#2b6777');
const brace = new Color('#32a6a4');
const braceTrim = new Color('#bfe8e4');
const skin = new Color('#dbb79e');
const hair = new Color('#352f2b');
const shoe = new Color('#e4ecf0');

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

  let c = skin;

  if (forearmHandWeight > 0.35) {
    c = skin;
  } else if (upperArmWeight > 0.4) {
    c = y > 1.27 ? navy : skin;
  } else if (torsoWeight >= legPelvisWeight && y > 0.95 && y < 1.445) {
    c = navy;
  } else if (y > 0.63 && y <= 0.97 && Math.abs(x) < 0.26) {
    c = shorts;
  } else if (x < -0.02 && y >= 0.455 && y <= 0.555) {
    // Operated right knee subtle rehabilitation band
    c = y < 0.47 || y > 0.54 ? braceTrim : brace;
  } else if (y < 0.095 && z > -0.08) {
    // Clean light athletic socks/footwear for clear foot/heel visibility
    c = shoe;
  }

  if (y > 1.645 && (z < 0.088 || y > 1.685)) {
    c = hair;
  }

  const co = cv.byteOffset + (ca.byteOffset || 0) + i * (cv.byteStride || (ca.type === 'VEC4' ? 16 : 12));
  output.writeFloatLE(c.r, co);
  output.writeFloatLE(c.g, co + 4);
  output.writeFloatLE(c.b, co + 8);
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
