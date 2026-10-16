import fs from 'node:fs';
const paths=JSON.parse(fs.readFileSync('dist/assets/scene-paths.json','utf8'));
function artwork(prefix){
 let svg='<svg class="animated-scene" viewBox="0 0 1103 1426" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><defs>';
 for(const [name,path] of Object.entries(paths))svg+=`<clipPath id="cut-${name}"><path d="${path}"/></clipPath>`;
 svg+='<mask id="scene-holes" maskUnits="userSpaceOnUse" x="0" y="0" width="1103" height="1426"><rect width="1103" height="1426" fill="black"/>';
 for(const path of Object.values(paths))svg+=`<path d="${path}" fill="white" stroke="white" stroke-width="12" stroke-linejoin="round"/>`;
 svg+=`</mask></defs><image href="${prefix}woodland-clean-plate.webp" width="1103" height="1426" mask="url(#scene-holes)"/><g class="owl-motion"><image href="${prefix}01-color.webp" width="1103" height="1426" clip-path="url(#cut-owl)"/></g>`;
 for(const name of ['upper','lower'])svg+=`<g class="leaf-${name}"><g clip-path="url(#cut-${name})"><image class="leaf-paint" href="${prefix}01-color.webp" width="1103" height="1426"/></g></g>`;
 return svg+'</svg>';
}
for(const [file,prefix] of [['dist/index.html','assets/'],['dist/explore-usa/owl/index.html','../../assets/']]){
 const source=fs.readFileSync(file,'utf8');
 if(!source.includes('<svg class="animated-scene"'))throw new Error(`Missing art layer in ${file}`);
 fs.writeFileSync(file,source.replace(/<svg class="animated-scene"[\s\S]*?<\/svg>/,artwork(prefix)));
}
console.log('Editable scene mask paths synchronized into both static entry pages.');
