const initial = {
    'j':'y',
    'c':'ch',
    'z':'j',
    'J':'Y',
    'C':'Ch',
    'Z':'J',
}
const final = {
    'eo':'eu',
    'oe':'eu',
    'eoi':'eui'
}
const tone = {
    'a':['ā','á','a','à','á','a'],
    'e':['ē','é','e','è','é','e'],
    'i':['ī','í','i','ì','í','i'],
    'o':['ō','ó','o','ò','ó','o'],
    'u':['ū','ú','u','ù','ú','u'],
    'n':['n','ń','n','ǹ','ń','n'],
    'N':['n','Ń','n','Ǹ','Ń','n'],
    'm':['m','ḿ','m','m̀','ḿ','m'],
    'M':['m','Ḿ','m','M̀','Ḿ','m']
}
const reg = /([bpmfdtnlgkhwzcsj]?[wg]?)([yaeiou]*)([ptknm]?g?)([1-6]?)(.*)/i
const dreamsForm = document.forms[0];
var dreamInput = dreamsForm.elements["dream"];

// listen for the form to be submitted and add a new dream when it is
dreamsForm.onsubmit = function(event) {
  // stop our form submission from refreshing the page
  event.preventDefault();
  // get dream value and add it to the list
  if(dreamInput.value==='')return
  else{
    var res = document.getElementById('res');
    res.innerText = ''
    var res = yp2yl(dreamInput.value)
    render(res)
  }
  // reset form
  dreamInput.value = "";
  dreamInput.focus();
};

function yp2yl(input){
  var wList = input.split(/\s+/)
  var res = []
  wList.forEach((item)=>{
    var tmp = transformer(item)
    res.push(tmp)
  })
  return res.join(' ')
}
function transformer(w){
  var res = w.match(reg);
  var sm = res[1] //聲母
  var yf = res[2] //韻腹
  var yw = res[3] //韻尾
  /*
  處理特殊聲母
  */
  if (res[1]&&(res[1] ==='j'|| res[1] ==='c' || res[1] ==='z'||res[1] ==='J'|| res[1] ==='C' || res[1] ==='Z')) 
    sm = initial[res[1]]
  else sm = res[1]
  /*
  處理韻腹
  */
  if (res[2]!==''){
    var res2 = res[2].split('')
    if(res2[0]==='y'&& (sm ==='y'||sm==='Y')) sm = '' //處理y介音 避免重複
    if(res[2] ==='oe' || res[2] ==='eo'||res[2] ==='eoi') yf = final[res[2]]
    if (res[2]==='aa' && res[3]==='')yf = 'a'
  }
  /*
  處理声调
  */
  var t = parseInt(res[4])
  if((sm == 'ng' || sm == 'Ng' || sm == 'm' || sm == 'M')&& res[2]===''){
    var sml = sm.split('')
    sm = tone[sml[0]][t-1]+(sml.length>1?sml[1]:'')
    return sm+(t>=4?'h':'')+res[5]
  }
  else{
    var yfl = yf.split('')
    if (yfl[0] !== 'y')yfl[0]= tone[yfl[0]][t-1]
    else yfl[1]= tone[yfl[1]][t-1] //调子标在y介音后面第一个元音上
    yf = yfl.join('')
    return sm+yf+(t>=4?'h':'')+yw+res[5]
  }
}
function render(input){
  var res = document.getElementById('res');
  res.innerText = input
}