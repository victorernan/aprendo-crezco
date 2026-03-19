// ── HELPERS ───────────────────────────────────────────────────
export function rnd(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
export function sh(a){ return [...a].sort(()=>Math.random()-.5); }
export function wrongSet(correct, count, min, max) {
  const s = new Set(); let att = 0;
  while (s.size < count && att < 300) { const w = rnd(min,max); if (w !== correct) s.add(w); att++; }
  let ex = min; while (s.size < count) { if (ex !== correct) s.add(ex); ex++; }
  return [...s];
}

// ── GENERATORS ────────────────────────────────────────────────

// 0 — Números hasta 100
export function qNumbers() {
  return Array.from({length:20}, () => {
    const n = rnd(10,100), type = rnd(0,1);
    if (type === 0) {
      return { type:'text', q:`¿Qué número es ${n}?`, answer:String(n),
        opts: sh([String(n), ...wrongSet(n,3,Math.max(10,n-10),Math.min(100,n+10)).map(String)]) };
    }
    const w = rnd(0,1), ans = w===0 ? n-1 : n+1;
    return { type:'text', q: w===0?`¿Qué número va antes de ${n}?`:`¿Qué número va después de ${n}?`,
      answer: String(ans), opts: sh([String(ans), ...wrongSet(ans,3,Math.max(1,ans-5),Math.min(100,ans+5)).map(String)]) };
  });
}

// 1 — Decenas y unidades
export function qPlaceValue() {
  return Array.from({length:20}, () => {
    const dec=rnd(1,9), uni=rnd(0,9), n=dec*10+uni, t=rnd(0,2);
    if (t===0) return { type:'text', q:`${n} = ___ decenas + ___ unidades`,
      answer:`${dec} dec + ${uni} uni`,
      opts: sh([`${dec} dec + ${uni} uni`,`${uni} dec + ${dec} uni`,`${dec+1} dec + ${uni} uni`,`${dec} dec + ${uni+1} uni`]) };
    if (t===1) return { type:'text', q:`¿Cuántas decenas tiene ${n}?`,
      answer:String(dec), opts:sh([String(dec),...wrongSet(dec,3,1,9).map(String)]) };
    return { type:'text', q:`¿Cuántas unidades tiene ${n}?`,
      answer:String(uni), opts:sh([String(uni),...wrongSet(uni,3,0,9).map(String)]) };
  });
}

// 2 — Comparar números
export function qCompare() {
  const sy = ['<','>','='];
  return Array.from({length:20}, () => {
    const a=rnd(1,99), b=rnd(0,1)===0?a:rnd(1,99), ans=a>b?'>':a<b?'<':'=';
    return { type:'text', q:`${a}   ___   ${b}`, hint:'Elige el símbolo: < = >', answer:ans, opts:sy };
  });
}

// 3 — Sumas sin llevar
export function qAddSimple() {
  return Array.from({length:20}, () => {
    let a,b; do { a=rnd(10,60); b=rnd(10,30); } while ((a%10)+(b%10)>=10||a+b>99);
    const ans=a+b;
    return { type:'calc', q:`${a} + ${b} =`, answer:ans,
      opts:sh([ans,...wrongSet(ans,3,Math.max(10,ans-9),Math.min(99,ans+9))]) };
  });
}

// 4 — Sumas con llevada
export function qAddCarry() {
  return Array.from({length:20}, () => {
    let a,b; do { a=rnd(5,49); b=rnd(5,49); } while ((a%10)+(b%10)<10||a+b>99);
    const ans=a+b;
    return { type:'calc', q:`${a} + ${b} =`, answer:ans,
      opts:sh([ans,...wrongSet(ans,3,Math.max(10,ans-9),Math.min(99,ans+9))]) };
  });
}

// 5 — Restas sin llevar
export function qSubSimple() {
  return Array.from({length:20}, () => {
    let a,b; do { a=rnd(20,80); b=rnd(10,40); } while (a<=b||(a%10)<(b%10));
    const ans=a-b;
    return { type:'calc', q:`${a} − ${b} =`, answer:ans,
      opts:sh([ans,...wrongSet(ans,3,Math.max(0,ans-9),ans+9)]) };
  });
}

// 6 — Restas con préstamo
export function qSubBorrow() {
  return Array.from({length:20}, () => {
    let a,b; do { a=rnd(20,80); b=rnd(5,40); } while (a<=b||(a%10)>=(b%10));
    const ans=a-b;
    return { type:'calc', q:`${a} − ${b} =`, answer:ans,
      opts:sh([ans,...wrongSet(ans,3,Math.max(0,ans-9),ans+9)]) };
  });
}

// 7 — Tablas del 2 y del 5
export function qMult25() {
  return Array.from({length:20}, (_,i) => {
    const base=i<10?2:5, b=rnd(1,10), ans=base*b;
    return { type:'calc', q:`${base} × ${b} =`, answer:ans,
      opts:sh([ans,...wrongSet(ans,3,Math.max(2,ans-8),ans+8)]) };
  });
}

// 8 — Tabla del 10
export function qMult10() {
  return Array.from({length:20}, (_,i) => {
    if (i%3===2) return { type:'text', q:`10 + 10 + 10 + 10 = 10 × ?`, answer:'4', opts:sh(['3','4','5','6']) };
    const b=rnd(1,10), ans=10*b;
    return { type:'calc', q:`10 × ${b} =`, answer:ans, opts:sh([ans,...wrongSet(ans,3,10,100)]) };
  });
}

// 9 — División básica
export function qDiv() {
  const P = [
    {q:'10 dulces entre 2 niños. ¿Cuántos a cada uno?',a:5,o:[3,4,5,6]},
    {q:'12 manzanas entre 3 canastas. ¿Cuántas en cada una?',a:4,o:[3,4,5,6]},
    {q:'20 fichas entre 4 grupos. ¿Cuántas por grupo?',a:5,o:[4,5,6,7]},
    {q:'15 galletas entre 3 amigos. ¿Cuántas a cada uno?',a:5,o:[4,5,6,3]},
    {q:'8 lápices entre 2 estuches. ¿Cuántos en cada uno?',a:4,o:[3,4,5,6]},
    {q:'18 pelotas entre 3 cajas. ¿Cuántas en cada caja?',a:6,o:[5,6,7,4]},
    {q:'16 cartas entre 4 jugadores. ¿Cuántas a cada uno?',a:4,o:[3,4,5,6]},
    {q:'14 flores entre 2 jarrones. ¿Cuántas en cada uno?',a:7,o:[6,7,8,5]},
  ];
  return Array.from({length:20}, (_,i) => {
    const p=P[i%P.length];
    return { type:'text', q:p.q, answer:String(p.a), opts:sh(p.o.map(String)) };
  });
}

// 10 — Longitud y peso
export function qMeasure() {
  const P = [
    {q:'¿Cuántos cm tiene 1 metro?',a:'100',o:['10','100','1000','50']},
    {q:'¿Qué es más largo: 1 m o 90 cm?',a:'1 m',o:['90 cm','1 m','son iguales','no se sabe']},
    {q:'¿Qué unidad usamos para medir una habitación?',a:'metros',o:['metros','kilómetros','gramos','litros']},
    {q:'¿Qué unidad usamos para pesar una manzana?',a:'gramos',o:['gramos','kilómetros','litros','metros']},
    {q:'2 kg + 500 g = ?',a:'2500 g',o:['2500 g','250 g','25000 g','2050 g']},
    {q:'Un lápiz mide 15 cm y otro 8 cm. ¿Cuánto miden juntos?',a:'23 cm',o:['21 cm','22 cm','23 cm','24 cm']},
    {q:'¿Qué instrumento usamos para medir longitud?',a:'regla',o:['regla','balanza','termómetro','reloj']},
    {q:'Una niña mide 120 cm. ¿Cuánto es en metros?',a:'1,20 m',o:['1,20 m','12 m','0,12 m','120 m']},
  ];
  return Array.from({length:20}, (_,i) => { const it=P[i%P.length]; return {type:'text',q:it.q,answer:it.a,opts:sh(it.o)}; });
}

// 11 — Tiempo y dinero
export function qTimeMoney() {
  const P = [
    {q:'¿Cuántos minutos tiene 1 hora?',a:'60',o:['30','60','100','24']},
    {q:'¿Cuántas horas tiene 1 día?',a:'24',o:['12','24','48','60']},
    {q:'¿Cuántos días tiene 1 semana?',a:'7',o:['5','6','7','8']},
    {q:'¿Cuántos meses tiene 1 año?',a:'12',o:['10','11','12','13']},
    {q:'Son las 3:00. ¿Qué hora será en 2 horas?',a:'5:00',o:['4:00','5:00','6:00','3:20']},
    {q:'Entro a las 7:00 y salgo a las 12:00. ¿Cuántas horas?',a:'5 horas',o:['4 horas','5 horas','6 horas','7 horas']},
    {q:'Tengo $500. Compro algo de $200. ¿Cuánto me queda?',a:'$300',o:['$200','$300','$400','$100']},
    {q:'Un jugo vale $150 y una galleta $100. ¿Cuánto pago?',a:'$250',o:['$150','$200','$250','$300']},
    {q:'¿Qué día viene después del viernes?',a:'sábado',o:['jueves','viernes','sábado','domingo']},
  ];
  return Array.from({length:20}, (_,i) => { const it=P[i%P.length]; return {type:'text',q:it.q,answer:it.a,opts:sh(it.o)}; });
}

// 12 — Problemas con sumas
export function qProblemAdd() {
  return Array.from({length:20}, () => {
    const a=rnd(5,40), b=rnd(5,40), ans=a+b;
    const T=[`Tenía ${a} y me dieron ${b} más. ¿Cuántos tengo?`,
             `Hay ${a} rojos y ${b} azules. ¿Cuántos en total?`,
             `El lunes leí ${a} páginas y el martes ${b}. ¿Cuántas en total?`,
             `Hay ${a} niñas y ${b} niños. ¿Cuántos estudiantes?`,
             `Un árbol tiene ${a} manzanas y otro ${b}. ¿Cuántas en total?`];
    return { type:'text', q:T[rnd(0,T.length-1)], answer:String(ans),
      opts:sh([String(ans),...wrongSet(ans,3,Math.max(5,ans-10),ans+10).map(String)]) };
  });
}

// 13 — Problemas con restas
export function qProblemSub() {
  return Array.from({length:20}, () => {
    const total=rnd(15,60), gasto=rnd(3,total-5), ans=total-gasto;
    const T=[`Tenía ${total} y gasté ${gasto}. ¿Cuántos quedan?`,
             `Había ${total} pájaros y volaron ${gasto}. ¿Cuántos quedan?`,
             `Tenía ${total} fichas y perdí ${gasto}. ¿Cuántas me quedan?`,
             `De ${total} estudiantes, ${gasto} faltaron. ¿Cuántos asistieron?`];
    return { type:'text', q:T[rnd(0,T.length-1)], answer:String(ans),
      opts:sh([String(ans),...wrongSet(ans,3,Math.max(1,ans-8),ans+8).map(String)]) };
  });
}

// 14 — Figuras geométricas
export function qGeometry() {
  const P = [
    {q:'¿Cuántos lados tiene un triángulo?',a:'3',o:['2','3','4','5']},
    {q:'¿Cuántos lados tiene un cuadrado?',a:'4',o:['3','4','5','6']},
    {q:'¿Cuántos lados tiene un círculo?',a:'0',o:['0','1','2','4']},
    {q:'¿Cuántos lados tiene un pentágono?',a:'5',o:['4','5','6','7']},
    {q:'¿Qué figura no tiene esquinas?',a:'círculo',o:['círculo','cuadrado','triángulo','rectángulo']},
    {q:'La puerta de tu casa tiene forma de…',a:'rectángulo',o:['círculo','triángulo','rectángulo','cuadrado']},
    {q:'La rueda de una bicicleta tiene forma de…',a:'círculo',o:['círculo','cuadrado','triángulo','rectángulo']},
    {q:'¿Cuántos vértices tiene un triángulo?',a:'3',o:['2','3','4','5']},
    {q:'Un cuadrado tiene 4 lados. ¿Cuántos lados tienen 2 cuadrados?',a:'8',o:['4','6','8','10']},
    {q:'¿Qué figura tiene 2 lados largos y 2 cortos?',a:'rectángulo',o:['círculo','cuadrado','triángulo','rectángulo']},
    {q:'¿Cuántas esquinas tiene un cuadrado?',a:'4',o:['3','4','5','6']},
    {q:'¿Qué figura tiene 3 lados y 3 vértices?',a:'triángulo',o:['cuadrado','triángulo','círculo','rectángulo']},
  ];
  return Array.from({length:20}, (_,i) => { const it=P[i%P.length]; return {type:'text',q:it.q,answer:it.a,opts:sh(it.o)}; });
}

// 15 — Secuencias y patrones
export function qPatterns() {
  return Array.from({length:20}, () => {
    const t = rnd(0,2);
    if (t===0) {
      const start=rnd(1,10), step=rnd(1,5), seq=[start,start+step,start+step*2,start+step*3], ans=start+step*4;
      return { type:'text', q:`¿Qué número sigue? ${seq.join(', ')}, ___`, answer:String(ans),
        opts:sh([String(ans),...wrongSet(ans,3,Math.max(1,ans-8),ans+8).map(String)]) };
    }
    if (t===1) {
      const base=[2,5,10][rnd(0,2)], start=rnd(1,5)*base;
      const seq=[start,start+base,start+base*2,start+base*3], ans=start+base*4;
      return { type:'text', q:`Cuenta de ${base} en ${base}: ${seq.join(', ')}, ___`, answer:String(ans),
        opts:sh([String(ans),...wrongSet(ans,3,Math.max(base,ans-base*2),ans+base*2).map(String)]) };
    }
    const R = [
      {q:'¿Qué número falta? 2, 4, ___, 8, 10',a:'6',o:['5','6','7','8']},
      {q:'¿Qué número falta? 5, 10, 15, ___, 25',a:'20',o:['18','19','20','21']},
      {q:'¿Qué número falta? 10, 20, ___, 40, 50',a:'30',o:['25','30','35','45']},
      {q:'¿Qué número falta? 1, 3, 5, ___, 9',a:'7',o:['6','7','8','10']},
      {q:'¿Qué número falta? 100, 90, 80, ___, 60',a:'70',o:['65','70','75','85']},
    ];
    const it=R[rnd(0,R.length-1)];
    return { type:'text', q:it.q, answer:it.a, opts:sh(it.o) };
  });
}

// ── LEVEL MAP ─────────────────────────────────────────────────
export const MATH_GENERATORS = [
  qNumbers, qPlaceValue, qCompare,
  qAddSimple, qAddCarry,
  qSubSimple, qSubBorrow,
  qMult25, qMult10, qDiv,
  qMeasure, qTimeMoney,
  qProblemAdd, qProblemSub,
  qGeometry, qPatterns
];
