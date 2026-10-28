// ============================================================
// BIBLIOTECA PESSOAL
// Arquivo: js/livro.js
//
// Página individual do livro.
//
// Funções:
// - localizar livro pelo ID
// - mostrar capa
// - abrir livro
// - criar páginas
// - navegar entre páginas
// - mostrar informações
// - mostrar avaliação
// - mostrar personagens
// - mostrar resenha
// - excluir livro
// - controlar scrapbook
// ============================================================


// ============================================================
// VARIÁVEIS
// ============================================================

let livroAtual = null;

let paginaAtual = 0;


// Cada item representa uma página dupla.

let paginasLivro = [];


// ============================================================
// INICIAR
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    iniciarLivro
);


function iniciarLivro() {

    console.log(
        "Página individual do livro iniciada."
    );


    carregarLivro();


    configurarScrapbook();

}


// ============================================================
// PEGAR ID PELA URL
// ============================================================

function obterIdLivro() {

    const parametros =
        new URLSearchParams(
            window.location.search
        );


    return parametros.get("id");

}


// ============================================================
// CARREGAR LIVRO
// ============================================================

function carregarLivro() {

    const id =
        obterIdLivro();


    if (!id) {

        mostrarErroLivro(
            "Nenhum livro foi selecionado."
        );

        return;

    }


    const livros =
        obterLivros();


    livroAtual =
        livros.find(
            function (livro) {

                return String(livro.id) ===
                    String(id);

            }
        );


    if (!livroAtual) {

        mostrarErroLivro(
            "O livro não foi encontrado."
        );

        return;

    }


    console.log(
        "Livro encontrado:",
        livroAtual
    );


    mostrarCabecalho();


    mostrarCapa();


    criarPaginas();


    configurarBotoes();


    mostrarScrapbook();

}


// ============================================================
// CABEÇALHO
// ============================================================

function mostrarCabecalho() {

    const titulo =
        document.getElementById(
            "tituloLivro"
        );


    const autor =
        document.getElementById(
            "autorLivro"
        );


    if (titulo) {

        titulo.textContent =
            livroAtual.titulo ||
            "Livro sem título";

    }


    if (autor) {

        autor.textContent =
            livroAtual.autor
                ? `por ${livroAtual.autor}`
                : "Autor desconhecido";

    }


    document.title =
        `${livroAtual.titulo || "Livro"} | Biblioteca Pessoal`;

}


// ============================================================
// MOSTRAR CAPA
// ============================================================

function mostrarCapa() {

    const capa =
        document.getElementById(
            "capaFechada"
        );


    if (!capa) {
        return;
    }


    if (livroAtual.capa) {

        capa.innerHTML = `

            <img
                src="${livroAtual.capa}"
                alt="Capa de ${escaparHTML(livroAtual.titulo)}"
            >

        `;

    } else {

        capa.innerHTML = `

            <div
                style="
                    width:100%;
                    height:100%;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    background:linear-gradient(135deg,#6D4C41,#8D6E63);
                    color:white;
                    font-size:90px;
                "
            >
                📖
            </div>

        `;

    }


    capa.addEventListener(
        "click",
        abrirLivro,
        {
            once: true
        }
    );

}


// ============================================================
// ABRIR LIVRO
// ============================================================

function abrirLivro() {

    const capa =
        document.getElementById(
            "capaFechada"
        );


    const areaFechada =
        document.getElementById(
            "livroFechadoArea"
        );


    const areaAberta =
        document.getElementById(
            "livroAbertoArea"
        );


    if (!capa || !areaFechada || !areaAberta) {
        return;
    }


    // Começa a animação

    capa.classList.add(
        "abrindo"
    );


    // Espera a animação terminar

    setTimeout(
        function () {

            areaFechada.style.display =
                "none";


            areaAberta.classList.add(
                "visivel"
            );


            paginaAtual = 0;


            mostrarPagina();

        },
        750
    );

}


// ============================================================
// CRIAR PÁGINAS
// ============================================================

function criarPaginas() {

    paginasLivro = [];


    // --------------------------------------------------------
    // PÁGINA 1
    // --------------------------------------------------------

    paginasLivro.push({

        esquerda: criarPaginaApresentacao(),

        direita: criarPaginaFicha()

    });


    // --------------------------------------------------------
    // PÁGINA 2
    // --------------------------------------------------------

    paginasLivro.push({

        esquerda: criarPaginaPersonagens(),

        direita: criarPaginaResenha()

    });


    // --------------------------------------------------------
    // PÁGINA 3
    // --------------------------------------------------------

    paginasLivro.push({

        esquerda: criarPaginaDatas(),

        direita: criarPaginaFinal()

    });


    atualizarContador();

}


// ============================================================
// PÁGINA DE APRESENTAÇÃO
// ============================================================

function criarPaginaApresentacao() {

    return `

        <span class="etiqueta-pagina">
            MINHA LEITURA
        </span>


        <h2>
            ${escaparHTML(
                livroAtual.titulo ||
                "Sem título"
            )}
        </h2>


        <p class="autor-pagina">
            ${escaparHTML(
                livroAtual.autor ||
                "Autor desconhecido"
            )}
        </p>


        <div class="linha-decorativa">
            ✦ ✦ ✦
        </div>


        <p>
            Este livro faz parte da sua
            biblioteca pessoal.
        </p>

    `;

}


// ============================================================
// FICHA
// ============================================================

function criarPaginaFicha() {

    const avaliacao =
        Number(
            livroAtual.avaliacao
        ) || 0;


    return `

        <span class="etiqueta-pagina">
            FICHA DO LIVRO
        </span>


        <h2>
            Informações
        </h2>


        <div class="ficha-livro">


            <div>

                <strong>
                    Gênero
                </strong>

                <span>
                    ${escaparHTML(
                        livroAtual.genero ||
                        "Não informado"
                    )}
                </span>

            </div>


            <div>

                <strong>
                    Formato
                </strong>

                <span>
                    ${formatarTexto(
                        livroAtual.formato
                    )}
                </span>

            </div>


            <div>

                <strong>
                    Origem
                </strong>

                <span>
                    ${formatarTexto(
                        livroAtual.origem
                    )}
                </span>

            </div>


            <div>

                <strong>
                    Status
                </strong>

                <span>
                    ${formatarTexto(
                        livroAtual.status
                    )}
                </span>

            </div>


        </div>


        <div class="avaliacao-grande">

            <span>
                ${gerarEstrelas(
                    avaliacao
                )}
            </span>


            <strong>
                ${
                    avaliacao
                        ? avaliacao.toFixed(1)
                        : "Sem avaliação"
                }
            </strong>

        </div>

    `;

}


// ============================================================
// PERSONAGENS
// ============================================================

function criarPaginaPersonagens() {

    const personagens =
        Array.isArray(
            livroAtual.personagens
        )
            ? livroAtual.personagens
            : [];


    let conteudo;


    if (personagens.length === 0) {

        conteudo = `

            <p class="sem-conteudo">
                Você ainda não cadastrou
                personagens favoritos.
            </p>

        `;

    } else {

        conteudo = `

            <div class="personagens-lista">

                ${
                    personagens
                        .map(
                            function (personagem) {

                                return `

                                    <span
                                        class="personagem-tag"
                                    >
                                        ❤️
                                        ${escaparHTML(
                                            personagem
                                        )}
                                    </span>

                                `;

                            }
                        )
                        .join("")
                }

            </div>

        `;

    }


    return `

        <span class="etiqueta-pagina">
            PERSONAGENS
        </span>


        <h2>
            Meus favoritos
        </h2>


        ${conteudo}

    `;

}


// ============================================================
// RESENHA
// ============================================================

function criarPaginaResenha() {

    if (!livroAtual.resenha) {

        return `

            <span class="etiqueta-pagina">
                MINHA OPINIÃO
            </span>


            <h2>
                Resenha
            </h2>


            <p class="sem-conteudo">
                Você ainda não escreveu
                uma resenha para este livro.
            </p>

        `;

    }


    return `

        <span class="etiqueta-pagina">
            MINHA OPINIÃO
        </span>


        <h2>
            Resenha
        </h2>


        <p class="resenha-texto">
            ${escaparHTML(
                livroAtual.resenha
            )}
        </p>

    `;

}


// ============================================================
// DATAS
// ============================================================

function criarPaginaDatas() {

    return `

        <span class="etiqueta-pagina">
            MINHA LEITURA
        </span>


        <h2>
            Quando li?
        </h2>


        <div class="ficha-livro">

            <div>

                <strong>
                    Comecei
                </strong>

                <span>
                    ${formatarData(
                        livroAtual.inicio
                    )}
                </span>

            </div>


            <div>

                <strong>
                    Terminei
                </strong>

                <span>
                    ${formatarData(
                        livroAtual.fim
                    )}
                </span>

            </div>

        </div>


        <div class="linha-decorativa">
            ✦
        </div>


        <p>
            Esta página registra
            sua jornada de leitura.
        </p>

    `;

}


// ============================================================
// PÁGINA FINAL
// ============================================================

function criarPaginaFinal() {

    return `

        <div
            style="
                text-align:center;
            "
        >

            <div
                style="
                    font-size:70px;
                    margin-bottom:20px;
                "
            >
                📚
            </div>


            <span class="etiqueta-pagina">
                BIBLIOTECA PESSOAL
            </span>


            <h2>
                Fim da leitura
            </h2>


            <p>
                Suas memórias deste livro
                estão guardadas no seu scrapbook.
            </p>


            <div class="linha-decorativa">
                ✦ ✦ ✦
            </div>

        </div>

    `;

}


// ============================================================
// MOSTRAR PÁGINA
// ============================================================

function mostrarPagina() {

    if (
        paginaAtual < 0 ||
        paginaAtual >= paginasLivro.length
    ) {

        return;

    }


    const esquerda =
        document.getElementById(
            "conteudoPaginaEsquerda"
        );


    const direita =
        document.getElementById(
            "conteudoPaginaDireita"
        );


    if (!esquerda || !direita) {
        return;
    }


    esquerda.innerHTML =
        paginasLivro[paginaAtual].esquerda;


    direita.innerHTML =
        paginasLivro[paginaAtual].direita;


    atualizarContador();


    atualizarBotoes();

}


// ============================================================
// PRÓXIMA PÁGINA
// ============================================================

function proximaPagina() {

    if (
        paginaAtual >=
        paginasLivro.length - 1
    ) {

        return;

    }


    const paginas =
        document.querySelectorAll(
            ".pagina"
        );


    paginas.forEach(
        function (pagina) {

            pagina.classList.remove(
                "voltando"
            );

            pagina.classList.add(
                "virando"
            );

        }
    );


    setTimeout(
        function () {

            paginaAtual++;

            mostrarPagina();

        },
        350
    );

}


// ============================================================
// PÁGINA ANTERIOR
// ============================================================

function paginaAnterior() {

    if (paginaAtual <= 0) {
        return;
    }


    const paginas =
        document.querySelectorAll(
            ".pagina"
        );


    paginas.forEach(
        function (pagina) {

            pagina.classList.remove(
                "virando"
            );

            pagina.classList.add(
                "voltando"
            );

        }
    );


    setTimeout(
        function () {

            paginaAtual--;

            mostrarPagina();

        },
        350
    );

}


// ============================================================
// CONTADOR
// ============================================================

function atualizarContador() {

    const contador =
        document.getElementById(
            "contadorPagina"
        );


    if (!contador) {
        return;
    }


    contador.textContent =
        `${paginaAtual + 1} / ${paginasLivro.length}`;

}


// ============================================================
// BOTÕES
// ============================================================

function atualizarBotoes() {

    const anterior =
        document.getElementById(
            "botaoAnterior"
        );


    const proxima =
        document.getElementById(
            "botaoProxima"
        );


    if (anterior) {

        anterior.disabled =
            paginaAtual === 0;

    }


    if (proxima) {

        proxima.disabled =
            paginaAtual ===
            paginasLivro.length - 1;

    }

}


// ============================================================
// CONFIGURAR BOTÕES
// ============================================================

function configurarBotoes() {

    const anterior =
        document.getElementById(
            "botaoAnterior"
        );


    const proxima =
        document.getElementById(
            "botaoProxima"
        );


    if (anterior) {

        anterior.addEventListener(
            "click",
            paginaAnterior
        );

    }


    if (proxima) {

        proxima.addEventListener(
            "click",
            proximaPagina
        );

    }


    const excluir =
        document.getElementById(
            "botaoExcluir"
        );


    if (excluir) {

        excluir.addEventListener(
            "click",
            excluirLivro
        );

    }


    const editar =
        document.getElementById(
            "botaoEditar"
        );


    if (editar) {

        editar.addEventListener(
            "click",
            function () {

                window.location.href =
                    `adicionar-livro.html?id=${encodeURIComponent(livroAtual.id)}`;

            }
        );

    }

}


// ============================================================
// EXCLUIR LIVRO
// ============================================================

function excluirLivro() {

    if (!livroAtual) {
        return;
    }


    const confirmou =
        confirm(
            `Deseja realmente excluir "${livroAtual.titulo}"?`
        );


    if (!confirmou) {
        return;
    }


    const livros =
        obterLivros();


    const novosLivros =
        livros.filter(
            function (livro) {

                return String(livro.id) !==
                    String(livroAtual.id);

            }
        );


    salvarLivros(
        novosLivros
    );


    alert(
        "Livro excluído com sucesso."
    );


    window.location.href =
        "../index.html";

}


// ============================================================
// SCRAPBOOK
// ============================================================

function configurarScrapbook() {

    const formulario =
        document.getElementById(
            "formScrapbook"
        );


    if (!formulario) {
        return;
    }


    formulario.addEventListener(
        "submit",
        adicionarScrap
    );

}


// ============================================================
// ADICIONAR SCRAP
// ============================================================

function adicionarScrap(evento) {

    evento.preventDefault();


    if (!livroAtual) {
        return;
    }


    const tipo =
        document.getElementById(
            "tipoScrap"
        ).value;


    const texto =
        document.getElementById(
            "textoScrap"
        ).value.trim();


    const arquivo =
        document.getElementById(
            "fotoScrap"
        ).files[0];


    const adesivo =
        document.getElementById(
            "adesivoScrap"
        ).value;


    // --------------------------------------------
    // MEMÓRIA
    // --------------------------------------------

    const memoria = {

        id:
            gerarId(),

        tipo:
            tipo,

        texto:
            texto,

        imagem:
            "",

        adesivo:
            adesivo,

        criadaEm:
            new Date().toISOString()

    };


    // --------------------------------------------
    // FOTO
    // --------------------------------------------

    if (arquivo) {

        const leitor =
            new FileReader();


        leitor.onload =
            function () {

                memoria.imagem =
                    leitor.result;


                salvarScrap(
                    memoria
                );

            };


        leitor.readAsDataURL(
            arquivo
        );

        return;

    }


    salvarScrap(
        memoria
    );

}


// ============================================================
// SALVAR SCRAP
// ============================================================

function salvarScrap(memoria) {

    if (
        !Array.isArray(
            livroAtual.scrapbook
        )
    ) {

        livroAtual.scrapbook = [];

    }


    livroAtual.scrapbook.push(
        memoria
    );


    atualizarLivro();


    document
        .getElementById(
            "formScrapbook"
        )
        .reset();


    mostrarScrapbook();

}


// ============================================================
// ATUALIZAR LIVRO NO STORAGE
// ============================================================

function atualizarLivro() {

    const livros =
        obterLivros();


    const indice =
        livros.findIndex(
            function (livro) {

                return String(livro.id) ===
                    String(livroAtual.id);

            }
        );


    if (indice === -1) {
        return;
    }


    livros[indice] =
        livroAtual;


    salvarLivros(
        livros
    );

}


// ============================================================
// MOSTRAR SCRAPBOOK
// ============================================================

function mostrarScrapbook() {

    const grid =
        document.getElementById(
            "scrapbookGrid"
        );


    if (!grid) {
        return;
    }


    grid.innerHTML = "";


    const memorias =
        Array.isArray(
            livroAtual.scrapbook
        )
            ? livroAtual.scrapbook
            : [];


    if (memorias.length === 0) {

        grid.innerHTML = `

            <div class="scrapbook-vazio">

                <span>
                    📖
                </span>

                <strong>
                    Seu scrapbook ainda está vazio.
                </strong>

                <p>
                    Adicione sua primeira memória.
                </p>

            </div>

        `;

        return;

    }


    memorias.forEach(
        function (memoria) {

            grid.appendChild(
                criarScrapElemento(
                    memoria
                )
            );

        }
    );

}


// ============================================================
// CRIAR ITEM DO SCRAPBOOK
// ============================================================

function criarScrapElemento(
    memoria
) {

    const item =
        document.createElement(
            "article"
        );


    item.className =
        "scrap-item";


    let classe =
        "scrap-nota";


    if (memoria.tipo === "foto") {

        classe =
            "scrap-foto";

    }


    if (memoria.tipo === "frase") {

        classe =
            "scrap-frase";

    }


    if (memoria.tipo === "adesivo") {

        classe =
            "scrap-adesivo";

    }


    item.classList.add(
        classe
    );


    // --------------------------------------------
    // CONTEÚDO
    // --------------------------------------------

    let conteudo = "";


    if (memoria.tipo === "foto") {

        conteudo = `

            ${
                memoria.imagem

                    ? `
                        <img
                            src="${memoria.imagem}"
                            alt="Memória do livro"
                        >
                    `

                    : `
                        <div class="scrap-conteudo">
                            📷
                        </div>
                    `
            }

        `;

    }


    else if (
        memoria.tipo === "frase"
    ) {

        conteudo = `

            <div class="scrap-conteudo">

                <div class="scrap-icone">
                    💬
                </div>

                <blockquote>
                    ${escaparHTML(
                        memoria.texto ||
                        "Frase sem texto"
                    )}
                </blockquote>

            </div>

        `;

    }


    else if (
        memoria.tipo === "adesivo"
    ) {

        conteudo = `

            <div
                class="scrap-conteudo adesivo-conteudo"
            >
                ${memoria.adesivo || "⭐"}
            </div>

        `;

    }


    else {

        conteudo = `

            <div class="scrap-conteudo">

                <div class="scrap-icone">
                    📝
                </div>

                <div>
                    ${escaparHTML(
                        memoria.texto ||
                        "Nota sem texto"
                    )}
                </div>

            </div>

        `;

    }


    item.innerHTML = `

        <button
            type="button"
            class="scrap-excluir"
            title="Excluir memória"
        >
            ×
        </button>

        ${conteudo}

    `;


    const excluir =
        item.querySelector(
            ".scrap-excluir"
        );


    excluir.addEventListener(
        "click",
        function () {

            excluirScrap(
                memoria.id
            );

        }
    );


    return item;

}


// ============================================================
// EXCLUIR SCRAP
// ============================================================

function excluirScrap(id) {

    const confirmou =
        confirm(
            "Deseja excluir esta memória?"
        );


    if (!confirmou) {
        return;
    }


    livroAtual.scrapbook =
        livroAtual.scrapbook.filter(
            function (memoria) {

                return String(memoria.id) !==
                    String(id);

            }
        );


    atualizarLivro();


    mostrarScrapbook();

}


// ============================================================
// FORMATAR DATA
// ============================================================

function formatarData(data) {

    if (!data) {

        return "Não informado";

    }


    const partes =
        String(data).split("-");


    if (partes.length !== 3) {

        return data;

    }


    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


// ============================================================
// FORMATAR CAMPOS
// ============================================================

function formatarTexto(valor) {

    if (!valor) {

        return "Não informado";

    }


    const mapa = {

        fisico: "Livro físico",

        ebook: "E-book",

        audiobook: "Audiobook",

        comprado: "Comprado",

        presente: "Presente",

        emprestado: "Emprestado",

        lendo: "Lendo",

        lido: "Lido",

        quero_ler: "Quero ler"

    };


    return mapa[valor] ||
        valor;

}


// ============================================================
// ESTRELAS
// ============================================================

function gerarEstrelas(
    avaliacao
) {

    let resultado = "";


    for (
        let i = 1;
        i <= 5;
        i++
    ) {

        if (
            avaliacao >= i
        ) {

            resultado += "★";

        } else {

            resultado += "☆";

        }

    }


    return resultado;

}


// ============================================================
// ESCAPAR HTML
// ============================================================

function escaparHTML(
    texto
) {

    return String(
        texto ?? ""
    )

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


// ============================================================
// ERRO
// ============================================================

function mostrarErroLivro(
    mensagem
) {

    const area =
        document.getElementById(
            "livroFechadoArea"
        );


    if (area) {

        area.innerHTML = `

            <div
                class="scrapbook-vazio"
            >

                <span>
                    🔎
                </span>

                <h2>
                    Livro não encontrado
                </h2>

                <p>
                    ${mensagem}
                </p>

                <a
                    href="../index.html"
                    class="botao-principal"
                >
                    Voltar para biblioteca
                </a>

            </div>

        `;

    }

}