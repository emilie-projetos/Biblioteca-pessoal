// ============================================================
// BIBLIOTECA PESSOAL
// Arquivo: js/adicionarLivro.js
//
// Responsável por:
// - cadastrar livros
// - detectar modo edição
// - carregar livro existente
// - alterar informações
// - manter a capa antiga se nenhuma nova for escolhida
// ============================================================


// ============================================================
// VARIÁVEIS
// ============================================================

let livroEditando = null;


// ============================================================
// INICIAR
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    iniciarFormulario
);


function iniciarFormulario() {

    console.log(
        "Formulário de livro carregado."
    );


    verificarModoEdicao();


    configurarPreviewCapa();


    configurarFormulario();

}


// ============================================================
// VERIFICAR SE É EDIÇÃO
// ============================================================

function verificarModoEdicao() {

    const parametros =
        new URLSearchParams(
            window.location.search
        );


    const id =
        parametros.get("id");


    // Não existe ID.
    // Portanto, é um novo livro.

    if (!id) {

        return;

    }


    console.log(
        "Modo edição ativado."
    );


    const livros =
        obterLivros();


    livroEditando =
        livros.find(
            function (livro) {

                return String(livro.id) ===
                    String(id);

            }
        );


    if (!livroEditando) {

        alert(
            "O livro que você tentou editar não foi encontrado."
        );


        window.location.href =
            "../index.html";


        return;

    }


    carregarDadosLivro();


}


// ============================================================
// CARREGAR DADOS NO FORMULÁRIO
// ============================================================

function carregarDadosLivro() {

    document.title =
        "Editar livro | Biblioteca Pessoal";


    const tituloPagina =
        document.getElementById(
            "tituloPagina"
        );


    const descricaoPagina =
        document.getElementById(
            "descricaoPagina"
        );


    const botaoSalvar =
        document.getElementById(
            "botaoSalvar"
        );


    if (tituloPagina) {

        tituloPagina.textContent =
            "Editar livro";

    }


    if (descricaoPagina) {

        descricaoPagina.textContent =
            "Altere as informações da sua leitura.";

    }


    if (botaoSalvar) {

        botaoSalvar.innerHTML =
            "💾 Salvar alterações";

    }


    // --------------------------------------------------------
    // CAMPOS
    // --------------------------------------------------------

    preencherCampo(
        "titulo",
        livroEditando.titulo
    );


    preencherCampo(
        "autor",
        livroEditando.autor
    );


    preencherCampo(
        "genero",
        livroEditando.genero
    );


    preencherCampo(
        "formato",
        livroEditando.formato ||
        "fisico"
    );


    preencherCampo(
        "inicio",
        livroEditando.inicio
    );


    preencherCampo(
        "fim",
        livroEditando.fim
    );


    preencherCampo(
        "status",
        livroEditando.status ||
        "quero_ler"
    );


    preencherCampo(
        "avaliacao",
        String(
            livroEditando.avaliacao ||
            0
        )
    );


    preencherCampo(
        "origem",
        livroEditando.origem ||
        "comprado"
    );


    preencherCampo(
        "personagens",
        Array.isArray(
            livroEditando.personagens
        )
            ? livroEditando.personagens.join(", ")
            : ""
    );


    preencherCampo(
        "resenha",
        livroEditando.resenha
    );


    // --------------------------------------------------------
    // CAPA EXISTENTE
    // --------------------------------------------------------

    if (livroEditando.capa) {

        mostrarPreview(
            livroEditando.capa
        );

    }

}


// ============================================================
// PREENCHER CAMPO
// ============================================================

function preencherCampo(
    id,
    valor
) {

    const campo =
        document.getElementById(id);


    if (!campo) {
        return;
    }


    campo.value =
        valor || "";

}


// ============================================================
// PREVIEW DA CAPA
// ============================================================

function configurarPreviewCapa() {

    const input =
        document.getElementById(
            "capa"
        );


    if (!input) {
        return;
    }


    input.addEventListener(
        "change",
        function () {

            const arquivo =
                input.files[0];


            if (!arquivo) {
                return;
            }


            const leitor =
                new FileReader();


            leitor.onload =
                function () {

                    mostrarPreview(
                        leitor.result
                    );

                };


            leitor.readAsDataURL(
                arquivo
            );

        }
    );

}


// ============================================================
// MOSTRAR PREVIEW
// ============================================================

function mostrarPreview(
    imagem
) {

    const preview =
        document.getElementById(
            "previewCapa"
        );


    if (!preview) {
        return;
    }


    preview.innerHTML = `

        <img
            src="${imagem}"
            alt="Prévia da capa"
            style="
                max-width:220px;
                max-height:320px;
                object-fit:cover;
                border-radius:8px;
                box-shadow:0 8px 20px rgba(0,0,0,.2);
                margin-top:15px;
            "
        >

    `;

}


// ============================================================
// CONFIGURAR FORMULÁRIO
// ============================================================

function configurarFormulario() {

    const formulario =
        document.getElementById(
            "formLivro"
        );


    if (!formulario) {

        console.error(
            "Formulário #formLivro não encontrado."
        );

        return;

    }


    formulario.addEventListener(
        "submit",
        salvarFormulario
    );

}


// ============================================================
// SALVAR
// ============================================================

function salvarFormulario(
    evento
) {

    evento.preventDefault();


    // --------------------------------------------------------
    // CAMPOS
    // --------------------------------------------------------

    const titulo =
        obterValor("titulo");


    const autor =
        obterValor("autor");


    const genero =
        obterValor("genero");


    const formato =
        obterValor("formato");


    const inicio =
        obterValor("inicio");


    const fim =
        obterValor("fim");


    const status =
        obterValor("status");


    const avaliacao =
        Number(
            obterValor("avaliacao")
        ) || 0;


    const origem =
        obterValor("origem");


    const personagensTexto =
        obterValor("personagens");


    const resenha =
        obterValor("resenha");


    // --------------------------------------------------------
    // VALIDAÇÃO
    // --------------------------------------------------------

    if (!titulo) {

        alert(
            "Digite o título do livro."
        );

        document
            .getElementById("titulo")
            .focus();

        return;

    }


    if (!autor) {

        alert(
            "Digite o autor do livro."
        );

        document
            .getElementById("autor")
            .focus();

        return;

    }


    // --------------------------------------------------------
    // PERSONAGENS
    // --------------------------------------------------------

    const personagens =
        personagensTexto

            .split(",")

            .map(
                function (nome) {

                    return nome.trim();

                }
            )

            .filter(
                function (nome) {

                    return nome.length > 0;

                }
            );


    // --------------------------------------------------------
    // CAPA
    // --------------------------------------------------------

    const inputCapa =
        document.getElementById(
            "capa"
        );


    const arquivoCapa =
        inputCapa &&
        inputCapa.files
            ? inputCapa.files[0]
            : null;


    // --------------------------------------------------------
    // NOVO LIVRO
    // --------------------------------------------------------

    if (!livroEditando) {

        const livro = {

            id:
                gerarId(),

            titulo:
                titulo,

            autor:
                autor,

            genero:
                genero,

            capa:
                "",

            inicio:
                inicio,

            fim:
                fim,

            formato:
                formato,

            origem:
                origem,

            status:
                status,

            avaliacao:
                avaliacao,

            personagens:
                personagens,

            resenha:
                resenha,

            scrapbook:
                [],

            criadoEm:
                new Date().toISOString()

        };


        if (arquivoCapa) {

            lerImagem(
                arquivoCapa,
                function (imagem) {

                    livro.capa =
                        imagem;


                    finalizarCadastro(
                        livro
                    );

                }
            );

        } else {

            finalizarCadastro(
                livro
            );

        }


        return;

    }


    // --------------------------------------------------------
    // EDIÇÃO
    // --------------------------------------------------------

    livroEditando.titulo =
        titulo;


    livroEditando.autor =
        autor;


    livroEditando.genero =
        genero;


    livroEditando.inicio =
        inicio;


    livroEditando.fim =
        fim;


    livroEditando.formato =
        formato;


    livroEditando.origem =
        origem;


    livroEditando.status =
        status;


    livroEditando.avaliacao =
        avaliacao;


    livroEditando.personagens =
        personagens;


    livroEditando.resenha =
        resenha;


    // --------------------------------------------------------
    // SE ESCOLHEU NOVA CAPA
    // --------------------------------------------------------

    if (arquivoCapa) {

        lerImagem(
            arquivoCapa,
            function (imagem) {

                livroEditando.capa =
                    imagem;


                finalizarEdicao();

            }
        );

    } else {

        // Mantém a capa antiga.

        finalizarEdicao();

    }

}


// ============================================================
// LER IMAGEM
// ============================================================

function lerImagem(
    arquivo,
    callback
) {

    const leitor =
        new FileReader();


    leitor.onload =
        function () {

            callback(
                leitor.result
            );

        };


    leitor.onerror =
        function () {

            alert(
                "Não foi possível carregar a imagem."
            );

        };


    leitor.readAsDataURL(
        arquivo
    );

}


// ============================================================
// FINALIZAR CADASTRO
// ============================================================

function finalizarCadastro(
    livro
) {

    const sucesso =
        adicionarLivro(
            livro
        );


    if (!sucesso) {

        alert(
            "Não foi possível salvar o livro."
        );

        return;

    }


    alert(
        "Livro adicionado com sucesso! 📚"
    );


    window.location.href =
        "../index.html";

}


// ============================================================
// FINALIZAR EDIÇÃO
// ============================================================

function finalizarEdicao() {

    const livros =
        obterLivros();


    const indice =
        livros.findIndex(
            function (livro) {

                return String(livro.id) ===
                    String(livroEditando.id);

            }
        );


    if (indice === -1) {

        alert(
            "Não foi possível encontrar o livro para atualizar."
        );

        return;

    }


    livros[indice] =
        livroEditando;


    const sucesso =
        salvarLivros(
            livros
        );


    if (!sucesso) {

        alert(
            "Não foi possível salvar as alterações."
        );

        return;

    }


    alert(
        "Livro atualizado com sucesso! ✨"
    );


    window.location.href =
        `livro.html?id=${encodeURIComponent(livroEditando.id)}`;

}


// ============================================================
// OBTER VALOR
// ============================================================

function obterValor(id) {

    const campo =
        document.getElementById(id);


    if (!campo) {
        return "";
    }


    return campo.value.trim();

}