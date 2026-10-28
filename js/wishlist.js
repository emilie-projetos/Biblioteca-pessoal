// ============================================================
// BIBLIOTECA PESSOAL
// Arquivo: js/wishlist.js
//
// Responsável por:
// - adicionar livros à wishlist
// - editar itens
// - excluir itens
// - criar listas personalizadas
// - pesquisar
// - filtrar
// - ordenar
// - calcular totais
// - salvar tudo no LocalStorage
// ============================================================


// ============================================================
// CONFIGURAÇÃO
// ============================================================

const CHAVE_WISHLIST =
    "biblioteca_wishlist";


// ============================================================
// VARIÁVEIS
// ============================================================

let wishlist =
    [];


// ============================================================
// INICIAR
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    iniciarWishlist
);


function iniciarWishlist() {

    wishlist =
        carregarWishlist();


    configurarEventos();


    atualizarListas();


    atualizarTela();

}


// ============================================================
// STORAGE
// ============================================================

function carregarWishlist() {

    const dados =
        localStorage.getItem(
            CHAVE_WISHLIST
        );


    if (!dados) {

        return [];

    }


    try {

        const resultado =
            JSON.parse(dados);


        return Array.isArray(resultado)
            ? resultado
            : [];

    } catch (erro) {

        console.error(
            "Erro ao carregar wishlist:",
            erro
        );


        return [];

    }

}


// ============================================================
// SALVAR
// ============================================================

function salvarWishlist() {

    try {

        localStorage.setItem(
            CHAVE_WISHLIST,
            JSON.stringify(wishlist)
        );


        return true;

    } catch (erro) {

        console.error(
            "Erro ao salvar wishlist:",
            erro
        );


        return false;

    }

}


// ============================================================
// EVENTOS
// ============================================================

function configurarEventos() {

    const formulario =
        document.getElementById(
            "formWishlist"
        );


    formulario.addEventListener(
        "submit",
        salvarItem
    );


    document
        .getElementById("botaoNovaLista")
        .addEventListener(
            "click",
            criarNovaLista
        );


    document
        .getElementById("botaoCancelarEdicao")
        .addEventListener(
            "click",
            cancelarEdicao
        );


    document
        .getElementById("filtroBusca")
        .addEventListener(
            "input",
            atualizarTela
        );


    document
        .getElementById("filtroLista")
        .addEventListener(
            "change",
            atualizarTela
        );


    document
        .getElementById("filtroOrdenacao")
        .addEventListener(
            "change",
            atualizarTela
        );

}


// ============================================================
// SALVAR ITEM
// ============================================================

function salvarItem(evento) {

    evento.preventDefault();


    const id =
        document.getElementById(
            "itemId"
        ).value;


    const titulo =
        valor("wishlistTitulo");


    const autor =
        valor("wishlistAutor");


    const lista =
        valor("wishlistLista");


    const loja =
        valor("wishlistLoja");


    const precoTexto =
        valor("wishlistPreco");


    const dataPesquisa =
        valor("wishlistData");


    const observacoes =
        valor("wishlistObservacoes");


    if (!titulo) {

        alert(
            "Digite o título do livro."
        );

        return;

    }


    const preco =
        precoTexto
            ? Number(precoTexto)
            : 0;


    // ========================================================
    // EDITAR
    // ========================================================

    if (id) {

        const indice =
            wishlist.findIndex(
                function (item) {

                    return String(item.id) ===
                        String(id);

                }
            );


        if (indice === -1) {

            alert(
                "O item não foi encontrado."
            );

            return;

        }


        wishlist[indice].titulo =
            titulo;


        wishlist[indice].autor =
            autor;


        wishlist[indice].lista =
            lista;


        wishlist[indice].loja =
            loja;


        wishlist[indice].preco =
            preco;


        wishlist[indice].dataPesquisa =
            dataPesquisa;


        wishlist[indice].observacoes =
            observacoes;


        wishlist[indice].atualizadoEm =
            new Date().toISOString();


        salvarWishlist();


        alert(
            "Item atualizado com sucesso! ✨"
        );


    }

    // ========================================================
    // NOVO
    // ========================================================

    else {

        const novoItem = {

            id:
                gerarIdWishlist(),

            titulo:
                titulo,

            autor:
                autor,

            lista:
                lista || "Quero comprar",

            loja:
                loja,

            preco:
                preco,

            dataPesquisa:
                dataPesquisa,

            observacoes:
                observacoes,

            criadoEm:
                new Date().toISOString(),

            atualizadoEm:
                new Date().toISOString()

        };


        wishlist.push(
            novoItem
        );


        salvarWishlist();


        alert(
            "Livro adicionado à wishlist! 💭"
        );

    }


    limparFormulario();


    atualizarListas();


    atualizarTela();

}


// ============================================================
// GERAR ID
// ============================================================

function gerarIdWishlist() {

    return (
        Date.now().toString() +
        Math.random()
            .toString(16)
            .slice(2)
    );

}


// ============================================================
// CRIAR NOVA LISTA
// ============================================================

function criarNovaLista() {

    const input =
        document.getElementById(
            "novaLista"
        );


    const nome =
        input.value.trim();


    if (!nome) {

        alert(
            "Digite o nome da nova lista."
        );

        input.focus();

        return;

    }


    const listas =
        obterNomesDasListas();


    const existente =
        listas.some(
            function (lista) {

                return lista.toLowerCase() ===
                    nome.toLowerCase();

            }
        );


    if (existente) {

        alert(
            "Essa lista já existe."
        );

        return;

    }


    const select =
        document.getElementById(
            "wishlistLista"
        );


    const opcao =
        document.createElement(
            "option"
        );


    opcao.value =
        nome;


    opcao.textContent =
        nome;


    select.appendChild(
        opcao
    );


    select.value =
        nome;


    input.value =
        "";


    atualizarFiltroListas();

}


// ============================================================
// OBTER LISTAS
// ============================================================

function obterNomesDasListas() {

    const listas =
        new Set();


    listas.add(
        "Quero comprar"
    );


    wishlist.forEach(
        function (item) {

            if (item.lista) {

                listas.add(
                    item.lista
                );

            }

        }
    );


    return Array.from(
        listas
    );

}


// ============================================================
// ATUALIZAR LISTAS
// ============================================================

function atualizarListas() {

    const select =
        document.getElementById(
            "wishlistLista"
        );


    const valorAtual =
        select.value;


    const listas =
        obterNomesDasListas();


    select.innerHTML =
        "";


    listas.forEach(
        function (lista) {

            const opcao =
                document.createElement(
                    "option"
                );


            opcao.value =
                lista;


            opcao.textContent =
                lista;


            select.appendChild(
                opcao
            );

        }
    );


    if (
        listas.includes(
            valorAtual
        )
    ) {

        select.value =
            valorAtual;

    }


    atualizarFiltroListas();

}


// ============================================================
// FILTRO DE LISTAS
// ============================================================

function atualizarFiltroListas() {

    const select =
        document.getElementById(
            "filtroLista"
        );


    const valorAtual =
        select.value;


    select.innerHTML = `

        <option value="">
            Todas as listas
        </option>

    `;


    obterNomesDasListas()
        .forEach(
            function (lista) {

                const opcao =
                    document.createElement(
                        "option"
                    );


                opcao.value =
                    lista;


                opcao.textContent =
                    lista;


                select.appendChild(
                    opcao
                );

            }
        );


    if (
        valorAtual
    ) {

        select.value =
            valorAtual;

    }

}


// ============================================================
// ATUALIZAR TELA
// ============================================================

function atualizarTela() {

    atualizarResumo();


    const itens =
        obterItensFiltrados();


    renderizarWishlist(
        itens
    );

}


// ============================================================
// FILTRAR
// ============================================================

function obterItensFiltrados() {

    const busca =
        valor("filtroBusca")
            .toLowerCase();


    const lista =
        valor("filtroLista");


    const ordenacao =
        valor("filtroOrdenacao");


    let resultado =
        wishlist.filter(
            function (item) {

                const texto =
                    (
                        item.titulo +
                        " " +
                        (item.autor || "")
                    ).toLowerCase();


                const correspondeBusca =
                    !busca ||
                    texto.includes(busca);


                const correspondeLista =
                    !lista ||
                    item.lista === lista;


                return (
                    correspondeBusca &&
                    correspondeLista
                );

            }
        );


    resultado.sort(
        function (a, b) {

            switch (ordenacao) {

                case "titulo":

                    return a.titulo.localeCompare(
                        b.titulo,
                        "pt-BR"
                    );


                case "autor":

                    return (a.autor || "")
                        .localeCompare(
                            b.autor || "",
                            "pt-BR"
                        );


                case "preco-menor":

                    return (
                        Number(a.preco || 0) -
                        Number(b.preco || 0)
                    );


                case "preco-maior":

                    return (
                        Number(b.preco || 0) -
                        Number(a.preco || 0)
                    );


                case "recentes":

                default:

                    return (
                        new Date(
                            b.criadoEm
                        ) -
                        new Date(
                            a.criadoEm
                        )
                    );

            }

        }
    );


    return resultado;

}


// ============================================================
// RENDERIZAR
// ============================================================

function renderizarWishlist(
    itens
) {

    const container =
        document.getElementById(
            "wishlistListaLivros"
        );


    const vazia =
        document.getElementById(
            "wishlistVazia"
        );


    container.innerHTML =
        "";


    if (!itens.length) {

        vazia.style.display =
            "block";


        return;

    }


    vazia.style.display =
        "none";


    itens.forEach(
        function (item) {

            container.appendChild(
                criarCard(item)
            );

        }
    );

}


// ============================================================
// CRIAR CARD
// ============================================================

function criarCard(
    item
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "wishlist-card";


    const preco =
        Number(
            item.preco || 0
        );


    const precoFormatado =
        preco > 0
            ? formatarMoeda(preco)
            : "Não informado";


    const data =
        item.dataPesquisa
            ? formatarData(
                item.dataPesquisa
            )
            : "Não informada";


    card.innerHTML = `

        <div class="wishlist-card-top">

            <div>

                <h3>
                    ${escaparHTML(item.titulo)}
                </h3>

                ${
                    item.autor
                        ? `
                            <div class="wishlist-autor">
                                ${escaparHTML(item.autor)}
                            </div>
                        `
                        : ""
                }

                <span class="wishlist-lista-tag">
                    📂 ${escaparHTML(item.lista || "Quero comprar")}
                </span>

            </div>

        </div>


        <div class="wishlist-info">

            <div class="wishlist-info-item">

                <small>
                    Loja
                </small>

                <strong>
                    ${
                        item.loja
                            ? escaparHTML(item.loja)
                            : "Não informada"
                    }
                </strong>

            </div>


            <div class="wishlist-info-item">

                <small>
                    Preço
                </small>

                <strong>
                    ${precoFormatado}
                </strong>

            </div>


            <div class="wishlist-info-item">

                <small>
                    Pesquisado em
                </small>

                <strong>
                    ${data}
                </strong>

            </div>

        </div>


        ${
            item.observacoes
                ? `
                    <div class="wishlist-observacoes">
                        ${escaparHTML(item.observacoes)}
                    </div>
                `
                : ""
        }


        <div class="wishlist-card-acoes">

            <button
                type="button"
                class="botao-card botao-editar"
                data-acao="editar"
                data-id="${item.id}"
            >
                ✏️ Editar
            </button>


            <button
                type="button"
                class="botao-card botao-excluir"
                data-acao="excluir"
                data-id="${item.id}"
            >
                🗑️ Excluir
            </button>

        </div>

    `;


    card
        .querySelector(
            '[data-acao="editar"]'
        )
        .addEventListener(
            "click",
            function () {

                editarItem(
                    item.id
                );

            }
        );


    card
        .querySelector(
            '[data-acao="excluir"]'
        )
        .addEventListener(
            "click",
            function () {

                excluirItem(
                    item.id
                );

            }
        );


    return card;

}


// ============================================================
// EDITAR ITEM
// ============================================================

function editarItem(
    id
) {

    const item =
        wishlist.find(
            function (item) {

                return String(item.id) ===
                    String(id);

            }
        );


    if (!item) {

        alert(
            "Item não encontrado."
        );

        return;

    }


    document.getElementById(
        "itemId"
    ).value =
        item.id;


    document.getElementById(
        "wishlistTitulo"
    ).value =
        item.titulo || "";


    document.getElementById(
        "wishlistAutor"
    ).value =
        item.autor || "";


    atualizarListas();


    document.getElementById(
        "wishlistLista"
    ).value =
        item.lista ||
        "Quero comprar";


    document.getElementById(
        "wishlistLoja"
    ).value =
        item.loja || "";


    document.getElementById(
        "wishlistPreco"
    ).value =
        item.preco || "";


    document.getElementById(
        "wishlistData"
    ).value =
        item.dataPesquisa || "";


    document.getElementById(
        "wishlistObservacoes"
    ).value =
        item.observacoes || "";


    document.getElementById(
        "tituloFormulario"
    ).textContent =
        "Editar item da wishlist";


    document.getElementById(
        "botaoSalvarWishlist"
    ).textContent =
        "💾 Salvar alterações";


    document.getElementById(
        "botaoCancelarEdicao"
    ).hidden =
        false;


    document
        .querySelector(".wishlist-formulario")
        .scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

}


// ============================================================
// CANCELAR EDIÇÃO
// ============================================================

function cancelarEdicao() {

    limparFormulario();

}


// ============================================================
// LIMPAR FORMULÁRIO
// ============================================================

function limparFormulario() {

    document
        .getElementById(
            "formWishlist"
        )
        .reset();


    document.getElementById(
        "itemId"
    ).value =
        "";


    document.getElementById(
        "tituloFormulario"
    ).textContent =
        "Adicionar à wishlist";


    document.getElementById(
        "botaoSalvarWishlist"
    ).textContent =
        "💭 Adicionar à wishlist";


    document.getElementById(
        "botaoCancelarEdicao"
    ).hidden =
        true;


    atualizarListas();

}


// ============================================================
// EXCLUIR
// ============================================================

function excluirItem(
    id
) {

    const item =
        wishlist.find(
            function (item) {

                return String(item.id) ===
                    String(id);

            }
        );


    if (!item) {
        return;
    }


    const confirmar =
        confirm(
            `Deseja realmente excluir "${item.titulo}" da wishlist?`
        );


    if (!confirmar) {
        return;
    }


    wishlist =
        wishlist.filter(
            function (item) {

                return String(item.id) !==
                    String(id);

            }
        );


    salvarWishlist();


    atualizarListas();


    atualizarTela();


    alert(
        "Livro removido da wishlist."
    );

}


// ============================================================
// RESUMO
// ============================================================

function atualizarResumo() {

    const total =
        wishlist.length;


    const valor =
        wishlist.reduce(
            function (total, item) {

                return (
                    total +
                    Number(item.preco || 0)
                );

            },
            0
        );


    const quantidadeListas =
        obterNomesDasListas()
            .filter(
                function (lista) {

                    return lista !==
                        "Quero comprar";

                }
            )
            .length;


    document.getElementById(
        "totalWishlist"
    ).textContent =
        total;


    document.getElementById(
        "valorWishlist"
    ).textContent =
        formatarMoeda(valor);


    document.getElementById(
        "listaPrincipal"
    ).textContent =
        quantidadeListas;

}


// ============================================================
// VALOR DE INPUT
// ============================================================

function valor(id) {

    const campo =
        document.getElementById(id);


    if (!campo) {
        return "";
    }


    return campo.value.trim();

}


// ============================================================
// MOEDA
// ============================================================

function formatarMoeda(
    valor
) {

    return new Intl.NumberFormat(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    ).format(
        Number(valor || 0)
    );

}


// ============================================================
// DATA
// ============================================================

function formatarData(
    data
) {

    if (!data) {
        return "Não informada";
    }


    const partes =
        data.split("-");


    if (partes.length !== 3) {

        return data;

    }


    return (
        partes[2] +
        "/" +
        partes[1] +
        "/" +
        partes[0]
    );

}


// ============================================================
// SEGURANÇA HTML
// ============================================================

function escaparHTML(
    texto
) {

    return String(texto || "")
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}