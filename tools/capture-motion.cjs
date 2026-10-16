const {chromium}=require('@playwright/test');
(async()=>{
const browser=await chromium.launch({channel:'chrome'});
for(const [width,height] of [[375,812],[1440,900]]){
 const page=await browser.newPage({viewport:{width,height}});await page.goto('http://localhost:4173/');await page.locator('#scene.layers-ready').waitFor();await page.locator('#greet').click();
 await page.locator('#scene').evaluate(scene=>scene.getAnimations({subtree:true}).forEach(animation=>{animation.pause();animation.currentTime=animation.animationName==='owl-hello'?400:animation.animationName==='hello'?500:0;}));
 await page.mouse.move(1,1);await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:`screenshots/owl-moving-${width}.png`,fullPage:true});
 await page.close();
}
await browser.close();
})().catch(error=>{console.error(error);process.exitCode=1});
