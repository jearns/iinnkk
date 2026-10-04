(function init124(){
 if(!window.Revision120?.ready){setTimeout(init124,50);return}
 const A=AnnotationApp,$=id=>document.getElementById(id);
 for(const id of ['paperPattern','quickPattern'])if(![...$(id).options].some(o=>o.value==='clouds124'))$(id).add(new Option('祥云','clouds124'));
 let applying=false;
 async function couplet(){if(applying||Math.abs(+$('ratio').value-.544444)>.00001)return;applying=true;try{
  await A.configure47({values:{ratio:'0.544444',stationery:'vermillion',paperPreset111:'couplet',papercolor:'#c52d25',paperPattern:'clouds124',followDirection:'vertical',rows:'7',columns:'2',letterLayout:'custom',paperExtent:'fixed',sceneChoice:'none',photoMode:'none',guideMode:'off',showLines:'yes',ruling:'mi'},mountKey:'bare',focus:'start'});
  A.persist();if(!A.isOverview55())$('fitView').click();
 }finally{applying=false}}
 $('ratio').addEventListener('change',()=>couplet().catch(e=>A.toast(e.message)));
 window.Revision124={ready:true,couplet};
})();
