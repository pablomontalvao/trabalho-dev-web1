// Shared header behavior: toggles right-side links based on login session
async function fetchUsuarioSessao() {
	try {
		const response = await fetch('../php/verificar_sessao.php', { credentials: 'include' });
		const result = await response.json();
		if (result.status === 'success') {
			return result.usuario;
		}
		return null;
	} catch (err) {
		return null;
	}
}

function buildRightNavForGuest() {
	return `
		<li class="nav-item">
			<a class="nav-link px-5" href="loginpage.html">Cadastro/Login</a>
		</li>
	`;
}

function buildRightNavForUser(usuario) {
	const isAdm = usuario && usuario.funcao === 'adm';
	const areaHref = isAdm ? 'areaAdm.html' : 'areaCliente.html';
	const areaLabel = isAdm ? 'Área do ADM' : 'Área do Cliente';
	return `
		<li class="nav-item">
			<a class="nav-link px-5" href="${areaHref}">${areaLabel}</a>
		</li>
		<li class="nav-item">
			<a class="nav-link px-3" href="perfil.html">Editar Perfil</a>
		</li>
		${isAdm ? `
		<li class="nav-item">
			<a class="nav-link px-3" href="cadastropage.html?admin=1">Cadastrar Usuário</a>
		</li>
		` : ''}
		<li class="nav-item">
			<button class="nav-link px-3 btn btn-link" id="logout-btn" style="border: none; background: none; color: inherit;">Logout</button>
		</li>
	`;
}

async function hydrateHeader() {
	const rightNav = document.getElementById('header-right');
	if (!rightNav) return;
	const usuario = await fetchUsuarioSessao();
	rightNav.innerHTML = usuario ? buildRightNavForUser(usuario) : buildRightNavForGuest();
	const logoutBtn = document.getElementById('logout-btn');
	if (logoutBtn) {
		logoutBtn.addEventListener('click', async () => {
			try {
				const response = await fetch('../php/logout.php', { credentials: 'include' });
				const result = await response.json();
				if (result.status === 'success') {
					window.location.href = result.redirect || 'inicial.html';
				}
			} catch (e) {
				window.location.href = 'loginpage.html';
			}
		});
	}
}

document.addEventListener('DOMContentLoaded', hydrateHeader);


