import fs from 'node:fs';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Box3,Vector3 } from 'three';
const b=fs.readFileSync('scripts/assets/makehuman-source.glb');
const j=JSON.parse(b.subarray(20,20+b.readUInt32LE(12))); console.log('geometry',j.accessors[0], 'node names',j.nodes.map(n=>n.name).filter(n=>!/finger|toe|face|tongue|jaw|eye/.test(n)));
const g=await new GLTFLoader().parseAsync(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),'');
g.scene.traverse(n=>{if(n.isSkinnedMesh)n.skeleton.pose();});g.scene.updateMatrixWorld(true);
console.log('bounds',new Box3().setFromObject(g.scene));g.scene.traverse(n=>{if(n.isBone && /upperleg|lowerleg|root|spine0[15]|head|upperarm|lowerarm|hand|foot/.test(n.name))console.log(n.name,n.getWorldPosition(new Vector3()).toArray(),n.children.filter(c=>c.isBone).map(c=>[c.name,c.position.toArray()]));});
