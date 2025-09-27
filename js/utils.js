function mascaraCEP(valor) {

  const apenasNumeros = valor.replace(/\D/g, '');

  if(apenasNumeros.length > 5) {
    return apenasNumeros.slice(0, 5) + '-' + apenasNumeros.slice(5, 8);
  }

  return apenasNumeros;
}

function ordenarArray(array, criterio, ordem = 'asc') {

  const copia = [...array];

  copia.sort((a, b) => {
    let valorA = a[criterio];
    let valorB = b[criterio];

    if(typeof valorA === 'string') {
      valorA = valorA.toLowerCase();
      valorB = valorB.toLowerCase();
    }

    if(valorA < valorB) {
      return ordem === 'asc' ? -1 : 1;
    }
    if(valorA > valorB) {
      return ordem === 'asc' ? 1 : -1;
    }

    return 0;
  });

  return copia;
}

window.mascaraCEP = mascaraCEP;
window.ordenarArray = ordenarArray;