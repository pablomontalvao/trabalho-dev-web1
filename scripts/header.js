async function fetchUsuarioSessao() {
	try {
		const response = await fetch('../php/verificar_sessao.php', { credentials: 'include' });
		const result = await response.json();
		if (result && result.status === 'success') {
			return result.usuario;
		}
	} catch (err) {
	}
	return null;
}

function buildRightNavForGuest() {
	return '<li class="nav-item">' +
		'<a class="nav-link px-5" href="loginpage.html">Cadastro/Login</a>' +
		'</li>';
}

function buildRightNavForUser(usuario) {
	var isAdm = false;
	if (usuario && usuario.funcao === 'adm') {
		isAdm = true;
	}

	var areaHref = 'areaCliente.html';
	var areaLabel = 'Área do Cliente';
	if (isAdm) {
		areaHref = 'areaAdm.html';
		areaLabel = 'Área do ADM';
	}

	var html = '';
	html += '<li class="nav-item">';
	html += '<a class="nav-link px-5" href="' + areaHref + '">' + areaLabel + '</a>';
	html += '</li>';
	html += '<li class="nav-item">';
	html += '<a class="nav-link px-3" href="perfil.html">Editar Perfil</a>';
	html += '</li>';

	if (isAdm) {
		html += '<li class="nav-item">';
		html += '<a class="nav-link px-3" href="cadastropage.html?admin=1">Cadastrar Usuário</a>';
		html += '</li>';
	}

	html += '<li class="nav-item">';
	html += '<button class="nav-link px-3 btn btn-link" id="logout-btn" style="border: none; background: none; color: inherit;">Logout</button>';
	html += '</li>';

	return html;
}

async function hydrateHeader() {
	var rightNav = document.getElementById('header-right');
	if (!rightNav) return;
	var usuario = await fetchUsuarioSessao();
	if (usuario) {
		rightNav.innerHTML = buildRightNavForUser(usuario);
	} else {
		rightNav.innerHTML = buildRightNavForGuest();
	}

	var logoutBtn = document.getElementById('logout-btn');
	if (logoutBtn) {
		logoutBtn.addEventListener('click', async function () {
			try {
				var response = await fetch('../php/logout.php', { credentials: 'include' });
				var result = await response.json();
				if (result && result.status === 'success') {
					window.location.href = result.redirect || 'inicial.html';
				}
			} catch (e) {
				window.location.href = 'loginpage.html';
			}
		});
	}
}

document.addEventListener('DOMContentLoaded', hydrateHeader);


