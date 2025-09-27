class Carrinho {

  constructor() {
    this.chaveStorage = 'carrinhoGamerStore';
    this.itens = this.obterDoStorage();
    this.atualizarContadorVisual(); 
  }

  obterDoStorage() {
    const carrinhoString = localStorage.getItem(this.chaveStorage);
    return carrinhoString ? JSON.parse(carrinhoString) : [];
  }

  salvarNoStorage() {
    localStorage.setItem(this.chaveStorage, JSON.stringify(this.itens));
    this.atualizarContadorVisual();
  }

  atualizarContadorVisual() {
    const contadorElemento = document.getElementById('contador-carrinho');
    if(!contadorElemento) return;
    const totalItens = this.itens.reduce((soma, item) => soma + item.qtd, 0);
    contadorElemento.innerText = totalItens;
  }


  adicionar(idProduto) {

    const idNumerico = Number(idProduto);
    const itemExistente = this.itens.find(item => item.id === idNumerico);

    if(itemExistente) {
      itemExistente.qtd++;
    } else {
      this.itens.push({ id: idNumerico, qtd: 1 });
    }

    this.salvarNoStorage();
    alert('Produto adicionado ao carrinho!');
  }

  remover(idProduto) {
    const idNumerico = Number(idProduto);
    this.itens = this.itens.filter(item => item.id !== idNumerico);
    this.salvarNoStorage();
  }

  alterarQuantidade(idProduto, novaQuantidade) {
    const idNumerico = Number(idProduto);
    const qtdNumerica = Number(novaQuantidade);
    const item = this.itens.find(i => i.id === idNumerico);

    if(item) {
      if(qtdNumerica > 0) {
        item.qtd = qtdNumerica;
      } else {
        this.remover(idNumerico);
      }
      this.salvarNoStorage();
    }
  }

  limpar() {
    this.itens = [];
    this.salvarNoStorage();
  }
  
  async obterItensComDetalhes() {
    if(this.itens.length === 0) return [];
    
    try {

      const resposta = await fetch('./data/produtos.json');
      if(!resposta.ok) {
          throw new Error(`Erro HTTP! Status: ${resposta.status}`);
      }
      const todosOsProdutos = await resposta.json();
      
      return this.itens.map(itemNoCarrinho => {
        const detalhesDoProduto = todosOsProdutos.find(p => p.id === itemNoCarrinho.id);
        return { ...detalhesDoProduto, qtd: itemNoCarrinho.qtd };
      });
    } catch (erro) {
      console.error("Erro ao buscar detalhes dos produtos:", erro);
      return [];
    }
  }

  async calcularTotal() {
    const itensComDetalhes = await this.obterItensComDetalhes();
    return itensComDetalhes.reduce((total, item) => total + (item.preco * item.qtd), 0);
  }
}

const carrinho = new Carrinho();