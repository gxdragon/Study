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
	let _planet; 
	//satellite
	//enemy
	let _interval;
	
	defence = {
		init : function(title){
			console.log(title);
			
			//Default Settings
			defence.tools.renderer();
			defence.tools.scene();
			defence.tools.axes();
			defence.tools.light();
			defence.tools.stats();
			defence.tools.camera();
			defence.tools.controls();
            defence.tools.board();
            defence.tools.button.addButton();
			document.body.appendChild(_renderer.domElement);
            document.body.appendChild(_stats.domElement);

            //life Setting
            defence.planet.init(10);
            
            //addSatellite
            defence.satellite.addSatellite();
            
            defence.enemy.addEnemy();
			/*var _interval = setInterval(function(){ 
	            //addEnemy
	            //defence.enemy.addEnemy();
            }, 1000);
*/
            //render started
            render();
            
            /*window.addEventListener('keydown', function(event){ key(); });*/
            window.addEventListener('resize', fn_onWindowResize, false );					//window resize event
		},
		tools : {
			renderer : function(){
				_renderer.setClearColor(0x000000, 1.0);
				_renderer.setSize(window.innerWidth, window.innerHeight);
			},
			scene : function(){
				_scene.userData = {enemy:[]};
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
			},
			button: {
				addButton : function(){
					let html = "<span class='button' style='right:200px;' onclick='defence.satellite.addSatellite();'> Add Satellite </span>";
					html += "<span class='button' style='right:100px;' onclick='defence.enemy.addEnemy();'> Add Enemy </span>";
					document.body.innerHTML += html;
				}
			}
		},
		planet : {
			init : function(life){
				_planet = new THREE.Mesh(
						new THREE.SphereGeometry(30,30,30),
						new THREE.MeshLambertMaterial({color: 0xffffff,wireframe:true}));
				_planet.name="planet";
				_planet.userData = {life:10};
				_scene.add(_planet);
			}
			//행성 (여기서는 주성 개념)
		},
		satellite :{
			addSatellite : function(){
				let satellite = new THREE.Mesh(
						new THREE.SphereGeometry(5,30,30),
						new THREE.MeshLambertMaterial({color: 0xff0000}));
				satellite.position.x = Math.round(Math.random() * 300)- 150;
				satellite.position.y = Math.round(Math.random() * 300)- 150;
				satellite.position.z = Math.round(Math.random() * 300)- 150;
				satellite.userData = {attackSpeed : 100, attackPoint : 5, speed : 2, turningFlag : {x : false, y : false, z : false}, position : {x:satellite.position.x,y:satellite.position.y,z:satellite.position.z}};
				satellite.name = "satellite";
				if((satellite.position.x > 40 || satellite.position.x < -40) || (satellite.position.y > 40 || satellite.position.y < -40) || (satellite.position.z > 40 || satellite.position.z < -40) ){
					_scene.add(satellite);
				}else{
					defence.satellite.addSatellite();
				}
			}
			//위성(Tower)
		},
		enemy : {
			//적 : 바위, 위성 등
			addEnemy : function(){
				let enemy = new THREE.Mesh(
						new THREE.SphereGeometry(5,30,30),
						new THREE.MeshLambertMaterial({color: 0xffff00}));
				enemy.position.x = Math.round(Math.random() * 300)- 150 ;
				enemy.position.y = Math.round(Math.random() * 300)- 150 ;
				enemy.position.z = Math.round(Math.random() * 300)- 150 ;
				enemy.userData = {hp:10,interval:null};
				enemy.name = "enemy";
				_scene.userData.enemy.push(enemy);
				_scene.add(enemy);
			}
		}
	};
	
	function render(){
		//x:red y:green z:blue.
		_planet.geometry.computeBoundingSphere();
		for(let obj of _scene.children){
			obj.updateMatrixWorld();
			if(obj.name == "satellite"){
				let pos = obj.userData.position;
				let enemySpotted = false;
				let satelliteP = new THREE.Sphere(obj.position, 10);
				
				for(let enemy of _scene.userData.enemy){
					if(satelliteP.intersectsSphere(new THREE.Sphere(enemy.position,5))){
						enemy.userData.interval = setInterval(function(){ 
							enemy.userData.hp -= obj.attackPoint;
							if(enemy.userData.hp<=0){
								clearInterval(enemy.userData.interval);
								_scene.userData.enemy.remove(enemy);
								_scene.remove(enemy);
							}
			            }, 10000 / obj.userData.attacSpeed );
						enemySpotted = true;
					}else{
						if(enemy.userData.interval != null){
							clearInterval(enemy.userData.interval);
						}
					}
				}
				if(enemySpotted == false){
					eulerRotate(pos,obj);
				}
			}
			if(obj.name == "enemy"){
				var pos = obj.position;
				var tx = (Math.abs(pos.x) / (Math.abs(pos.x) + Math.abs(pos.y) + Math.abs(pos.z)));
				var ty = (Math.abs(pos.y) / (Math.abs(pos.x) + Math.abs(pos.y) + Math.abs(pos.z)));
				var tz = (Math.abs(pos.z) / (Math.abs(pos.x) + Math.abs(pos.y) + Math.abs(pos.z)));
				if(pos.x!=0){
					if(pos.x>0){
						obj.position.x -= 0.5 * tx; 
					}else{
						obj.position.x += 0.5 * tx;
					}
				}
				if(pos.y!=0){
					if(pos.y>0){
						obj.position.y -= 0.5 * ty;
					}else{
						obj.position.y += 0.5 * ty;
					}
				}
				if(pos.z!=0){
					if(pos.z>0){
						obj.position.z -= 0.5 * tz;
					}else{
						obj.position.z += 0.5 * tz;
					}
				}
				
				//Game Over Flag
				if(_planet.geometry.boundingSphere.intersectsSphere(new THREE.Sphere(obj.position,5))){
        			_scene.remove(obj);
        			_planet.userData.life--;
        			if(_planet.userData.life==0){
						document.getElementById("gameOver").style.display = "block";
        			    //clearInterval(_interval);
        			}
				}
				
			}
		}

		if(_planet.userData.life != 0){
			requestAnimationFrame( render );
		}
       	
       	if(_stats) _stats.update();
       	if(_controls) _controls.update();
       	 
        _renderer.render( _scene, _camera );
	}
	function fn_onWindowResize(){
	    _camera.aspect = window.innerWidth / window.innerHeight;
	    _camera.updateProjectionMatrix();

	    _renderer.setSize( window.innerWidth, window.innerHeight );
	}
	function key(target,obj){
		//render();
		defence.enemy.addEnemy();
	}
	
	function eulerRotate(pos, obj){
		let sp = 0.01;
		if(pos.x >= pos.y){
			if(pos.x>=pos.z){
				let target = ((Math.abs(pos.z) / Math.abs(pos.y)).toFixed(3));
				if(pos.z >0){
					target = -target;
				}
				if(pos.y < 0){
					target = -target;
				}
				let euler = new THREE.Euler(0, sp * target ,sp, 'XYZ' );
				obj.position = obj.position.applyEuler(euler);
			}else{
				let target = ((Math.abs(pos.z) / Math.abs(pos.y)).toFixed(3));
				if(pos.z >0){
					target = -target;
				}
				if(pos.y < 0){
					target = -target;
				}
				let euler = new THREE.Euler(0, sp * target ,sp, 'XYZ' );
				obj.position = obj.position.applyEuler(euler);
			}
		}else if(pos.y>=pos.z){
			let target = ((Math.abs(pos.x) / Math.abs(pos.z)).toFixed(3));
			if(pos.x >0){
				target = -target;
			}
			if(pos.z < 0){
				target = -target;
			}
			let euler = new THREE.Euler(sp, 0  ,sp* target, 'XYZ' );
			obj.position = obj.position.applyEuler(euler);
		}else{
			let target = ((Math.abs(pos.x) / Math.abs(pos.y)).toFixed(3));
			if(pos.x >0){
				target = -target;
			}
			if(pos.y < 0){
				target = -target;
			}
			let euler = new THREE.Euler(sp, sp * target ,0, 'XYZ' );
			obj.position = obj.position.applyEuler(euler);
		}
	}
	
	if ( !noGlobal ) {
		window.defence = defence;
	}

	return defence;
});
