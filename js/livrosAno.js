// ============================================================
// BIBLIOTECA PESSOAL
// Arquivo: js/livrosAno.js
//
// Responsável por:
// - carregar os livros cadastrados
// - criar filtros automaticamente
// - agrupar livros por ano
// - mostrar estatísticas
// - abrir o livro selecionado
// ============================================================


// ============================================================
// ELEMENTOS
// ============================================================

const filtroAno =
    document.getElementById(
        "filtroAno"
    );


const filtroAutor =
    document.getElementById(
        "filtroAutor"
    );


const filtroGenero =
    document.getElementById(
        "filtroGenero"
    );


const filtroAvaliacao =
    document.getElementById(
        "filtroAvaliacao"
    );


const listaLivrosAno =
    document.getElementById(
        "listaLivrosAno"
    );


const resumoAno =
    document.getElementById(
        "resumoAno"
    );


const limparFiltros =
    document.getElementById(
        "limparFiltros"
    );


// ============================================================
// PEGAR LIVROS
// ============================================================

let listaLivros =
    obterLivros();


// ============================================================
// ESCAPAR HTML
// ============================================================

function escaparHTML(texto) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        texto || "";

    return div.innerHTML;

}


// ============================================================
// ESTRELAS
// ============================================================

function gerarEstrelas(
    avaliacao
) {

    const nota =
        Number(
            avaliacao || 0
        );


    if (!nota) {

        return "☆☆☆☆☆";

    }


    let estrelas = "";


    for (
        let i = 1;
        i <= 5;
        i++
    ) {

        if (nota >= i) {

            estrelas += "★";

        } else if (
            nota >= i - 0.5
        ) {

            estrelas += "⯨";

        } else {

            estrelas += "☆";

        }

    }


    return estrelas;

}


// ============================================================
// DESCOBRIR ANO DO LIVRO
// ============================================================
//
// Preferimos a data de término.
// Caso não exista, usamos a data de início.
//
// ============================================================

function descobrirAno(
    livro
) {

    const data =
        livro.fim ||
        livro.inicio;


    if (!data) {

        return "Sem ano";

    }


    const ano =
        new Date(
            data + "T00:00:00"
        ).getFullYear();


    if (
        Number.isNaN(ano)
    ) {

        return "Sem ano";

    }


    return String(ano);

}


// ============================================================
// PREENCHER FILTRO DE ANOS
// ============================================================

function preencherAnos() {

    const anos =
        [
            ...new Set(
                listaLivros
                    .map(
                        descobrirAno
                    )
                    .filter(
                        ano =>
                            ano !==
                            "Sem ano"
                    )
            )
        ]
        .sort(
            (a, b) =>
                Number(b) -
                Number(a)
        );


    filtroAno.innerHTML = `

        <option value="todos">
            Todos os anos
        </option>

    `;


    anos.forEach(
        ano => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                ano;


            option.textContent =
                ano;


            filtroAno.appendChild(
                option
            );

        }
    );

}


// ============================================================
// PREENCHER AUTORES
// ============================================================

function preencherAutores() {

    const autores =
        [
            ...new Set(
                listaLivros
                    .map(
                        livro =>
                            livro.autor
                    )
                    .filter(Boolean)
            )
        ]
        .sort(
            (a, b) =>
                a.localeCompare(
                    b,
                    "pt-BR"
                )
        );


    filtroAutor.innerHTML = `

        <option value="todos">
            Todos os autores
        </option>

    `;


    autores.forEach(
        autor => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                autor;


            option.textContent =
                autor;


            filtroAutor.appendChild(
                option
            );

        }
    );

}


// ============================================================
// PREENCHER GÊNEROS
// ============================================================

function preencherGeneros() {

    const generos =
        [
            ...new Set(
                listaLivros
                    .map(
                        livro =>
                            livro.genero
                    )
                    .filter(Boolean)
            )
        ]
        .sort(
            (a, b) =>
                a.localeCompare(
                    b,
                    "pt-BR"
                )
        );


    filtroGenero.innerHTML = `

        <option value="todos">
            Todos os gêneros
        </option>

    `;


    generos.forEach(
        genero => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                genero;


            option.textContent =
                genero;


            filtroGenero.appendChild(
                option
            );

        }
    );

}


// ============================================================
// FILTRAR LIVROS
// ============================================================

function obterLivrosFiltrados() {

    const ano =
        filtroAno.value;


    const autor =
        filtroAutor.value;


    const genero =
        filtroGenero.value;


    const avaliacao =
        filtroAvaliacao.value;


    return listaLivros.filter(
        livro => {

            const anoLivro =
                descobrirAno(
                    livro
                );


            const passouAno =
                ano === "todos" ||
                anoLivro === ano;


            const passouAutor =
                autor === "todos" ||
                livro.autor === autor;


            const passouGenero =
                genero === "todos" ||
                livro.genero === genero;


            const nota =
                Number(
                    livro.avaliacao || 0
                );


            const passouAvaliacao =
                avaliacao === "todos" ||
                nota >=
                    Number(
                        avaliacao
                    );


            return (
                passouAno &&
                passouAutor &&
                passouGenero &&
                passouAvaliacao
            );

        }
    );

}


// ============================================================
// RESUMO
// ============================================================

function renderizarResumo(
    livros
) {

    if (!livros.length) {

        resumoAno.innerHTML = "";

        return;

    }


    const avaliados =
        livros.filter(
            livro =>
                Number(
                    livro.avaliacao || 0
                ) > 0
        );


    const soma =
        avaliados.reduce(
            (
                total,
                livro
            ) =>
                total +
                Number(
                    livro.avaliacao
                ),
            0
        );


    const media =
        avaliados.length
            ? (
                soma /
                avaliados.length
            ).toFixed(1)
            : "0";


    const fisicos =
        livros.filter(
            livro =>
                livro.formato ===
                "Livro Físico"
        ).length;


    const ebooks =
        livros.filter(
            livro =>
                livro.formato ===
                "Ebook"
        ).length;


    const audiobooks =
        livros.filter(
            livro =>
                livro.formato ===
                "Audiobook"
        ).length;


    resumoAno.innerHTML = `

        <div class="resumo-card">

            <span>
                📚
            </span>

            <strong>
                ${livros.length}
            </strong>

            <small>
                ${
                    livros.length === 1
                        ? "livro"
                        : "livros"
                }
            </small>

        </div>


        <div class="resumo-card">

            <span>
                ⭐
            </span>

            <strong>
                ${media}
            </strong>

            <small>
                média
            </small>

        </div>


        <div class="resumo-card">

            <span>
                📖
            </span>

            <strong>
                ${fisicos}
            </strong>

            <small>
                físicos
            </small>

        </div>


        <div class="resumo-card">

            <span>
                📱
            </span>

            <strong>
                ${ebooks}
            </strong>

            <small>
                ebooks
            </small>

        </div>


        <div class="resumo-card">

            <span>
                🎧
            </span>

            <strong>
                ${audiobooks}
            </strong>

            <small>
                audiobooks
            </small>

        </div>

    `;

}


// ============================================================
// RENDERIZAR LIVROS
// ============================================================

function renderizarLivros() {

    const filtrados =
        obterLivrosFiltrados();


    renderizarResumo(
        filtrados
    );


    listaLivrosAno.innerHTML = "";


    if (!filtrados.length) {

        listaLivrosAno.innerHTML = `

            <div class="estado-vazio">

                <div>
                    📚
                </div>

                <h3>
                    Nenhum livro encontrado
                </h3>

                <p>
                    Tente mudar os filtros
                    ou cadastre um novo livro.
                </p>

                <a
                    href="adicionar-livro.html"
                    class="botao-principal"
                >
                    ➕ Adicionar livro
                </a>

            </div>

        `;

        return;

    }


    // ========================================================
    // AGRUPAR POR ANO
    // ========================================================

    const grupos = {};


    filtrados.forEach(
        livro => {

            const ano =
                descobrirAno(
                    livro
                );


            if (!grupos[ano]) {

                grupos[ano] = [];

            }


            grupos[ano].push(
                livro
            );

        }
    );


    // ========================================================
    // ORDENAR ANOS
    // ========================================================

    const anos =
        Object.keys(
            grupos
        ).sort(
            (a, b) => {

                if (
                    a === "Sem ano"
                ) {

                    return 1;

                }


                if (
                    b === "Sem ano"
                ) {

                    return -1;

                }


                return (
                    Number(b) -
                    Number(a)
                );

            }
        );


    // ========================================================
    // CRIAR CADA ANO
    // ========================================================

    anos.forEach(
        ano => {

            const secao =
                document.createElement(
                    "section"
                );


            secao.className =
                "grupo-ano";


            const titulo =
                document.createElement(
                    "div"
                );


            titulo.className =
                "titulo-ano";


            titulo.innerHTML = `

                <div>

                    <span>
                        ${ano}
                    </span>

                    <small>
                        ${grupos[ano].length}
                        ${
                            grupos[ano].length === 1
                                ? " livro"
                                : " livros"
                        }
                    </small>

                </div>

                <div class="linha-ano"></div>

            `;


            secao.appendChild(
                titulo
            );


            const grid =
                document.createElement(
                    "div"
                );


            grid.className =
                "grid-livros-ano";


            grupos[ano]
                .forEach(
                    livro => {

                        grid.appendChild(
                            criarCardLivro(
                                livro
                            )
                        );

                    }
                );


            secao.appendChild(
                grid
            );


            listaLivrosAno.appendChild(
                secao
            );

        }
    );

}


// ============================================================
// CRIAR CARD
// ============================================================

function criarCardLivro(
    livro
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "card-livro-ano";


    card.tabIndex = 0;


    const capa =
        livro.capa ||
        "../assets/icons/livro-sem-capa.png";


    const nota =
        Number(
            livro.avaliacao || 0
        );


    card.innerHTML = `

        <div class="capa-card-ano">

            <img
                src="${capa}"
                alt="${escaparHTML(
                    livro.titulo
                )}"
            >

        </div>


        <div class="info-card-ano">

            <h3>
                ${escaparHTML(
                    livro.titulo
                )}
            </h3>

            <p>
                ${escaparHTML(
                    livro.autor ||
                    "Autor desconhecido"
                )}
            </p>


            <div class="card-ano-detalhes">

                ${
                    livro.genero
                        ? `
                            <span>
                                ${escaparHTML(
                                    livro.genero
                                )}
                            </span>
                          `
                        : ""
                }

            </div>


            <div class="card-ano-nota">

                <span>
                    ${gerarEstrelas(
                        nota
                    )}
                </span>

                ${
                    nota
                        ? `<strong>${nota}</strong>`
                        : ""
                }

            </div>

        </div>

    `;


    card.addEventListener(
        "click",
        function () {

            abrirLivro(
                livro.id
            );

        }
    );


    card.addEventListener(
        "keydown",
        function (evento) {

            if (
                evento.key === "Enter" ||
                evento.key === " "
            ) {

                evento.preventDefault();

                abrirLivro(
                    livro.id
                );

            }

        }
    );


    return card;

}


// ============================================================
// ABRIR LIVRO
// ============================================================

function abrirLivro(
    id
) {

    window.location.href =
        `livro.html?id=${encodeURIComponent(
            id
        )}`;

}


// ============================================================
// EVENTOS DOS FILTROS
// ============================================================

[
    filtroAno,
    filtroAutor,
    filtroGenero,
    filtroAvaliacao
]
.forEach(
    filtro => {

        filtro.addEventListener(
            "change",
            renderizarLivros
        );

    }
);


// ============================================================
// LIMPAR FILTROS
// ============================================================

limparFiltros.addEventListener(
    "click",
    function () {

        filtroAno.value =
            "todos";

        filtroAutor.value =
            "todos";

        filtroGenero.value =
            "todos";

        filtroAvaliacao.value =
            "todos";


        renderizarLivros();

    }
);


// ============================================================
// INICIALIZAÇÃO
// ============================================================

preencherAnos();

preencherAutores();

preencherGeneros();

renderizarLivros();