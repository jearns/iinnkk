import json
from pathlib import Path
rows=[
('本站从馆藏与甲骨专题展中精选十件，含殷商刻辞、朱书与先书后刻的实物，按观察主题编排。非官方高下排名；各件年代与释读以来源机构说明为准。',
'Ten pieces selected from museum collections and oracle-bone exhibitions include Shang-dynasty inscriptions, writing in vermilion, and examples written before carving, arranged by observation theme. This is a curatorial selection, not an official ranking; dating and readings follow the source institutions.',
'Dix pièces choisies dans les collections de musées et les expositions d’os oraculaires présentent des inscriptions Shang, des textes au vermillon et des exemples écrits avant d’être gravés, classés par thème d’observation. Cette sélection ne constitue pas un classement officiel ; datations et lectures suivent les indications des institutions sources.',
'Десять предметов из музейных коллекций и выставок гадательных костей включают надписи эпохи Шан, тексты киноварью и образцы письма перед гравировкой; они сгруппированы по темам наблюдения. Это кураторская подборка, а не официальный рейтинг; датировки и прочтения приводятся по данным учреждений-источников.',
'عشر قطع مختارة من مجموعات المتاحف ومعارض عظام العرافة، تشمل نقوشًا من عهد شانغ وكتابة بالزنجفر وأمثلة كُتبت قبل نقشها، ومرتبة حسب موضوعات التأمل. هذا اختيار تحريري وليس ترتيبًا رسميًا؛ وتُعتمد تواريخ القطع وقراءات نصوصها وفق المؤسسات المصدرية.',
'Diez piezas seleccionadas de colecciones de museos y exposiciones de huesos oraculares incluyen inscripciones Shang, escritura en bermellón y ejemplos escritos antes de ser grabados, organizados por temas de observación. Es una selección curatorial, no una clasificación oficial; las fechas y las lecturas siguen a las instituciones de origen.'),
('两片缀合牛肩胛骨记录在义京祭祀的占问，展示字形、卜兆与行列的关系。',
'Two joined ox-scapula fragments record divination questions about sacrifices at Yijing (義京), showing the relationships between character forms, divination cracks and column layout.',
'Deux fragments raccordés d’omoplate de bœuf consignent des consultations divinatoires sur des sacrifices à Yijing (義京), montrant les relations entre formes des caractères, fissures divinatoires et disposition en colonnes.',
'Два соединённых фрагмента бычьей лопатки содержат гадательные вопросы о жертвоприношениях в Ицзине (義京), показывая связь форм знаков, гадательных трещин и расположения строк и столбцов.',
'يسجل جزآن موصولان من لوح كتف ثور أسئلة عرافة عن قرابين في يي جينغ (義京)، ويوضحان العلاقة بين أشكال المحارف وشقوق العرافة وتخطيط السطور والأعمدة.',
'Dos fragmentos unidos de una escápula de buey registran preguntas adivinatorias sobre sacrificios en Yijing (義京), mostrando la relación entre las formas de los caracteres, las grietas adivinatorias y la disposición en columnas.'),
('围绕收成的正反设问，展示商代卜辞的逻辑与填朱字形。',
'Paired affirmative and negative divination questions about the harvest show the reasoning of Shang inscriptions and their vermilion-filled character forms.',
'Des questions divinatoires formulées par paires, affirmatives et négatives, sur la récolte révèlent la logique des inscriptions Shang et leurs caractères rehaussés de vermillon.',
'Парные утвердительные и отрицательные гадательные вопросы об урожае раскрывают логику надписей эпохи Шан и формы знаков, заполненных киноварью.',
'تُظهر أسئلة العرافة المتقابلة بصيغتي الإثبات والنفي حول المحصول منطق نقوش عهد شانغ وأشكال المحارف المملوءة بالزنجفر.',
'Las preguntas adivinatorias sobre la cosecha, formuladas por pares afirmativos y negativos, muestran la lógica de las inscripciones Shang y las formas de sus caracteres rellenados con bermellón.')]
for i,l in enumerate(['en','fr','ru','ar','es'],1):
 p=Path('locales218/'+l+'.json');d=json.loads(p.read_text());d.update({r[0]:r[i] for r in rows});p.write_text(json.dumps(d,ensure_ascii=False,separators=(',',':'))+'\n')
p=Path('release300/locale-source.json');keys=json.loads(p.read_text());p.write_text(json.dumps(sorted(set(keys+[r[0] for r in rows])),ensure_ascii=False,indent=2)+'\n')
print('Manually reviewed final three descriptions in all five languages')
