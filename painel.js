document.addEventListener('DOMContentLoaded', () => {
  const senhaCorreta = "12345"; // Trocar para uma senha que ela prefira.

  const loginSection = document.getElementById('login-section');
  const dashboard = document.getElementById('dashboard');
  const senhaInput = document.getElementById('senha-input');
  const btnLogin = document.getElementById('btn-login');
  const loginMessage = document.getElementById('login-message');

  // Dados locais para produtos, agendamentos e estoque 
  let produtos = JSON.parse(localStorage.getItem('produtos')) || [
    { id: 1, nome: 'Cesta artesanal', preco: 40, estoque: 10 },
    { id: 2, nome: 'Vela aromática', preco: 25, estoque: 15 },
    { id: 3, nome: 'Caixa artesanal', preco: 35, estoque: 8 },
    { id: 4, nome: 'Sabonete artesanal', preco: 15, estoque: 20 },
  ];

  let agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];

  function saveProdutos() {
    localStorage.setItem('produtos', JSON.stringify(produtos));
  }

  function saveAgendamentos() {
    localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
  }

  // Login simples
  btnLogin.addEventListener('click', () => {
    if (senhaInput.value === senhaCorreta) {
      loginSection.style.display = 'none';
      dashboard.style.display = 'block';
      loginMessage.textContent = '';
      renderProdutos();
      renderAgendamentos();
      renderEstoque();
    } else {
      loginMessage.textContent = 'Senha incorreta.';
    }
  });

  // Tabs
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => (c.style.display = 'none'));

      btn.classList.add('active');
      const tabId = btn.getAttribute('data-tab');
      document.getElementById(tabId + '-tab').style.display = 'block';
    });
  });

  // Gerenciar produtos

  const formAddProduto = document.getElementById('form-add-produto');
  const listaProdutos = document.getElementById('lista-produtos');

  formAddProduto.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('produto-nome').value.trim();
    const preco = parseFloat(document.getElementById('produto-preco').value);

    if (!nome || isNaN(preco) || preco < 0) {
      alert('Preencha os dados corretamente.');
      return;
    }

    const novoProduto = {
      id: produtos.length > 0 ? produtos[produtos.length - 1].id + 1 : 1,
      nome,
      preco,
      estoque: 0
    };

    produtos.push(novoProduto);
    saveProdutos();
    renderProdutos();

    formAddProduto.reset();
  });

  function renderProdutos() {
    if (produtos.length === 0) {
      listaProdutos.innerHTML = '<p>Não há produtos cadastrados.</p>';
      return;
    }

    listaProdutos.innerHTML = '';
    produtos.forEach(prod => {
      const prodDiv = document.createElement('div');
      prodDiv.className = 'produto-item';
      prodDiv.innerHTML = `
        <strong>${prod.nome}</strong> - R$ ${prod.preco.toFixed(2)} <br/>
        Estoque: ${prod.estoque} <br/>
        <button class="edit-prod" data-id="${prod.id}">Editar</button>
        <button class="remove-prod" data-id="${prod.id}">Remover</button>
      `;

      listaProdutos.appendChild(prodDiv);
    });

    // Eventos dos botões
    document.querySelectorAll('.edit-prod').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'));
        editarProduto(id);
      });
    });

    document.querySelectorAll('.remove-prod').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'));
        removerProduto(id);
      });
    });
  }

  function editarProduto(id) {
    const prod = produtos.find(p => p.id === id);
    if (!prod) return;

    const novoNome = prompt('Novo nome:', prod.nome);
    if (novoNome === null) return; // cancelou
    const novoPrecoStr = prompt('Novo preço:', prod.preco);
    if (novoPrecoStr === null) return;

    const novoPreco = parseFloat(novoPrecoStr);
    if (isNaN(novoPreco) || novoPreco < 0) {
      alert('Preço inválido.');
      return;
    }

    prod.nome = novoNome.trim();
    prod.preco = novoPreco;
    saveProdutos();
    renderProdutos();
  }

  function removerProduto(id) {
    if (!confirm('Tem certeza que deseja remover este produto?')) return;
    produtos = produtos.filter(p => p.id !== id);
    saveProdutos();
    renderProdutos();
  }

  // Agendamentos
  const listaAgendamentos = document.getElementById('lista-agendamentos');
function renderAgendamentos() {
  if (agendamentos.length === 0) {
    listaAgendamentos.innerHTML = '<p>Não há agendamentos para mostrar.</p>';
    return;
  }

  listaAgendamentos.innerHTML = '';

  agendamentos.forEach((agendamento, index) => {
    const agDiv = document.createElement('div');
    agDiv.className = 'agendamento-item';
    agDiv.innerHTML = `
      <p><strong>Nome:</strong> ${agendamento.nome}</p>
      <p><strong>Data:</strong> ${agendamento.data}</p>
      <p><strong>Endereço:</strong> ${agendamento.endereco || '-'}</p>
      <p><strong>Produto desejado para entrega:</strong> ${agendamento.produto || '-'}</p>
      <p><strong>Observações:</strong> ${agendamento.obs || '-'}</p>
      <button class="remove-ag" data-index="${index}">Remover</button>
    `;
    listaAgendamentos.appendChild(agDiv);
  });

  // Botão remover agendamento
  document.querySelectorAll('.remove-ag').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'));
      if (confirm('Remover este agendamento?')) {
        agendamentos.splice(idx, 1);
        saveAgendamentos();
        renderAgendamentos();
      }
    });
  });
}


  // Estoque
  const estoqueLista = document.getElementById('estoque-lista');

  function renderEstoque() {
    if (produtos.length === 0) {
      estoqueLista.innerHTML = '<p>Sem produtos para estoque.</p>';
      return;
    }

    estoqueLista.innerHTML = '';

    produtos.forEach(prod => {
      const estDiv = document.createElement('div');
      estDiv.className = 'estoque-item';
      estDiv.innerHTML = `
        <strong>${prod.nome}</strong> - Estoque atual: ${prod.estoque} <br/>
        <input type="number" min="0" value="${prod.estoque}" data-id="${prod.id}" class="estoque-input" />
        <button class="atualizar-estoque" data-id="${prod.id}">Atualizar</button>
      `;
      estoqueLista.appendChild(estDiv);
    });

    document.querySelectorAll('.atualizar-estoque').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'));
        const input = document.querySelector(`.estoque-input[data-id="${id}"]`);
        const novoEstoque = parseInt(input.value);

        if (isNaN(novoEstoque) || novoEstoque < 0) {
          alert('Quantidade inválida.');
          return;
        }

        const prod = produtos.find(p => p.id === id);
        if (prod) {
          prod.estoque = novoEstoque;
          saveProdutos();
          renderEstoque();
        }
      });
    });
  }

});
