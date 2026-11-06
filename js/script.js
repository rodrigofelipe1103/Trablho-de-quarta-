/*
  Projeto: Modo Preguica | Arquivo: js/script.js
  Favoritos, filtros, comparativo interativo, sugestoes e rolagem suave
*/

const CHAVE_FAVORITOS = "modoPreguica.favoritos";
const CHAVE_SUGESTOES = "modoPreguica.sugestoes";
const OFFSET_NAVBAR = 80;

const listaCards = document.getElementById("lista-receitas");
const cards = Array.from(listaCards.querySelectorAll(".card"));
const botoesFiltro = Array.from(document.querySelectorAll(".filtro"));
const botoesFavorito = Array.from(document.querySelectorAll(".botao-favorito"));
const contador = document.getElementById("contador-favoritos");
const avisoFiltro = document.getElementById("aviso-filtro");
const botaoVer = document.getElementById("btn-ver");
const botaoSurpresa = document.getElementById("btn-surpresa");

const formulario = document.getElementById("form-contato");
const mensagemForm = document.getElementById("mensagem-form");
const listaSugestoes = document.getElementById("lista-sugestoes");
const avisoSugestoes = document.getElementById("aviso-sugestoes");
const contadorSugestoes = document.getElementById("contador-sugestoes");
const btnLimparSugestoes = document.getElementById("btn-limpar-sugestoes");

const corpoComparativo = document.getElementById("corpo-comparativo");

let favoritos = [];
let sugestoes = [];
let filtroAtual = "todas";

function carregarFavoritos() {
  try {
    const dados = JSON.parse(localStorage.getItem(CHAVE_FAVORITOS));
    favoritos = Array.isArray(dados) ? dados : [];
  } catch (erro) {
    favoritos = [];
  }
}

function salvarFavoritos() {
  localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(favoritos));
}

function renderizarFavoritos() {
  contador.textContent = "♥ " + favoritos.length;

  botoesFavorito.forEach(function (botao) {
    const nome = botao.dataset.receita;

    if (favoritos.includes(nome)) {
      botao.classList.add("ativo");
      botao.setAttribute("aria-pressed", "true");
    } else {
      botao.classList.remove("ativo");
      botao.setAttribute("aria-pressed", "false");
    }
  });
}

function alternarFavorito(nome) {
  if (favoritos.includes(nome)) {
    favoritos = favoritos.filter(function (item) {
      return item !== nome;
    });
  } else {
    favoritos.push(nome);
  }

  salvarFavoritos();
  renderizarFavoritos();

  if (filtroAtual === "favoritos") {
    filtrarCards(filtroAtual);
  }
}

function filtrarCards(categoria) {
  filtroAtual = categoria;

  cards.forEach(function (card) {
    const categoriaCard = card.dataset.categoria;
    const receita = card.querySelector(".botao-favorito").dataset.receita;

    let deveMostrar;

    if (categoria === "todas") {
      deveMostrar = true;
    } else if (categoria === "favoritos") {
      deveMostrar = favoritos.includes(receita);
    } else {
      deveMostrar = categoriaCard === categoria;
    }

    card.classList.toggle("oculto", !deveMostrar);
  });

  atualizarAvisoVazio();
}

function atualizarAvisoVazio() {
  const visiveis = cards.filter(function (card) {
    return !card.classList.contains("oculto");
  }).length;

  const mostrar = filtroAtual === "favoritos" && visiveis === 0;
  avisoFiltro.style.display = mostrar ? "block" : "none";
}

botoesFiltro.forEach(function (botao) {
  botao.addEventListener("click", function () {
    botoesFiltro.forEach(function (outro) {
      outro.classList.remove("ativo");
    });

    botao.classList.add("ativo");
    filtrarCards(botao.dataset.categoria);
  });
});

botoesFavorito.forEach(function (botao) {
  botao.addEventListener("click", function () {
    alternarFavorito(botao.dataset.receita);
  });
});

botaoVer.addEventListener("click", function () {
  document.getElementById("receitas").scrollIntoView({ behavior: "smooth" });
});

botaoSurpresa.addEventListener("click", function () {
  filtroAtual = "todas";

  botoesFiltro.forEach(function (botao) {
    botao.classList.toggle("ativo", botao.dataset.categoria === "todas");
  });

  cards.forEach(function (card) {
    card.classList.remove("oculto", "destaque-surpresa");
  });

  atualizarAvisoVazio();

  const sorteado = cards[Math.floor(Math.random() * cards.length)];

  sorteado.scrollIntoView({ behavior: "smooth", block: "center" });
  sorteado.classList.add("destaque-surpresa");

  setTimeout(function () {
    sorteado.classList.remove("destaque-surpresa");
  }, 2600);
});

const DETALHES_RECEITAS = {
  "Macarrão ao Molho Vermelho": {
    ingredientes: ["macarrão", "molho de tomate", "açúcar", "alho", "sal"],
    preparo: [
      "Cozinhe o macarrão em água fervente com sal até ficar al dente.",
      "Doure o alho no óleo, junte o molho e uma pitada de açúcar para cortar a acidez.",
      "Misture o macarrão ao molho, aqueça por 1 minuto e sirva."
    ]
  },
  "Miojo com Requeijão": {
    ingredientes: ["miojo", "requeijão", "leite", "manteiga"],
    preparo: [
      "Cozinhe o miojo por 3 minutos e descarte metade da água.",
      "Acrescente o requeijão, o leite e a manteiga ainda no fogo.",
      "Mexa até formar um creme e sirva imediatamente."
    ]
  },
  "Misto Quente": {
    ingredientes: ["pão de forma", "queijo", "presunto", "manteiga"],
    preparo: [
      "Passe manteiga nas duas fatias de pão.",
      "Monte com queijo e presunto no meio.",
      "Doure na frigideira por 2 minutos de cada lado, em fogo médio."
    ]
  },
  "Brigadeiro de Micro-ondas": {
    ingredientes: ["leite condensado", "chocolate em pó", "manteiga", "granulado"],
    preparo: [
      "Misture o leite condensado, o chocolate e a manteiga em um bowl.",
      "Leve ao micro-ondas por 3 minutos, mexendo a cada 1 minuto.",
      "Deixe esfriar, enrole e passe no granulado."
    ]
  },
  "Macarrão Alfredo": {
    ingredientes: ["macarrão", "creme de leite", "queijo parmesão", "manteiga", "alho"],
    preparo: [
      "Cozinhe o macarrão até ficar al dente.",
      "Derreta a manteiga, doure o alho e junte o creme de leite.",
      "Adicione o parmesão, mexa até engrossar e misture ao macarrão."
    ]
  },
  "Miojo na Manteiga": {
    ingredientes: ["miojo", "manteiga", "orégano", "sal"],
    preparo: [
      "Cozinhe o miojo por 3 minutos e escorra a água.",
      "Misture a manteiga ainda quente até derreter.",
      "Tempere com orégano e um pouco do sachê de tempero."
    ]
  },
  "Sanduíche de Atum": {
    ingredientes: ["pão", "atum", "maionese", "cebola", "limão"],
    preparo: [
      "Escorra o atum e misture com a maionese.",
      "Pique a cebola bem fina e junte, com um pouco de limão.",
      "Recheie o pão e coma na hora."
    ]
  },
  "Mousse de Limão": {
    ingredientes: ["leite condensado", "creme de leite", "suco de limão", "biscoito"],
    preparo: [
      "Bata o leite condensado, o creme de leite e o suco de limão no liquidificador.",
      "Despeje em um recipiente e leve à geladeira por 2 horas.",
      "Quebre o biscoito por cima antes de servir."
    ]
  }
};

function montarLinhasDetalhe() {
  const linhas = Array.from(corpoComparativo.querySelectorAll("tr.linha-receita"));

  linhas.forEach(function (linha) {
    const nome = linha.dataset.receita;
    const dados = DETALHES_RECEITAS[nome];

    if (!dados) {
      return;
    }

    const detalhe = document.createElement("tr");
    detalhe.className = "linha-detalhe";
    detalhe.style.display = "none";

    const celula = document.createElement("td");
    celula.colSpan = 4;

    const conteudo = document.createElement("div");
    conteudo.className = "detalhe-conteudo";

    const inner = document.createElement("div");
    inner.className = "detalhe-inner";

    const listaIngredientes = dados.ingredientes
      .map(function (item) {
        return "<li>" + item + "</li>";
      })
      .join("");

    const listaPreparo = dados.preparo
      .map(function (passo) {
        return "<li>" + passo + "</li>";
      })
      .join("");

    inner.innerHTML =
      '<p class="detalhe-titulo">Ingredientes</p>' +
      '<ul class="detalhe-ingredientes">' + listaIngredientes + "</ul>" +
      '<p class="detalhe-titulo">Modo de preparo</p>' +
      '<ol class="detalhe-preparo">' + listaPreparo + "</ol>";

    conteudo.appendChild(inner);
    celula.appendChild(conteudo);
    detalhe.appendChild(celula);
    linha.parentNode.insertBefore(detalhe, linha.nextSibling);
  });
}

function fecharOutrasLinhas(linhaAtual) {
  const abertas = Array.from(corpoComparativo.querySelectorAll(".linha-detalhe.aberta"));

  abertas.forEach(function (detalhe) {
    const linhaAnterior = detalhe.previousElementSibling;

    if (linhaAnterior === linhaAtual) {
      return;
    }

    detalhe.classList.remove("aberta");
    detalhe.querySelector(".detalhe-conteudo").style.maxHeight = "0px";
    detalhe.style.display = "none";

    if (linhaAnterior) {
      linhaAnterior.classList.remove("aberta");
      linhaAnterior.setAttribute("aria-expanded", "false");
    }
  });
}

function alternarLinha(linha) {
  const detalhe = linha.nextElementSibling;

  if (!detalhe || !detalhe.classList.contains("linha-detalhe")) {
    return;
  }

  const conteudo = detalhe.querySelector(".detalhe-conteudo");
  const estaAberta = detalhe.classList.contains("aberta");

  if (estaAberta) {
    conteudo.style.maxHeight = "0px";

    setTimeout(function () {
      detalhe.style.display = "none";
    }, 350);

    detalhe.classList.remove("aberta");
    linha.classList.remove("aberta");
    linha.setAttribute("aria-expanded", "false");
  } else {
    fecharOutrasLinhas(linha);

    detalhe.style.display = "table-row";
    detalhe.classList.add("aberta");
    linha.classList.add("aberta");
    linha.setAttribute("aria-expanded", "true");

    conteudo.style.maxHeight = conteudo.scrollHeight + "px";
  }
}

function ligarEventosLinhas() {
  const linhas = Array.from(corpoComparativo.querySelectorAll("tr.linha-receita"));

  linhas.forEach(function (linha) {
    linha.addEventListener("click", function () {
      alternarLinha(linha);
    });

    linha.addEventListener("keydown", function (evento) {
      if (evento.key === "Enter" || evento.key === " ") {
        evento.preventDefault();
        alternarLinha(linha);
      }
    });

    linha.addEventListener("pointerdown", function () {
      linha.classList.add("pressionada");
    });

    ["pointerup", "pointercancel", "pointerleave"].forEach(function (evento) {
      linha.addEventListener(evento, function () {
        linha.classList.remove("pressionada");
      });
    });
  });
}

function carregarSugestoes() {
  try {
    const dados = JSON.parse(localStorage.getItem(CHAVE_SUGESTOES));
    sugestoes = Array.isArray(dados) ? dados : [];
  } catch (erro) {
    sugestoes = [];
  }
}

function salvarSugestoes() {
  localStorage.setItem(CHAVE_SUGESTOES, JSON.stringify(sugestoes));
}

function formatarData(iso) {
  const data = new Date(iso);

  return data.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function criarCartaoSugestao(sugestao) {
  const item = document.createElement("li");
  item.className = "sugestao-card";

  const topo = document.createElement("div");
  topo.className = "sugestao-topo";

  const autor = document.createElement("span");
  autor.className = "sugestao-autor";
  autor.textContent = sugestao.nome;

  const data = document.createElement("span");
  data.className = "sugestao-data";
  data.textContent = formatarData(sugestao.data);

  topo.appendChild(autor);
  topo.appendChild(data);

  const badge = document.createElement("span");
  badge.className = "badge";
  badge.textContent = sugestao.categoria;

  const texto = document.createElement("p");
  texto.className = "sugestao-texto";
  texto.textContent = sugestao.mensagem;

  const rodape = document.createElement("div");
  rodape.className = "sugestao-rodape";

  const email = document.createElement("span");
  email.className = "sugestao-email";
  email.textContent = sugestao.email;

  const remover = document.createElement("button");
  remover.className = "botao-remover";
  remover.type = "button";
  remover.textContent = "Remover";

  remover.addEventListener("click", function () {
    removerSugestao(sugestao.id);
  });

  rodape.appendChild(email);
  rodape.appendChild(remover);

  item.appendChild(topo);
  item.appendChild(badge);
  item.appendChild(texto);
  item.appendChild(rodape);

  return item;
}

function renderizarSugestoes() {
  listaSugestoes.innerHTML = "";

  const ordenadas = sugestoes.slice().sort(function (a, b) {
    return new Date(b.data) - new Date(a.data);
  });

  ordenadas.forEach(function (sugestao) {
    listaSugestoes.appendChild(criarCartaoSugestao(sugestao));
  });

  const total = sugestoes.length;
  contadorSugestoes.textContent = total === 1 ? "1 sugestão" : total + " sugestões";
  avisoSugestoes.style.display = total === 0 ? "block" : "none";
  btnLimparSugestoes.style.display = total === 0 ? "none" : "inline-block";
}

function adicionarSugestao(nome, email, categoria, mensagem) {
  sugestoes.push({
    id: String(Date.now()) + "-" + sugestoes.length,
    nome: nome,
    email: email,
    categoria: categoria,
    mensagem: mensagem,
    data: new Date().toISOString()
  });

  salvarSugestoes();
  renderizarSugestoes();
}

function removerSugestao(id) {
  if (!window.confirm("Remover esta sugestão?")) {
    return;
  }

  sugestoes = sugestoes.filter(function (item) {
    return item.id !== id;
  });

  salvarSugestoes();
  renderizarSugestoes();
}

btnLimparSugestoes.addEventListener("click", function () {
  if (!window.confirm("Apagar todas as sugestões salvas?")) {
    return;
  }

  sugestoes = [];
  salvarSugestoes();
  renderizarSugestoes();
});

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const categoria = document.getElementById("categoria").value;
  const mensagem = document.getElementById("mensagem").value.trim();

  if (nome.length < 3) {
    mensagemForm.style.color = "#d63a3a";
    mensagemForm.textContent = "Informe um nome com pelo menos 3 letras.";
    return;
  }

  if (!email.includes("@") || !email.includes(".")) {
    mensagemForm.style.color = "#d63a3a";
    mensagemForm.textContent = "Informe um e-mail válido.";
    return;
  }

  if (categoria === "") {
    mensagemForm.style.color = "#d63a3a";
    mensagemForm.textContent = "Escolha uma categoria favorita.";
    return;
  }

  if (mensagem.length < 10) {
    mensagemForm.style.color = "#d63a3a";
    mensagemForm.textContent = "Descreva sua sugestão com pelo menos 10 caracteres.";
    return;
  }

  adicionarSugestao(nome, email, categoria, mensagem);

  mensagemForm.style.color = "#1f7a3d";
  mensagemForm.textContent = "Valeu, " + nome + "! Sua sugestão foi registrada.";
  formulario.reset();

  document.getElementById("sugestoes").scrollIntoView({ behavior: "smooth", block: "start" });
});

function ligarRolagemSuave() {
  const links = Array.from(document.querySelectorAll('a[href^="#"]'));

  links.forEach(function (link) {
    link.addEventListener("click", function (evento) {
      const id = link.getAttribute("href");

      if (!id || id.length < 2) {
        return;
      }

      const destino = document.querySelector(id);

      if (!destino) {
        return;
      }

      evento.preventDefault();

      const posicao = destino.getBoundingClientRect().top + window.pageYOffset - OFFSET_NAVBAR;

      window.scrollTo({
        top: Math.max(posicao, 0),
        behavior: "smooth"
      });

      history.replaceState(null, "", id);
    });
  });
}

window.addEventListener("resize", function () {
  const abertas = Array.from(document.querySelectorAll(".linha-detalhe.aberta .detalhe-conteudo"));

  abertas.forEach(function (conteudo) {
    conteudo.style.maxHeight = conteudo.scrollHeight + "px";
  });
});

carregarFavoritos();
renderizarFavoritos();
carregarSugestoes();
renderizarSugestoes();
filtrarCards("todas");
montarLinhasDetalhe();
ligarEventosLinhas();
ligarRolagemSuave();
