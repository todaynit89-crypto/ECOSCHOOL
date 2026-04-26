import { JSDOM, VirtualConsole } from 'jsdom';

const virtualConsole = new VirtualConsole();
virtualConsole.on("error", () => { /* No-op */ });
virtualConsole.on("warn", () => { /* No-op */ });
virtualConsole.on("info", () => { /* No-op */ });
virtualConsole.on("dir", () => { /* No-op */ });
// Listen to all JS errors
virtualConsole.on("jsdomError", (e) => {
    console.error("JSDOM ERROR:", e.message, e.stack);
});

JSDOM.fromURL('https://ecoschool-ai.vercel.app/', { 
    runScripts: 'dangerously', 
    resources: 'usable',
    pretendToBeVisual: true, 
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
    virtualConsole 
})
.then(dom => {
    dom.window.onerror = function(msg, url, lineNo, columnNo, error) {
      console.error('JSDOM WINDOW ERROR:', msg, error);
    };
    
    setTimeout(() => {
        console.log('DOM BODY after 5s LENGTH:', dom.window.document.body.innerHTML.length);
        console.log('BODY:', dom.window.document.body.innerHTML.substring(0, 500));
        process.exit(0);
    }, 5000);
}).catch(e => {
    console.error("FETCH ERROR", e);
});
