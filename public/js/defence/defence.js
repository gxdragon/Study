/**
 * Default Setting Script
 * 2018. 08. 10.
 */
( function( global, factory ) {
	"use strict";
	if ( typeof module === "object" && typeof module.exports === "object" ) {
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					
				}
				return factory( w );
			};
	} else {
		factory( global );
	}
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {
	
	let _scene = new THREE.Scene();
	let _camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
	let _renderer = new THREE.WebGLRenderer();
	let _frustum = new THREE.Frustum();
	let _cameraViewProjectionMatrix = new THREE.Matrix4();
	
	let _stats, _controls;
	
	//planet
	let _life = 0;
	//satellite
	//enemy
	
	defence = {
		init : function(title){
			console.log(title);
			
			//Default Settings
			defence.tools.renderer();
			defence.tools.axes();
			defence.tools.light();
			defence.tools.stats();
			defence.tools.camera();
			defence.tools.controls();
            defence.tools.board();
            
			document.body.appendChild(_renderer.domElement);
            document.body.appendChild(_stats.domElement);

            //life Setting
            defence.planet.init(10);
            
            //addSatellite
            defence.satellite.addSatellite();
            
            //addEnemy
            defence.enemy.addEnemy();
            
            //render started
			
            render();
            window.addEventListener('keydown', function(event){ key(); });
		},
		tools : {
			renderer : function(){
				_renderer.setClearColor(0xEEEEEE, 1.0);
				_renderer.setSize(window.innerWidth, window.innerHeight);
			},
			axes : function(){
				let axes = new THREE.AxesHelper(200);
				_scene.add(axes);
			},
			light : function(){
            	let dl = new THREE.DirectionalLight( 0xffffff );
            	dl.position.x = 0; 
            	dl.position.y = 0; 
            	dl.position.z = 100; 
            	dl.position.normalize();
                _scene.add(dl);
			},
			stats : function(){
                _stats = new Stats();
                _stats.domElement.style.position = 'absolute';
                _stats.domElement.style.top = '0px';
                _stats.domElement.style.zIndex = 100;
			},
			camera : function(){
				_camera.position.x = 300;
				_camera.position.y = 100;
				_camera.position.z = 300; 
				
				_camera.updateMatrixWorld();
				_camera.matrixWorldInverse.getInverse( _camera.matrixWorld );
				_cameraViewProjectionMatrix.multiplyMatrices( _camera.projectionMatrix, _camera.matrixWorldInverse );
				_frustum.setFromMatrix( _cameraViewProjectionMatrix );

				_camera.lookAt(_scene.position);
			},
			controls : function(){
				_controls = new THREE.OrbitControls(_camera, _renderer.domElement);
			},
			board : function(){
				let html = "<div class='score' id='scoreBoard'></div>";
				html += "<div class='gameOver' id='gameOver'><span>Game Over</span></div>";
				document.body.innerHTML += html;
			}
		},
		planet : {
			init : function(life){
				let planet = new THREE.Mesh(
						new THREE.SphereGeometry(10,30,30),
						new THREE.MeshLambertMaterial({color: 0xffffff,wireframe:true}));
				planet.name="planet";
				_scene.add(planet);
				defence.planet.setLife(life);
			},
			getLife : function(){
				return _life;
			},
			setLife : function(life){
				_life = life;
			}
			//행성 (여기서는 주성 개념)
		},
		satellite :{
			addSatellite : function(){
				let satellite = new THREE.Mesh(
						new THREE.SphereGeometry(5,30,30),
						new THREE.MeshLambertMaterial({color: 0xff0000}));
				satellite.position.z = -30;
				satellite.position.x = -30;
				satellite.userData = {attackSpeed : 10, attackPoint:5, speed:2};
				satellite.name = "satellite";
				_scene.add(satellite);

				satellite = new THREE.Mesh(
						new THREE.SphereGeometry(5,30,30),
						new THREE.MeshLambertMaterial({color: 0xff0000}));
				satellite.position.y = -30;
				satellite.userData = {attackSpeed : 10, attackPoint:5, speed:2};
				satellite.name = "satellite";
				_scene.add(satellite);
				
				satellite = new THREE.Mesh(
						new THREE.SphereGeometry(5,30,30),
						new THREE.MeshLambertMaterial({color: 0xff0000}));
				satellite.position.x = -30;
				satellite.userData = {attackSpeed : 10, attackPoint:5, speed:2};
				satellite.name = "satellite";
				_scene.add(satellite);
			}
			//위성(Tower)
		},
		enemy : {
			//적 : 바위, 위성 등
			addEnemy : function(){
				let enemy = new THREE.Mesh(
						new THREE.SphereGeometry(5,30,30),
						new THREE.MeshLambertMaterial({color: 0xffff00}));
				enemy.position.x = 30;
				enemy.position.y = 30;
				enemy.position.z = -30;
				enemy.name = "enemy";
				_scene.add(enemy);
			}
		}
	};
	
	const _planet = {x:0,y:0};
	function transformation(/*cx:Number,cy:Number,
            px:Number,py:Number,
            rad:Number*/)/*:Object*/
{
/*
var rx:Number = (px-cx)*Math.cos(rad) - (py-cy)*Math.sin(rad) + cx;
var ry:Number = (px-cx)*Math.sin(rad) + (py-cy)*Math.cos(rad) + cy;                
return {x:rx , y:ry}*/     
}

	var a = true;
	function render(){
		/*if(!_frustum.intersectsObject(_monster)){
			_scene.remove(_monster);
			_monster = new THREE.Mesh(new THREE.BoxGeometry(5,5,5), new THREE.MeshLambertMaterial({color: 0xffffff}));
			_monster.position.x=-25;
			_monster.position.y=-25;
			_monster.userData = {hp:100};
			_scene.add(_monster);
		}
		if(_monster.userData.hp<=0){
			_scene.remove(_monster);
			_monster = new THREE.Mesh(new THREE.BoxGeometry(5,5,5), new THREE.MeshLambertMaterial({color: 0xffffff}));
			_monster.position.x=-25;
			_monster.position.y=-25;
			_monster.userData = {hp:100};
			_scene.add(_monster);
		}
		_box.setFromObject(_monster);
		if(_box.intersectsSphere(_sphere)){
			if(f){
				f=false;
				attack = setInterval(function(){ 
					_monster.userData.hp -= 10;
				}, Attack Speed300);
				console.log("Attack Start");
			}
		}else{
			if(f==false){
				f=true;
				console.log("Attack Stop");
				clearInterval(attack);
			}
		}
		_monster.position.x += 0.1;
		_monster.position.y += 0.1;*/
		//x:red y:green z:blue.
		for(let obj of _scene.children){
			
			if(obj.name == "satellite"){ 
				obj.updateMatrixWorld();
				var px,py;
				if(obj.position.x != 0){
					px = obj.position.x;
					py = obj.position.y;
					if(obj.position.z !=0){
						py = obj.position.z;
					}
				}else if(obj.position.y != 0){
					px = obj.position.z;
					py = obj.position.y;
				}else{
					px = obj.position.x;
					py = obj.position.z;
				}
				var rx = ((px - 0) * Math.cos(obj.userData.speed * Math.PI/180) - (py - 0) * Math.sin(obj.userData.speed * Math.PI/180)) + 0; 
				var ry = ((px - 0) * Math.sin(obj.userData.speed * Math.PI/180) + (py - 0) * Math.cos(obj.userData.speed * Math.PI/180)) + 0;


				if(obj.position.x != 0){
					obj.position.x = rx;
					if(obj.position.z !=0){
						obj.position.z = ry;
					}else{					
						obj.position.y = ry;
					}
				}else if(obj.position.y != 0){
					obj.position.z = rx;
					obj.position.y = ry;
				}else{
					obj.position.x = rx;
					obj.position.z = ry;
				}
			}
			
			if(obj.name == "enemy"){
				obj.updateMatrixWorld();
				var pos = obj.position;
				if(pos.x!=0){
					if(pos.x>0){
						obj.position.x -= 0.1
					}else{
						obj.position.x += 0.1
					}
				}
				if(pos.y!=0){
					if(pos.y>0){
						obj.position.y -= 0.1
					}else{
						obj.position.y += 0.1
					}
				}
				if(pos.z!=0){
					if(pos.z>0){
						obj.position.z -= 0.1
					}else{
						obj.position.z += 0.1
					}
				}
			}
		}
       	requestAnimationFrame( render );
       	
       	if(_stats) _stats.update();
       	if(_controls) _controls.update();
       	 
        _renderer.render( _scene, _camera );
	}
	function key(){
	}
	
	if ( !noGlobal ) {
		window.defence = defence;
	}

	return defence;
});
