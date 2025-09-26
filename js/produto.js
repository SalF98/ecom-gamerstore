
async function buscarProdutos() {

  try {

    const resposta = await fetch('data/produtos.json');

    if(!resposta.ok) {
        throw new Error(`Erro HTTP! Status: ${resposta.status}`);
    }

    const produtos = await resposta.json();

    return produtos;

  }catch (erro) {

    console.error("Erro ao buscar produtos:", erro);

    return [];
  }
}

async function mostrarDetalhes() {
  const parametrosURL = new URLSearchParams(window.location.search);
  const idProduto = Number(parametrosURL.get('id')); 

  const secaoDetalhe = document.getElementById('detalhe-produto');

  if(!idProduto) {
    secaoDetalhe.innerHTML = '<p>Produto inválido. Por favor, volte para a página inicial e selecione um produto.</p>';
    return;
  }

  const todosOsProdutos = await buscarProdutos();
  const produto = todosOsProdutos.find(p => p.id === idProduto);

  if(!produto) {
    secaoDetalhe.innerHTML = '<p>Ops! Não encontramos o produto que você está procurando.</p>';
    return;
  }
  
  document.title = `${produto.nome} | GamerStore`;

  const galeriaHtml = produto.imagens.map((imgSrc, index) => `
    <img 
      src="${imgSrc}" 
      alt="Imagem ${index + 1} de ${produto.nome}" 
      onclick="trocarImagemPrincipal(this, '${imgSrc}')"
    >
  `).join('');

  secaoDetalhe.innerHTML = `
    <div class="imagem-container">
      <div class="imagem-principal">
        <img src="${produto.imagens[0]}" alt="Imagem principal de ${produto.nome}">
      </div>
      <div class="galeria">
        ${galeriaHtml}
      </div>
    </div>
    <div class="info-produto">
      <h2>${produto.nome}</h2>
      <p>${produto.descricao}</p>
      <p class="preco-detalhe">R$ ${produto.preco.toFixed(2).replace('.', ',')}</p>
      <button class="btn-adicionar" onclick="carrinho.adicionar(${produto.id})">Adicionar ao carrinho</button>
    </div>
  `;
  
  const primeiraMiniatura = secaoDetalhe.querySelector('.galeria img');
  if(primeiraMiniatura) {
    primeiraMiniatura.classList.add('active');
  }
}

function trocarImagemPrincipal(miniaturaClicada, novaUrl) {
  const imagemPrincipal = document.querySelector('.imagem-principal img');
  imagemPrincipal.src = novaUrl;

  const todasMiniaturas = document.querySelectorAll('.galeria img');
  todasMiniaturas.forEach(img => img.classList.remove('active'));

  miniaturaClicada.classList.add('active');
}

document.addEventListener('DOMContentLoaded', mostrarDetalhes);