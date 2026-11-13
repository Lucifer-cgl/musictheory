// Original words and melody. Every lyric character is assigned to one pitched note.
function writtenBar(chord,sequence,lyric='',style='broken'){
 const rhythms={1:[4],3:[1,1,2],4:[1,1,1,1],5:[.5,.5,1,1,1],6:[.5,.5,.5,.5,1,1],7:[.5,.5,1,.5,.5,.5,.5],8:[.5,.5,.5,.5,.5,.5,.5,.5]};
 const beats=rhythms[sequence.length];if(!beats)throw Error('Unsupported rhythm');const chars=[...lyric];if(lyric&&chars.length!==sequence.filter(d=>d!==0).length)throw Error('Lyric alignment: '+lyric);
 let ci=0;return {chord,style,lyric,melody:sequence.map((d,i)=>({degree:Math.abs(d),octave:d<0?-1:0,beats:beats[i],lyric:d&&lyric?chars[ci++]:''}))};
}
const composedSong={title:'把脚步还给自己',credit:'本站原创词曲与钢琴编配 · 女声弹唱设计',tempo:66,meter:'4/4',key:'C',description:'由 A 小调色彩出发，在 C 大调的开放和声中停下。没有胜利式高潮，只有逐渐恢复的行动与回应。',sections:[
{name:'前奏 · 留白',type:'instrumental',bars:[writtenBar('viadd9',[-6,3,2,1]),writtenBar('ii7',[2,4,3,2]),writtenBar('iii7',[3,5,3,2]),writtenBar('viadd9',[1,-7,-6])]},
{name:'主歌 · 停在原地',type:'vocal',bars:[
writtenBar('viadd9',[3,3,2,1,2,1,-6],'把钟声折进抽屉'),writtenBar('IVmaj7',[1,2,3,4,3,2,1],'让明天暂时缺席'),
writtenBar('ii7',[2,2,4,3,2,1,2],'空着的位置太轻'),writtenBar('iii7',[3,3,2,1,-7,2,3],'轻得我不敢呼吸'),
writtenBar('vi7',[3,3,5,3,2,1,-6],'把问候放回原地'),writtenBar('IVmaj7',[1,2,4,3,2,1,4],'怕一碰就有回音'),
writtenBar('ii7',[4,4,3,2,1,2,4],'原来沉默不是岸'),writtenBar('Vsus4',[2,3,2,1,-7,2,2],'只是我握紧的冰','mixed')]},
{name:'副歌 · 试着回应',type:'vocal',bars:[
writtenBar('Iadd9',[3,3,5,5,6,5,3],'先不问路通哪里','mixed'),writtenBar('V6',[2,3,5,7,6,5,2],'把脚步还给自己','mixed'),
writtenBar('vi7',[3,3,5,6,5,3,2,1],'没说完的话停一停'),writtenBar('IVmaj7',[4,4,6,5,4,3,1],'也算认真地回应'),
writtenBar('ii7',[2,3,4,6,5,4,2],'不必把裂缝抚平'),writtenBar('iii7',[3,3,5,7,6,5,3],'不必每次都证明'),
writtenBar('IVmaj7',[4,5,6,5,3,2,1],'让风从指缝经过'),writtenBar('Iadd9',[3,2,1,2,1],'我还愿意听','block')]},
{name:'间奏 · 继续探路',type:'instrumental',bars:[writtenBar('vi7',[-6,1,3,5,3,1]),writtenBar('IVmaj7',[1,3,4,6,5,4]),writtenBar('ii7',[2,4,6,5,4,2]),writtenBar('Vsus4',[2,3,5,4,2,2],'','mixed')]},
{name:'再唱 · 不必成为别人',type:'vocal',bars:[
writtenBar('Iadd9',[3,3,5,6,5,3,1],'旧日的空白还在','mixed'),writtenBar('iii7',[3,3,5,7,6,5,3],'不再替我做决定'),
writtenBar('vi7',[3,3,5,6,5,3,2,1],'把没寄出的那封信'),writtenBar('IVmaj7',[4,4,6,5,4,3,1],'留给不完美的你'),
writtenBar('ii7',[2,3,4,6,5,4,2],'今天只走这一程'),writtenBar('V6',[2,3,5,7,6,5,2],'不借谁的光作凭','mixed'),
writtenBar('iii7',[3,3,5,7,6,5,3],'允许声音会发颤'),writtenBar('vi7',[3,5,6,5,3,2,1],'也允许脚步会停'),
writtenBar('IVmaj7',[4,4,5,6,5,4,3,1],'原来远方不是奖赏','mixed'),writtenBar('ii7',[2,3,4,6,5,4,2],'是我敢再次动身'),
writtenBar('Vsus4',[2,3,4,5,4,3,2,2],'不用变成另一个人','mixed'),writtenBar('I69',[3,3,5,6,5,3,1],'我也能够走下去','block')]},
{name:'尾奏 · 仍有余地',type:'instrumental',bars:[writtenBar('IVmaj7',[6,5,4,3]),writtenBar('ii7',[4,3,2]),writtenBar('Iadd9',[3,2,1]),writtenBar('I69',[1],'','block')]}]};
if(typeof module!=='undefined')module.exports=composedSong;
