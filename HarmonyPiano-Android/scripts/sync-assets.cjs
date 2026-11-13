// Standalone export: complete offline assets are already included.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const dir=path.resolve(__dirname,'../assets');
for(const name of ['index.html','piano.js','piano.css','themes.css','chord-data.js','piano-release.js','piano-guide.js','art/sound-garden.png','art/monet-pond.png','art/misty-light.png'])if(!fs.existsSync(path.join(dir,name)))throw Error('Missing asset: '+name);
const box={window:{}};vm.runInNewContext(fs.readFileSync(path.join(dir,'chord-data.js'),'utf8'),box);
if(box.window.PianoData.chords.length!==21)throw Error('Incomplete chord definitions');
console.log('Verified complete standalone offline assets and 21 chord types.');
