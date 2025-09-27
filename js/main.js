async function buscarProdutos() {

  try {

    const resposta = await fetch('./data/produtos.json'); 

    if(!resposta.ok) {
      throw new Error(`Erro HTTP! Status: ${resposta.status}`);
    }

    const produtos = await resposta.json();

    return produtos;

  }catch(erro) {
    console.error("Não foi possível carregar os produtos:", erro);
    const catalogoContainer = document.getElementById('catalogo');
    catalogoContainer.innerHTML = '<p style="color: red;">Erro ao carregar produtos. Verifique o console (F12) para mais detalhes.</p>';

    return []; 
  }
}

function criarCardProduto(produto) {
  
  const card = document.createElement('div');
  card.className = 'produto-card';

  card.innerHTML = `
    <img src="${produto.imagens[0]}" alt="Imagem de ${produto.nome}">
    <div class="info">
      <div>
        <h3>${produto.nome}</h3>
        <p class="preco">R$ ${produto.preco.toFixed(2).replace('.', ',')}</p>
      </div>
      <div class="acoes">
        <button onclick="carrinho.adicionar(${produto.id})">Adicionar</button>
        <a href="produto.html?id=${produto.id}">Detalhes</a>
      </div>
    </div>
  `;

  return card;
}

async function renderizarCatalogo() {

  const todosOsProdutos = await buscarProdutos();
  
  const termoBusca = document.getElementById('busca').value.toLowerCase();
  const categoriaSelecionada = document.getElementById('filtro-categoria').value;
  const ordenacao = document.getElementById('ordenar').value;

  let produtosFiltrados = todosOsProdutos.filter(produto => {
    const correspondeBusca = produto.nome.toLowerCase().includes(termoBusca);
    const correspondeCategoria = !categoriaSelecionada || produto.categoria === categoriaSelecionada;

    return correspondeBusca && correspondeCategoria;
  });

  if(ordenacao) {
    const [criterio, ordem] = ordenacao.split('-'); 
    produtosFiltrados = ordenarArray(produtosFiltrados, criterio, ordem);
  }

  const catalogoContainer = document.getElementById('catalogo');
  catalogoContainer.innerHTML = ''; 

  if(produtosFiltrados.length === 0) {
    catalogoContainer.innerHTML = '<p>Nenhum produto encontrado com esses filtros.</p>';
  } else {
    produtosFiltrados.forEach(produto => {
      const card = criarCardProduto(produto);
      catalogoContainer.appendChild(card);
    });
    
  }
}


document.getElementById('busca').addEventListener('input', renderizarCatalogo);
document.getElementById('filtro-categoria').addEventListener('change', renderizarCatalogo);
document.getElementById('ordenar').addEventListener('change', renderizarCatalogo);

document.addEventListener('DOMContentLoaded', renderizarCatalogo);