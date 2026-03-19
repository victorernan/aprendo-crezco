import { sh } from './math.js';

// ── POOLS ─────────────────────────────────────────────────────
const VOW_POOL = [
  {w:'árbol',a:'a'},{w:'iglesia',a:'i'},{w:'oso',a:'o'},{w:'uva',a:'u'},
  {w:'elefante',a:'e'},{w:'isla',a:'i'},{w:'ángel',a:'a'},{w:'oreja',a:'o'},
  {w:'uniforme',a:'u'},{w:'escuela',a:'e'},{w:'avión',a:'a'},{w:'oveja',a:'o'},
  {w:'imán',a:'i'},{w:'útil',a:'u'},{w:'era',a:'e'},
];

const SYL_POOL = [
  {q:'"mamá"',a:'2'},{q:'"mariposa"',a:'4'},{q:'"sol"',a:'1'},
  {q:'"elefante"',a:'4'},{q:'"mesa"',a:'2'},{q:'"ventana"',a:'3'},
  {q:'"pan"',a:'1'},{q:'"paraguas"',a:'3'},{q:'"computadora"',a:'5'},
  {q:'"libro"',a:'2'},{q:'"pelota"',a:'3'},{q:'"casa"',a:'2'},
  {q:'"chocolate"',a:'4'},{q:'"tren"',a:'1'},{q:'"murciélago"',a:'5'},
];

const WORD_POOL = [
  {p:'🐱',w:'gato',o:['gato','pato','rato','dato']},
  {p:'🌸',w:'flor',o:['flor','piel','biol','flan']},
  {p:'🌙',w:'luna',o:['luna','lana','lona','cuna']},
  {p:'🦁',w:'león',o:['lión','bión','león','sión']},
  {p:'🏠',w:'casa',o:['masa','pasa','casa','tasa']},
  {p:'🐦',w:'pájaro',o:['pájaro','páramo','pájalo','péjaro']},
  {p:'🌳',w:'árbol',o:['árbol','álbol','árbor','árpol']},
  {p:'⭐',w:'estrella',o:['estrilla','estrella','estralla','estrela']},
  {p:'🍦',w:'helado',o:['helado','heledo','hilado','heladoz']},
  {p:'🐟',w:'pez',o:['vez','mes','pez','pes']},
];

const COMPL_POOL = [
  {s:'El gato duerme en la ___.',a:'cama',o:['cama','lago','nube','tren']},
  {s:'La niña come una ___ roja.',a:'manzana',o:['manzana','silla','nube','rueda']},
  {s:'El sol brilla en el ___.',a:'cielo',o:['cielo','suelo','bolso','marco']},
  {s:'Los peces viven en el ___.',a:'agua',o:['agua','suelo','cielo','fuego']},
  {s:'Por la noche brilla la ___.',a:'luna',o:['luna','tierra','flor','mesa']},
  {s:'Cuando llueve usamos ___.',a:'paraguas',o:['paraguas','sombrero','guantes','bufanda']},
  {s:'Las flores crecen en el ___.',a:'jardín',o:['jardín','techo','libro','cajón']},
  {s:'El avión vuela por el ___.',a:'cielo',o:['cielo','mar','pasto','túnel']},
  {s:'Los niños van a la ___ a aprender.',a:'escuela',o:['escuela','tienda','piscina','montaña']},
  {s:'El perro mueve la ___.',a:'cola',o:['cola','cabeza','pata','oreja']},
];

const COMT_POOL = [
  {s:'Ana tiene 3 gatos. Uno negro, uno blanco y uno naranja.',q:'¿Cuántos gatos tiene Ana?',a:'3',o:['2','3','4','5']},
  {s:'El pájaro vuela sobre las nubes azules.',q:'¿Dónde vuela el pájaro?',a:'sobre las nubes',o:['en el agua','sobre las nubes','bajo la tierra','en la casa']},
  {s:'María tiene 5 años. Su hermano tiene 7.',q:'¿Quién es mayor?',a:'el hermano',o:['María','el hermano','los dos','ninguno']},
  {s:'Carlos corrió más rápido que Pedro pero más lento que Lucía.',q:'¿Quién llegó primero?',a:'Lucía',o:['Carlos','Pedro','Lucía','todos igual']},
  {s:'El cielo está gris y cae agua.',q:'¿Qué tiempo hace?',a:'llueve',o:['hace sol','llueve','nieva','hay viento']},
  {s:'Hay 10 niños en clase. 4 son niñas.',q:'¿Cuántos niños hay?',a:'6',o:['4','5','6','7']},
  {s:'La vaca da leche. Con la leche hacemos queso.',q:'¿Qué animal da leche?',a:'la vaca',o:['la vaca','el perro','el gato','el cerdo']},
  {s:'El tren sale a las 9 y llega a las 11.',q:'¿Cuánto dura el viaje?',a:'2 horas',o:['1 hora','2 horas','3 horas','4 horas']},
];

const SYN_POOL = [
  {q:'Sinónimo de "feliz"',a:'contento',o:['contento','triste','cansado','aburrido']},
  {q:'Sinónimo de "bonito"',a:'hermoso',o:['hermoso','feo','raro','oscuro']},
  {q:'Sinónimo de "correr"',a:'trotar',o:['trotar','dormir','comer','leer']},
  {q:'Sinónimo de "grande"',a:'enorme',o:['enorme','pequeño','delgado','corto']},
  {q:'Sinónimo de "rápido"',a:'veloz',o:['veloz','lento','quieto','suave']},
  {q:'Sinónimo de "casa"',a:'hogar',o:['hogar','calle','plaza','lago']},
  {q:'Sinónimo de "miedo"',a:'susto',o:['susto','alegría','amor','paz']},
  {q:'Sinónimo de "hablar"',a:'decir',o:['decir','callar','dormir','cantar']},
];

const ANT_POOL = [
  {q:'Antónimo de "arriba"',a:'abajo',o:['abajo','lado','dentro','lejos']},
  {q:'Antónimo de "día"',a:'noche',o:['noche','tarde','mañana','siesta']},
  {q:'Antónimo de "caliente"',a:'frío',o:['frío','tibio','cálido','templado']},
  {q:'Antónimo de "grande"',a:'pequeño',o:['pequeño','gordo','alto','largo']},
  {q:'Antónimo de "rápido"',a:'lento',o:['lento','suave','tranquilo','quieto']},
  {q:'Antónimo de "abierto"',a:'cerrado',o:['cerrado','lleno','vacío','roto']},
  {q:'Antónimo de "entrar"',a:'salir',o:['salir','pasar','venir','subir']},
  {q:'Antónimo de "blanco"',a:'negro',o:['negro','gris','rojo','azul']},
];

const SYLID_POOL = [
  {q:'Sílaba inicial de "pelota"',a:'pe',o:['pe','po','pi','pa']},
  {q:'Sílaba inicial de "mariposa"',a:'ma',o:['ma','mi','mo','me']},
  {q:'Sílaba inicial de "camino"',a:'ca',o:['ca','co','cu','ce']},
  {q:'¿"bra" está en cuál palabra?',a:'cabra',o:['cabra','cama','carta','capa']},
  {q:'¿"llo" está en cuál palabra?',a:'pollo',o:['pollo','polo','poco','poro']},
  {q:'¿"tre" está en cuál palabra?',a:'tres',o:['tres','tez','tej','tem']},
  {q:'Sílaba inicial de "escuela"',a:'es',o:['es','cu','ela','el']},
  {q:'¿"llo" está en cuál palabra?',a:'silla',o:['silla','sala','solo','sola']},
  {q:'¿"gua" está en cuál palabra?',a:'agua',o:['agua','ala','ara','ama']},
  {q:'Sílaba inicial de "uniforme"',a:'u',o:['u','ni','for','me']},
];

const READQ_POOL = [
  {s:'El perro de Lucía se llama Toby.',q:'¿Cómo se llama el perro?',a:'Toby',o:['Toby','Rocky','Max','Bruno']},
  {s:'En verano hace calor. Los niños van a la playa.',q:'¿Adónde van los niños?',a:'a la playa',o:['a la playa','a la montaña','a la escuela','al mercado']},
  {s:'Pedro tiene 2 hermanas y 1 hermano.',q:'¿Cuántos hermanos en total?',a:'3',o:['2','3','4','5']},
  {s:'Los lunes y miércoles hay música.',q:'¿Cuántos días de música?',a:'2',o:['1','2','3','4']},
  {s:'La señora García vende frutas y verduras.',q:'¿Qué vende?',a:'frutas y verduras',o:['frutas y verduras','ropa','juguetes','libros']},
  {s:'Sofía tiene 8 años. Su prima tiene 6.',q:'¿Quién es mayor?',a:'Sofía',o:['Sofía','la prima','las dos','ninguna']},
  {s:'La tortuga camina lento. El conejo corre rápido.',q:'¿Quién es más rápido?',a:'el conejo',o:['el conejo','la tortuga','los dos igual','ninguno']},
  {s:'El gato duerme 14 horas al día.',q:'¿Cuántas horas duerme?',a:'14',o:['8','10','14','16']},
];

const VOC_POOL = [
  {q:'¿Qué es un "diccionario"?',a:'libro de palabras',o:['libro de palabras','tipo de fruta','instrumento musical','animal marino']},
  {q:'¿Qué significa "anochecer"?',a:'cuando llega la noche',o:['cuando llega la noche','cuando sale el sol','hora de comer','momento de jugar']},
  {q:'¿Qué es un "herbívoro"?',a:'animal que come plantas',o:['animal que come plantas','animal que vuela','planta carnívora','tipo de hierba']},
  {q:'¿Qué significa "escaso"?',a:'que hay poco',o:['que hay poco','que hay mucho','que es grande','que es rápido']},
  {q:'¿Qué significa "veloz"?',a:'muy rápido',o:['muy rápido','muy lento','muy grande','muy suave']},
  {q:'¿Qué es un "sinónimo"?',a:'palabra con igual significado',o:['palabra con igual significado','palabra opuesta','letra del alfabeto','número grande']},
  {q:'¿Qué significa "enorme"?',a:'muy grande',o:['muy grande','muy pequeño','muy lejos','muy cerca']},
];

// ── GENERATORS ────────────────────────────────────────────────
export function qVowels()    { return Array.from({length:20},(_,i)=>{ const it=VOW_POOL[i%VOW_POOL.length],wr=sh(['a','e','i','o','u'].filter(x=>x!==it.a)).slice(0,3); return {type:'text',q:`¿Con qué vocal empieza "${it.w}"?`,answer:it.a,opts:sh([it.a,...wr])}; }); }
export function qSyllables() { return Array.from({length:20},(_,i)=>{ const it=SYL_POOL[i%SYL_POOL.length],others=sh(['1','2','3','4','5','6'].filter(x=>x!==it.a)).slice(0,3); return {type:'text',q:`¿Cuántas sílabas tiene ${it.q}?`,answer:it.a,opts:sh([it.a,...others])}; }); }
export function qWords()     { return Array.from({length:20},(_,i)=>{ const it=WORD_POOL[i%WORD_POOL.length]; return {type:'text',q:`¿Qué palabra corresponde a ${it.p}?`,answer:it.w,opts:sh(it.o)}; }); }
export function qComplete()  { return Array.from({length:20},(_,i)=>{ const it=COMPL_POOL[i%COMPL_POOL.length]; return {type:'text',q:'Completa la frase:',hint:it.s,answer:it.a,opts:sh(it.o)}; }); }
export function qComp()      { return Array.from({length:20},(_,i)=>{ const it=COMT_POOL[i%COMT_POOL.length]; return {type:'text',q:it.q,hint:it.s,answer:it.a,opts:sh(it.o)}; }); }
export function qSynonyms()  { return Array.from({length:20},(_,i)=>{ const it=SYN_POOL[i%SYN_POOL.length]; return {type:'text',q:it.q,answer:it.a,opts:sh(it.o)}; }); }
export function qAntonyms()  { return Array.from({length:20},(_,i)=>{ const it=ANT_POOL[i%ANT_POOL.length]; return {type:'text',q:it.q,answer:it.a,opts:sh(it.o)}; }); }
export function qSylId()     { return Array.from({length:20},(_,i)=>{ const it=SYLID_POOL[i%SYLID_POOL.length]; return {type:'text',q:it.q,answer:it.a,opts:sh(it.o)}; }); }
export function qReadQ()     { return Array.from({length:20},(_,i)=>{ const it=READQ_POOL[i%READQ_POOL.length]; return {type:'text',q:it.q,hint:it.s,answer:it.a,opts:sh(it.o)}; }); }
export function qVocab()     { return Array.from({length:20},(_,i)=>{ const it=VOC_POOL[i%VOC_POOL.length]; return {type:'text',q:it.q,answer:it.a,opts:sh(it.o)}; }); }

export const READ_GENERATORS = [
  qVowels, qSyllables, qWords, qComplete, qComp,
  qSynonyms, qAntonyms, qSylId, qReadQ, qVocab
];
