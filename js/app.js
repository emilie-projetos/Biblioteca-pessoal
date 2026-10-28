// ============================================================
// BIBLIOTECA PESSOAL
// Arquivo: js/app.js
//
// Responsável pela página inicial:
// - carregar livros salvos
// - mostrar livros na estante
// - mostrar estatísticas
// - mostrar nome da biblioteca
// - mostrar nome do usuário
// - mostrar foto de perfil
// - mostrar meta anual
// - abrir o livro individual
// ============================================================


// ============================================================
// CONFIGURAÇÕES
// ============================================================

function obterConfiguracaoApp() {

    try {

        const dados =
            localStorage.getItem(
                "configuracaoBiblioteca"
            );


        if (!dados) {

            return {

                nome: "Leitor",

                nomeBiblioteca:
                    "Minha Biblioteca",

                fotoPerfil: "",

                metaAnual: 12

            };

        }


        return {

            nome: "Leitor",

            nomeBiblioteca:
                "Minha Biblioteca",

            fotoPerfil: "",

            metaAnual: 12,

            ...JSON.parse(dados)

        };

    } catch (erro) {

        console.error(
            "Erro ao carregar configuração:",
            erro
        );


        return {

            nome: "Leitor",

            nomeBiblioteca:
                "Minha Biblioteca",

            fotoPerfil: "",

            metaAnual: 12

        };

    }

}


// ============================================================
// INICIALIZAÇÃO
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "================================="
        );

        console.log(
            "BIBLIOTECA PESSOAL"
        );

        console.log(
            "Página inicial carregada."
        );

        console.log(
            "================================="
        );


        // Carrega livros e estatísticas.

        carregarBiblioteca();


        // Carrega configurações.

        carregarConfiguracao();

    }
);


// ============================================================
// CARREGA TODOS OS DADOS DA BIBLIOTECA
// ============================================================

function carregarBiblioteca() {

    const livros =
        obterLivros();


    console.log(
        "Livros encontrados:",
        livros
    );


    console.log(
        "Quantidade de livros:",
        livros.length
    );


    // --------------------------------------------------------
    // ESTANTE
    // --------------------------------------------------------

    mostrarLivrosNaEstante(
        livros
    );


    // --------------------------------------------------------
    // ESTATÍSTICAS
    // --------------------------------------------------------

    atualizarEstatisticas(
        livros
    );

}


// ============================================================
// MOSTRA OS LIVROS NA ESTANTE
// ============================================================

function mostrarLivrosNaEstante(
    livros
) {

    const estante =
        document.getElementById(
            "estante"
        );


    if (!estante) {

        console.error(
            "ERRO: elemento #estante não encontrado."
        );

        return;

    }


    estante.innerHTML = "";


    // --------------------------------------------------------
    // BIBLIOTECA VAZIA
    // --------------------------------------------------------

    if (
        !livros ||
        livros.length === 0
    ) {

        estante.innerHTML = `

            <div class="biblioteca-vazia">

                <div class="biblioteca-vazia-icone">
                    📚
                </div>

                <h2>
                    Sua estante está vazia
                </h2>

                <p>
                    Você ainda não cadastrou nenhum livro.
                </p>

                <a
                    href="pages/adicionar-livro.html"
                    class="botao-principal"
                >
                    + Adicionar primeiro livro
                </a>

            </div>

        `;

        return;

    }


    // --------------------------------------------------------
    // MOSTRA CADA LIVRO
    // --------------------------------------------------------

    livros.forEach(
        function (livro) {

            const elemento =
                criarLivro(
                    livro
                );


            estante.appendChild(
                elemento
            );

        }
    );

}


// ============================================================
// CRIA O ELEMENTO VISUAL DO LIVRO
// ============================================================

function criarLivro(
    livro
) {

    const elemento =
        document.createElement(
            "div"
        );


    elemento.className =
        "livro";


    elemento.dataset.id =
        livro.id;


    // --------------------------------------------------------
    // CAPA
    // --------------------------------------------------------

    let capa;


    if (livro.capa) {

        capa = `

            <img
                src="${livro.capa}"
                alt="Capa de ${escaparHTML(
                    livro.titulo
                )}"
            >

        `;

    } else {

        capa = `

            <div class="capa-sem-imagem">
                📖
            </div>

        `;

    }


    // --------------------------------------------------------
    // AVALIAÇÃO
    // --------------------------------------------------------

    const avaliacao =
        Number(
            livro.avaliacao
        ) || 0;


    const estrelas =
        gerarEstrelas(
            avaliacao
        );


    // --------------------------------------------------------
    // CONTEÚDO
    // --------------------------------------------------------

    elemento.innerHTML = `

        <div class="livro-capa">

            ${capa}

        </div>


        <div class="livro-detalhes">

            <h3>
                ${escaparHTML(
                    livro.titulo ||
                    "Sem título"
                )}
            </h3>


            <p class="livro-autor">

                ${escaparHTML(
                    livro.autor ||
                    "Autor desconhecido"
                )}

            </p>


            <p class="livro-genero">

                ${escaparHTML(
                    livro.genero ||
                    "Sem gênero"
                )}

            </p>


            <div class="livro-estrelas">

                ${estrelas}

            </div>

        </div>

    `;


    // --------------------------------------------------------
    // CLIQUE
    // --------------------------------------------------------

    elemento.addEventListener(
        "click",
        function () {

            console.log(
                "Abrindo livro:",
                livro
            );


            window.location.href =
                "pages/livro.html?id=" +
                encodeURIComponent(
                    livro.id
                );

        }
    );


    return elemento;

}


// ============================================================
// ESTRELAS
// ============================================================

function gerarEstrelas(
    avaliacao
) {

    if (!avaliacao) {

        return `

            <span class="sem-avaliacao">
                Sem avaliação
            </span>

        `;

    }


    let resultado = "";


    for (
        let numero = 1;
        numero <= 5;
        numero++
    ) {

        if (
            avaliacao >= numero
        ) {

            resultado += "★";

        } else if (
            avaliacao >= numero - 0.5
        ) {

            resultado += "½";

        } else {

            resultado += "☆";

        }

    }


    return resultado;

}


// ============================================================
// ESTATÍSTICAS
// ============================================================

function atualizarEstatisticas(
    livros
) {

    // ========================================================
    // TOTAL DE LIVROS
    // ========================================================

    definirTexto(
        "totalLivros",
        livros.length
    );


    // ========================================================
    // MÉDIA DAS AVALIAÇÕES
    // ========================================================

    const avaliados =
        livros.filter(
            function (livro) {

                return (
                    Number(
                        livro.avaliacao
                    ) > 0
                );

            }
        );


    let media = 0;


    if (
        avaliados.length > 0
    ) {

        const soma =
            avaliados.reduce(
                function (
                    total,
                    livro
                ) {

                    return (
                        total +
                        Number(
                            livro.avaliacao
                        )
                    );

                },
                0
            );


        media =
            soma /
            avaliados.length;

    }


    definirTexto(
        "mediaAvaliacoes",
        media > 0
            ? media.toFixed(1)
            : "0"
    );


    // ========================================================
    // FORMATOS
    // ========================================================

    const fisicos =
        livros.filter(
            function (livro) {

                return (
                    livro.formato ===
                    "fisico"
                );

            }
        ).length;


    const ebooks =
        livros.filter(
            function (livro) {

                return (
                    livro.formato ===
                    "ebook"
                );

            }
        ).length;


    const audiobooks =
        livros.filter(
            function (livro) {

                return (
                    livro.formato ===
                    "audiobook"
                );

            }
        ).length;


    definirTexto(
        "totalFisicos",
        fisicos
    );


    definirTexto(
        "totalEbooks",
        ebooks
    );


    definirTexto(
        "totalAudiobooks",
        audiobooks
    );


    // ========================================================
    // ORIGEM
    // ========================================================

    const comprados =
        livros.filter(
            function (livro) {

                return (
                    livro.origem ===
                    "comprado"
                );

            }
        ).length;


    const presentes =
        livros.filter(
            function (livro) {

                return (
                    livro.origem ===
                    "presente"
                );

            }
        ).length;


    const emprestados =
        livros.filter(
            function (livro) {

                return (
                    livro.origem ===
                    "emprestado"
                );

            }
        ).length;


    definirTexto(
        "totalComprados",
        comprados
    );


    definirTexto(
        "totalPresentes",
        presentes
    );


    definirTexto(
        "totalEmprestados",
        emprestados
    );


    // ========================================================
    // AUTOR MAIS LIDO
    // ========================================================

    const autorMaisLido =
        encontrarMaisFrequente(
            livros,
            "autor"
        );


    definirTexto(
        "autorMaisLido",
        autorMaisLido ||
        "Nenhum"
    );


    // ========================================================
    // GÊNERO MAIS LIDO
    // ========================================================

    const generoMaisLido =
        encontrarMaisFrequente(
            livros,
            "genero"
        );


    definirTexto(
        "generoMaisLido",
        generoMaisLido ||
        "Nenhum"
    );


    // ========================================================
    // META ANUAL
    // ========================================================

    atualizarMetaAnual(
        livros
    );

}


// ============================================================
// META ANUAL
// ============================================================

function atualizarMetaAnual(
    livros
) {

    // AQUI ESTÁ A CORREÇÃO IMPORTANTE:
    //
    // Antes estava procurando:
    //
    // "bibliotecaConfiguracao"
    //
    // Agora usa a mesma chave das configurações:
    //
    // "configuracaoBiblioteca"

    const configuracao =
        obterConfiguracaoApp();


    let meta =
        Number(
            configuracao.metaAnual
        );


    if (
        !Number.isFinite(meta) ||
        meta < 0
    ) {

        meta = 12;

    }


    definirTexto(
        "metaLeitura",
        meta
    );


    // --------------------------------------------------------
    // ANO ATUAL
    // --------------------------------------------------------

    const anoAtual =
        new Date()
            .getFullYear()
            .toString();


    const livrosDoAno =
        livros.filter(
            function (livro) {

                const data =
                    livro.fim ||
                    livro.inicio ||
                    "";


                return data.startsWith(
                    anoAtual
                );

            }
        );


    const quantidade =
        livrosDoAno.length;


    let progresso = 0;


    if (meta > 0) {

        progresso =
            Math.round(
                (
                    quantidade /
                    meta
                ) * 100
            );

    }


    if (
        progresso > 100
    ) {

        progresso = 100;

    }


    definirTexto(
        "progressoMeta",
        progresso + "%"
    );

}


// ============================================================
// CONFIGURAÇÕES DA BIBLIOTECA
// ============================================================

function carregarConfiguracao() {

    const configuracao =
        obterConfiguracaoApp();


    // ========================================================
    // NOME DO USUÁRIO
    // ========================================================

    const usuarioNome =
        document.getElementById(
            "usuarioNome"
        );


    if (usuarioNome) {

        usuarioNome.textContent =
            configuracao.nome ||
            "Leitor";

    }


    // ========================================================
    // NOME DA BIBLIOTECA
    // ========================================================

    const tituloBiblioteca =
        document.querySelector(
            ".cabecalho-principal h1"
        );


    if (tituloBiblioteca) {

        tituloBiblioteca.textContent =
            `Biblioteca de ${
                configuracao.nomeBiblioteca ||
                "Minha Biblioteca"
            }`;

    }


    // ========================================================
    // FOTO DE PERFIL
    // ========================================================

    const fotoPerfil =
        document.getElementById(
            "fotoPerfilGlobal"
        );


    if (fotoPerfil) {

        if (
            configuracao.fotoPerfil
        ) {

            fotoPerfil.innerHTML = `

                <img
                    src="${configuracao.fotoPerfil}"
                    alt="Foto de perfil"
                >

            `;

        } else {

            fotoPerfil.innerHTML =
                "👤";

        }

    }

}


// ============================================================
// ENCONTRA O ITEM MAIS FREQUENTE
// ============================================================

function encontrarMaisFrequente(
    livros,
    propriedade
) {

    if (
        !livros.length
    ) {

        return "";

    }


    const contagem = {};


    livros.forEach(
        function (livro) {

            const valor =
                String(
                    livro[propriedade] ||
                    ""
                ).trim();


            if (!valor) {
                return;
            }


            contagem[valor] =
                (
                    contagem[valor] ||
                    0
                ) + 1;

        }
    );


    let maior = 0;

    let resultado = "";


    Object.keys(
        contagem
    ).forEach(
        function (valor) {

            if (
                contagem[valor] >
                maior
            ) {

                maior =
                    contagem[valor];

                resultado =
                    valor;

            }

        }
    );


    return resultado;

}


// ============================================================
// ALTERA O TEXTO DE UM ELEMENTO
// ============================================================

function definirTexto(
    id,
    valor
) {

    const elemento =
        document.getElementById(
            id
        );


    if (!elemento) {

        console.warn(
            `Elemento #${id} não encontrado.`
        );

        return;

    }


    elemento.textContent =
        valor;

}


// ============================================================
// PROTEÇÃO CONTRA HTML INJETADO
// ============================================================

function escaparHTML(
    texto
) {

    return String(texto)

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