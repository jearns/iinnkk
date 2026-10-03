/* Original colour interpretations grounded in the catalogue's names and cultural forms. */
(function(){
 const rules=[
  [/莫高|敦煌|Dunhuang/i,['壁画的流光','飞天的轻盈','岩壁上的层层丹青']],
  [/长城|Great Wall/i,['城垣与山脊的起伏','砖石相接的节律','山关远望的雄浑']],
  [/故宫|紫禁|宫殿|Palace|Versailles/i,['宫城的庄重层次','庭院深处的秩序','殿宇光影的开合']],
  [/苏州|园林|Gardens|Garden/i,['借景与留白的分寸','曲径通幽的含蓄','疏影漏窗的虚实']],
  [/天坛|祈年|Temple of Heaven/i,['礼仪建筑的向天之意','坛宇几何的安静秩序','天地相望的开阔']],
  [/龙门|云冈|石窟|Grotto|Cave Temples/i,['石刻明暗的深浅','凿痕与岁月的相遇','岩壁造像的沉静']],
  [/泰山|石刻|岩画|Rock Art|Petroglyph/i,['山石与刻痕的力量','岩面留字的质朴','手迹穿过岁月的回响']],
  [/吴哥|Angkor/i,['塔影与回廊的层叠','建筑融入山林的幽深','石纹与树影的交织']],
  [/泰姬|Taj Mahal/i,['对称与水影的宁静','庭院映照的清澈','建筑轮廓的柔和']],
  [/阿尔罕|Alhambra|伊斯法罕|Isfahan/i,['几何纹饰的回旋','庭院与花纹的层次','重复图案中的秩序']],
  [/金字塔|Pyramid|吉萨|Giza/i,['几何轮廓的凝练','巨大体量的静默','地平线上清晰的棱线']],
  [/威尼斯|Venice|运河|Canal/i,['水城倒影的流动','水路与街巷的交汇','桥影牵起的往来']],
  [/马丘|Machu|梯田|Rice Terraces/i,['地形与人居的相依','高低错落的构筑','山地空间的层次']],
  [/雅典|卫城|Acropolis|古罗马|Roman|斗兽|Colosseum/i,['柱廊的比例与节律','石构空间的开张','遗址轮廓的清朗']],
  [/佛罗伦萨|Florence|文艺复兴/i,['城市与艺术的相映','线条和比例的均衡','人文目光的温度']],
  [/大教堂|教堂|Cathedral|Church|Basilica|Abbey/i,['拱顶向上的节律','光穿过建筑的层次','肃静空间里的回声']],
  [/清真|回教|Mosque|Minaret/i,['穹顶与纹样的呼应','几何装饰的韵律','庭院光影的澄明']],
  [/寺|庙|Temple|Monastery|Sanctuary|圣地/i,['院落进深的静意','门庭相接的节奏','仪式空间的留白']],
  [/丝绸|商路|驿道|Silk Roads|Caravan|Trade/i,['文化交汇的往来','道路连接的远方','交换与相遇的温度']],
  [/港|码头|Port|Harbour|Harbor|Maritime/i,['岸线与航路的相望','海港往来的开放','陆海交汇的呼吸']],
  [/矿|钢铁|工厂|工业|Mine|Mining|Industrial|Factory/i,['劳动与构筑的力量','机械节律的坚实','工艺留痕的质感']],
  [/天文|观象|Observatory|Astronomical/i,['观看天穹的尺度','几何与星空的对话','测量世界的清晰']],
  [/大学|书院|University|Academy/i,['知识传承的开放','庭院里的求索','文字与思想的往来']],
  [/墓|陵|Tomb|Necropolis|Mausoleum/i,['记忆与时间的沉静','石构留存的纪念','历史层积的深意']],
  [/纪念|Memorial|Auschwitz|奥斯维辛/i,['记忆中的克制','纪念空间的肃穆','凝视历史的安静']],
  [/土楼|窑洞|Village|村|聚落|Settlement/i,['共同生活的温度','人居尺度的亲切','日常构筑的质朴']],
  [/木构|木制|Wooden|Timber/i,['木构相接的韵律','材料纹理的温润','匠作连接的细致']],
  [/桥|Bridge|Aqueduct|水渠/i,['结构跨越的张力','连接两岸的节奏','构筑与水流的相依']],
  [/古城|Historic|Old Town|Medina|街区|City|Cities/i,['街巷层积的记忆','城市肌理的疏密','人间烟火的温度']],
  [/考古|遗址|Archaeological|Ruins/i,['遗迹与时间的对话','碎片留存的记忆','历史层叠的纹理']],
  [/岛|海|Island|Coast|Sea|Reef/i,['潮汐与岸线的呼吸','海陆相望的辽阔','水光变换的节律']],
  [/冰|雪|Glacier|Ice/i,['冰雪边界的清澈','寒光中的寂静','冷暖相依的分寸']],
  [/森林|林|Forest|Rainforest/i,['林冠疏密的呼吸','枝叶交织的层次','生长与光影的节律']],
  [/沙漠|荒漠|Desert|沙丘/i,['风塑地表的起伏','沙地空阔的静意','光落大地的温度']],
  [/山|峡谷|Mountain|Valley|Canyon|Gorge/i,['地形起伏的力量','山谷开合的呼吸','高低层次的远意']],
  [/湖|河|瀑|Lake|River|Waterfall|湿地/i,['水面映照的清静','流水转折的节奏','水岸相依的柔和']]
 ];
 const sentences=[
  (c,p,i,s)=>`${p}纸承接${c}，${i}墨与${s}相映。`,
  (c,p,i,s)=>`以${p}笺铺陈${c}，${i}墨与${s}添入深浅层次。`,
  (c,p,i,s)=>`${i}墨行于${p}纸，让${s}呼应${c}。`,
  (c,p,i,s)=>`${c}启发${p}纸与${i}墨的疏密对照，${s}留下一点温度。`,
  (c,p,i,s)=>`将${c}留在${p}笺上，${i}墨与${s}相接成章。`,
  (c,p,i,s)=>`${c}化入${p}纸与${i}墨，${s}如画中一笔亮色。`,
  (c,p,i,s)=>`让${p}纸承接${c}，以${i}笔迹和${s}留下自己的手迹。`,
  (c,p,i,s)=>`取${c}之意，${p}纸留空，${i}墨流动，${s}映出岁月的暖意。`
 ];
 const portraits=[
 (p,i,s)=>`${p}纸如洞窟里柔和的光，${i}墨沿壁画的衣带飞扬，${s}点出丹青历久的鲜妍。`,
 (p,i,s)=>`${p}笺铺开山关的远意，${i}墨写出砖石相接的力度，${s}似夕阳停在城垣。`,
 (p,i,s)=>`${p}纸留出庭院的深静，${i}墨取殿宇层叠的庄重，${s}让宫城的华彩落在手边。`,
 (p,i,s)=>`${p}笺如漏窗外的一方天光，${i}墨疏密有致，${s}像曲径尽头的一枝花。`,
 (p,i,s)=>`${p}纸敞开天地，${i}墨以清晰的笔势呼应坛宇几何，${s}带来礼乐的庄严。`,
 (p,i,s)=>`${p}纸映出岩壁的微光，${i}墨辨出造像与凿痕的深浅，${s}留下穿越岁月的暖色。`,
 (p,i,s)=>`${p}笺留住山石的朴素，${i}墨写出刻痕的锋棱，${s}让古老手迹与今日相遇。`,
 (p,i,s)=>`${p}纸如回廊间的光隙，${i}墨交织石纹与树影，${s}唤起密林中古城的生机。`,
 (p,i,s)=>`${p}笺取庭院水影的澄澈，${i}墨随建筑轮廓舒展，${s}如静水上一点霞光。`,
 (p,i,s)=>`${p}纸衬出庭院的明暗，${i}墨借几何纹饰回旋，${s}为繁密花纹留一处光亮。`,
 (p,i,s)=>`${p}笺铺开地平线，${i}墨勾出几何棱角，${s}如沙地上温热的日光。`,
 (p,i,s)=>`${p}纸映着水城天光，${i}墨随桥影与水巷流转，${s}像倒影里的一扇亮窗。`,
 (p,i,s)=>`${p}纸呈现山地的高低层次，${i}墨连接地形与人居，${s}如云隙中照进石墙的光。`,
 (p,i,s)=>`${p}笺展开柱廊的空阔，${i}墨讲究比例与节律，${s}给古老石构添一分人的亲近。`
 ];
 function hash(str){let h=2166136261;for(const ch of str)h=Math.imul(h^ch.codePointAt(0),16777619);return h>>>0}
 function describe(p,state,colour){const catalogue=window.HeritagePalettes102||[],original=catalogue.find(q=>q.id===(p.heritageId113||p.id))||catalogue.find(q=>q.referencePlace===p.referencePlace)||{},place=String(p.referencePlace||p.place||original.referencePlace||p.name||'文化遗产').replace(/[\r\n]+/g,' '),full=(window.HeritageSites102||[]).find(q=>'heritage102-'+q[0]===(p.heritageId113||p.id||original.id))?.[1]||p.place||original.place||place,seed=hash((p.heritageId113||p.id||original.id||full)+'|'+state.values.papercolor+'|'+state.brush.color+'|'+state.values.headColor+'|'+state.values.tailColor),match=rules.find(([pattern])=>pattern.test(full)),kind=p.kind||original.kind||'',fallback=/Natural|Mixed/.test(kind)?['自然尺度的开阔','大地纹理的层次','生命与环境的相依']:['文化传承的温度','空间与时间的交织','人文匠心的分寸'],cues=match?match[1]:fallback,cue=cues[Math.floor(seed/8)%cues.length],v=state.values,paper=colour(v.papercolor),ink=colour(state.brush.color),seal=v.headColor===v.tailColor?colour(v.headColor)+'印色':colour(v.headColor)+'引首、'+colour(v.tailColor)+'落款';return (full+'：'+(portraits[rules.indexOf(match)]?portraits[rules.indexOf(match)](paper,ink,seal):sentences[seed%sentences.length](cue,paper,ink,seal))).replace(/[\r\n]+/g,' ')}
 window.HeritageStories113={describe,rules:rules.length,sentences:sentences.length};
})();
