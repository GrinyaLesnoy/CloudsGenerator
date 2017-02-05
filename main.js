/*
Генерация облаков по алгоритму Diamond-Square
Autor: Grinya Lesnoy
Site: https://github.com/GrinyaLesnoy
License: MIT
*/

var diamondSquare = {
	color1 : [0,0,0,1],
	color2 : [255,255,255,1],
	width : 200,
	height : 400,
	SW : 7,
	SH : 7, 
	
	Init : function(box){
		var box= box instanceof HTMLElement?box:document.body; 
		//createElement
		var createEl = function(parent,NodeName,attr){
			if(NodeName === 'text')var e = document.createTextNode(attr);
			else{
			var e = document.createElement(NodeName);
			if(attr)for(var i in attr){
			if(i==='style')for(var j in attr.style){e.style[j]=attr.style[j];}
			else e.setAttribute(i,attr[i]);
			}
			}
			if(parent)parent.appendChild(e);
			return e;
		},
		//Для удобства, в генерации используются сегменты, кратные 2; getSMax пытается получить степень 2, при которой ширина/высота сегмента будет полностью перекрывать ширину/высоту изображения ( например,  для ширины 600px ширина сегмента будет 1024px - 2 в 10й степени )
		getSMax = function(S){
			S=Math.log2(S); return (S!==~~S)?~~S+1:S;  
		}, 
		//Преобразует цвет в массив [R,G,B,A]
		parseColor = function(C){
		switch(typeof C){
			case 'object': if(C.length<4)C[3]=1;break;
			case 'string': C=C.trim();
				if(C.indexOf(',')!=-1){
					C=C.split(',').map(function(v){return +v;});
					if(C.length<4)C.push(1); 
					break;
				}
				if(C.indexOf('#')===0){ C=C.substr(1);}
				var str = C.length === 6 ? C:C[0]+C[0]+C[1]+C[1]+C[2]+C[2],C=[0,0,0,1];
				
				for(var i=0;i<3;i++)C[i]=parseInt(str.slice(i<<1,(i<<1)+2), 16); 
			 break;
			case 'number':C=[0,0,0,C]; break;
		}
			return C;
	}
	
		/*create background DataURL*/
		var ctx = document.createElement('canvas');
		ctx.width=20;ctx.height=20;
		ctx = ctx.getContext('2d');
		ctx.fillStyle = '#ccc';
		ctx.fillRect(0,0,20,20); 
		ctx.fillStyle = '#333';
		ctx.fillRect(0,0,10,10);
		ctx.fillRect(10,10,10,10);
		var bgc = ctx.canvas.toDataURL();
		
		var w = 600; 
		var h = 700; 
		var comment = {}//comment
		var C = this.controller = document.createElement('div');
		//C.style.position = 'absolute';
		C.style.top = 0;C.style.left = 0;C.style.right = 0;
		C.style.background = '#fff'; 
		var div = createEl(C,'div'); 
		div.innerHTML = 'Ширина: <input name="width" value="'+w+'" type="number"/> Ширина сегмента (степень 2): <input name="SW" value="'+this.SW+'" type="number"/> ';
		comment.SW = createEl(div,'span'); 
		comment.SW.innerHTML = Math.pow(2,this.SW);
		createEl(div,'text', ' px; Max: ');
		comment.width = createEl(div,'span'); 
		comment.width.innerHTML =  getSMax(w);
		var div = createEl(C,'div'); 
		div.innerHTML = 'Высота: <input name="height" value="'+h+'" type="number"/> Высота сегмента (степень 2): <input name="SH" value="'+this.SH+'" type="number"/> ';
		comment.SH = createEl(div,'span'); 
		comment.SH.innerHTML = Math.pow(2,this.SH);
		createEl(div,'text', ' px; Max: ');
		comment.height = createEl(div,'span'); 
		comment.height.innerHTML =  getSMax(h);
		
		
		var	cboxAttr = 	{style:{display:'inline-block',width:'15px',height:'13px',backgroundImage:'url('+bgc+')',border:'1px solid #999', margin:'0 5px',backgroundSize:'50%'}};
		var div = createEl(C,'div'); 
		createEl(div,'text', 'Цвет 1: ');
		createEl(div,'input', {name:"color1",value:this.color1}); 
		comment.color1 = createEl(createEl(div,'div',cboxAttr),'div',{style:{width:'15px',height:'13px'}}); 
		comment.color1.style.backgroundColor='rgba('+this.color1+')';
		createEl(div,'text', 'Цвет 2: ');
		createEl(div,'input', {name:"color2",value:this.color2});  
		comment.color2 = createEl(createEl(div,'div',cboxAttr),'div',{style:{width:'15px',height:'13px'}}); 	
		 comment.color2.style.backgroundColor='rgba('+this.color2+')';
		
		var div = createEl(C,'div'); 
		div.innerHTML = '<button name="Generate">Создать (New)</button> <button name="Render">Обновить (Ubdate)</button>';  
		
		this.SaveBTN = createEl(C,'a',{download:"clouds.png",style:{display:'inline-block',margin:'5px 0',textAlign:'center'}}); 
		ctx.clearRect(0,0,20,20); 
		ctx.fillStyle = '#00f';
		ctx.fillRect(0,0,20,20); 
		ctx.fillStyle = '#ccc';
		ctx.fillRect(4,0,12,5)
		ctx.fillStyle = '#00f';
		ctx.fillRect(10,1,5,3); 
		ctx.fillStyle = '#fff';
		ctx.fillRect(2,8,16,9); 
		ctx.fillStyle = '#f00';
		ctx.fillRect(2,8,16,2); 
		 
		this.SaveBTN.innerHTML = '<img src="'+ctx.canvas.toDataURL()+'"><br/>Save';
		//e.target.type==='submit'
		div.addEventListener('click',function(e){ if(e.target.name&&$T[e.target.name])$T[e.target.name](e);});
		var $T = this;
		var change = function(e){
			var e = e.target, n = e.name,v=e.type === 'number'?+e.value:e.value;
			if(n === 'width'|| n === 'height'){ 
			//Если был изменен размер - пытаемся обновить без повторного рендеринга
			var du = $T.canvas.toDataURL();
			$T.canvas[n]=v;
			$T.canvas.parentNode.style[n]=v+'px';
			var ctx = $T.canvas.getContext('2d');
			var Img = new Image();
			Img.onload=function(){
				ctx.drawImage(Img,0,0,Img.width,Img.height);
				$T.SaveBTN.href=$T.canvas.toDataURL();
			} 
			Img.src = du;
			comment[n].innerHTML =  getSMax(v);
			} else { 
			if(n==='color1'||n==='color2'){
			//Если менялся цвет, то парсим значение и обновляем предпросмотр
				e.value = v=parseColor(v);
				comment[n].style.backgroundColor='rgba('+v+')';
			}
			else if(n==='SW'||n==='SH')comment[n].innerHTML = Math.pow(2,v);
			$T[n]=v;
			}
		 }
		C.addEventListener('change',change);
		//C.addEventListener('input',change);
		box.innerHTML = '<p style="color:#777">'
		+'<b>Ширина/высота</b> - ширина/высота изображения<br>'
		+'<b>Ширина/высота сегмента</b> - изображение строится из сегментов кратных 2px: 2 в степени n; По умолчанию степень и по ширине и по высоте n = 7 (соотв сегменту  128х128px) <b>Max</b> - рекомендуемый максимальный параметр (степень n, при которой 1 сегмент занимает размер всего изображения)<br>'
		+'<b>Цвет 1, Цвет 2</b> - цвета Фон/перед. Допустимые форматы: <b>r,g,b</b> (255,255,255) | <b>r,g,b,a</b> (255,255,255,1) | <b>#hex</b> (#fff или #ffffff или fff без "#"; РеГиСтР не важен)<br>'
		+'<b>Создать (New)</b> - расчитывает новое изображение<br>'
		+'<b>Обновить (Update)</b> - обновляет вид без перерасчета (можно использовать, например, при изменении цвета)<br>'
		+'<b>Сохранить</b> - save или через контекстное меню<br>'
		+'</p>';
		box.appendChild(C);
		this.canvas = document.createElement('canvas');
		this.canvas.width=w;
		this.canvas.height=h;
		
		
		var cBox =  createEl(false,'div',{style:{display:'inline-block',margin:'5px 0',background:'url('+bgc+')', width : w+'px', height:h+'px',overflow:'hidden'}}); 
		cBox.appendChild(this.canvas);
		box.appendChild(cBox);
		this.SaveBTN.href=this.canvas.toDataURL();
		createEl(box,'div',{}).innerHTML='ver 0.2 | <a href="https://github.com/GrinyaLesnoy">Grinya Lesnoy</a> | License: MIT | <a href="https://github.com/GrinyaLesnoy/CloudsGenerator">Source</a>';  
	}, 
	Map : {},
	GenerateComplite : false,
	Generate : function(){
		this.GenerateComplite = false;
		var $T = this, random=Math.random,round=Math.round;
		var Map = this.Map = {}; this.MapR={};
		var CW = this.canvas.width, CH = this.canvas.height, W,Wmax,H,Hmax, w, h, w2,h2;  
		if(this.SW===0&&this.SH===0){
		for(var X=0, Y=0; Y<CH; X++ ){ 
				//if X >= W - end line -> go to next line;if  Y>=H - end last line -> break;  
				if( X>=CW ){ X=0; Y++; if( Y>=CH )break; }   
			Map[[X,Y]]=[X,Y,random()]; 
		}this.GenerateComplite = true;
		$T.Render();return;
		}
		W = Math.pow(2,this.SW);H = Math.pow(2,this.SH);//2 в степени n
		var  a1, a2, a3, a4, a5, sum, tmp, min, max, x, y, st1 = true; 
		var 
		A,
		Am = 0.001,//min step
		AM = 0.5,//max step
		WH2 = (W+H)/2,
		wh2
		;
		// while(): w = W -> 1px; h = H -> 1px;
		// W, H - canvas width,height; w,h - segment width,height
		w = W; h = H;
		for(var X=0, Y=0; Y<CH; X+=w ){ 
				//if X >= W - end line -> go to next line;if  Y>=H - end last line -> break;  
				if( X>=CW ){ X=0; Y+=h; if( Y>=CH )break; }   
			Map[[X,Y]]=[X,Y,random()];
			Map[[X+w,Y]]=[X+w,Y,random()];
			Map[[X+w,Y+h]]=[X+w,Y+h,random()];
			Map[[X,Y+h]]=[X,Y+h,random()];
		}
		$T.Render();
		w>>1;h>>1;st1===false;
		var getData = function(){
		//while( w>0 && h>0 ){ 
			w2 = w>>1;//w2 = Int (w/2)
			h2 = h>>1;//h2 = Int (h/2) 
			wh2=(w+h)/2;
			/* 
				A - Amplituda ( Амплитуда ): 
				Откланение точки от средгнго значения соседних точек: чем меньше отрезок, тем меньше откланения
				a5 = (a1+a2+a3+a4)/4 + A*Math.random();
				MAX : w=W,h=H, wh2 = wh2M = (W+H)/2 = WH2; A = AM = 1;
				MIN : w=1,h=1, wh2 = wh2m = (1+1)/2 = 1; A = Am = 0.01;
				CURRENT :  w,h, wh2 = (w+h)/2; A = ?; 
				Уровнение прямой:
				( y1-y2 )*x + ( x2-x1 )*y + ( x1*y2 - x2*y1 ) = 0;
				1 - MAX, 2 - MIN, x - wh2, y - A : 
				( AM-Am )*wh2 + ( wh2m-wh2M )*A + ( wh2M*Am - wh2m*AM )=0; 
				( AM-Am )*wh2 + ( 1-WH2 )*A + ( WH2*Am - 1*AM ) = 0; 
			*/ 
			A =  ( ( AM-Am )*wh2 + WH2*Am - AM )/( WH2-1 );
			//A/=2; // random( -A/2,+A/2 )
			/*  for():
					Y=0
				X=0|----->|X=W
				X=0|----->|X=W
				X=0|----->|X=W
					Y = H    
			*/
			 //подмать о разбиении на блоки
			for(var X=0, Y=0; Y<CH; X+=w ){ 
				//if X >= W - end line -> go to next line;if  Y>=H - end last line -> break;  
				if( X>=CW ){ X=0; Y+=h; if( Y>=CH )break; }   
					
						if(st1===true){
							/* st1=true	
								a1----a2
								| \  / |
							I)	|  a5  |
								| /  \ |
								a3----a4
							*/  
							sum = (
							Map[X+','+Y][2]+//a1
							Map[(X+w)+','+Y][2]+
							Map[(X+w)+','+(Y+h)][2]+
							Map[X+','+(Y+h)][2]//a3
							)/4;
							 min = sum-A; max = sum+A; 
							if(!Map[(X+w2)+','+(Y+h2)])Map[(X+w2)+','+(Y+h2)]= [(X+w2),(Y+h2), ~~((random()*(max-min)+min)/Am)*Am ];
						}else {//st1=false
							/* 	st1=false
								 +---a5.1---+
								 |     |    |
							II)	a5.4<-a5->a5.2
								 |     |    |
								 +---a5.3---+ 
								 
									+----a5'---+
									|     |    |
							III)	a1->a5.1<-a2
									|     |    |
									+----a5----+
							*/
							a1= Map[X+','+Y][2]; 
							a2= Map[(X+w)+','+Y][2]; 
							a3= Map[(X+w)+','+(Y+h)][2]; 
							a4= Map[X+','+(Y+h)][2];
							a4= Map[X+','+(Y+h)][2];
							a5= Map[(X+w2)+','+(Y+h2)][2];
							
							x = X+w2; y = Y; //a5.1 
							tmp = y===0 ? (a1+a2+a5)/3-A : Map[x+','+(y-h2)][2]; 
							sum = (a1+a2+a5+tmp)/4;
							min = sum-A; max = sum+A; 
							if(!Map[x+','+y])Map[x+','+y] =  [x,y, ~~((random()*(max-min)+min)/Am)*Am ];
							
							x = X+w; y = Y+h2; //a5.2
							tmp = x>=CW ? (a2+a3+a5)/3-A : Map[(x+w2)+','+y][2]; 
							sum = (a2+a3+a5+tmp)/4;
							min = sum-A; max = sum+A; 
							Map[x+','+y] = [x,y, ~~((random()*(max-min)+min)/Am)*Am ];
							
							x = X+w2; y = Y+h; //a5.3
							tmp = y>=CH ? (a3+a4+a5)/3-A : Map[x+','+(y+h2)][2]; 
							sum = (a3+a4+a5+tmp)/4;
							min = sum-A; max = sum+A; 
							Map[x+','+y] = [x,y, ~~((random()*(max-min)+min)/Am)*Am ];
							
							x = X; y = Y+h2; //a5.4  
							tmp = x === 0 ? (a4+a1+a5)/3 - A : Map[(x-w2)+','+y][2]; 
							sum = (a4+a1+a5+tmp)/4;
							min = sum-A; max = sum+A; 
							Map[x+','+y] = [x,y, ~~((random()*(max-min)+min)/Am)*Am ];
						} 
				 
			}  	 
			//if(w<=1||h<=1)break;
			if(w<=1&&h<=1){console.log('generate complie');$T.GenerateComplite = true; $T.RenderLayer();return;}
			if(st1===false){//if stade 2 : w = Int w/2; h = Int h/2;
				w = w===1?1:w>>1;
				h = h===1?1:h>>1;
				$T.RenderLayer();
				console.log(w+'x'+h,W+'x'+H,W/w+'x'+H/h);
			}
			st1 = !!(--st1);//<=> if(st1 = st1===true){ st1 = false }else{ st1 = true; } 
			if(w!==0&&h!==0){setTimeout(getData,5);}else $T.RenderLayer();
		}
		 getData();
		//this.Render();
	},
	MapR : {}, 
	RenderLayer : function(){
		var $T = this, ctx = this.canvas.getContext('2d'),  c2 = this.color2;
		var Map = this.Map,MapR = this.MapR, rgba='rgba('+c2[0]+','+c2[1]+','+c2[2]+',', a=c2[3]; 
		var _keys = Object.keys(Map);
		if(_keys.length<100000){
		for(var i in Map){
			if(MapR[i])continue;
			MapR[i]=i; 
			ctx.fillStyle = rgba+Map[i][2]+')';
			ctx.fillRect(Map[i][0],Map[i][1],1,1);  
		}
		if($T.GenerateComplite===true)$T.SaveBTN.href=$T.canvas.toDataURL();
		}else{
		var draw = function(){  
			if(_keys.length===0)return;
			
			for(var j=0; j<20000;j++){
				i=_keys.pop();
				if(!i)break;
				if(MapR[i])continue;
				MapR[i]=i;
				ctx.fillStyle = rgba+Map[i][2]+')';
				ctx.fillRect(Map[i][0],Map[i][1],1,1); 
			} 
			
			if(_keys.length!==0)setTimeout(draw,1);else if($T.GenerateComplite===true)$T.SaveBTN.href=$T.canvas.toDataURL();
		};draw();
		}
		
	},
	Render : function(){
		var ctx = this.canvas.getContext('2d'), c1 = this.color1;
		this.MapR={};
		ctx.fillStyle = 'rgba('+c1+')';
		ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
		ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
		this.RenderLayer();
	},
	
	Save : function(e){ 
			e.target.href=this.canvas.toDataURL();
		return false; 
	 },
}   

document.addEventListener("DOMContentLoaded", function(){diamondSquare.Init();});
