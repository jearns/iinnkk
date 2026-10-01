# 第94版头图制作记录

使用内置 imagegen 技能生成两套独立构图。人物是历史人物的AI意象，不是声称经过史料认证的照片或肖像。人物、朝代与作品标注使用网页DOM，未把小字烘焙进图像。

- 大屏资产：`hero-wide94.webp`，以原有头图为风格参考。
- 手机资产：`hero-mobile94.webp`，四列两排人物，上方留出文字区。
- 生成后的PNG以WebP质量88编码，图像构图不作手工改画。两张首屏资源合计约1MB。

大屏最终提示词：

```
Use case: stylized-concept. Asset: ultra-wide website hero, 3:1 aspect ratio. Reimagine the reference as an international cinematic ensemble of EIGHT historical calligraphy pioneers, contemporary science and humanities, luminescent fine ink filaments and AI constellations, refined teal ivory antique gold. Leftmost 25% of entire image is pale ivory airy NEGATIVE SPACE for dark website headline; no people there. RIGHT 75% has exactly eight distinct bust portraits in ONE equally spaced horizontal row, heads near y=40%, shoulder bases y=90%. Left to right: Li Si wearing Qin minister cap; Wang Xizhi scholarly Jin robes; Yan Zhenqing mature Tang official red robe; Su Shi wearing Song scholar cap; Huang Tingjian tall thin Song scholar; Leonardo da Vinci long white beard Renaissance dark cap holding notebook; Teshima Yukei elderly twentieth-century Japanese man glasses black suit holding abstract ink composition; Ibn Muqla Abbasid Baghdad scholar turban holding reed pen and manuscript, respectfully historic. Historically inspired imagined portraits, not claims of archival likenesses. Faces must be distinct, all eight wholly visible, calm dignified confident forward gaze; not generic Asian faces for European/Arab. Leave clean thin vertical spaces beside each right shoulder for WEB labels. No letters, words, logos, no readable Quran text, no fake calligraphy. Full edge-to-edge composition. Modern premium movie poster, believable painterly photographic faces, no retro sepia, no neon cartoon. Use reference only for energy and luminous ink style.
```

手机最终提示词：

```
Use case: stylized-concept. Asset: MOBILE website hero, portrait 3:4 aspect ratio, separate purposeful composition of same international eight historical calligraphers. TOP 22% is dark deep teal atmospheric empty space for WHITE webpage headline. Below, exactly EIGHT busts arranged cleanly FOUR equal columns, TWO rows. First row centres x=12.5%,37.5%,62.5%,87.5%, faces y=39%: Li Si Qin cap; Wang Xizhi Jin scholar; Yan Zhenqing mature Tang official; Su Shi Song scholar cap. Second row same columns faces y=72%: Huang Tingjian tall thin Song scholar; Leonardo da Vinci white beard Renaissance cap notebook; Teshima Yukei elderly Japanese black suit glasses abstract ink panel; Ibn Muqla Abbasid Baghdad turban reed pen manuscript. Each head should sit in left half of its cell, keep a slim clean vertical margin immediately right of each face for webpage labels; all8visible no repeats. Cinematic photoreal painterly humanity meets AI, blue teal gold luminous ink ribbons, polished contemporary world-cultural ensemble. Historically inspired imagined portraits, not archival likeness claims. No words, labels, logos, no readable Quran text. Portrait layout deliberate; no cropping people out. Reference only for luminous ink style.
```
