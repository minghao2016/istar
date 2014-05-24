$(function() {

	// Initialize pager
	var pager = $('#pager');
	pager.pager('init', [ 'Description', 'Submitted on', 'Status', 'Result' ], function(job) {
		var status, progress, result = '<a href="iview/?' + job._id + '"><img src="/iview/logo.png" alt="iview"></a>';
		if (!job.scheduled) {
			status = 'Queued for execution';
		} else if (!job.done) {
			status = 'Execution in progress';
		} else {
			status = 'Done on ' + $.format.date(new Date(job.done), 'yyyy/MM/dd HH:mm:ss');
			result += '<a href="jobs/' + job._id + '/log.csv.gz"><img src="/excel.png" alt="log.csv.gz"></a><a href="jobs/' + job._id + '/ligands.pdbqt.gz"><img src="/molecule.png" alt="ligands.pdbqt.gz"></a>';
		}
		return [
			job.description,
			$.format.date(new Date(job.submitted), 'yyyy/MM/dd HH:mm:ss'),
			status,
			result
		];
	});

	var covalentRadii = { // http://en.wikipedia.org/wiki/Covalent_radius
		 H: 0.31,
		HE: 0.28,
		LI: 1.28,
		BE: 0.96,
		 B: 0.84,
		 C: 0.76,
		 N: 0.71,
		 O: 0.66,
		 F: 0.57,
		NE: 0.58,
		NA: 1.66,
		MG: 1.41,
		AL: 1.21,
		SI: 1.11,
		 P: 1.07,
		 S: 1.05,
		CL: 1.02,
		AR: 1.06,
		 K: 2.03,
		CA: 1.76,
		SC: 1.70,
		TI: 1.60,
		 V: 1.53,
		CR: 1.39,
		MN: 1.39,
		FE: 1.32,
		CO: 1.26,
		NI: 1.24,
		CU: 1.32,
		ZN: 1.22,
		GA: 1.22,
		GE: 1.20,
		AS: 1.19,
		SE: 1.20,
		BR: 1.20,
		KR: 1.16,
		RB: 2.20,
		SR: 1.95,
		 Y: 1.90,
		ZR: 1.75,
		NB: 1.64,
		MO: 1.54,
		TC: 1.47,
		RU: 1.46,
		RH: 1.42,
		PD: 1.39,
		AG: 1.45,
		CD: 1.44,
		IN: 1.42,
		SN: 1.39,
		SB: 1.39,
		TE: 1.38,
		 I: 1.39,
		XE: 1.40,
		CS: 2.44,
		BA: 2.15,
		LA: 2.07,
		CE: 2.04,
		PR: 2.03,
		ND: 2.01,
		PM: 1.99,
		SM: 1.98,
		EU: 1.98,
		GD: 1.96,
		TB: 1.94,
		DY: 1.92,
		HO: 1.92,
		ER: 1.89,
		TM: 1.90,
		YB: 1.87,
		LU: 1.87,
		HF: 1.75,
		TA: 1.70,
		 W: 1.62,
		RE: 1.51,
		OS: 1.44,
		IR: 1.41,
		PT: 1.36,
		AU: 1.36,
		HG: 1.32,
		TL: 1.45,
		PB: 1.46,
		BI: 1.48,
		PO: 1.40,
		AT: 1.50,
		RN: 1.50,
		FR: 2.60,
		RA: 2.21,
		AC: 2.15,
		TH: 2.06,
		PA: 2.00,
		 U: 1.96,
		NP: 1.90,
		PU: 1.87,
		AM: 1.80,
		CM: 1.69,
	};
	var atomColors = { // http://jmol.sourceforge.net/jscolors
		 H: new THREE.Color(0xFFFFFF),
		HE: new THREE.Color(0xD9FFFF),
		LI: new THREE.Color(0xCC80FF),
		BE: new THREE.Color(0xC2FF00),
		 B: new THREE.Color(0xFFB5B5),
		 C: new THREE.Color(0x909090),
		 N: new THREE.Color(0x3050F8),
		 O: new THREE.Color(0xFF0D0D),
		 F: new THREE.Color(0x90E050),
		NE: new THREE.Color(0xB3E3F5),
		NA: new THREE.Color(0xAB5CF2),
		MG: new THREE.Color(0x8AFF00),
		AL: new THREE.Color(0xBFA6A6),
		SI: new THREE.Color(0xF0C8A0),
		 P: new THREE.Color(0xFF8000),
		 S: new THREE.Color(0xFFFF30),
		CL: new THREE.Color(0x1FF01F),
		AR: new THREE.Color(0x80D1E3),
		 K: new THREE.Color(0x8F40D4),
		CA: new THREE.Color(0x3DFF00),
		SC: new THREE.Color(0xE6E6E6),
		TI: new THREE.Color(0xBFC2C7),
		 V: new THREE.Color(0xA6A6AB),
		CR: new THREE.Color(0x8A99C7),
		MN: new THREE.Color(0x9C7AC7),
		FE: new THREE.Color(0xE06633),
		CO: new THREE.Color(0xF090A0),
		NI: new THREE.Color(0x50D050),
		CU: new THREE.Color(0xC88033),
		ZN: new THREE.Color(0x7D80B0),
		GA: new THREE.Color(0xC28F8F),
		GE: new THREE.Color(0x668F8F),
		AS: new THREE.Color(0xBD80E3),
		SE: new THREE.Color(0xFFA100),
		BR: new THREE.Color(0xA62929),
		KR: new THREE.Color(0x5CB8D1),
		RB: new THREE.Color(0x702EB0),
		SR: new THREE.Color(0x00FF00),
		 Y: new THREE.Color(0x94FFFF),
		ZR: new THREE.Color(0x94E0E0),
		NB: new THREE.Color(0x73C2C9),
		MO: new THREE.Color(0x54B5B5),
		TC: new THREE.Color(0x3B9E9E),
		RU: new THREE.Color(0x248F8F),
		RH: new THREE.Color(0x0A7D8C),
		PD: new THREE.Color(0x006985),
		AG: new THREE.Color(0xC0C0C0),
		CD: new THREE.Color(0xFFD98F),
		IN: new THREE.Color(0xA67573),
		SN: new THREE.Color(0x668080),
		SB: new THREE.Color(0x9E63B5),
		TE: new THREE.Color(0xD47A00),
		 I: new THREE.Color(0x940094),
		XE: new THREE.Color(0x429EB0),
		CS: new THREE.Color(0x57178F),
		BA: new THREE.Color(0x00C900),
		LA: new THREE.Color(0x70D4FF),
		CE: new THREE.Color(0xFFFFC7),
		PR: new THREE.Color(0xD9FFC7),
		ND: new THREE.Color(0xC7FFC7),
		PM: new THREE.Color(0xA3FFC7),
		SM: new THREE.Color(0x8FFFC7),
		EU: new THREE.Color(0x61FFC7),
		GD: new THREE.Color(0x45FFC7),
		TB: new THREE.Color(0x30FFC7),
		DY: new THREE.Color(0x1FFFC7),
		HO: new THREE.Color(0x00FF9C),
		ER: new THREE.Color(0x00E675),
		TM: new THREE.Color(0x00D452),
		YB: new THREE.Color(0x00BF38),
		LU: new THREE.Color(0x00AB24),
		HF: new THREE.Color(0x4DC2FF),
		TA: new THREE.Color(0x4DA6FF),
		 W: new THREE.Color(0x2194D6),
		RE: new THREE.Color(0x267DAB),
		OS: new THREE.Color(0x266696),
		IR: new THREE.Color(0x175487),
		PT: new THREE.Color(0xD0D0E0),
		AU: new THREE.Color(0xFFD123),
		HG: new THREE.Color(0xB8B8D0),
		TL: new THREE.Color(0xA6544D),
		PB: new THREE.Color(0x575961),
		BI: new THREE.Color(0x9E4FB5),
		PO: new THREE.Color(0xAB5C00),
		AT: new THREE.Color(0x754F45),
		RN: new THREE.Color(0x428296),
		FR: new THREE.Color(0x420066),
		RA: new THREE.Color(0x007D00),
		AC: new THREE.Color(0x70ABFA),
		TH: new THREE.Color(0x00BAFF),
		PA: new THREE.Color(0x00A1FF),
		 U: new THREE.Color(0x008FFF),
		NP: new THREE.Color(0x0080FF),
		PU: new THREE.Color(0x006BFF),
		AM: new THREE.Color(0x545CF2),
		CM: new THREE.Color(0x785CE3),
		BK: new THREE.Color(0x8A4FE3),
		CF: new THREE.Color(0xA136D4),
		ES: new THREE.Color(0xB31FD4),
		FM: new THREE.Color(0xB31FBA),
	};
	var defaultAtomColor = new THREE.Color(0xCCCCCC);
	var defaultBackgroundColor = new THREE.Color(0x000000);
	var sphereGeometry = new THREE.SphereGeometry(1, 64, 64);
	var cylinderGeometry = new THREE.CylinderGeometry(1, 1, 1, 64, 1);
	var cylinderRadius = 0.3;
	var linewidth = 2;
	var pdbqt2pdb = {
		HD: 'H',
		A : 'C',
		NA: 'N',
		OA: 'O',
		SA: 'S',
	};

	var canvas = $('canvas');
	canvas.widthInv  = 1 / canvas.width();
	canvas.heightInv = 1 / canvas.height();
	var renderer = new THREE.WebGLRenderer({
		canvas: canvas.get(0),
		antialias: true,
	});
	renderer.setSize(canvas.width(), canvas.height());
	renderer.setClearColor(defaultBackgroundColor);
	var scene = new THREE.Scene();
	var directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1.2);
	directionalLight.position = new THREE.Vector3(0.2, 0.2, -1).normalize();
	var ambientLight = new THREE.AmbientLight(0x202020);
	var rot = new THREE.Object3D(), mdl = new THREE.Object3D();
	scene.add(directionalLight);
	scene.add(ambientLight);
	scene.add(rot);
	scene.fog = new THREE.Fog(defaultBackgroundColor, 100, 200);
	var camera = new THREE.PerspectiveCamera(20, canvas.width() / canvas.height(), 1, 800), sn, sf;
	camera.position = new THREE.Vector3(0, 0, -150);
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	var hasCovalentBond = function (atom0, atom1) {
		var r = covalentRadii[atom0.elem] + covalentRadii[atom1.elem];
		return atom0.coord.distanceToSquared(atom1.coord) < 1.3 * r * r;
	};
	var createSphere = function (atom, defaultRadius) {
		var mesh = new THREE.Mesh(sphereGeometry, new THREE.MeshLambertMaterial({ color: atom.color }));
		mesh.scale.x = mesh.scale.y = mesh.scale.z = defaultRadius;
		mesh.position = atom.coord;
		return mesh;
	};
	var createCylinder = function (p0, p1, radius, color) {
		var mesh = new THREE.Mesh(cylinderGeometry, new THREE.MeshLambertMaterial({ color: color }));
		mesh.position = p0.clone().add(p1).multiplyScalar(0.5);
		mesh.matrixAutoUpdate = false;
		mesh.lookAt(p0);
		mesh.updateMatrix();
		mesh.matrix.multiply(new THREE.Matrix4().makeScale(radius, radius, p0.distanceTo(p1))).multiply(new THREE.Matrix4().makeRotationX(Math.PI * 0.5));
		return mesh;
	};
	var createRepresentationSub = function (atoms, f0, f01) {
		for (var i in atoms) {
			var atom0 = atoms[i];
			f0(atom0);
			for (var j in atom0.bonds) {
				var atom1 = atom0.bonds[j];
				if (atom1.serial < atom0.serial) continue;
				f01(atom0, atom1);
			}
		}
	};
	var createStickRepresentation = function (atoms, atomR, bondR) {
		var obj = new THREE.Object3D();
		obj.add(createRepresentationSub(atoms, function (atom0) {
			obj.add(createSphere(atom0, atomR, true));
		}, function (atom0, atom1) {
			if (atom0.color === atom1.color) {
				obj.add(createCylinder(atom0.coord, atom1.coord, bondR, atom0.color));
			} else {
				var mp = atom0.coord.clone().add(atom1.coord).multiplyScalar(0.5);
				obj.add(createCylinder(atom0.coord, mp, bondR, atom0.color));
				obj.add(createCylinder(atom1.coord, mp, bondR, atom1.color));
			}
		}));
		return obj;
	};
	var render = function () {
		var center = rot.position.z - camera.position.z;
		if (center < 1) center = 1;
		camera.near = center + sn;
		if (camera.near < 1) camera.near = 1;
		camera.far = center + sf;
		if (camera.near + 1 > camera.far) camera.far = camera.near + 1;
		camera.updateProjectionMatrix();
		scene.fog.near = camera.near + 0.4 * (camera.far - camera.near);
		scene.fog.far = camera.far;
		renderer.render(scene, camera);
	};
	var moments = function (dists, n, v) {
		var m = new Float32Array(3);
		for (var i = 0; i < n; ++i) {
			var d = dists[i];
			m[0] += d;
		}
		m[0] *= v;
		for (var i = 0; i < n; ++i) {
			var d = dists[i] - m[0];
			m[1] += d * d;
		}
		m[1] = Math.sqrt(m[1] * v);
		for (var i = 0; i < n; ++i) {
			var d = dists[i] - m[0];
			m[2] += d * d * d;
		}
		var sign = (m[2] > 0) - (m[2] < 0);
		m[2] = sign * Math.pow(sign * m[2] * v, 1 / 3);
		return m;
	};

	// Load ligand locally
	$('input[type="file"]').change(function() {
		var file = this.files[0];
		if (file === undefined) return;
		var reader = new FileReader();
		reader.onload = function () {
			rot.remove(mdl);
			rot.add(mdl = new THREE.Object3D());
			var lines = reader.result.split('\n'), atoms = {}, start_frame, rotors = [];
			for (var i = 0, l = lines.length; i < l; ++i) {
				var line = lines[i];
				var record = line.substr(0, 6);
				if (record === 'ATOM  ' || record === 'HETATM') {
					var atom = {
						serial: parseInt(line.substr(6, 5)),
						name: line.substr(12, 4).replace(/ /g, ''),
						coord: new THREE.Vector3(parseFloat(line.substr(30, 8)), parseFloat(line.substr(38, 8)), parseFloat(line.substr(46, 8))),
						elqt: line.substr(77, 2),
						elem: line.substr(77, 2).replace(/ /g, '').toUpperCase(),
						bonds: [],
					};
					var elem = pdbqt2pdb[atom.elem];
					if (elem) atom.elem = elem;
					if (atom.elem === 'H') continue;
					atom.color = atomColors[atom.elem] || defaultAtomColor;
					atoms[atom.serial] = atom;
					if (start_frame === undefined) start_frame = atom.serial;
					for (var j = start_frame; j < atom.serial; ++j) {
						var a = atoms[j];
						if (a && hasCovalentBond(a, atom)) {
							a.bonds.push(atom);
							atom.bonds.push(a);
						}
					}
				} else if (record === 'BRANCH') {
					rotors.push({
						x: parseInt(line.substr( 6, 4)),
						y: parseInt(line.substr(10, 4)),
					});
					start_frame = undefined;
				} else if (record === 'TORSDO') {
					for (var j in rotors) {
						var r = rotors[j];
						atoms[r.x].bonds.push(atoms[r.y]);
						atoms[r.y].bonds.push(atoms[r.x]);
					}
				}
			}
			var lmin = new THREE.Vector3( 9999, 9999, 9999);
			var lmax = new THREE.Vector3(-9999,-9999,-9999);
			var lsum = new THREE.Vector3();
			var lcnt = 0;
			for (var i in atoms) {
				var atom = atoms[i];
				var coord = atom.coord;
				lsum.add(coord);
				lmin.min(coord);
				lmax.max(coord);
				++lcnt;
			}
			var lcnv = 1 / lcnt;
			var lavg = lsum.clone().multiplyScalar(lcnv);
			var maxD = lmax.distanceTo(lmin);
			sn = -maxD;
			sf =  maxD;
			rot.position.z = maxD * 0.35 / Math.tan(Math.PI / 180.0 * 10) - 140;
			rot.quaternion = new THREE.Quaternion(1, 0, 0, 0);
			mdl.position = lavg.clone().multiplyScalar(-1);
			mdl.add(createStickRepresentation(atoms, cylinderRadius, cylinderRadius));
			render();
			var ctd = lavg, cst, fct, ftf, cst_dist = 9999, fct_dist = -9999, ftf_dist = -9999;
			for (var i in atoms) {
				var atom = atoms[i];
				var this_dist = atom.coord.distanceToSquared(ctd);
				if (this_dist < cst_dist) {
					cst = atom.coord;
					cst_dist = this_dist;
				}
				if (this_dist > fct_dist) {
					fct = atom.coord;
					fct_dist = this_dist;
				}
			}
			for (var i in atoms) {
				var atom = atoms[i];
				var this_dist = atom.coord.distanceToSquared(fct);
				if (this_dist > ftf_dist) {
					ftf = atom.coord;
					ftf_dist = this_dist;
				}
			}
			[ ctd, cst, fct, ftf ].forEach(function (rpt) {
				var dists = new Float32Array(lcnt), o = 0;
				for (var i in atoms) {
					var atom = atoms[i];
					dists[o++] = atom.coord.distanceTo(rpt);
				}
				var m = moments(dists, lcnt, lcnv);
				console.log(m);
			});
		};
		reader.readAsText(file);
	});
	var dg, wh, cx, cy, cq, cz, cp, cn, cf;
	canvas.bind('contextmenu', function (e) {
		e.preventDefault();
	});
	canvas.bind('mouseup touchend', function (e) {
		dg = false;
	});
	canvas.bind('mousedown touchstart', function (e) {
		e.preventDefault();
		var x = e.pageX;
		var y = e.pageY;
		if (e.originalEvent.targetTouches && e.originalEvent.targetTouches[0]) {
			x = e.originalEvent.targetTouches[0].pageX;
			y = e.originalEvent.targetTouches[0].pageY;
		}
		dg = true;
		wh = e.which;
		cx = x;
		cy = y;
		cq = rot.quaternion.clone();
		cz = rot.position.z;
		cp = mdl.position.clone();
		cn = sn;
		cf = sf;
	});
	canvas.bind('mousemove touchmove', function (e) {
		e.preventDefault();
		if (!dg) return;
		var x = e.pageX;
		var y = e.pageY;
		if (e.originalEvent.targetTouches && e.originalEvent.targetTouches[0]) {
			x = e.originalEvent.targetTouches[0].pageX;
			y = e.originalEvent.targetTouches[0].pageY;
		}
		var dx = (x - cx) * canvas.widthInv;
		var dy = (y - cy) * canvas.heightInv;
		if (!dx && !dy) return;
		if (e.ctrlKey && e.shiftKey) { // Slab
			sn = cn + dx * 100;
			sf = cf + dy * 100;
		} else if (e.ctrlKey || wh == 3) { // Translate
			var scaleFactor = Math.max((rot.position.z - camera.position.z) * 0.85, 20);
			mdl.position = cp.clone().add(new THREE.Vector3(-dx * scaleFactor, -dy * scaleFactor, 0).applyQuaternion(rot.quaternion.clone().inverse().normalize()));
		} else if (e.shiftKey || wh == 2) { // Zoom
			var scaleFactor = Math.max((rot.position.z - camera.position.z) * 0.85, 80);
			rot.position.z = cz - dy * scaleFactor;
		} else { // Rotate
			var r = Math.sqrt(dx * dx + dy * dy);
			var rs = Math.sin(r * Math.PI) / r;
			rot.quaternion.copy(new THREE.Quaternion(1, 0, 0, 0).multiply(new THREE.Quaternion(Math.cos(r * Math.PI), 0, rs * dx, rs * dy)).multiply(cq));
		}
		render();
	});
	canvas.bind('mousewheel', function (e) {
		e.preventDefault();
		var scaleFactor = (rot.position.z - camera.position.z) * 0.85;
		rot.position.z -= scaleFactor * e.originalEvent.wheelDelta * 0.0025;
		render();
	});
	canvas.bind('DOMMouseScroll', function (e) {
		e.preventDefault();
		var scaleFactor = (rot.position.z - camera.position.z) * 0.85;
		rot.position.z += scaleFactor * e.originalEvent.detail * 0.1;
		render();
	});

	// Initialize tooltips
	$('.form-group a').tooltip();

	// Process submission
	var submissionStatus = $('#submissionStatus');
	var submit = $('#submit');
	submit.click(function() {
		// Hide tooltips
		$('.form-group a').tooltip('hide');
		// Disable the submit button for a while
		submit.prop('disabled', true);
		submissionStatus.show();
		// Post a new job with server side validation
		$.post('jobs', {
		}, function(res) {
			submissionStatus.hide();
			var keys = Object.keys(res);
			// If server side validation fails, show the tooltips
			if (keys.length) {
				keys.forEach(function(key) {
					$('#' + key + '_label').tooltip('show');
				});
			} else {
				$('html, body').animate({ scrollTop: pager.offset().top });
			}
		}, 'json').always(function() {
			submit.prop('disabled', false);
		});
	});

	// Apply accordion to tutorials
	$('.ui-accordion').accordion({
		collapsible: true,
		active: false,
		heightStyle: 'content',
		activate: function(event, ui) {
			$('img', this).trigger('expand');
		}
	});
	$('.ui-accordion img').lazyload({
		event: 'expand',
		effect: 'fadeIn',
	});
});
