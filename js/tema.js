// ============================================================
// BIBLIOTECA PESSOAL
// Arquivo: js/tema.js
//
// Responsabilidade:
// - Salvar configurações da biblioteca
// - Aplicar o tema em todas as páginas
// - Aplicar modo claro/escuro
// - Atualizar nome da biblioteca
// - Atualizar nome do usuário
// - Atualizar foto de perfil
// - Atualizar meta anual
// - Controlar a página de configurações
// ============================================================


// ============================================================
// CONFIGURAÇÕES
// ============================================================

const CHAVE_CONFIGURACAO = "configuracaoBiblioteca";

const CONFIGURACAO_PADRAO = {

    nome: "Leitor",

    nomeBiblioteca: "Minha Biblioteca",

    fotoPerfil: "",

    tema: "classico",

    modoTela: "claro",

    metaAnual: 12,

    bibliotecaPrivada: false,

    mostrarEstatisticas: true

};


// ============================================================
// OBTER CONFIGURAÇÃO
// ============================================================

function obterConfiguracao() {

    try {

        const dados =
            localStorage.getItem(CHAVE_CONFIGURACAO);

        if (!dados) {

            return {
                ...CONFIGURACAO_PADRAO
            };

        }

        const configuracaoSalva =
            JSON.parse(dados);

        return {

            ...CONFIGURACAO_PADRAO,

            ...configuracaoSalva

        };

    } catch (erro) {

        console.error(
            "Erro ao carregar configurações:",
            erro
        );

        return {
            ...CONFIGURACAO_PADRAO
        };

    }

}


// ============================================================
// SALVAR CONFIGURAÇÃO
// ============================================================

function salvarConfiguracaoCentral(configuracao) {

    try {

        const configuracaoFinal = {

            ...CONFIGURACAO_PADRAO,

            ...configuracao

        };

        localStorage.setItem(
            CHAVE_CONFIGURACAO,
            JSON.stringify(configuracaoFinal)
        );

        return true;

    } catch (erro) {

        console.error(
            "Erro ao salvar configurações:",
            erro
        );

        return false;

    }

}


// ============================================================
// APLICAR TEMA
// ============================================================
//
// Adicionamos uma classe no <body>:
//
// tema-classico
// tema-academia
// tema-cottagecore
// tema-sombrio
//
// Isso permite que o CSS altere toda a interface.
// ============================================================

function aplicarTemaGlobal() {

    const configuracao =
        obterConfiguracao();

    const tema =
        configuracao.tema || "classico";

    const body =
        document.body;

    if (!body) {
        return;
    }


    // Remove temas anteriores

    body.classList.remove(
        "tema-classico",
        "tema-academia",
        "tema-cottagecore",
        "tema-sombrio"
    );


    // Aplica o tema escolhido

    body.classList.add(
        `tema-${tema}`
    );


    // Guarda também como atributo

    body.dataset.tema = tema;

}


// ============================================================
// APLICAR MODO DE TELA
// ============================================================

function aplicarModoGlobal(modo) {

    const body =
        document.body;

    if (!body) {
        return;
    }


    body.classList.remove(
        "modo-claro",
        "modo-escuro"
    );


    // ========================================================
    // MODO AUTOMÁTICO
    // ========================================================

    if (modo === "automatico") {

        const sistemaEscuro =
            window.matchMedia &&
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;


        body.classList.add(
            sistemaEscuro
                ? "modo-escuro"
                : "modo-claro"
        );

        return;

    }


    // ========================================================
    // MODO ESCURO
    // ========================================================

    if (modo === "escuro") {

        body.classList.add(
            "modo-escuro"
        );

        return;

    }


    // ========================================================
    // MODO CLARO
    // ========================================================

    body.classList.add(
        "modo-claro"
    );

}


// ============================================================
// APLICAR TODAS AS CONFIGURAÇÕES VISUAIS
// ============================================================

function aplicarConfiguracoesVisuais() {

    const configuracao =
        obterConfiguracao();


    aplicarTemaGlobal();

    aplicarModoGlobal(
        configuracao.modoTela
    );


    atualizarNomeBiblioteca();

    atualizarNomeUsuario();

    atualizarFotoPerfilGlobal();

    atualizarMetaGlobal();

}


// ============================================================
// ATUALIZAR NOME DA BIBLIOTECA
// ============================================================

function atualizarNomeBiblioteca() {

    const configuracao =
        obterConfiguracao();

    const nome =
        configuracao.nomeBiblioteca ||
        "Minha Biblioteca";


    // Logo da lateral

    const elementoLogo =
        document.getElementById(
            "nomeBiblioteca"
        );

    if (elementoLogo) {

        elementoLogo.textContent =
            nome;

    }


    // Título principal

    const titulo =
        document.querySelector(
            ".cabecalho-principal h1"
        );

    if (titulo) {

        titulo.textContent =
            `Biblioteca de ${nome}`;

    }


    // Caso o projeto utilize outro cabeçalho

    const tituloTopo =
        document.querySelector(
            ".topo h1"
        );

    if (tituloTopo) {

        tituloTopo.textContent =
            `Biblioteca de ${nome}`;

    }

}


// ============================================================
// ATUALIZAR NOME DO USUÁRIO
// ============================================================

function atualizarNomeUsuario() {

    const configuracao =
        obterConfiguracao();

    const nome =
        configuracao.nome ||
        "Leitor";


    const elementos =
        document.querySelectorAll(
            "#usuarioNome"
        );


    elementos.forEach(
        elemento => {

            elemento.textContent =
                nome;

        }
    );

}


// ============================================================
// ATUALIZAR FOTO DE PERFIL
// ============================================================

function atualizarFotoPerfilGlobal() {

    const configuracao =
        obterConfiguracao();

    const foto =
        configuracao.fotoPerfil || "";


    const elementos =
        document.querySelectorAll(
            "#fotoPerfilGlobal"
        );


    elementos.forEach(
        elemento => {

            atualizarElementoFoto(
                elemento,
                foto
            );

        }
    );

}


// ============================================================
// DESENHAR FOTO
// ============================================================

function atualizarElementoFoto(
    elemento,
    foto
) {

    if (!elemento) {
        return;
    }


    if (foto) {

        elemento.innerHTML = "";


        const imagem =
            document.createElement(
                "img"
            );


        imagem.src =
            foto;

        imagem.alt =
            "Foto de perfil";


        elemento.appendChild(
            imagem
        );

    } else {

        elemento.textContent =
            "👤";

    }

}


// ============================================================
// ATUALIZAR META
// ============================================================

function atualizarMetaGlobal() {

    const configuracao =
        obterConfiguracao();

    const meta =
        Number(
            configuracao.metaAnual
        );


    const metaFinal =
        Number.isFinite(meta) &&
        meta >= 0
            ? meta
            : 12;


    const elementos =
        document.querySelectorAll(
            "#metaLeitura"
        );


    elementos.forEach(
        elemento => {

            elemento.textContent =
                metaFinal;

        }
    );

}


// ============================================================
// ATUALIZAR CAMPOS DA PÁGINA
// DE CONFIGURAÇÕES
// ============================================================

function atualizarConfiguracoesNaPagina() {

    const configuracao =
        obterConfiguracao();


    const nomeUsuario =
        document.getElementById(
            "nomeUsuario"
        );

    if (nomeUsuario) {

        nomeUsuario.value =
            configuracao.nome || "";

    }


    const nomeBiblioteca =
        document.getElementById(
            "nomeBiblioteca"
        );

    if (nomeBiblioteca) {

        nomeBiblioteca.value =
            configuracao.nomeBiblioteca || "";

    }


    const meta =
        document.getElementById(
            "metaAnual"
        );

    if (meta) {

        meta.value =
            configuracao.metaAnual || 12;

    }


    const bibliotecaPrivada =
        document.getElementById(
            "bibliotecaPrivada"
        );

    if (bibliotecaPrivada) {

        bibliotecaPrivada.checked =
            Boolean(
                configuracao.bibliotecaPrivada
            );

    }


    const mostrarEstatisticas =
        document.getElementById(
            "mostrarEstatisticas"
        );

    if (mostrarEstatisticas) {

        mostrarEstatisticas.checked =
            configuracao.mostrarEstatisticas !== false;

    }


    // Tema

    const temaSelecionado =
        document.querySelector(
            `input[name="tema"][value="${configuracao.tema}"]`
        );

    if (temaSelecionado) {

        temaSelecionado.checked =
            true;

    }


    // Modo

    const modoSelecionado =
        document.querySelector(
            `input[name="modoTela"][value="${configuracao.modoTela}"]`
        );

    if (modoSelecionado) {

        modoSelecionado.checked =
            true;

    }


    // Foto

    mostrarFotoConfiguracao(
        configuracao.fotoPerfil
    );

}


// ============================================================
// EDITOR DE CONFIGURAÇÕES
// ============================================================

function iniciarEditorConfiguracoes() {

    const paginaConfiguracoes =
        document.getElementById(
            "salvarConfiguracoes"
        );


    // Se não existe o botão,
    // não estamos na página de configurações.

    if (!paginaConfiguracoes) {

        return;

    }


    atualizarConfiguracoesNaPagina();

    configurarEditorTema();

    configurarEditorModo();

    configurarEditorFoto();

    configurarEditorMeta();

    configurarBotaoSalvarConfiguracao();

    configurarExportacaoConfiguracao();

    configurarImportacaoConfiguracao();

    configurarApagarConfiguracao();

}


// ============================================================
// EDITOR DE TEMA
// ============================================================

function configurarEditorTema() {

    const temas =
        document.querySelectorAll(
            'input[name="tema"]'
        );


    temas.forEach(
        radio => {

            radio.addEventListener(
                "change",
                function () {

                    if (!this.checked) {
                        return;
                    }


                    const configuracao =
                        obterConfiguracao();


                    configuracao.tema =
                        this.value;


                    salvarConfiguracaoCentral(
                        configuracao
                    );


                    aplicarTemaGlobal();

                }
            );

        }
    );

}


// ============================================================
// EDITOR DE MODO
// ============================================================

function configurarEditorModo() {

    const modos =
        document.querySelectorAll(
            'input[name="modoTela"]'
        );


    modos.forEach(
        radio => {

            radio.addEventListener(
                "change",
                function () {

                    if (!this.checked) {
                        return;
                    }


                    const configuracao =
                        obterConfiguracao();


                    configuracao.modoTela =
                        this.value;


                    salvarConfiguracaoCentral(
                        configuracao
                    );


                    aplicarModoGlobal(
                        this.value
                    );

                }
            );

        }
    );

}


// ============================================================
// EDITOR DE FOTO
// ============================================================

function configurarEditorFoto() {

    const input =
        document.getElementById(
            "fotoPerfil"
        );

    if (!input) {
        return;
    }


    input.addEventListener(
        "change",
        function () {

            const arquivo =
                this.files &&
                this.files[0];


            if (!arquivo) {
                return;
            }


            if (!arquivo.type.startsWith("image/")) {

                alert(
                    "Escolha uma imagem válida."
                );

                this.value = "";

                return;

            }


            const leitor =
                new FileReader();


            leitor.onload =
                function (evento) {

                    const configuracao =
                        obterConfiguracao();


                    configuracao.fotoPerfil =
                        evento.target.result;


                    salvarConfiguracaoCentral(
                        configuracao
                    );


                    mostrarFotoConfiguracao(
                        configuracao.fotoPerfil
                    );


                    atualizarFotoPerfilGlobal();

                };


            leitor.readAsDataURL(
                arquivo
            );

        }
    );


    const remover =
        document.getElementById(
            "removerFoto"
        );


    if (remover) {

        remover.addEventListener(
            "click",
            function () {

                const configuracao =
                    obterConfiguracao();


                configuracao.fotoPerfil =
                    "";


                salvarConfiguracaoCentral(
                    configuracao
                );


                mostrarFotoConfiguracao(
                    ""
                );


                atualizarFotoPerfilGlobal();


                input.value = "";

            }
        );

    }

}


// ============================================================
// MOSTRAR FOTO NA PÁGINA DE CONFIGURAÇÕES
// ============================================================

function mostrarFotoConfiguracao(foto) {

    const preview =
        document.getElementById(
            "fotoPerfilPreview"
        );


    if (!preview) {
        return;
    }


    if (foto) {

        preview.innerHTML =
            `<img src="${foto}" alt="Foto de perfil">`;

    } else {

        preview.innerHTML =
            "👤";

    }

}


// ============================================================
// EDITOR DA META
// ============================================================

function configurarEditorMeta() {

    const campo =
        document.getElementById(
            "metaAnual"
        );


    const texto =
        document.getElementById(
            "textoMeta"
        );


    if (!campo) {
        return;
    }


    function atualizarTexto() {

        if (!texto) {
            return;
        }


        texto.textContent =
            `${campo.value || 0} livros`;

    }


    campo.addEventListener(
        "input",
        atualizarTexto
    );


    atualizarTexto();

}


// ============================================================
// BOTÃO SALVAR
// ============================================================

function configurarBotaoSalvarConfiguracao() {

    const botao =
        document.getElementById(
            "salvarConfiguracoes"
        );


    if (!botao) {
        return;
    }


    botao.addEventListener(
        "click",
        function () {

            const configuracao =
                obterConfiguracao();


            const nomeUsuario =
                document.getElementById(
                    "nomeUsuario"
                );


            const nomeBiblioteca =
                document.getElementById(
                    "nomeBiblioteca"
                );


            const meta =
                document.getElementById(
                    "metaAnual"
                );


            const bibliotecaPrivada =
                document.getElementById(
                    "bibliotecaPrivada"
                );


            const mostrarEstatisticas =
                document.getElementById(
                    "mostrarEstatisticas"
                );


            // --------------------------------------------
            // Nome
            // --------------------------------------------

            if (nomeUsuario) {

                configuracao.nome =
                    nomeUsuario.value.trim() ||
                    "Leitor";

            }


            // --------------------------------------------
            // Nome da biblioteca
            // --------------------------------------------

            if (nomeBiblioteca) {

                configuracao.nomeBiblioteca =
                    nomeBiblioteca.value.trim() ||
                    "Minha Biblioteca";

            }


            // --------------------------------------------
            // Meta
            // --------------------------------------------

            if (meta) {

                let valor =
                    Number(
                        meta.value
                    );


                if (
                    !Number.isFinite(valor) ||
                    valor < 0
                ) {

                    valor = 12;

                }


                configuracao.metaAnual =
                    valor;

            }


            // --------------------------------------------
            // Privacidade
            // --------------------------------------------

            if (bibliotecaPrivada) {

                configuracao.bibliotecaPrivada =
                    bibliotecaPrivada.checked;

            }


            // --------------------------------------------
            // Estatísticas
            // --------------------------------------------

            if (mostrarEstatisticas) {

                configuracao.mostrarEstatisticas =
                    mostrarEstatisticas.checked;

            }


            // --------------------------------------------
            // Salvar
            // --------------------------------------------

            const sucesso =
                salvarConfiguracaoCentral(
                    configuracao
                );


            if (!sucesso) {

                alert(
                    "Não foi possível salvar as configurações."
                );

                return;

            }


            // --------------------------------------------
            // Aplicar imediatamente
            // --------------------------------------------

            aplicarConfiguracoesVisuais();


            const status =
                document.getElementById(
                    "statusConfiguracao"
                );


            if (status) {

                status.textContent =
                    "✓ Configurações salvas com sucesso!";

                status.classList.add(
                    "visivel"
                );

            }


            // --------------------------------------------
            // Pequeno retorno visual
            // --------------------------------------------

            setTimeout(
                function () {

                    if (status) {

                        status.classList.remove(
                            "visivel"
                        );

                    }

                },
                3000
            );

        }
    );

}


// ============================================================
// EXPORTAR DADOS
// ============================================================

function configurarExportacaoConfiguracao() {

    const botao =
        document.getElementById(
            "exportarDados"
        );


    if (!botao) {
        return;
    }


    botao.addEventListener(
        "click",
        function () {

            const dados =
                obterDadosBackup();


            const conteudo =
                JSON.stringify(
                    dados,
                    null,
                    4
                );


            const arquivo =
                new Blob(
                    [conteudo],
                    {
                        type:
                            "application/json"
                    }
                );


            const url =
                URL.createObjectURL(
                    arquivo
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href =
                url;

            link.download =
                "backup-biblioteca-pessoal.json";


            document.body.appendChild(
                link
            );


            link.click();


            link.remove();


            URL.revokeObjectURL(
                url
            );

        }
    );

}


// ============================================================
// IMPORTAR DADOS
// ============================================================

function configurarImportacaoConfiguracao() {

    const input =
        document.getElementById(
            "importarDados"
        );


    if (!input) {
        return;
    }


    input.addEventListener(
        "change",
        function () {

            const arquivo =
                this.files &&
                this.files[0];


            if (!arquivo) {
                return;
            }


            const leitor =
                new FileReader();


            leitor.onload =
                function (evento) {

                    try {

                        const dados =
                            JSON.parse(
                                evento.target.result
                            );


                        if (
                            dados.configuracaoBiblioteca
                        ) {

                            salvarConfiguracaoCentral(
                                dados.configuracaoBiblioteca
                            );

                        }


                        Object.keys(dados).forEach(
                            chave => {

                                if (
                                    chave ===
                                    "configuracaoBiblioteca"
                                ) {

                                    return;

                                }


                                localStorage.setItem(
                                    chave,
                                    typeof dados[chave] === "string"
                                        ? dados[chave]
                                        : JSON.stringify(
                                            dados[chave]
                                        )
                                );

                            }
                        );


                        alert(
                            "Dados importados com sucesso. A página será recarregada."
                        );


                        location.reload();


                    } catch (erro) {

                        console.error(
                            erro
                        );


                        alert(
                            "O arquivo selecionado não é um backup válido."
                        );

                    }

                };


            leitor.readAsText(
                arquivo
            );

        }
    );

}


// ============================================================
// APAGAR BIBLIOTECA
// ============================================================

function configurarApagarConfiguracao() {

    const botao =
        document.getElementById(
            "apagarBiblioteca"
        );


    if (!botao) {
        return;
    }


    botao.addEventListener(
        "click",
        function () {

            const confirmar =
                confirm(
                    "Tem certeza que deseja apagar todos os dados da biblioteca?"
                );


            if (!confirmar) {
                return;
            }


            localStorage.clear();


            alert(
                "Todos os dados foram apagados."
            );


            location.reload();

        }
    );

}


// ============================================================
// BACKUP
// ============================================================

function obterDadosBackup() {

    const dados = {};


    for (
        let i = 0;
        i < localStorage.length;
        i++
    ) {

        const chave =
            localStorage.key(i);


        if (!chave) {
            continue;
        }


        const valor =
            localStorage.getItem(
                chave
            );


        try {

            dados[chave] =
                JSON.parse(valor);

        } catch {

            dados[chave] =
                valor;

        }

    }


    return dados;

}


// ============================================================
// MODO AUTOMÁTICO
// ============================================================

function observarModoAutomatico() {

    if (
        !window.matchMedia
    ) {

        return;

    }


    const media =
        window.matchMedia(
            "(prefers-color-scheme: dark)"
        );


    media.addEventListener(
        "change",
        function () {

            const configuracao =
                obterConfiguracao();


            if (
                configuracao.modoTela ===
                "automatico"
            ) {

                aplicarModoGlobal(
                    "automatico"
                );

            }

        }
    );

}


// ============================================================
// INICIALIZAÇÃO GLOBAL
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        aplicarConfiguracoesVisuais();

        atualizarConfiguracoesNaPagina();

        iniciarEditorConfiguracoes();

        observarModoAutomatico();

    }
);