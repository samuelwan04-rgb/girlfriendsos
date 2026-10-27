/* GIRLFRIENDSOS data: the dish bank and Rinis' spots. Edit this file to add places. */
(function(root){

/* ---------- Questions ---------- */
const AREAS = [
  {id:'school', label:'School', note:'SIM'},
  {id:'west', label:'West', note:'tuition, Bukit Panjang'},
  {id:'home', label:'Home / near home'},
  {id:'sengkang', label:'Sengkang', note:'Compass One, Kopitiam Square'},
  {id:'east', label:'East'},
  {id:'central', label:'Central'},
  {id:'north', label:'North'}
];
const SIDES = [
  {id:'asian', label:'Asian', note:'rice, noodles, spice'},
  {id:'angmoh', label:'Ang moh', note:'western-ish stuff'},
  {id:'snack', label:'Snacky / sweet', note:'small bites, desserts'}
];
const CUISINES = {
  asian:[
    {id:'im', label:'Indian / Malay', note:'prata, biryani, nasi lemak'},
    {id:'cn', label:'Chinese / Taiwanese', note:'dumplings, TW chicken, noodles'},
    {id:'jk', label:'Japanese / Korean', note:'ramen, sushi, kimchi stuff'}
  ],
  angmoh:[
    {id:'cw', label:'Classic western', note:'chicken chop, burgers'},
    {id:'pa', label:'Pasta', note:'carbonara, aglio olio'},
    {id:'pz', label:'Pizza', note:'slices or a whole pie'},
    {id:'me', label:'Middle Eastern', note:'shawarma, kebabs, hummus'},
    {id:'st', label:'Steak / meats', note:'steak, ribs, roast chicken'}
  ]
};
const HUNGER = [
  {id:'meal', label:'Full meal', note:'starving, feed me'},
  {id:'between', label:'In between', note:'hungry but not crazy'},
  {id:'snack', label:'Snack', note:'just something small'},
  {id:'dunno', label:"Don't rly know", note:'you decide'}
];
const BUDGET = [
  {id:7, label:'Under $7', note:'hawker mode'},
  {id:10, label:'Under $10', note:'food court mode'},
  {id:15, label:'Under $15', note:'casual sit-down'},
  {id:20, label:'$20 or more', note:'treat yourself'}
];

/* ---------- Dish bank ----------
   D(id, name, cuisines, priceLow, priceHigh, fitMeal, fitBetween, fitSnack, {
     p: base craving weight 0-1, tr: travels well 0-1,
     f: flags ("late" supper, "morning", "treat"), x: short description, w: general where-to-get hint })
   cuisines: space-separated ids. "sw" = shows up under Snacky / sweet.
   Prices are SGD per person, cheapest hawker version → typical restaurant version. */
const DISHES = [];
function D(id,name,cu,lo,hi,m,b,s,o={}){DISHES.push({id,name,cu:cu.split(' '),lo,hi,fit:{meal:m,between:b,snack:s},p:o.p??.75,tr:o.tr??.7,f:o.f||'',x:o.x||'',w:o.w||''})}

// Indian / Malay
D('prata','Roti prata','im',2,6,.5,.9,.9,{p:.9,f:'late morning',tr:.5,x:'plain or egg, fish curry',w:'Any prata shop or mamak'});
D('murtabak','Murtabak','im',7,13,.9,.6,.2,{p:.65,f:'late',x:'stuffed chicken or mutton',w:'Mamak or a Kampong Glam murtabak shop'});
D('butterchk','Butter chicken + naan','im',8,20,1,.5,.1,{p:.9,x:'garlic naan or briyani rice',w:'North Indian restaurant or food-court Indian stall'});
D('biryani','Biryani','im',6,16,1,.4,.1,{p:.8,tr:.9,x:'chicken or mutton dum biryani',w:'Biryani stall at a hawker centre'});
D('nasilemak','Nasi lemak','im',4,10,.9,.7,.2,{p:.9,f:'late morning',tr:.9,x:'chicken wing, sambal, egg',w:'Hawker nasi lemak stall'});
D('meegoreng','Mee goreng / Maggi goreng','im',4,7,.8,.8,.3,{p:.8,f:'late',tr:.8,x:'spicy fried noodles, fried egg',w:'Mamak or prata shop'});
D('nasipadang','Nasi padang','im',5,11,1,.5,.1,{p:.7,tr:.8,x:'rice + rendang + sayur lodeh',w:'Malay nasi padang stall'});
D('satay','Satay','im sw',7,14,.4,.8,.9,{p:.75,f:'late',tr:.6,x:'10 sticks, peanut sauce, ketupat',w:'Satay stall at a hawker centre'});
D('thosai','Thosai / dosa','im',2,8,.5,.9,.7,{p:.6,f:'morning',tr:.4,x:'masala dosa with chutneys',w:'South Indian vegetarian place'});
D('ayampenyet','Ayam penyet','im',6,12,1,.5,.1,{p:.7,tr:.8,x:'smashed fried chicken, sambal',w:'Ayam penyet stall or Indonesian place'});
D('meesoto','Mee rebus / mee soto','im',4,6,.7,.8,.3,{p:.6,f:'morning',tr:.4,x:'thick gravy or light soto broth',w:'Malay hawker stall'});
D('tandoori','Tandoori chicken set','im',10,20,.9,.5,.2,{p:.6,x:'with naan and mint chutney',w:'North Indian restaurant'});
D('currypuff','Curry puff','im sw',2,3,0,.3,1,{p:.6,tr:.9,x:'potato or sardine',w:'Old Chang Kee or a kueh stall'});
D('kueh','Kueh','im sw',1.5,4,0,.2,1,{p:.5,tr:.9,x:'ondeh ondeh, kueh lapis',w:'Bengawan Solo or a kueh stall'});

// Chinese / Taiwanese
D('dumplings','Dumplings','cn',6,12,.5,1,.7,{p:.95,tr:.6,x:'pan-fried or boiled',w:'Dumpling stall, la mian shop or Din Tai Fung'});
D('dumplingnoodles','Noodles with dumplings','cn',5,9,.9,.8,.2,{p:.8,tr:.5,x:'noodles + a few dumplings',w:'Chinese noodle shop'});
D('xlb','Xiao long bao','cn',7,15,.4,.9,.8,{p:.9,tr:.3,x:'soupy pork dumplings',w:'Din Tai Fung or Paradise Dynasty'});
D('twchicken','Taiwanese fried chicken','cn sw',4,9,.3,.7,1,{p:.85,f:'late',tr:.8,x:'XXL cutlet, plum powder',w:'Shihlin, Monga or a TW snack stall'});
D('twchickenrice','Taiwanese chicken cutlet rice','cn',6,10,.9,.8,.1,{p:.8,tr:.9,x:'fried cutlet over rice',w:'Taiwanese stall or food court'});
D('sotong','Fried sotong / popcorn chicken','cn sw',3,9,.2,.6,1,{p:.8,f:'late',tr:.8,x:'salt & pepper crispy bits',w:'Shihlin or a TW snack kiosk'});
D('lurou','Braised pork rice','cn',5,10,.8,.8,.2,{p:.75,tr:.9,x:'lu rou fan with braised egg',w:'Taiwanese eatery or food court'});
D('beefnoodle','Taiwanese beef noodles','cn',10,18,1,.5,.1,{p:.75,tr:.3,x:'braised beef shank, chewy noodles',w:'Taiwanese noodle house'});
D('banhmi','Banh mi','cn cw',6,10,.6,.9,.5,{p:.75,tr:1,x:'Vietnamese baguette sandwich',w:'Banh mi stall'});
D('chickenrice','Chicken rice','cn',4,8,.9,.7,.2,{p:.75,tr:.9,x:'roasted or steamed, extra chilli',w:'Any hawker chicken rice stall'});
D('mala','Mala xiang guo','cn',10,22,1,.5,.1,{p:.85,f:'late',tr:.8,x:'pick-your-own dry mala',w:'Mala stall at a food court'});
D('tomyum','Tom yum noodles','cn',5,8,.9,.7,.1,{p:.8,tr:.4,x:'mee hoon kueh or ke kou mian',w:'Tom yum noodle stall'});
D('ytf','Yong tau foo','cn',5,9,.9,.8,.2,{p:.75,tr:.6,x:'pick your own, soup or dry',w:'Yong tau foo stall'});
D('fishsoup','Sliced fish soup','cn',5,8,.8,.7,.2,{p:.7,tr:.5,x:'light, comforting soup',w:'Fish soup or ban mian stall'});
D('ducknoodle','Duck noodles','cn',4,7,.9,.7,.1,{p:.65,tr:.6,x:'braised duck, dry or soup',w:'Duck rice / noodle stall'});
D('wantonmee','Wanton mee','cn',4,7,.9,.8,.2,{p:.7,tr:.7,x:'char siew, wanton, chilli',w:'Wanton mee stall'});
D('friedrice','Egg fried rice','cn',5,9,1,.7,.1,{p:.7,tr:.9,x:'wok hei, pork chop optional',w:'Zi char or fried rice stall'});
D('ckt','Char kway teow / Hokkien mee','cn',5,8,.9,.6,.2,{p:.7,f:'late',tr:.7,x:'wok hei fried noodles',w:'Hawker noodle stall'});
D('lamian','La mian / dan dan noodles','cn',7,13,.9,.7,.1,{p:.7,tr:.5,x:'spicy sesame or clear broth',w:'Hand-pulled noodle shop'});
D('dimsum','Dim sum','cn',8,30,.8,.8,.5,{p:.8,f:'morning',tr:.5,x:'har gow, siew mai, liu sha bao',w:'Dim sum place (Swee Choon for supper)'});
D('caipng','Cai png (economy rice)','cn',4,7,1,.7,.1,{p:.5,tr:.9,x:'rice + 2 veg + 1 meat',w:'Any cai png stall'});
D('bkt','Bak kut teh','cn',8,15,1,.4,.1,{p:.65,f:'late',tr:.4,x:'peppery pork rib soup + you tiao',w:'Bak kut teh shop'});
D('hotpot','Hotpot','cn',25,45,1,.2,0,{p:.8,f:'treat',tr:.1,x:'sit-down soup + everything',w:'Haidilao or a hotpot place'});
D('kaya','Kaya toast','cn sw',2,7,.2,.6,.9,{p:.7,f:'morning',tr:.6,x:'kaya butter toast, kopi, eggs',w:'Ya Kun or Toast Box'});
D('mjk','Min jiang kueh','cn sw',2,4,0,.3,1,{p:.6,tr:.9,x:'peanut, red bean or Biscoff',w:'A min jiang kueh stall'});
D('eggtart','Egg tart','cn sw',2,3,0,.2,1,{p:.6,tr:.8,x:'flaky or cookie crust',w:'A bakery or Tai Cheong'});
D('fruit','Fruit cup','sw',2,4,0,.2,1,{p:.55,tr:1,x:'cut fruit, light',w:'Any fruit stall'});
D('chendol','Chendol','sw',3,5,0,.2,1,{p:.55,tr:.3,x:'shaved ice, gula melaka, coconut milk',w:'A dessert stall'});
D('bread','Bread / buns','sw',1.5,4,0,.3,1,{p:.6,tr:1,x:'cream cheese buns, sweet buns',w:'Any bakery'});

// Japanese / Korean
D('ramen','Ramen','jk',7,22,1,.5,.1,{p:.9,f:'late',tr:.3,x:'tonkotsu, shoyu, dry or spicy',w:'Ippudo, Keisuke or any ramen shop'});
D('donburi','Donburi','jk',7,16,1,.7,.1,{p:.85,tr:.8,x:'gyudon, katsudon, oyakodon',w:'Yoshinoya, Sukiya or a don stall'});
D('sushi','Sushi','jk',4,30,.7,.9,.7,{p:.9,tr:.8,x:'conveyor plates or a platter',w:'Sushiro, Sushi Express or Genki'});
D('sashimi','Chirashi / sashimi','jk',20,60,.8,.6,.3,{p:.7,f:'treat',tr:.6,x:'fresh fish over rice',w:'A proper Japanese restaurant'});
D('jcurry','Japanese curry','jk',8,16,1,.5,.1,{p:.75,tr:.8,x:'katsu curry rice',w:'Japanese curry shop or food court'});
D('udon','Udon / soba','jk',7,15,.8,.8,.2,{p:.7,tr:.4,x:'kake, curry or cold zaru',w:'Udon shop or food court'});
D('konbini','Onigiri & konbini snacks','jk sw',2,6,.2,.6,1,{p:.6,tr:1,x:'onigiri, sandos, egg salad',w:'FamilyMart, 7-Eleven or Don Don Donki'});
D('kimchifr','Kimchi fried rice + hanjuku egg','jk',6,8,.8,.8,.2,{p:.7,tr:1,x:'the 7-Eleven one',w:'7-Eleven'});
D('takoyaki','Takoyaki','jk sw',5,9,.1,.5,1,{p:.7,tr:.6,x:'6 pcs with bonito flakes',w:'Takoyaki kiosk'});
D('mochi','Mochi','jk sw',2,4,0,.2,1,{p:.6,tr:.9,x:'cream-filled, fruity',w:'Chateraise or a Japanese bakery'});
D('buttertteok','Butter tteok','jk sw',1,5,0,.3,1,{p:.65,tr:.9,x:'chewy buttery rice cake bites',w:'Four Leaves'});
D('krchicken','Korean fried chicken','jk',12,28,.8,.6,.7,{p:.85,f:'late',tr:.7,x:'soy garlic or yangnyeom',w:'4Fingers, Kyochon or Chir Chir'});
D('bibimbap','Bibimbap','jk',9,16,1,.7,.1,{p:.75,tr:.7,x:'stone pot, gochujang',w:'Korean restaurant or food court'});
D('tteok','Tteokbokki','jk sw',8,15,.4,.9,.8,{p:.8,tr:.6,x:'chewy rice cakes, spicy sauce',w:'Korean snack bar or Dookki'});
D('jjigae','Korean stew','jk',6,18,1,.5,.1,{p:.7,tr:.4,x:'kimchi jjigae or sundubu',w:'Korean stall or restaurant'});
D('kbbq','Korean BBQ','jk',25,45,1,.2,0,{p:.8,f:'treat',tr:.1,x:'grill-your-own + banchan',w:'Korean BBQ restaurant'});
D('kimbap','Kimbap','jk sw',5,10,.3,.9,.9,{p:.65,tr:1,x:'tuna mayo or bulgogi rolls',w:'Korean deli or supermarket'});

// Classic western
D('chickenchop','Chicken chop','cw',6,10,1,.5,.1,{p:.8,x:'black pepper sauce, fries, coleslaw',w:'Hawker western stall'});
D('cutlet','Chicken cutlet','cw',6,12,1,.6,.2,{p:.85,x:'breaded cutlet, mushroom sauce',w:'Hawker western stall or Astons'});
D('fishchips','Fish & chips','cw',7,18,1,.5,.2,{p:.75,tr:.6,x:'battered fish, tartar sauce',w:'Fish & Co or a hawker western stall'});
D('burger','Burger & fries','cw',8,25,1,.6,.2,{p:.85,x:'smash or classic',w:'Shake Shack or a local burger joint'});
D('fastfood','Fast food','cw',6,12,.8,.8,.8,{p:.75,f:'late',tr:.9,x:'the 2am classic',w:"McDonald's, KFC or Jollibee"});
D('applepie','Apple pie','cw sw',2,3,0,.2,1,{p:.6,f:'late',tr:.9,x:'hot, crispy, lava filling',w:"McDonald's"});
D('brunch','Brunch plate','cw',16,28,.9,.6,.2,{p:.75,f:'morning treat',tr:.4,x:'eggs ben, big breakfast, waffles',w:'A brunch café'});
D('grilledcheese','Grilled cheese','cw',10,18,.6,.9,.4,{p:.7,tr:.5,x:'café-style, gooey',w:'A brunch café'});
D('panwich','Toastie / panwich','cw sw',6,9,.4,.9,.7,{p:.65,tr:.9,x:'hot pressed sandwich',w:'Starbucks or a café'});
D('sandwich','Sandwich / wrap','cw',6,14,.5,.9,.6,{p:.6,tr:1,x:'light and easy',w:'Subway, a café or a bakery'});
D('wings','Wings & fries','cw sw',5,12,.1,.5,1,{p:.7,f:'late',x:'snacky and crunchy',w:'Wingstop or a hawker western stall'});
D('waffle','Waffle','cw sw',2,6,0,.3,1,{p:.65,tr:.6,x:'plain, kaya or peanut butter',w:'Primadeli or a waffle stall'});
D('icecreamwaffle','Ice cream waffle','cw sw',8,18,0,.5,.9,{p:.7,f:'treat',tr:.1,x:'café waffle + a scoop',w:'A dessert café'});

// Pasta
D('carbonara','Carbonara / cream pasta','pa',8,25,1,.6,.1,{p:.9,tr:.6,x:'creamy, bacon, parmesan',w:'Saizeriya, Pastamania or an Italian place'});
D('aglio','Aglio olio','pa',6,22,.8,.8,.2,{p:.8,x:'garlic, chilli, prawns',w:'Any pasta spot or hawker western'});
D('tomato','Tomato / bolognese','pa',7,22,.9,.7,.2,{p:.75,x:'meat sauce or arrabbiata',w:'Saizeriya, Pastamania or an Italian place'});
D('pesto','Pesto pasta','pa',9,24,.9,.7,.2,{p:.65,x:'basil pesto, cherry tomatoes',w:'A café or Italian place'});
D('mentaiko','Mentaiko pasta','pa',10,22,.9,.7,.2,{p:.75,tr:.6,x:'cod roe cream, nori',w:'Japanese-Italian café'});
D('vongole','Seafood / vongole','pa',16,32,1,.5,.1,{p:.65,f:'treat',tr:.5,x:'clams, white wine, garlic',w:'Italian restaurant'});
D('baked','Baked pasta / mac & cheese','pa',10,22,.9,.6,.2,{p:.6,tr:.8,x:'cheesy and oven-baked',w:'A café or Saizeriya'});

// Pizza
D('slice','Pizza by the slice','pz sw',4,9,.3,.8,1,{p:.75,tr:.8,x:'one or two slices',w:'A slice shop or bakery'});
D('pepperoni','Pepperoni pizza','pz',10,30,.9,.7,.4,{p:.85,tr:.9,x:'the classic',w:"Domino's, Pizza Hut or a pizzeria"});
D('margherita','Margherita','pz',12,30,.9,.7,.4,{p:.75,tr:.8,x:'tomato, mozzarella, basil',w:'A wood-fired pizzeria'});
D('hawaiian','Hawaiian','pz',10,28,.9,.7,.4,{p:.7,tr:.9,x:'ham + pineapple, no judgement',w:"Domino's, Pizza Hut or Canadian 2 for 1"});
D('truffle','Truffle / white pizza','pz',18,35,.9,.6,.3,{p:.65,f:'treat',x:'truffle cream, mushrooms',w:'An Italian restaurant'});
D('pizzadeal','Pizza delivery deal','pz',8,20,.9,.7,.5,{p:.7,f:'late',tr:1,x:'personal pan + sides',w:"Domino's or Pizza Hut app deals"});

// Middle Eastern
D('shawarma','Shawarma / kebab wrap','me',8,14,.8,.9,.5,{p:.9,f:'late',tr:.9,x:'chicken or lamb, garlic sauce',w:'A shawarma or kebab shop'});
D('kebabplate','Kebab rice plate','me',12,22,1,.5,.1,{p:.8,tr:.8,x:'grilled meat, rice, salad',w:'Turkish or Lebanese restaurant'});
D('falafel','Falafel wrap','me',7,12,.6,.9,.6,{p:.65,tr:.9,x:'tahini and pickles',w:'Falafel stall or Middle Eastern café'});
D('mezze','Hummus & pita mezze','me',10,20,.3,.8,.8,{p:.7,tr:.6,x:'hummus, baba ganoush, warm pita',w:'Lebanese or Israeli café'});
D('mandi','Mandi rice + lamb','me',14,28,1,.3,0,{p:.65,x:'smoky rice, tender lamb',w:'Kampong Glam / Arab Street'});
D('pide','Turkish pide','me',14,24,.9,.6,.3,{p:.55,x:'boat-shaped flatbread, cheese + meat',w:'A Turkish restaurant'});

// Steak / meats
D('budgetsteak','Budget steak','st',10,18,1,.5,.1,{p:.8,tr:.5,x:'sirloin or ribeye with 2 sides',w:"Astons, Collin's or hawker western"});
D('steak','Proper steak','st',30,80,1,.4,0,{p:.8,f:'treat',tr:.3,x:'medium rare, the works',w:'A steakhouse'});
D('ribs','Ribs / BBQ platter','st',20,45,1,.3,0,{p:.65,f:'treat',tr:.5,x:'pork ribs, brisket, slaw',w:'An American BBQ place'});
D('roastchicken','Roast chicken','st',10,22,1,.6,.2,{p:.65,tr:.8,x:'half bird with mash',w:'A rotisserie or western place'});
D('lamb','Lamb chops','st',14,32,1,.4,.1,{p:.6,tr:.5,x:'grilled, rosemary',w:'Western grill or Middle Eastern place'});
D('bowl','Grilled meat bowl','st',10,18,.9,.8,.2,{p:.65,tr:.9,x:'steak or chicken over rice + greens',w:'A grain bowl / poke-style place'});

/* ---------- Rinis' spots ----------
   O(area, place, dish id, priceLow, priceHigh, {note, w: how often to offer 0-1 (default 1), extra: true for Momo's suggestions}) */
const SPOTS = [];
function O(area,place,dish,lo,hi,o={}){if(typeof hi==='object'){o=hi;hi=undefined}SPOTS.push({area,place,dish,lo,hi:hi??lo,note:o.note||'',w:o.w??1,extra:!!o.extra})}

// School (SIM)
O('school','Dumpling stall','dumplings',7.1);
O('school','Taiwanese stall','twchicken',4,5);
O('school','Taiwanese stall','sotong',3);
O('school','Taiwanese stall','twchickenrice',6,{note:'fried chicken w rice'});
O('school','Taiwanese stall','lurou',6);
O('school','Taiwanese stall','banhmi',7);
O('school','Ramen stall','ramen',7,{note:'dry ramen'});
O('school','Fruit stall','fruit',2,3);
O('school','Starbucks','panwich',7);
O('school','Chinese noodle shop','dumplingnoodles',5,7);
O('school','Korean stall','jjigae',6,{note:'kimchi soup with meat'});

// Home / near home
O('home','Tom yum stall','tomyum',6,{note:'mee hoon kueh or ke kou mian'});
O('home','Yong tau foo stall','ytf',6);
O('home','Koo Kee Yong Tau Foo','ytf',7);
O('home','7-Eleven','kimchifr',7,{w:.3,note:'might be sold out'});
O('home','Fish soup stall','fishsoup',7,{note:'sliced fish'});
O('home','Duck noodles (behind)','ducknoodle',5);
O('home','Wanton mee stall','wantonmee',5);
O('home','King of Fried Rice','friedrice',6,8);
O('home','Mala stall','mala',10,12,{note:'1 person portion'});

// West (tuition, Bukit Panjang)
O('west','Primadeli','waffle',3);
O('west','Bakery','bread',2);
O('west','Four Leaves @ BPP','buttertteok',1,5,{note:'5 for $5'});
O('west','Ya Kun @ Hillion','kaya',2,6.3);
O('west','Shihlin @ Hillion','twchicken',6);
O('west','Shihlin @ Hillion','sotong',6);
O('west','I Love Taimei @ Hillion','twchicken',7);
O('west',"McDonald's",'applepie',2);
O('west','Chateraise @ Hillion','mochi',2,{note:'mango cream mochi'});
// Momo's extra finds around Hillion / BPP (prices from 2026 food guides; check they're still there)
O('west','Munchi Pancakes @ Hillion','mjk',2.4,3.2,{extra:true,note:'peanut, red bean, Biscoff'});
O('west','Barcook Bakery @ Hillion','bread',1.6,3,{extra:true,note:'cream cheese bun'});
O('west','Kopi & Tarts @ Hillion','eggtart',2.5,{extra:true});
O('west','Nan Yang Dao @ Hillion','chendol',3.5,{extra:true});
O('west','Gokoku Bakery @ BPP','bread',2,4,{extra:true,note:'Japanese breads'});
O('west','Swee Heng @ BPP','bread',1.5,3,{extra:true});
O('west','Genki Sushi @ Hillion','sushi',4,10,{extra:true,note:'a few plates'});
O('west','Wingstop @ Hillion','wings',6.75,{extra:true,note:'voodoo fries'});
O('west','Old Chang Kee @ BPP','currypuff',2,2.5,{extra:true});
O('west','Bengawan Solo @ BPP','kueh',1.5,4,{extra:true});
O('west','Pastago @ Hillion','aglio',5.7,12,{extra:true,note:'fresh pasta'});

// East
O('east','The Brewing Ground','grilledcheese',17);
O('east','Neptune','icecreamwaffle',17,{note:'caramelised bacon ice cream waffle'});

// Sengkang: Momo's finds at Compass One and Kopitiam Square (from 2025-26 food guides; check they're still there)
// Compass One
O('sengkang','Four Leaves @ Compass One','buttertteok',1,5,{extra:true});
O('sengkang','Chateraise @ Compass One','mochi',2,4,{extra:true});
O('sengkang','Ya Kun @ Compass One','kaya',2,6.3,{extra:true});
O('sengkang','Tip Top Curry Puff @ Compass One','currypuff',2,2.5,{extra:true});
O('sengkang','Polar Puffs @ Compass One','currypuff',2,3,{extra:true});
O('sengkang','BreadTalk @ Compass One','bread',2,4,{extra:true});
O('sengkang',"McDonald's @ Compass One",'applepie',2,{extra:true});
O('sengkang',"McDonald's @ Compass One",'fastfood',6,10,{extra:true});
O('sengkang','Shihlin @ Compass One','twchicken',6,7,{extra:true,w:.6,note:'older listing, check it\'s open'});
O('sengkang','Shihlin @ Compass One','sotong',6,7,{extra:true,w:.6,note:'older listing, check it\'s open'});
O('sengkang','Eat 3 Bowls @ Compass One','lurou',6,9,{extra:true,note:'braised pork rice, price est.'});
O('sengkang','Din Tai Fung @ Compass One','xlb',9,15,{extra:true});
O('sengkang','Din Tai Fung @ Compass One','dumplings',9,14,{extra:true,note:'price est.'});
O('sengkang','Pontian Wanton Noodles @ Compass One','wantonmee',5,7,{extra:true,note:'price est.'});
O('sengkang','Crave Nasi Lemak @ Compass One','nasilemak',6,9,{extra:true});
O('sengkang','Umisushi / Ichiban Sushi @ Compass One','sushi',4,15,{extra:true});
O('sengkang','Yoshinoya @ Compass One','donburi',7,11,{extra:true});
O('sengkang','Ajisen Ramen @ Compass One','ramen',12,18,{extra:true,note:'price est.'});
O('sengkang','Bonchon @ Compass One','krchicken',12,20,{extra:true,note:'price est.'});
O('sengkang','Seorae @ Compass One','kbbq',25,40,{extra:true,note:'price est.'});
// Kopitiam Square (10 Sengkang Square)
O('sengkang','Munchi Pancakes @ Kopitiam Sq','mjk',2.2,3.2,{extra:true});
O('sengkang','JIN Kimchi Express @ Kopitiam Sq','jjigae',6,{extra:true,note:'kimchi stew set'});
O('sengkang','Fitra Chicken Rice @ Kopitiam Sq','chickenrice',4,6,{extra:true,note:'price est.'});
O('sengkang','Confirm+Chop Western @ Kopitiam Sq','chickenchop',7,10,{extra:true,note:'price est.'});
O('sengkang','Kebab Marhaba @ Kopitiam Sq','shawarma',7,10,{extra:true,note:'price est.'});
O('sengkang','Seng Kee Bak Kut Teh @ Kopitiam Sq','bkt',6,9,{extra:true,note:'price est.'});
O('sengkang','Pasta Times @ Kopitiam Sq','aglio',6,9,{extra:true,note:'price est.'});

/* Drinks Momo can suggest on the side */
const ADDONS = [
  {area:'school', name:'Milo', price:2},
  {area:'school', name:'Starbucks drink', price:8}
];

/* Where Momo auto-emails each verdict (via formsubmit.co, GitHub Pages version only).
   After you activate it, FormSubmit emails you a random code: put that here instead so your address isn't in the public code. */
const SAM_EMAIL = 'samuelwan04@gmail.com';

const DATA={AREAS,SIDES,CUISINES,HUNGER,BUDGET,DISHES,SPOTS,ADDONS,SAM_EMAIL};
if(typeof module!=='undefined') module.exports=DATA; else root.GFDATA=DATA;
})(this);
