// Shared by the website and offline Android instrument. Seconds measure fade after key-up.
window.PianoRelease=class {
 constructor(){this.tails=new Set()}
 finish(v){if(v.done)return;v.done=true;clearTimeout(v.cleanup);try{v.g.gain.cancelScheduledValues(v.context.currentTime);v.g.gain.setValueAtTime(0,v.context.currentTime)}catch{}v.oscs.forEach(o=>{try{o.stop()}catch{}});try{v.g.disconnect()}catch{}this.tails.delete(v)}
 release(v,seconds){if(v.done)return;v.context=v.g.context;const t=v.context.currentTime,d=Math.max(.035,Math.min(10,seconds));try{if(v.g.gain.cancelAndHoldAtTime)v.g.gain.cancelAndHoldAtTime(t);else{const value=v.g.gain.value;v.g.gain.cancelScheduledValues(t);v.g.gain.setValueAtTime(Math.max(.0001,value),t)}v.g.gain.exponentialRampToValueAtTime(.0001,t+d);v.oscs.forEach(o=>o.stop(t+d+.025))}catch{}this.tails.add(v);v.cleanup=setTimeout(()=>this.finish(v),d*1000+70);while(this.tails.size>48)this.finish(this.tails.values().next().value)}
 clear(){[...this.tails].forEach(v=>this.finish(v))}
 retrigger(midi){[...this.tails].filter(v=>v.midi===midi).forEach(v=>this.finish(v))}
};
