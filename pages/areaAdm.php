<!DOCTYPE html>
<html lang="pt-BR">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Área do Administrador</title>
  <link rel="stylesheet" href="../css/areaAdm.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-LN+7fdVzj6u52u30Kp6M/trliBMCMKTyK833zpbD+pXdCLuTusPj697FH4R/5mcr" crossorigin="anonymous">
  <script src="https://code.jquery.com/jquery-3.7.1.js" integrity="sha256-eKhayi8LEQwp4NKxN+CfCh+3qOVUtJn3QNZ0TciWLP4="
    crossorigin="anonymous"></script>

</head>

<body>
  <div class="header">
    <nav class="navbar navbar-expand-lg navbar-custom p-2">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <img src="../imagem/logobranca.png" alt="Logo RAU" class="logo-img">
        </a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuNavbar"
          aria-controls="menuNavbar" aria-expanded="false" aria-label="Alternar navegação">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="menuNavbar">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link px-5" href="inicial.php">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link px-3" href="sobre.php">Sobre Nós</a>
            </li>
          </ul>
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link px-5" href="loginpage.php">Cadastro/Login</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>

  <main class="page">
    <section class="section">
      <div class="container">
        <h1 class="section__title">Reclamações recebidas:</h1>

        <div class="filters" role="region" aria-label="Filtros">

          <div class="filters__row">
            <div class="filters__title-container">
              <h3 class="filters__title">Filtros</h3>
              <div class="filters__divider"></div>
            </div>

            <div class="field">
              <label for="f-status">Status:</label>
              <select id="f-status">
                <option value="">Todos</option>
                <option value="recebido">Recebido</option>
                <option value="andamento">Em andamento</option>
                <option value="resolvido">Resolvido</option>
              </select>
            </div>

            <div class="field field--wide">
              <label for="f-endereco">Endereço:</label>
              <input id="f-endereco" type="text" />
            </div>

            <div class="field">
              <label for="f-tipo">Tipo:</label>
              <select id="f-tipo">
                <option value="">Todos</option>
                <option>Falta de água</option>
                <option>Água suja/com cheiro</option>
                <option>Vazamento de água limpa</option>
                <option>Vazamento de esgoto</option>
                <option>Despejo irregular</option>
                <option>Outros</option>
              </select>
            </div>


            <div class="field field--dates">
              <label>Data:</label>
              <div class="date-range">
                <div class="date-input-wrapper">
                  <input type="date" id="f-data-inicio" aria-label="Data início" />
                </div>
                <div class="date-input-wrapper">
                  <input type="date" id="f-data-fim" aria-label="Data fim" />
                </div>
              </div>
            </div>

            <button id="clear-filters-btn" class="btn btn--ghost" type="button">Limpar Filtros</button>
          </div>

          <ul class="cards" id="claims-list" aria-live="polite">
            <li class="card" data-id="1" data-status="recebido" data-tipo="Iluminação"
              data-endereco="Rua das Flores, 123 - Centro" data-data="12/08/2025" data-hora="14:30"
              data-descricao="Poste sem iluminação em frente ao número 123." data-numero="123"
              data-complemento="Centro">
              <div class="card__status">
                <span class="status__label">Status</span>
                <img class="status__icon" src="../imagem/checkRecebido.png" alt="Recebido" />
                <span class="status__text status--recebido">Recebido</span>
              </div>
              <div class="card__body">
                <div class="card__grid">
                  <div class="card__col"><span class="label">Tipo:</span><span class="value">Iluminação</span></div>
                  <div class="card__col"><span class="label">Endereço:</span><span class="value">Rua das Flores, 123 -
                      Centro</span></div>
                  <div class="card__col"><span class="label">Data:</span><span class="value">12/08/2025</span></div>
                  <div class="card__col"><span class="label">Hora:</span><span class="value">14:30</span></div>
                  <div class="card__col card__col--full"><span class="label">Descrição:</span><span class="value">Poste
                      sem iluminação em frente ao número 123.</span></div>
                </div>
                <div class="card__actions">
                  <button class="btn btn--primary btn--small" onclick="viewDetails(1)">Ver Detalhes</button>
                  <button class="btn btn--secondary btn--small" onclick="updateStatus(1)">Atualizar Status</button>
                </div>
              </div>
            </li>

            <li class="card" data-id="2" data-status="andamento" data-tipo="Lixo"
              data-endereco="Av. Brasil, 456 - Jardim" data-data="10/08/2025" data-hora="09:15"
              data-descricao="Acúmulo de lixo não recolhido há três dias." data-numero="456" data-complemento="Jardim">
              <div class="card__status">
                <span class="status__label">Status</span>
                <img class="status__icon" src="../imagem/checkEmAndamento.png" alt="Em andamento" />
                <span class="status__text status--andamento">Em andamento</span>
              </div>
              <div class="card__body">
                <div class="card__grid">
                  <div class="card__col"><span class="label">Tipo:</span><span class="value">Lixo</span></div>
                  <div class="card__col"><span class="label">Endereço:</span><span class="value">Av. Brasil, 456 -
                      Jardim</span></div>
                  <div class="card__col"><span class="label">Data:</span><span class="value">10/08/2025</span></div>
                  <div class="card__col"><span class="label">Hora:</span><span class="value">09:15</span></div>
                  <div class="card__col card__col--full"><span class="label">Descrição:</span><span
                      class="value">Acúmulo de lixo não recolhido há três dias.</span></div>
                </div>
                <div class="card__actions">
                  <button class="btn btn--primary btn--small" onclick="viewDetails(2)">Ver Detalhes</button>
                  <button class="btn btn--secondary btn--small" onclick="updateStatus(2)">Atualizar Status</button>
                </div>
              </div>
            </li>

            <li class="card" data-id="3" data-status="resolvido" data-tipo="Buraco na via"
              data-endereco="Rua A, 789 - Industrial" data-data="03/08/2025" data-hora="16:45"
              data-descricao="Buraco grande próximo à esquina, já tapado." data-numero="789"
              data-complemento="Industrial">
              <div class="card__status">
                <span class="status__label">Status</span>
                <img class="status__icon" src="../imagem/checkResolvido.png" alt="Resolvido" />
                <span class="status__text status--resolvido">Resolvido</span>
              </div>
              <div class="card__body">
                <div class="card__grid">
                  <div class="card__col"><span class="label">Tipo:</span><span class="value">Buraco na via</span></div>
                  <div class="card__col"><span class="label">Endereço:</span><span class="value">Rua A, 789 -
                      Industrial</span></div>
                  <div class="card__col"><span class="label">Data:</span><span class="value">03/08/2025</span></div>
                  <div class="card__col"><span class="label">Hora:</span><span class="value">16:45</span></div>
                  <div class="card__col card__col--full"><span class="label">Descrição:</span><span class="value">Buraco
                      grande próximo à esquina, já tapado.</span></div>
                </div>
                <div class="card__actions">
                  <button class="btn btn--primary btn--small" onclick="viewDetails(3)">Ver Detalhes</button>
                  <button class="btn btn--secondary btn--small" onclick="updateStatus(3)">Atualizar Status</button>
                </div>
              </div>
            </li>

            <li class="card" data-id="4" data-status="andamento" data-tipo="Água/Esgoto"
              data-endereco="Rua B, 55 - Centro" data-data="01/08/2025" data-hora="11:20"
              data-descricao="Vazamento visível próximo à calçada." data-numero="55" data-complemento="Centro">
              <div class="card__status">
                <span class="status__label">Status</span>
                <img class="status__icon" src="../imagem/checkEmAndamento.png" alt="Em andamento" />
                <span class="status__text status--andamento">Em andamento</span>
              </div>
              <div class="card__body">
                <div class="card__grid">
                  <div class="card__col"><span class="label">Tipo:</span><span class="value">Água/Esgoto</span></div>
                  <div class="card__col"><span class="label">Endereço:</span><span class="value">Rua B, 55 -
                      Centro</span></div>
                  <div class="card__col"><span class="label">Data:</span><span class="value">01/08/2025</span></div>
                  <div class="card__col"><span class="label">Hora:</span><span class="value">11:20</span></div>
                  <div class="card__col card__col--full"><span class="label">Descrição:</span><span
                      class="value">Vazamento visível próximo à calçada.</span></div>
                </div>
                <div class="card__actions">
                  <button class="btn btn--primary btn--small" onclick="viewDetails(4)">Ver Detalhes</button>
                  <button class="btn btn--secondary btn--small" onclick="updateStatus(4)">Atualizar Status</button>
                </div>
              </div>
            </li>
          </ul>
          <p id="no-results-message" class="no-results" style="display: none;">Nenhuma reclamação encontrada com os
            filtros aplicados.</p>
        </div>
      </div>
    </section>
  </main>

  <div id="details-modal" class="modal">
    <div class="modal__content">
      <div class="modal__header">
        <h2 id="modal-title">Detalhes da Reclamação</h2>
        <button class="modal__close" onclick="closeModal()">&times;</button>
      </div>
      <div class="modal__body" id="modal-body">
      </div>
    </div>
  </div>

  <div id="status-modal" class="modal">
    <div class="modal__content">
      <div class="modal__header">
        <h2>Atualizar Status</h2>
        <button class="modal__close" onclick="closeStatusModal()">&times;</button>
      </div>
      <div class="modal__body">
        <form id="status-form">
          <div class="field">
            <label for="new-status">Novo Status:</label>
            <select id="new-status" name="new-status" required>
              <option value="recebido">Recebido</option>
              <option value="andamento">Em andamento</option>
              <option value="resolvido">Resolvido</option>
            </select>
          </div>
          <div class="field">
            <label for="status-notes">Observações (opcional):</label>
            <textarea id="status-notes" name="status-notes" rows="3"
              placeholder="Adicione observações sobre a mudança de status..."></textarea>
          </div>
          <div class="form__actions">
            <button type="button" class="btn btn--ghost" onclick="closeStatusModal()">Cancelar</button>
            <button type="submit" class="btn btn--primary">Atualizar</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <footer class="custom-footer text-center py-3 mt-auto w-100">
    <p>&copy; “Trabalho final DWEB – Grupo RAU"</p>
  </footer>

  <script src="../scripts/areaAdm.js"></script>
</body>

</html>