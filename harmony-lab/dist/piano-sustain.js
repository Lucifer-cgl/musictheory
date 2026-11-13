let sustainEnabled=false,sustainSeconds=1.5;const pianoRelease=new PianoRelease();
const sustainControls=document.createElement('div');sustainControls.className='sustain-controls';sustainControls.innerHTML='<button id="sustainToggle" aria-pressed="false">延音 · 关</button><label>松键后 <input id="sustainSeconds" aria-label="延音秒数" type="number" min="0.2" max="10" step="0.1" value="1.5"> 秒淡出</label><button id="sustainPanic">全部止音</button><button id="pianoHelp">弹唱提示</button>';
pocketLab.prepend(sustainControls);
const sustainBaseOn=noteOn;noteOn=async function(id,offset){const midi=(octave+1)*12+offset;pianoRelease.retrigger(midi);await sustainBaseOn(id,offset);const v=voices.get(id);if(v)v.midi=midi};
noteOff=function(id,force=false){held.delete(id);const v=voices.get(id);if(!v)return;voices.delete(id);const manual=/^(pointer-|chapter-|pocket-|Key|Digit|Semicolon)/.test(id);pianoRelease.release(v,!force&&manual&&sustainEnabled?sustainSeconds:.04);liveVisual()};
releaseAll=function(){[...held].forEach(id=>noteOff(id,true));pianoRelease.clear()};
$('#sustainToggle').onclick=()=>{sustainEnabled=!sustainEnabled;$('#sustainToggle').setAttribute('aria-pressed',sustainEnabled);$('#sustainToggle').textContent='延音 · '+(sustainEnabled?'开':'关');if(!sustainEnabled)pianoRelease.clear()};
$('#sustainSeconds').onchange=()=>{const n=Number($('#sustainSeconds').value);sustainSeconds=Number.isFinite(n)?Math.max(.2,Math.min(10,n)):1.5;$('#sustainSeconds').value=sustainSeconds};$('#sustainPanic').onclick=()=>{pocketStop();releaseAll()};
// Lifecycle handlers registered by earlier modules retain their original function reference.
window.addEventListener('blur',releaseAll);document.addEventListener('visibilitychange',()=>{if(document.hidden)releaseAll()});
const guideDialog=document.createElement('dialog');guideDialog.id='pianoGuideDialog';guideDialog.className='piano-guide-dialog';guideDialog.innerHTML='<div class="guide-heading"><h2>弹唱怎么分配双手</h2><button id="pianoGuideClose" aria-label="关闭弹唱提示">关闭 ×</button></div><div class="guide-body">'+PianoGuide.accompanimentHTML()+'</div>';document.body.append(guideDialog);
function openPianoGuide(){pocketStop();releaseAll();(pianoFullscreenOpen?fullPiano:document.body).append(guideDialog);guideDialog.showModal()}
$('#pianoHelp').onclick=openPianoGuide;$('#pianoGuideClose').onclick=()=>guideDialog.close();
const singingRules=document.createElement('details');singingRules.className='singing-rules';singingRules.innerHTML='<summary>弹唱伴奏怎么弹？双手分工、节奏与延音</summary>'+PianoGuide.accompanimentHTML();$('.hand-arrangement-note').after(singingRules);

// Do not let musical key shortcuts leak through an open guide.
document.addEventListener('keydown',e=>{if(guideDialog.open&&(keyCodes.includes(e.code)||lowKeyboardCodes.includes(e.code)||['KeyZ','KeyX'].includes(e.code)))e.stopImmediatePropagation()},true);
