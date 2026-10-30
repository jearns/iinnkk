import json
from pathlib import Path
rows=[
('著录与馆藏编号','Catalogue and accession numbers','Références bibliographiques et numéros d’inventaire','Библиографические и инвентарные номера','أرقام الفهرسة والحفظ المتحفي','Referencias de catálogo y números de inventario'),
('我的书写排名','My writing rank','Mon classement d’écriture','Мой рейтинг письма','ترتيبي في الكتابة','Mi clasificación de escritura'),
('图片未能生成，请使用4K分页保存','Image generation failed. Try saving in 4K pages.','Échec de la création de l’image. Essayez l’enregistrement par pages 4K.','Не удалось создать изображение. Сохраните его страницами в 4K.','تعذر إنشاء الصورة. جرّب الحفظ على صفحات بدقة 4K.','No se pudo crear la imagen. Prueba a guardarla por páginas en 4K.'),
('保存高清 JPG 到相册','Save HD JPG to Photos','Enregistrer le JPG HD dans Photos','Сохранить JPG высокого качества в фотоальбом','حفظ JPG عالي الدقة في الصور','Guardar JPG HD en Fotos'),
('点击存入相册，在系统菜单中选择保存图片。也可打开原图后长按保存。','Tap Save to Photos, then choose Save Image in the system menu. You can also open the original and press and hold to save.','Touchez Enregistrer dans Photos, puis choisissez Enregistrer l’image dans le menu système. Vous pouvez aussi ouvrir l’original et appuyer longuement pour l’enregistrer.','Нажмите «Сохранить в фотоальбом» и выберите сохранение изображения в системном меню. Также можно открыть оригинал и сохранить его долгим нажатием.','اضغط على الحفظ في الصور، ثم اختر حفظ الصورة من قائمة النظام. يمكنك أيضًا فتح الصورة الأصلية والضغط عليها مطولًا لحفظها.','Toca Guardar en Fotos y elige Guardar imagen en el menú del sistema. También puedes abrir el original y mantenerlo pulsado para guardarlo.'),
('打开原图 · 长按保存到相册','Open original · Hold to save to Photos','Ouvrir l’original · Appui long pour enregistrer dans Photos','Открыть оригинал · Удерживайте для сохранения в фотоальбом','فتح الأصل · اضغط مطولًا للحفظ في الصور','Abrir original · Mantén pulsado para guardar en Fotos'),
('存入相册 / 系统分享','Save to Photos / Share','Enregistrer dans Photos / Partager','Сохранить в фотоальбом / Поделиться','الحفظ في الصور / المشاركة','Guardar en Fotos / Compartir'),
('已交给系统，请在系统菜单中完成保存。','Opened the system menu. Complete saving there.','Le menu système est ouvert. Terminez l’enregistrement dans ce menu.','Открыто системное меню. Завершите сохранение в нём.','تم فتح قائمة النظام. أكمل الحفظ منها.','Se ha abierto el menú del sistema. Completa allí el guardado.'),
('请打开原图，长按保存到相册。','Open the original, then press and hold to save to Photos.','Ouvrez l’original, puis appuyez longuement pour l’enregistrer dans Photos.','Откройте оригинал и удерживайте изображение для сохранения в фотоальбом.','افتح الصورة الأصلية واضغط عليها مطولًا لحفظها في الصور.','Abre el original y mantenlo pulsado para guardarlo en Fotos.'),
('保存 JPG','Save JPG','Enregistrer JPG','Сохранить JPG','حفظ JPG','Guardar JPG'),
('分页保存','Save pages','Enregistrer les pages','Сохранить страницами','حفظ الصفحات','Guardar páginas'),
('正在读取…','Loading…','Chargement…','Загрузка…','جار التحميل…','Cargando…'),
('此帖文化地位说明正在核对。','The cultural significance of this work is being verified.','La portée culturelle de cette œuvre est en cours de vérification.','Сведения о культурном значении этой работы проверяются.','جار التحقق من الأهمية الثقافية لهذا العمل.','Se está verificando la importancia cultural de esta obra.'),
('排名服务尚未配置','Ranking service is not configured yet','Le service de classement n’est pas encore configuré','Сервис рейтинга ещё не настроен','لم يتم إعداد خدمة الترتيب بعد','El servicio de clasificación aún no está configurado'),
('排名暂未读取，请稍后刷新','Rankings are unavailable. Refresh later.','Classement indisponible. Actualisez plus tard.','Рейтинг недоступен. Обновите позже.','الترتيب غير متاح حاليًا. حدّث لاحقًا.','La clasificación no está disponible. Actualiza más tarde.'),
('排名资料格式异常','Unexpected ranking data format','Format des données du classement inattendu','Неверный формат данных рейтинга','تنسيق بيانات الترتيب غير متوقع','Formato inesperado de los datos de clasificación'),
('正在读取书友排名…','Loading writers’ rankings…','Chargement du classement des membres…','Загрузка рейтинга участников…','جار تحميل ترتيب الكتّاب…','Cargando la clasificación de los participantes…'),
('手筆书友','手筆 writer','Membre de 手筆','Участник 手筆','كاتب في 手筆','Participante de 手筆'),
('小时','hr','h','ч','ساعة','h'),
('分','min','min','мин','دقيقة','min'),
('在线排名已更新','Online rankings updated','Classement en ligne actualisé','Онлайн-рейтинг обновлён','تم تحديث الترتيب عبر الإنترنت','Clasificación en línea actualizada'),
('还没有公开书写排名。','No public writing rankings yet.','Pas encore de classement public d’écriture.','Публичного рейтинга письма пока нет.','لا يوجد ترتيب علني للكتابة بعد.','Aún no hay una clasificación pública de escritura.'),
('书友书写排名','Writers’ rankings','Classement des membres','Рейтинг участников','ترتيب الكتّاب','Clasificación de participantes'),
('刷新排名','Refresh rankings','Actualiser le classement','Обновить рейтинг','تحديث الترتيب','Actualizar clasificación'),
('按累计书写时长排序；字数按七笔一字估算。本机未同步记录不计入在线排名。','Ranked by total writing time; character counts are estimated at seven strokes per character. Unsynced local records are not included in online rankings.','Classement par durée totale d’écriture ; le nombre de caractères est estimé à sept traits par caractère. Les données locales non synchronisées ne sont pas incluses dans le classement en ligne.','Сортировка по общему времени письма; число знаков оценивается из расчёта семи штрихов на знак. Несинхронизированные локальные записи не входят в онлайн-рейтинг.','الترتيب حسب إجمالي وقت الكتابة؛ يُقدَّر عدد المحارف بسبع ضربات لكل محرف. لا تُحتسب السجلات المحلية غير المتزامنة في الترتيب عبر الإنترنت.','Ordenado por tiempo total de escritura; se estima un carácter por cada siete trazos. Los registros locales sin sincronizar no se incluyen en la clasificación en línea.'),
]
langs=['en','fr','ru','ar','es']
for i,l in enumerate(langs,1):
 p=Path('locales218/'+l+'.json');d=json.loads(p.read_text());d.update({r[0]:r[i] for r in rows});p.write_text(json.dumps(d,ensure_ascii=False,separators=(',',':'))+'\n')
p=Path('release300/locale-source.json');old=json.loads(p.read_text()) if p.exists() else [];p.write_text(json.dumps(sorted(set(old+[r[0] for r in rows])),ensure_ascii=False,indent=2)+'\n')
print('Translated',len(rows),'UI strings into',len(langs),'languages')
