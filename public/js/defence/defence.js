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
            
			document.body.appendChild(_renderer.domElement);
            document.body.appendChild(_stats.domElement);

            //life Setting
            defence.planet.init(10);
            
            //addSatellite
            defence.satellite.addSatellite();
            
            defence.enemy.addEnemy();
			var _interval = setInterval(function(){ 
	            //addEnemy
	            //defence.enemy.addEnemy();
            }, 5000);

            //render started
            render();
            
            window.addEventListener('keydown', function(event){ key(); });
            window.addEventListener('resize', fn_onWindowResize, false );					//window resize event
		},
		tools : {
			renderer : function(){
				_renderer.setClearColor(0x000000, 1.0);
				_renderer.setSize(window.innerWidth, window.innerHeight);
			},
			scene : function(){
				_scene.userData = {pivot:[]};
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
				satellite.position.x = Math.round(Math.random() * 300)- 150 ;
				satellite.position.y = Math.round(Math.random() * 300)- 150 ;
				satellite.position.z = Math.round(Math.random() * 300)- 150 ;
				satellite.userData = {attackSpeed : 10, attackPoint:5, speed:2};
				satellite.name = "satellite";

				var pivot = new THREE.Object3D();
				_planet.add( pivot );
				pivot.add( satellite );
				_scene.userData.pivot.push(pivot);
				//_scene.add(satellite);
				/*satellite = new THREE.Mesh(
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
				_scene.add(satellite);*/
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
				enemy.userData = {hp:100};
				enemy.name = "enemy";
				_scene.add(enemy);
			}
		}
	};
	
	function render(){
		//x:red y:green z:blue.
		for(let obj of _scene.children){
			if(obj.name == "enemy"){
				obj.updateMatrixWorld();
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
				obj.updateMatrixWorld();
				_planet.geometry.computeBoundingSphere();
				if(_planet.geometry.boundingSphere.intersectsSphere(new THREE.Sphere(obj.position,5))){
        			_scene.remove(obj);
        			_planet.userData.life--;
        			if(_planet.userData.life==0){
						document.getElementById("gameOver").style.display = "block";
        			    clearInterval(_interval);
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
	function key(){
		defence.satellite.addSatellite();
	}
	if ( !noGlobal ) {
		window.defence = defence;
	}

	return defence;
});
