async function renderizarResumoCarrinho() {

  const resumoContainer = document.getElementById('resumo-carrinho');
  const itens = await carrinho.obterItensComDetalhes();

  if(itens.length === 0) {
    resumoContainer.innerHTML = '<h2>Resumo do Pedido</h2><p>Seu carrinho está vazio.</p>';
    document.getElementById('formulario-checkout').style.display = 'none';

    return;
  }

  const total = await carrinho.calcularTotal();

  const linhasTabela = itens.map(item => `
    <tr>
      <td data-label="Produto">
        <div class="produto-info">
          <img src="${item.imagens[0]}" alt="${item.nome}">
          <span>${item.nome}</span>
        </div>
      </td>
      <td data-label="Qtd">
        <input 
          type="number" 
          value="${item.qtd}" 
          min="1" 
          onchange="handleAlterarQuantidade(${item.id}, this.value)"
        >
      </td>
      <td data-label="Preço Unit.">R$ ${item.preco.toFixed(2).replace('.', ',')}</td>
      <td data-label="Subtotal">R$ ${(item.preco * item.qtd).toFixed(2).replace('.', ',')}</td>
      <td data-label="Ações">
        <button class="btn-remover" onclick="handleRemoverItem(${item.id})">Remover</button>
      </td>
    </tr>
  `).join('');

  resumoContainer.innerHTML = `
    <h2>Resumo do Pedido</h2>
    <table class="tabela-carrinho">
      <thead>
        <tr>
          <th>Produto</th>
          <th>Qtd</th>
          <th>Preço Unit.</th>
          <th>Subtotal</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        ${linhasTabela}
      </tbody>
    </table>
    <p class="total-carrinho">Total: R$ ${total.toFixed(2).replace('.', ',')}</p>
  `;
}


async function handleAlterarQuantidade(idProduto, novaQuantidade) {

  carrinho.alterarQuantidade(idProduto, novaQuantidade);
  await renderizarResumoCarrinho(); 
}

async function handleRemoverItem(idProduto) {

  if(confirm('Tem certeza que deseja remover este item?')) {
    carrinho.remover(idProduto);
    await renderizarResumoCarrinho();
  }
}

const formulario = document.getElementById('formulario-checkout');

formulario.addEventListener('submit', function(evento) {
  evento.preventDefault();
  carrinho.limpar();
  
  formulario.innerHTML = `
    <div class="msg-sucesso">
      <h3>Pedido realizado com sucesso!</h3>
      <p>Você será redirecionado para a página inicial em 5 segundos.</p>
    </div>
  `;

  setTimeout(() => { window.location.href = 'index.html'; }, 5000);
});


const inputCep = document.getElementById('cep');
const mensagemCep = document.getElementById('mensagem-cep');

inputCep.addEventListener('input', (evento) => {
  const valorInput = evento.target.value;
  evento.target.value = mascaraCEP(valorInput);

  const cepApenasDigitos = evento.target.value.replace(/\D/g, '');

  if(cepApenasDigitos.length === 8) {
    buscarEnderecoPorCEP(cepApenasDigitos);
  } else {
    mensagemCep.innerText = ''; 
  }
});

async function buscarEnderecoPorCEP(cep) {

  try {

    const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if(!resposta.ok) throw new Error('Falha de rede ao buscar CEP.');
    
    const dadosEndereco = await resposta.json();

    if(dadosEndereco.erro) {
      mensagemCep.innerText = 'CEP não encontrado. Preencha manualmente.';
      return;
    }

    mensagemCep.innerText = ''; 
    document.getElementById('rua').value = dadosEndereco.logradouro;
    document.getElementById('bairro').value = dadosEndereco.bairro;
    document.getElementById('cidade').value = dadosEndereco.localidade;
    document.getElementById('uf').value = dadosEndereco.uf;
    
    document.getElementById('numero').focus();

  }catch(erro) {
    
    mensagemCep.innerText = 'Não foi possível buscar o CEP. Verifique sua conexão.';
    console.error("Erro na API ViaCEP:", erro);
  }
}

document.addEventListener('DOMContentLoaded', renderizarResumoCarrinho);