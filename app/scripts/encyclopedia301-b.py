import json,re,pathlib
p=pathlib.Path(__file__).resolve().parents[1]
s=(p/'calligraphy-rank-data183.js').read_text(); works=json.JSONDecoder().raw_decode(s[s.index('{'):])[0]['works'][61:]
r={}
def add(i,label,url,ref,related=False):
 w=next(x for x in works if x['id']==i);r[i]={'title':w['title'],'label':label,'url':url,'provider':'快懂百科' if 'baike.com/' in url else '中国百科网' if 'zgbk.com/' in url else '百度百科','relatedTopic':related,'verifiedVia':{'method':'web_search','reference':ref,'checkedAt':'2026-10-30'}}
def kd(i,label,id,ref,related=False):add(i,label,'https://www.baike.com/wikiid/'+id,ref,related)
def bd(i,label,id,ref,related=False):
 import urllib.parse
 add(i,label,'https://bkso.baidu.com/item/'+urllib.parse.quote(label)+'/'+id,ref,related)
kd('zhongxing','大唐中兴颂','292857875054594688','turn61search0')
bd('shimenming','石门铭','9937775','turn63search0');bd('jitaishan','纪泰山铭','5248009','turn63search1');bd('shengjiao','集王圣教序','61489707','turn63search2')
add('xiping','熹平石经','https://www.zgbk.com/ecph/words?ID=406856&SiteID=1&SubID=205242&Type=bkzyb','turn63search4')
kd('zhengshi','三体石经（正始石经）','8127465928708748561','turn67search19');bd('kaicheng','开成石经','0','turn67search0');bd('dizhu','砥柱铭','10487439','turn67search22')
kd('shamenghai-bangshu','沙孟海论艺','6485689799717653478','turn124search17',True)
kd('wuchangshuo-shigu','吴昌硕','7251744333568180285','turn69search1',True)
kd('wuhou','蜀丞相诸葛武侯祠堂碑','2775137578744231','turn69search0');bd('lizi','荔子碑','10846310','turn69search26')
kd('baozhi','宝志禅师','8498096015577952946','turn74search24',True);kd('suxian','三绝碑（苏仙岭）','8415061275056657290','turn74search0');kd('zuiweng','醉翁亭记碑','7426107752939312611','turn74search1')
bd('lisheng','李晟碑','1123785','turn74search17');bd('chenghuang','城隍庙碑','14442104','turn78search29');bd('wanan','洛阳桥','3550436','turn113search9',True)
kd('shouchan','三绝碑（上尊号与受禅碑）','7960363879797370192','turn78search10')
bd('auction-pingan','平安帖','25252','turn78search24',True);kd('guoyouzhi','赵孟頫','7166510562602582068','turn82search0',True);bd('rao-hanliu','饶 介','7172649','turn113search4',True);bd('jushi','局事帖','5761624','turn82search8')
kd('zhao-xinjing','般若波罗蜜多心经（赵孟頫）','4448353435201950778','turn82search1');kd('zhao-huangting','临黄庭经','7417268205297434634','turn89search0');kd('gongfu','苏轼','2840507407652825840','turn69search32',True);bd('songke-zhuangyou','宋克','4221501','turn113search11',True)
add('dong-longshen','董其昌','https://www.zgbk.com/ecph/words?Name=%E8%91%A3%E5%85%B6%E6%98%8C&SiteID=1&SourceID=110077&Type=bkzyb&subSourceType=000003000013000004','turn111search15',True)
bd('oracle','甲骨文','16914','turn100search0',True);kd('juyan','居延汉简','1062948867994668044','turn93search1');kd('dunhuang','敦煌遗书','2991392701994393781','turn93search0')
add('mingqing','明清档案','https://www.zgbk.com/ecph/words?ID=728210&SiteID=1&SubID=242104','turn93search25')
kd('milan247','兰亭叙','547074602459641639','turn140search24',True);kd('yingguang247','英光堂帖','3146326561090188971','turn96search1');bd('caishi247','蔡襄','491720','turn140search2',True);kd('anguoshigu247','石鼓','7228428268792348727','turn143search0',True);kd('kushu247','褚遂良','7232188329596338237','turn140search0',True);kd('luoshui247','兰亭叙','547074602459641639','turn140search24',True)
bd('zhaocheng275','赵城金藏','8959606','turn98search20')
add('yongle275','《永乐大典》','https://www.zgbk.com/ecph/words?Name=%E3%80%8A%E6%B0%B8%E4%B9%90%E5%A4%A7%E5%85%B8%E3%80%8B&SiteID=1&SourceID=105132&Type=bkzyb&subSourceType=000003000012000001','turn124search22')
kd('wenjinge275','四库全书','7176095215131508791','turn98search2',True)
for w in works:
 if w['id'].startswith('oracle-'):bd(w['id'],'甲骨文','16914','turn100search0',True)
bd('maogong','毛公鼎','1161082','turn105search9');bd('sanshi','散氏盘','1162572','turn105search21');kd('bronze-dayu299','西周大盂鼎','5662362161878402519','turn105search7');kd('bronze-dake299','西周大克鼎','4642129257017115206','turn105search2');bd('bronze-guoji299','虢季子白盘铭文','2189625','turn139search1');bd('hezun','何尊','1163495','turn110search4');kd('bronze-qiang299','西周墙盘（史墙盘）','1317121069323420857','turn110search0');kd('bronze-lai299','西周逨盘','2888467483454473949','turn111search24');kd('bronze-li299','西周利簋','6757961208690498463','turn110search1');kd('bronze-zongzhou299','青铜宗周钟','4646305985044596611','turn111search0')
for i in ['oracle']+[w['id'] for w in works if w['id'].startswith('oracle-')]:
 r[i].update(label='甲骨文',url='https://www.zgbk.com/ecph/words?ID=524682&Preview=false&SiteID=1&Type=bkzyb',provider='中国百科网',verifiedVia={'method':'web_search','reference':'turn143search1','checkedAt':'2026-10-30'})
for i in ['shimenming','maogong','hezun','caishi247']:
 r[i]['url']=r[i]['url'].replace('https://bkso.baidu.com/','https://wapbaike.baidu.com/')
assert len(r)==len(works)==61,(len(r),len(works))
(p/'features/library/encyclopedia-works-b.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n')
print('records',len(r),'exact',sum(not x['relatedTopic'] for x in r.values()),'related',sum(x['relatedTopic'] for x in r.values()))
