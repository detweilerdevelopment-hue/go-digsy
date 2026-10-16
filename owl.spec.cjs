const {test,expect}=require('@playwright/test');
const fs=require('fs');
for(const [width,height] of [[320,740],[375,812],[390,844],[480,900],[768,1024],[1024,768],[1280,800],[1440,900],[1920,1080]]){
test(`Owl interactions ${width}`,async({page})=>{
await page.setViewportSize({width,height});const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
await page.goto('http://localhost:4173/');await expect(page.locator('h1')).toHaveText('Owl');
await expect(page.locator('.story>p').nth(1)).toContainText('Digsy tiptoed');await expect(page.locator('.story>p').nth(2)).toContainText('where to look');
expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
await page.locator('#greet').click();await expect(page.locator('#feedback')).toContainText('Whooo');await expect(page.locator('#scene')).toHaveClass(/greet/);
await page.locator('.owl').click();await expect(page.locator('#feedback')).toContainText('Whooo');
await page.locator('#hint').click();await expect(page.locator('#find')).toHaveAttribute('open','');await expect(page.locator('#scene')).toHaveClass(/hinting/);await expect(page.locator('#feedback')).toHaveText('Look on Owl’s wing, just below its face. A little green leaf is tucked into the feathers.');
await page.locator('.leaf').click();await expect(page.locator('#feedback')).toContainText('You found');await expect(page.locator('#scene')).toHaveClass(/found/);await page.locator('.leaf').click();
await page.locator('#pause').click();await expect(page.locator('body')).toHaveClass(/paused/);await page.locator('#reset').click();await expect(page.locator('body')).toHaveClass(/paused/);await expect(page.locator('#scene')).not.toHaveClass(/found/);await expect(page.locator('#feedback')).toContainText('waiting');
expect(await page.locator('.one').evaluate(e=>getComputedStyle(e).animationPlayState)).toBe('paused');await page.locator('#pause').click();await expect(page.locator('body')).not.toHaveClass(/paused/);
await page.locator('[data-art-toggle]').click();await expect(page.locator('#adventure-art')).toHaveAttribute('src',/01-original/);await expect(page.locator('#adventure-art')).toHaveJSProperty('naturalWidth',1103);await page.locator('[data-art-toggle]').click();
await page.locator('[data-text-size]').click();await expect(page.locator('.story')).toHaveClass(/large/);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.locator('[data-text-size]').click();
await page.getByRole('link',{name:'Look & find'}).click();await expect(page.locator('#find')).toHaveAttribute('open','');
await page.locator('#reset').click();await page.locator('.leaf').focus();await page.keyboard.press('Enter');await expect(page.locator('#feedback')).toContainText('You found');await page.locator('#reset').click();
await page.locator('.canopy').click();await expect(page.locator('#feedback')).toContainText('Rustle');await page.locator('#reset').click();
const links=await page.locator('a').evaluateAll(as=>as.map(a=>a.getAttribute('href')));for(const href of links){expect(href.startsWith('#')).toBe(true);expect(await page.locator(href).count()).toBe(1);}
await page.getByRole('link',{name:'Next →'}).click();await expect(page.locator('#sample-info')).toBeInViewport();
await page.goto('http://localhost:4173/explore-usa/owl/');await page.reload();await expect(page.locator('#adventure-art')).toHaveJSProperty('naturalWidth',1103);
await page.evaluate(()=>document.fonts.ready);await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:`screenshots/owl-${width}x${height}.png`,fullPage:true});expect(errors).toEqual([]);
});}
test('Reduced motion and keyboard focus',async({page})=>{await page.emulateMedia({reducedMotion:'reduce'});await page.goto('http://localhost:4173/');await expect(page.locator('body')).toHaveClass(/paused/);expect(await page.locator('.one').evaluate(e=>getComputedStyle(e).animationName)).toBe('none');await page.keyboard.press('Tab');await expect(page.locator('.skip')).toBeFocused();await page.keyboard.press('Enter');await page.locator('#greet').focus();await page.keyboard.press('Enter');await expect(page.locator('#feedback')).toContainText('Whooo');await page.locator('#reset').click();await expect(page.locator('body')).toHaveClass(/paused/);});
test('Automated accessibility scan',async({page})=>{const AxeBuilder=require('@axe-core/playwright').default;await page.goto('http://localhost:4173/');const result=await new AxeBuilder({page}).analyze();fs.writeFileSync('test-results/accessibility.json',JSON.stringify(result.violations,null,2));expect(result.violations).toEqual([]);});


test('Activity edge cases, target alignment, and text encoding',async({page})=>{
await page.setViewportSize({width:375,height:812});await page.goto('http://localhost:4173/');
await page.locator('#pause').click();await page.locator('#greet').click();await expect(page.locator('.greeting')).toHaveCSS('opacity','1');
await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:'screenshots/owl-paused-greeting.png',fullPage:true});
for(let i=0;i<8;i++)await page.locator('#greet').click();
await expect(page.locator('#feedback')).toHaveText('Whooo, hello! Owl is happy you stopped by.');
await page.locator('#hint').click();await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:'screenshots/owl-hint.png',fullPage:true});
await page.locator('.leaf').click();await expect(page.locator('#feedback')).toHaveText('You found the little leaf! Wonderful looking, woodland explorer!');
await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:'screenshots/owl-success.png',fullPage:true});
await page.locator('#hint').click();await expect(page.locator('#scene')).not.toHaveClass(/hinting/);
await page.locator('.canopy').click();await expect(page.locator('#feedback')).toContainText('well done');
await page.locator('#reset').click();await expect(page.locator('.leaf')).toHaveAttribute('aria-label','Small green leaf on the owl’s wing');
await page.locator('.leaf').focus();await page.keyboard.press('Space');await expect(page.locator('#scene')).toHaveClass(/found/);
await page.locator('#reset').click();await expect(page.locator('#scene')).not.toHaveClass(/hinting|found|greet|rustle/);await expect(page.locator('body')).toHaveClass(/paused/);
for(const width of [320,375,768,1024,1920]){
 await page.setViewportSize({width,height:900});await page.locator('#scene').scrollIntoViewIfNeeded();
 const hit=await page.locator('#scene').evaluate(e=>{const b=e.getBoundingClientRect();return document.elementFromPoint(b.left+b.width*.284,b.top+b.height*.545)?.classList.contains('leaf')});expect(hit).toBe(true);
 const boxes=await page.locator('.play-controls button').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}}));
 for(let i=0;i<boxes.length;i++){expect(boxes[i].h).toBeGreaterThanOrEqual(44);for(let j=i+1;j<boxes.length;j++){const a=boxes[i],b=boxes[j];expect(a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y).toBe(false);}}
}
await page.setViewportSize({width:375,height:812});await page.locator('[data-art-toggle]').click();await expect(page.locator('#adventure-art')).toHaveAttribute('alt',/Original coloring-book/);await page.locator('#hint').click();await expect(page.locator('#feedback')).not.toContainText('â');await page.locator('.leaf').click();await expect(page.locator('#scene')).toHaveClass(/found/);
});

test('Reduced motion preference changes keep controls honest',async({page})=>{
await page.emulateMedia({reducedMotion:'reduce'});await page.goto('http://localhost:4173/');await expect(page.locator('#pause')).toBeDisabled();await expect(page.locator('#pause')).toHaveText('Movement off');
await page.locator('#greet').click();await expect(page.locator('.greeting')).toHaveCSS('opacity','1');
await page.emulateMedia({reducedMotion:'no-preference'});await expect(page.locator('#pause')).toBeEnabled();await expect(page.locator('#pause')).toHaveText('Play movement');await expect(page.locator('body')).toHaveClass(/paused/);
await page.locator('#pause').click();await expect(page.locator('body')).not.toHaveClass(/paused/);await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('#pause')).toBeDisabled();await expect(page.locator('body')).toHaveClass(/paused/);
});

test('Accessibility in coloring, larger text, and completed activity states',async({page})=>{
const AxeBuilder=require('@axe-core/playwright').default;await page.setViewportSize({width:320,height:740});await page.goto('http://localhost:4173/');await page.locator('[data-art-toggle]').click();await page.locator('[data-text-size]').click();await page.locator('#hint').click();await page.locator('.leaf').click();
const result=await new AxeBuilder({page}).analyze();fs.writeFileSync('test-results/accessibility-interactive.json',JSON.stringify(result.violations,null,2));expect(result.violations).toEqual([]);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('Artwork and complete source content preserved, local paths and encoding valid',async()=>{
const path=require('path');const base=path.resolve('dist');
const baseline=JSON.parse(fs.readFileSync('tests/source-baseline.json','utf8'));const crypto=require('crypto');for(const [name,hash] of Object.entries(baseline.artworkSha256))expect(crypto.createHash('sha256').update(fs.readFileSync(path.join(base,'assets',name))).digest('hex')).toBe(hash);
const html=fs.readFileSync('dist/index.html','utf8');expect(baseline.storyParagraphs).toHaveLength(2);for(const paragraph of baseline.storyParagraphs)expect(html).toContain('<p>'+paragraph+'</p>');
for(const relative of ['index.html','explore-usa/owl/index.html']){
 const absolute=path.join(base,relative),text=fs.readFileSync(absolute,'utf8');
 expect(text).not.toMatch(/(?:\u00e2\u20ac|\u00c3|\ufffd)/);
 for(const match of text.matchAll(/(?:src|href|data-color|data-original)="([^"#]+)"/g)){const target=path.resolve(path.dirname(absolute),match[1]);expect(target.startsWith(base+path.sep)).toBe(true);expect(fs.existsSync(target)).toBe(true);}
}
for(const asset of ['site.js','style.css'])expect(fs.readFileSync(path.join(base,'assets',asset),'utf8')).not.toMatch(/(?:\u00e2\u20ac|\u00c3|\ufffd)/);
expect(JSON.parse(fs.readFileSync('vercel.json','utf8')).outputDirectory).toBe('dist');
expect(fs.readFileSync('dist/explore-usa/owl/index.html','utf8').replaceAll('../../assets/','assets/')).toBe(html);
});

test('Original owl and leaves visibly move; pause freezes actual artwork',async({page})=>{
await page.setViewportSize({width:1024,height:1100});await page.goto('http://localhost:4173/');await expect(page.locator('#scene')).toHaveClass(/layers-ready/);
await page.locator('#scene').scrollIntoViewIfNeeded();await page.mouse.move(1,1);
await page.locator('#scene').evaluate(e=>e.getAnimations({subtree:true}).forEach(a=>{a.pause();a.currentTime=0;}));
const box=await page.locator('#scene').boundingBox();const clip={x:box.x+box.width*.32,y:box.y+box.height*.36,width:box.width*.24,height:box.height*.14};
const before=await page.screenshot({clip});
await page.locator('#greet').click();await page.locator('#scene').evaluate(e=>e.getAnimations({subtree:true}).filter(a=>a.animationName==='owl-hello').forEach(a=>{a.pause();a.currentTime=400;}));
const matrix=await page.locator('svg .owl-motion').evaluate(e=>getComputedStyle(e).transform);expect(matrix).not.toBe('none');expect(matrix).not.toBe('matrix(1, 0, 0, 1, 0, 0)');
const after=await page.screenshot({clip});expect(before.equals(after)).toBe(false);await expect(page.locator('#adventure-art')).toHaveCSS('transform','none');
// The leaf target must share the exact same motion matrix as the original owl pixels.
expect(await page.locator('.owl-touch-layer').evaluate(e=>getComputedStyle(e).transform)).toBe(matrix);
await page.locator('#reset').click();await page.locator('#scene').evaluate(e=>e.getAnimations({subtree:true}).forEach(a=>a.play()));
await page.locator('.canopy-lower').click();await expect(page.locator('.leaf-upper')).toHaveCSS('animation-name','leaf-rustle');
await page.locator('#pause').click();const first=await page.locator('.leaf-upper').evaluate(e=>getComputedStyle(e).transform);await page.waitForTimeout(250);expect(await page.locator('.leaf-upper').evaluate(e=>getComputedStyle(e).transform)).toBe(first);await expect(page.locator('.leaf-lower')).toHaveCSS('animation-play-state','paused');
await page.locator('#reset').click();await expect(page.locator('body')).toHaveClass(/paused/);await page.locator('#pause').click();await expect(page.locator('.leaf-upper')).toHaveCSS('animation-play-state','running');
});

test('Leaf coloring changes original leaf pixels, reset and coloring toggle remain safe',async({page})=>{
await page.setViewportSize({width:375,height:812});await page.goto('http://localhost:4173/');await expect(page.locator('#scene')).toHaveClass(/layers-ready/);await page.locator('#pause').click();
for(const name of ['Golden leaves','Coral leaves','Blue leaves','Green leaves']){
await page.getByRole('button',{name,exact:true}).click();await expect(page.getByRole('button',{name,exact:true})).toHaveAttribute('aria-pressed','true');expect(await page.locator('.color-choice[aria-pressed="true"]').count()).toBe(1);await expect(page.locator('#adventure-art')).toHaveJSProperty('naturalWidth',1103);await expect(page.locator('#scene')).toBeVisible();
expect(await page.locator('.leaf-paint').first().evaluate(e=>getComputedStyle(e).filter)).toBe(name==='Green leaves'?'none':name==='Golden leaves'?'hue-rotate(-50deg) saturate(1.1)':name==='Coral leaves'?'hue-rotate(-108deg) saturate(0.9)':'hue-rotate(105deg)');
}
await page.getByRole('button',{name:'Golden leaves',exact:true}).click();await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:'screenshots/owl-golden-leaves-mobile.png',fullPage:true});
await page.locator('[data-art-toggle]').click();await expect(page.locator('.animated-scene')).toBeHidden();for(const b of await page.locator('.color-choice').all())await expect(b).toBeDisabled();await expect(page.locator('#color-note')).toBeVisible();await page.locator('#greet').click();await expect(page.locator('.owl-touch-layer')).toHaveCSS('transform','none');
await page.locator('[data-art-toggle]').click();await expect(page.getByRole('button',{name:'Golden leaves',exact:true})).toBeEnabled();await expect(page.locator('.animated-scene')).toBeVisible();await page.locator('#reset').click();await expect(page.getByRole('button',{name:'Green leaves',exact:true})).toHaveAttribute('aria-pressed','true');await expect(page.locator('.leaf-paint').first()).toHaveCSS('filter','none');await expect(page.locator('body')).toHaveClass(/paused/);
});

test('Reduced motion disables original artwork movement and still permits leaf coloring',async({page})=>{
await page.emulateMedia({reducedMotion:'reduce'});await page.goto('http://localhost:4173/');await expect(page.locator('#scene')).toHaveClass(/layers-ready/);await page.locator('#greet').click();
for(const selector of ['svg .owl-motion','.leaf-upper','.leaf-lower']){await expect(page.locator(selector)).toHaveCSS('animation-name','none');await expect(page.locator(selector)).toHaveCSS('transform','none');}
await page.getByRole('button',{name:'Blue leaves',exact:true}).click();await expect(page.locator('#scene')).toHaveAttribute('data-leaf-color','blue');await page.locator('.leaf').click();await expect(page.locator('#feedback')).toContainText('You found');await expect(page.locator('.confetti i').first()).toHaveCSS('display','none');
});

test('Failed prepared-art request preserves the original scene and honest controls',async({page})=>{
await page.route('**/woodland-clean-plate.webp',route=>route.abort());await page.goto('http://localhost:4173/');await expect(page.locator('#color-note')).toContainText('could not load');await expect(page.locator('#adventure-art')).toHaveJSProperty('naturalWidth',1103);await expect(page.locator('.animated-scene')).toHaveCSS('opacity','0');for(const b of await page.locator('.color-choice').all())await expect(b).toBeDisabled();await page.locator('.leaf').click();await expect(page.locator('#feedback')).toContainText('You found');
});
