// Variáveis globais
let cartItems = [];

// Função para salvar no localStorage
function saveCart() {
  localStorage.setItem('lourdesFruttiCart', JSON.stringify(cartItems));
}

// Função para carregar do localStorage
function loadCart() {
  const saved = localStorage.getItem('lourdesFruttiCart');
  if (saved) {
    cartItems = JSON.parse(saved);
  } else {
    cartItems = [];
  }
}

// Atualiza o contador no ícone do carrinho
function updateCartCount() {
  const count = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const cartCountEl = document.getElementById('cart-count');
  if (cartCountEl) cartCountEl.textContent = count;
}

// Formata preço para BRL
function formatPrice(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Renderiza os itens do carrinho na sidebar
function renderCart() {
  const container = document.getElementById('cart-items');
  if (!container) return;

  container.innerHTML = '';

  if (cartItems.length === 0) {
    container.innerHTML = '<p>Seu carrinho está vazio.</p>';
    const totalEl = document.getElementById('cart-total');
    if (totalEl) totalEl.textContent = 'Total: R$ 0,00';
    return;
  }

  cartItems.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('cart-item');

    div.innerHTML = `
      <span class="cart-item-name">${item.name}</span>
      <span class="cart-item-qty">x${item.qty}</span>
      <span class="cart-item-price">${formatPrice(item.price * item.qty)}</span>
      <button aria-label="Remover item" class="remove-item-btn" data-id="${item.id}">×</button>
    `;

    container.appendChild(div);
  });

  // Atualiza total
  const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalEl = document.getElementById('cart-total');
  if (totalEl) totalEl.textContent = `Total: ${formatPrice(total)}`;

  // Adiciona evento para remover item
  container.querySelectorAll('.remove-item-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      removeFromCart(parseInt(btn.dataset.id));
    });
  });
}

// Adiciona produto ao carrinho
function addToCart(product) {
  const existing = cartItems.find(item => item.id === product.id);
  if (existing) {
    existing.qty++;
  } else {
    cartItems.push({ ...product, qty: 1 });
  }
  saveCart();
  updateCartCount();
  renderCart();
  toggleCart(true);
}

// Remove produto do carrinho
function removeFromCart(id) {
  cartItems = cartItems.filter(item => item.id !== id);
  saveCart();
  updateCartCount();
  renderCart();
}

// Limpa o carrinho
function clearCart() {
  cartItems = [];
  saveCart();
  updateCartCount();
  renderCart();
}

// Finaliza a compra
function checkout() {
  if (cartItems.length === 0) {
    alert('Seu carrinho está vazio!');
    return;
  }
  window.location.href = 'pagamento.html';
}


// Alterna tema claro/escuro
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('lourdesFruttiTheme', isDark ? 'dark' : 'light');
}

// Carrega tema salvo
function loadTheme() {
  const saved = localStorage.getItem('lourdesFruttiTheme');
  if (saved === 'dark') {
    document.body.classList.add('dark-mode');
  }
}

// Mostrar / esconder carrinho
function toggleCart(open) {
  const cart = document.getElementById('cart');
  if (!cart) return;

  if (open === undefined) {
    cart.classList.toggle('open');
  } else if (open) {
    cart.classList.add('open');
  } else {
    cart.classList.remove('open');
  }
}

// Configuração inicial
document.addEventListener('DOMContentLoaded', () => {
  // Carrega tema e carrinho
  loadTheme();
  loadCart();
  updateCartCount();
  renderCart();

  // Botões de adicionar no catálogo
  document.querySelectorAll('.add-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Evita abrir modal ao clicar no botão
      const prodDiv = btn.closest('.produto');
      if (!prodDiv) return;

      const product = {
        id: parseInt(prodDiv.dataset.id),
        name: prodDiv.dataset.nome,
        price: parseFloat(prodDiv.dataset.preco),
      };
      addToCart(product);
    });
  });

  // Modal do produto
  const produtos = document.querySelectorAll('.produto');
  const modal = document.getElementById('product-modal');
  const modalClose = document.getElementById('modal-close');
  const modalImg = document.getElementById('modal-img');
  const modalName = document.getElementById('modal-name');
  const modalDesc = document.getElementById('modal-desc');
  const modalPrice = document.getElementById('modal-price');
  const modalAddCartBtn = document.getElementById('modal-add-cart-btn');

  produtos.forEach(prod => {
    prod.addEventListener('click', (e) => {
      if (e.target.classList.contains('add-cart-btn')) return;

      modal.style.display = 'flex';
      const imgEl = prod.querySelector('img');
      modalImg.src = imgEl ? imgEl.src : '';
      modalImg.alt = prod.dataset.nome || 'Imagem do produto';
      modalName.textContent = prod.dataset.nome || '';
      modalDesc.textContent = prod.dataset.desc || "Descrição não disponível."; // Personalize
      modalPrice.textContent = `R$ ${parseFloat(prod.dataset.preco).toFixed(2)}`;

      // Dados para o botão
      modalAddCartBtn.dataset.id = prod.dataset.id;
      modalAddCartBtn.dataset.nome = prod.dataset.nome;
      modalAddCartBtn.dataset.preco = prod.dataset.preco;
    });
  });

  modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  modalAddCartBtn.addEventListener('click', () => {
    const id = parseInt(modalAddCartBtn.dataset.id);
    const nome = modalAddCartBtn.dataset.nome;
    const preco = parseFloat(modalAddCartBtn.dataset.preco);

    addToCart({ id, name: nome, price: preco });
    modal.style.display = 'none';
  });

  // Botões de abrir e fechar carrinho
  const cartToggle = document.querySelector('.cart-toggle');
  const cart = document.getElementById('cart');
  const cartClose = document.querySelector('.cart-close');

  if (cartToggle && cart) {
    cartToggle.addEventListener('click', () => {
      cart.style.display = 'block';
    });
  }

  if (cartClose && cart) {
    cartClose.addEventListener('click', () => {
      cart.style.display = 'none';
    });
  }

  // Botão esvaziar carrinho
  const clearCartBtn = document.getElementById('clear-cart-btn');
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', clearCart);
  }

  // Botão finalizar compra
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', checkout);
  }

  // Botão alternar tema
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
});
