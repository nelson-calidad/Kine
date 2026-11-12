import fs from 'node:fs';
const names=['deslizamiento-talon','flexion-asistida-toalla','deslizamiento-pie-pared','flexion-activa-sedestacion','bicicleta-estatica'];
const line=(a,b,w,c)=>`<path d="M${a} L${b}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
const limb=(a,b,c,far=false)=>line(a,b,28,far?'#8ca3ac':'url(#pants)')+line(b,c,20,far?'#c59d85':'url(#skin)')+`<circle cx="${b[0]}" cy="${b[1]}" r="13" fill="${far?'#8ca3ac':'#56bdb6'}"/>`;
const shoe=(p)=>`<path d="M${p[0]-9} ${p[1]-7} q12 -5 20 3 l15 7 q4 8 -7 9 h-29 q-6 -4 1 -19" fill="#f9fcfc" stroke="#b3c9cc" stroke-width="2"/>`;
for(let i=0;i<5;i++) for(let final=0;final<2;final++){
 let scene='',body='',hip,knee,foot,head,shoulder;
 if(i<3){
  scene='<rect x="40" y="257" width="490" height="17" rx="8" fill="#aecfce"/><path d="M65 274v28 M505 274v28" stroke="#8ba6b2" stroke-width="10"/><rect x="53" y="244" width="80" height="13" rx="6" fill="white"/>';
  hip=[255,232]; shoulder=[145,225]; head=[99,224];
  if(i===2){scene+='<path d="M493 39v219h30V39" fill="#dbe5ea"/><path d="M493 39v219" stroke="#b2c6ce" stroke-width="3"/>'; hip=[320,232]; shoulder=[210,225]; head=[164,224];foot=final?[478,142]:[478,62]; const dx=foot[0]-hip[0],dy=foot[1]-hip[1],d=Math.hypot(dx,dy),h=Math.sqrt(120**2-(d/2)**2); knee=[(hip[0]+foot[0])/2+dy/d*h,(hip[1]+foot[1])/2-dx/d*h];}
  else{foot=final?[404,241]:[493,241];const dx=foot[0]-hip[0],dy=foot[1]-hip[1],d=Math.hypot(dx,dy),h=Math.sqrt(120**2-(d/2)**2);knee=[(hip[0]+foot[0])/2+dy/d*h,(hip[1]+foot[1])/2-dx/d*h];}
  body+=limb([hip[0],hip[1]-8],i===2?[390,130]:[370,230],i===2?[475,90]:[490,231],true);
  body+=`<path d="M${shoulder[0]-13} 208 Q${shoulder[0]+35} 194 ${hip[0]} 217 L${hip[0]+4} 247 L${shoulder[0]-10} 246 Q${shoulder[0]-25} 232 ${shoulder[0]-13} 208" fill="url(#shirt)"/>`;
  body+=limb(hip,knee,foot)+shoe(foot);
  const hand=i===1?[285,190]:[238+(i===2?65:0),239];
  body+=line(shoulder,[shoulder[0]+42,235],17,'url(#skin)')+line([shoulder[0]+42,235],hand,13,'url(#skin)');
  if(i===1)body+=`<path d="M${hand} Q350 190 ${foot[0]+17} ${foot[1]-8} L${foot[0]+18} ${foot[1]+8} Q345 213 ${hand[0]} ${hand[1]+8}" fill="none" stroke="#c99d61" stroke-width="5"/>`;
 }else{
  const bike=i===4;hip=bike?[251,166]:[244,183]; shoulder=bike?[283,103]:[235,103];head=bike?[300,62]:[237,62];
  if(!bike){scene='<path d="M202 110v84h80 M207 195l-10 97 M277 195l12 97" fill="none" stroke="#8ca4b1" stroke-width="11" stroke-linecap="round"/><rect x="207" y="179" width="83" height="16" rx="8" fill="#b5ced3"/>';foot=final?[277,278]:[375,278];const dx=foot[0]-hip[0],dy=foot[1]-hip[1],d=Math.hypot(dx,dy),h=Math.sqrt(110**2-(d/2)**2);knee=[(hip[0]+foot[0])/2+dy/d*h,(hip[1]+foot[1])/2-dx/d*h];}
  else{scene='<path d="M214 285h192 M245 280l30-80 85 70 M255 168l20 32 M360 265l22-151h-28" fill="none" stroke="#8ca4b1" stroke-width="12" stroke-linecap="round"/><ellipse cx="333" cy="244" rx="55" ry="39" fill="#e0e9ed"/><circle cx="333" cy="244" r="28" fill="#b0c5cc"/><rect x="225" y="166" width="53" height="10" rx="5" fill="#173b59"/>';foot=final?[310,263]:[354,225];const dx=foot[0]-hip[0],dy=foot[1]-hip[1],d=Math.hypot(dx,dy),h=Math.sqrt(100**2-(d/2)**2);knee=[(hip[0]+foot[0])/2+dy/d*h,(hip[1]+foot[1])/2-dx/d*h];scene+=line([333,244],foot,7,'#526e80')+line([foot[0]-13,foot[1]+8],[foot[0]+24,foot[1]+8],7,'#173b59');}
  body+=limb([hip[0]-8,hip[1]],[320,190],[bike?307:347,bike?264:278],true);
  body+=`<path d="M${shoulder[0]-20} ${shoulder[1]-12} Q${shoulder[0]+8} ${shoulder[1]-22} ${shoulder[0]+22} ${shoulder[1]+1} L${hip[0]+20} ${hip[1]+10} Q${hip[0]} ${hip[1]+25} ${hip[0]-22} ${hip[1]+5}Z" fill="url(#shirt)"/>`;
  body+=limb(hip,knee,foot)+shoe(foot)+line(shoulder,bike?[315,138]:[257,147],17,'url(#skin)')+line(bike?[315,138]:[257,147],bike?[366,115]:[292,180],13,'url(#skin)');
 }
 body+=line(shoulder,head,19,'url(#skin)')+`<ellipse cx="${head[0]}" cy="${head[1]}" rx="23" ry="27" fill="url(#skin)"/><path d="M${head[0]-22} ${head[1]+3} q-12 -40 20 -32 q22 3 24 19 q-26 -7 -33 13Z" fill="#334854"/><circle cx="${head[0]+12}" cy="${head[1]-2}" r="2" fill="#334854"/>`;
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 580 330"><defs><linearGradient id="skin" x2="0.6" y2="1"><stop stop-color="#efcbb1"/><stop offset="1" stop-color="#c79176"/></linearGradient><linearGradient id="shirt" x2="0.4" y2="1"><stop stop-color="#54798e"/><stop offset="1" stop-color="#173b59"/></linearGradient><linearGradient id="pants" x2="0.4" y2="1"><stop stop-color="#75cec4"/><stop offset="1" stop-color="#238f90"/></linearGradient></defs><ellipse cx="290" cy="299" rx="230" ry="12" fill="#173b59" opacity=".07"/>${scene}${body}</svg>`;
 fs.writeFileSync(`public/exercises/${names[i]}-${final?'final':'inicio'}.svg`,svg);
 if(final)fs.writeFileSync(`public/exercises/${names[i]}.svg`,svg);
}
