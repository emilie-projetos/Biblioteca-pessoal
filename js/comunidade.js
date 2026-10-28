// ============================================================
// BIBLIOTECA PESSOAL
// Arquivo: js/comunidade.js
//
// Sistema de comunidade.
// Os dados são armazenados no localStorage.
//
// IMPORTANTE:
// Esta versão é local. Para comunidade realmente online,
// será necessário conectar um backend futuramente.
// ============================================================


// ============================================================
// CONFIGURAÇÕES
// ============================================================

const CHAVE_COMUNIDADE = "biblioteca_comunidade";

const LIMITE_MEMBROS = 100;

let dadosComunidade = null;

let clubeAtualId = null;


// ============================================================
// INICIALIZAÇÃO
// ============================================================

document.addEventListener("DOMContentLoaded", iniciarComunidade);


function iniciarComunidade() {

    carregarDadosComunidade();

    configurarAbasPrincipais();

    configurarModais();

    configurarEventosGlobais();

    configurarCriacaoClube();

    configurarEventosClube();

    configurarFormularioMensagem();

    configurarFormularioEvento();

    configurarFormularioMeta();

    configurarFormularioEnquete();

    configurarFormularioEdicaoClube();

    configurarExclusaoClube();

    configurarConvite();

    renderizarClubes();

    renderizarClubesDescobrir();

    renderizarComunidadesLivros();
}


// ============================================================
// BANCO LOCAL
// ============================================================

function carregarDadosComunidade() {

    const dadosSalvos =
        localStorage.getItem(CHAVE_COMUNIDADE);


    if (dadosSalvos) {

        try {

            dadosComunidade =
                JSON.parse(dadosSalvos);

        } catch (erro) {

            console.error(
                "Erro ao carregar comunidade:",
                erro
            );

            dadosComunidade = criarBancoComunidade();
        }

    } else {

        dadosComunidade = criarBancoComunidade();
    }


    normalizarDados();

    salvarDadosComunidade();
}


function criarBancoComunidade() {

    return {

        clubes: [],

        comunidadesLivros: []

    };
}


function normalizarDados() {

    if (!dadosComunidade) {

        dadosComunidade =
            criarBancoComunidade();
    }


    if (!Array.isArray(dadosComunidade.clubes)) {

        dadosComunidade.clubes = [];
    }


    if (
        !Array.isArray(
            dadosComunidade.comunidadesLivros
        )
    ) {

        dadosComunidade.comunidadesLivros = [];
    }


    dadosComunidade.clubes.forEach(clube => {

        if (!Array.isArray(clube.membros)) {
            clube.membros = [];
        }

        if (!Array.isArray(clube.mensagens)) {
            clube.mensagens = [];
        }

        if (!Array.isArray(clube.eventos)) {
            clube.eventos = [];
        }

        if (!Array.isArray(clube.metas)) {
            clube.metas = [];
        }

        if (!Array.isArray(clube.enquetes)) {
            clube.enquetes = [];
        }

    });
}


function salvarDadosComunidade() {

    try {

        localStorage.setItem(
            CHAVE_COMUNIDADE,
            JSON.stringify(dadosComunidade)
        );

        return true;

    } catch (erro) {

        console.error(
            "Erro ao salvar comunidade:",
            erro
        );

        return false;
    }
}


// ============================================================
// ID
// ============================================================

function gerarIdComunidade() {

    return (
        Date.now().toString(36) +
        Math.random()
            .toString(36)
            .substring(2, 9)
    );
}


// ============================================================
// ABAS PRINCIPAIS
// ============================================================

function configurarAbasPrincipais() {

    const abas =
        document.querySelectorAll(
            ".aba-comunidade"
        );


    abas.forEach(aba => {

        aba.addEventListener(
            "click",
            () => {

                const nomeAba =
                    aba.dataset.aba;


                abas.forEach(item => {

                    item.classList.remove(
                        "ativa"
                    );

                });


                document
                    .querySelectorAll(
                        ".conteudo-aba-comunidade"
                    )
                    .forEach(conteudo => {

                        conteudo.classList.remove(
                            "ativa"
                        );

                    });


                aba.classList.add("ativa");


                const destino =
                    document.getElementById(
                        `aba${capitalizar(nomeAba)}`
                    );


                if (destino) {

                    destino.classList.add(
                        "ativa"
                    );
                }

            }
        );

    });
}


// ============================================================
// ABAS INTERNAS DO CLUBE
// ============================================================

function configurarAbasClube() {

    const abas =
        document.querySelectorAll(
            ".aba-clube"
        );


    abas.forEach(aba => {

        aba.addEventListener(
            "click",
            () => {

                const nomeAba =
                    aba.dataset.clubeAba;


                document
                    .querySelectorAll(
                        ".aba-clube"
                    )
                    .forEach(item => {

                        item.classList.remove(
                            "ativa"
                        );

                    });


                document
                    .querySelectorAll(
                        ".conteudo-clube"
                    )
                    .forEach(conteudo => {

                        conteudo.classList.remove(
                            "ativo"
                        );

                    });


                aba.classList.add("ativa");


                const conteudo =
                    document.querySelector(
                        `[data-conteudo-clube="${nomeAba}"]`
                    );


                if (conteudo) {

                    conteudo.classList.add(
                        "ativo"
                    );
                }

            }
        );

    });
}


// ============================================================
// MODAIS
// ============================================================

function configurarModais() {

    document
        .querySelectorAll(
            "[data-fechar-modal]"
        )
        .forEach(botao => {

            botao.addEventListener(
                "click",
                () => {

                    fecharModal(
                        botao.dataset.fecharModal
                    );

                }
            );

        });


    document
        .querySelectorAll(
            ".modal-comunidade"
        )
        .forEach(modal => {

            modal.addEventListener(
                "click",
                evento => {

                    if (
                        evento.target === modal
                    ) {

                        modal.classList.remove(
                            "aberto"
                        );

                    }

                }
            );

        });
}


function abrirModal(id) {

    const modal =
        document.getElementById(id);


    if (modal) {

        modal.classList.add("aberto");
    }
}


function fecharModal(id) {

    const modal =
        document.getElementById(id);


    if (modal) {

        modal.classList.remove("aberto");
    }
}


// ============================================================
// EVENTOS GLOBAIS
// ============================================================

function configurarEventosGlobais() {

    const botaoCriar =
        document.getElementById(
            "botaoCriarClube"
        );


    const botaoCriarVazio =
        document.getElementById(
            "botaoCriarClubeVazio"
        );


    if (botaoCriar) {

        botaoCriar.addEventListener(
            "click",
            () => abrirModal("modalClube")
        );

    }


    if (botaoCriarVazio) {

        botaoCriarVazio.addEventListener(
            "click",
            () => abrirModal("modalClube")
        );

    }


    const voltar =
        document.getElementById(
            "botaoVoltarClubes"
        );


    if (voltar) {

        voltar.addEventListener(
            "click",
            fecharPainelClube
        );

    }
}


// ============================================================
// CRIAR CLUBE
// ============================================================

function configurarCriacaoClube() {

    const formulario =
        document.getElementById(
            "formNovoClube"
        );


    if (!formulario) {
        return;
    }


    formulario.addEventListener(
        "submit",
        evento => {

            evento.preventDefault();


            const nome =
                document
                    .getElementById(
                        "nomeClube"
                    )
                    .value
                    .trim();


            const descricao =
                document
                    .getElementById(
                        "descricaoClube"
                    )
                    .value
                    .trim();


            const icone =
                document
                    .getElementById(
                        "iconeClube"
                    )
                    .value;


            const privacidade =
                document
                    .getElementById(
                        "privacidadeClube"
                    )
                    .value;


            if (!nome) {

                alert(
                    "Digite o nome do clube."
                );

                return;
            }


            const clube = {

                id:
                    gerarIdComunidade(),

                codigo:
                    gerarCodigoConvite(),

                nome,

                descricao,

                icone,

                privacidade,

                criadoEm:
                    new Date().toISOString(),

                membros: [

                    {

                        id:
                            gerarIdComunidade(),

                        nome:
                            obterNomeUsuario(),

                        tipo:
                            "Administrador",

                        avatar:
                            "👤"

                    }

                ],

                mensagens: [],

                eventos: [],

                metas: [],

                enquetes: []

            };


            dadosComunidade.clubes.push(
                clube
            );


            salvarDadosComunidade();


            formulario.reset();

            fecharModal("modalClube");


            renderizarClubes();

            renderizarClubesDescobrir();


            abrirClube(clube.id);

        }
    );
}


// ============================================================
// RENDERIZAR CLUBES
// ============================================================

function renderizarClubes() {

    const container =
        document.getElementById(
            "listaClubes"
        );


    const vazio =
        document.getElementById(
            "clubesVazio"
        );


    const contador =
        document.getElementById(
            "contadorClubes"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    const clubes =
        dadosComunidade.clubes;


    contador.textContent =
        `${clubes.length} ${
            clubes.length === 1
                ? "clube"
                : "clubes"
        }`;


    if (!clubes.length) {

        vazio.style.display = "block";

        return;
    }


    vazio.style.display = "none";


    clubes.forEach(clube => {

        container.appendChild(
            criarCartaoClube(clube)
        );

    });
}


// ============================================================
// CLUBES PARA DESCOBRIR
// ============================================================

function renderizarClubesDescobrir() {

    const container =
        document.getElementById(
            "listaClubesDescobrir"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    const clubes =
        dadosComunidade.clubes.filter(
            clube =>
                clube.privacidade === "publico"
        );


    if (!clubes.length) {

        container.innerHTML = `

            <div class="estado-vazio-comunidade">

                <div class="vazio-icone">
                    🔎
                </div>

                <h3>
                    Nenhum clube público
                </h3>

                <p>
                    Crie um clube público para
                    ele aparecer aqui.
                </p>

            </div>

        `;

        return;
    }


    clubes.forEach(clube => {

        container.appendChild(
            criarCartaoClube(clube)
        );

    });
}


// ============================================================
// CARTÃO DO CLUBE
// ============================================================

function criarCartaoClube(clube) {

    const elemento =
        document.createElement("article");


    elemento.className =
        "cartao-clube";


    const quantidadeMembros =
        Array.isArray(clube.membros)
            ? clube.membros.length
            : 0;


    elemento.innerHTML = `

        <div class="cartao-clube-cabecalho">

            <div class="cartao-clube-icone">
                ${escaparHTML(clube.icone)}
            </div>

            <div>

                <h3>
                    ${escaparHTML(clube.nome)}
                </h3>

                <small>
                    ${
                        clube.privacidade === "publico"
                            ? "🌎 Público"
                            : "🔒 Privado"
                    }
                </small>

            </div>

        </div>


        <p>
            ${
                escaparHTML(
                    clube.descricao ||
                    "Clube de leitura."
                )
            }
        </p>


        <div class="cartao-clube-rodape">

            <span class="info-clube">
                👥 ${quantidadeMembros}/100
            </span>

            <span class="info-clube">
                💬 ${
                    clube.mensagens.length
                }
            </span>

        </div>

    `;


    elemento.addEventListener(
        "click",
        () => abrirClube(clube.id)
    );


    return elemento;
}


// ============================================================
// ABRIR CLUBE
// ============================================================

function abrirClube(id) {

    const clube =
        encontrarClube(id);


    if (!clube) {

        alert(
            "Clube não encontrado."
        );

        return;
    }


    clubeAtualId = id;


    const painel =
        document.getElementById(
            "painelClube"
        );


    if (!painel) {
        return;
    }


    document
        .querySelectorAll(
            ".conteudo-aba-comunidade"
        )
        .forEach(item => {

            item.classList.remove(
                "ativa"
            );

        });


    document
        .querySelectorAll(
            ".aba-comunidade"
        )
        .forEach(item => {

            item.classList.remove(
                "ativa"
            );

        });


    painel.classList.add(
        "visivel"
    );


    preencherCabecalhoClube(clube);

    configurarAbasClube();

    renderizarMensagens(clube);

    renderizarEventos(clube);

    renderizarMetas(clube);

    renderizarEnquetes(clube);

    renderizarMembros(clube);

    preencherFormularioEdicao(clube);


    painel.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// ============================================================
// FECHAR PAINEL
// ============================================================

function fecharPainelClube() {

    clubeAtualId = null;


    const painel =
        document.getElementById(
            "painelClube"
        );


    if (painel) {

        painel.classList.remove(
            "visivel"
        );
    }


    renderizarClubes();

    renderizarClubesDescobrir();
}


// ============================================================
// CABEÇALHO DO CLUBE
// ============================================================

function preencherCabecalhoClube(clube) {

    document
        .getElementById(
            "clubeIcone"
        )
        .textContent =
        clube.icone;


    document
        .getElementById(
            "clubeTitulo"
        )
        .textContent =
        clube.nome;


    document
        .getElementById(
            "clubeDescricao"
        )
        .textContent =
        clube.descricao ||
        "Clube de leitura";


    document
        .getElementById(
            "clubePrivacidade"
        )
        .textContent =
        clube.privacidade === "publico"
            ? "PÚBLICO"
            : "PRIVADO";


    document
        .getElementById(
            "resumoMembros"
        )
        .textContent =
        clube.membros.length;


    document
        .getElementById(
            "resumoMetas"
        )
        .textContent =
        clube.metas.length;


    document
        .getElementById(
            "resumoLivro"
        )
        .textContent =
        "—";


    document
        .getElementById(
            "contadorMembros"
        )
        .textContent =
        `${clube.membros.length} / ${LIMITE_MEMBROS}`;
}


// ============================================================
// ENCONTRAR CLUBE
// ============================================================

function encontrarClube(id) {

    return dadosComunidade.clubes.find(
        clube => clube.id === id
    );
}


// ============================================================
// MENSAGENS
// ============================================================

function configurarFormularioMensagem() {

    const formulario =
        document.getElementById(
            "formMensagem"
        );


    if (!formulario) {
        return;
    }


    formulario.addEventListener(
        "submit",
        evento => {

            evento.preventDefault();


            if (!clubeAtualId) {
                return;
            }


            const campo =
                document.getElementById(
                    "textoMensagem"
                );


            const texto =
                campo.value.trim();


            if (!texto) {
                return;
            }


            const clube =
                encontrarClube(
                    clubeAtualId
                );


            if (!clube) {
                return;
            }


            clube.mensagens.push({

                id:
                    gerarIdComunidade(),

                autor:
                    obterNomeUsuario(),

                texto,

                data:
                    new Date().toISOString()

            });


            salvarDadosComunidade();


            campo.value = "";


            renderizarMensagens(clube);

        }
    );
}


function renderizarMensagens(clube) {

    const container =
        document.getElementById(
            "listaMensagens"
        );


    const vazio =
        document.getElementById(
            "mensagensVazio"
        );


    container.innerHTML = "";


    if (!clube.mensagens.length) {

        vazio.style.display = "block";

        return;
    }


    vazio.style.display = "none";


    clube.mensagens.forEach(mensagem => {

        const elemento =
            document.createElement("article");


        elemento.className =
            "mensagem";


        elemento.innerHTML = `

            <div class="mensagem-cabecalho">

                <span class="mensagem-autor">
                    ${escaparHTML(
                        mensagem.autor
                    )}
                </span>

                <span class="mensagem-data">
                    ${formatarDataHora(
                        mensagem.data
                    )}
                </span>

            </div>

            <p class="mensagem-texto">
                ${escaparHTML(
                    mensagem.texto
                )}
            </p>

        `;


        container.appendChild(
            elemento
        );

    });


    container.scrollTop =
        container.scrollHeight;
}


// ============================================================
// CALENDÁRIO
// ============================================================

function configurarEventosClube() {

    const botao =
        document.getElementById(
            "botaoNovoEvento"
        );


    if (botao) {

        botao.addEventListener(
            "click",
            () => {

                if (!clubeAtualId) {
                    return;
                }

                abrirModal("modalEvento");

            }
        );

    }


    const botaoMeta =
        document.getElementById(
            "botaoNovaMeta"
        );


    if (botaoMeta) {

        botaoMeta.addEventListener(
            "click",
            () => {

                if (!clubeAtualId) {
                    return;
                }

                abrirModal("modalMeta");

            }
        );

    }


    const botaoEnquete =
        document.getElementById(
            "botaoNovaEnquete"
        );


    if (botaoEnquete) {

        botaoEnquete.addEventListener(
            "click",
            () => {

                if (!clubeAtualId) {
                    return;
                }

                abrirModal("modalEnquete");

            }
        );

    }


    const botaoCompartilhar =
        document.getElementById(
            "botaoCompartilharClube"
        );


    if (botaoCompartilhar) {

        botaoCompartilhar.addEventListener(
            "click",
            mostrarConvite
        );

    }
}


function configurarFormularioEvento() {

    const formulario =
        document.getElementById(
            "formEvento"
        );


    formulario.addEventListener(
        "submit",
        evento => {

            evento.preventDefault();


            const clube =
                encontrarClube(
                    clubeAtualId
                );


            if (!clube) {
                return;
            }


            const titulo =
                document.getElementById(
                    "tituloEvento"
                ).value.trim();


            const data =
                document.getElementById(
                    "dataEvento"
                ).value;


            const hora =
                document.getElementById(
                    "horaEvento"
                ).value;


            const descricao =
                document.getElementById(
                    "descricaoEvento"
                ).value.trim();


            clube.eventos.push({

                id:
                    gerarIdComunidade(),

                titulo,

                data,

                hora,

                descricao

            });


            salvarDadosComunidade();


            formulario.reset();

            fecharModal("modalEvento");

            renderizarEventos(clube);

        }
    );
}


function renderizarEventos(clube) {

    const container =
        document.getElementById(
            "listaEventos"
        );


    container.innerHTML = "";


    if (!clube.eventos.length) {

        container.innerHTML = `

            <div class="estado-vazio-comunidade">

                <div class="vazio-icone">
                    📅
                </div>

                <h3>
                    Nenhum evento marcado
                </h3>

                <p>
                    Crie o primeiro encontro do clube.
                </p>

            </div>

        `;

        return;
    }


    const eventos =
        [...clube.eventos].sort(
            (a, b) =>
                a.data.localeCompare(
                    b.data
                )
        );


    eventos.forEach(evento => {

        const elemento =
            document.createElement("article");


        elemento.className =
            "cartao-evento";


        elemento.innerHTML = `

            <div class="data-evento">
                📅 ${formatarData(
                    evento.data
                )}

                ${
                    evento.hora
                        ? ` • ${evento.hora}`
                        : ""
                }
            </div>

            <h4>
                ${escaparHTML(
                    evento.titulo
                )}
            </h4>

            <p>
                ${
                    escaparHTML(
                        evento.descricao ||
                        "Sem descrição."
                    )
                }
            </p>

            <button
                type="button"
                class="botao-excluir-pequeno"
                data-evento-id="${evento.id}"
            >
                Excluir evento
            </button>

        `;


        elemento
            .querySelector(
                ".botao-excluir-pequeno"
            )
            .addEventListener(
                "click",
                () => excluirEvento(
                    evento.id
                )
            );


        container.appendChild(
            elemento
        );

    });
}


function excluirEvento(id) {

    const clube =
        encontrarClube(
            clubeAtualId
        );


    if (!clube) {
        return;
    }


    if (
        !confirm(
            "Excluir este evento?"
        )
    ) {

        return;
    }


    clube.eventos =
        clube.eventos.filter(
            evento =>
                evento.id !== id
        );


    salvarDadosComunidade();

    renderizarEventos(clube);
}


// ============================================================
// METAS
// ============================================================

function configurarFormularioMeta() {

    const formulario =
        document.getElementById(
            "formMeta"
        );


    formulario.addEventListener(
        "submit",
        evento => {

            evento.preventDefault();


            const clube =
                encontrarClube(
                    clubeAtualId
                );


            if (!clube) {
                return;
            }


            const titulo =
                document.getElementById(
                    "tituloMeta"
                ).value.trim();


            const quantidade =
                Number(
                    document.getElementById(
                        "quantidadeMeta"
                    ).value
                );


            const prazo =
                document.getElementById(
                    "prazoMeta"
                ).value;


            clube.metas.push({

                id:
                    gerarIdComunidade(),

                titulo,

                quantidade,

                progresso: 0,

                prazo

            });


            salvarDadosComunidade();


            formulario.reset();


            document.getElementById(
                "quantidadeMeta"
            ).value = 1;


            fecharModal("modalMeta");


            renderizarMetas(clube);

            atualizarResumoClube(clube);

        }
    );
}


function renderizarMetas(clube) {

    const container =
        document.getElementById(
            "listaMetas"
        );


    container.innerHTML = "";


    if (!clube.metas.length) {

        container.innerHTML = `

            <div class="estado-vazio-comunidade">

                <div class="vazio-icone">
                    🎯
                </div>

                <h3>
                    Nenhuma meta criada
                </h3>

                <p>
                    Crie uma meta de leitura para o clube.
                </p>

            </div>

        `;

        return;
    }


    clube.metas.forEach(meta => {

        const porcentagem =
            Math.min(
                100,
                Math.round(
                    (
                        meta.progresso /
                        meta.quantidade
                    ) * 100
                )
            );


        const elemento =
            document.createElement("article");


        elemento.className =
            "cartao-meta";


        elemento.innerHTML = `

            <div class="meta-cabecalho">

                <div>

                    <h4>
                        ${escaparHTML(
                            meta.titulo
                        )}
                    </h4>

                    ${
                        meta.prazo
                            ? `<small>
                                Prazo:
                                ${formatarData(
                                    meta.prazo
                                )}
                            </small>`
                            : ""
                    }

                </div>

                <strong>
                    ${meta.progresso}/${meta.quantidade}
                </strong>

            </div>


            <div class="meta-progresso">

                <div class="barra-progresso">

                    <span
                        style="width:${porcentagem}%"
                    ></span>

                </div>

                <small>
                    ${porcentagem}% concluído
                </small>

            </div>


            <div class="meta-acoes">

                <button
                    type="button"
                    class="botao-pequeno"
                    data-meta-acao="menos"
                    data-meta-id="${meta.id}"
                >
                    −
                </button>

                <button
                    type="button"
                    class="botao-pequeno"
                    data-meta-acao="mais"
                    data-meta-id="${meta.id}"
                >
                    + 1
                </button>

                <button
                    type="button"
                    class="botao-pequeno"
                    data-meta-acao="excluir"
                    data-meta-id="${meta.id}"
                >
                    Excluir
                </button>

            </div>

        `;


        elemento
            .querySelectorAll(
                "[data-meta-acao]"
            )
            .forEach(botao => {

                botao.addEventListener(
                    "click",
                    () => {

                        alterarMeta(
                            botao.dataset.metaId,
                            botao.dataset.metaAcao
                        );

                    }
                );

            });


        container.appendChild(
            elemento
        );

    });
}


function alterarMeta(id, acao) {

    const clube =
        encontrarClube(
            clubeAtualId
        );


    if (!clube) {
        return;
    }


    const meta =
        clube.metas.find(
            item => item.id === id
        );


    if (!meta) {
        return;
    }


    if (acao === "mais") {

        meta.progresso =
            Math.min(
                meta.quantidade,
                meta.progresso + 1
            );
    }


    if (acao === "menos") {

        meta.progresso =
            Math.max(
                0,
                meta.progresso - 1
            );
    }


    if (acao === "excluir") {

        if (
            !confirm(
                "Excluir esta meta?"
            )
        ) {

            return;
        }


        clube.metas =
            clube.metas.filter(
                item => item.id !== id
            );
    }


    salvarDadosComunidade();


    renderizarMetas(clube);

    atualizarResumoClube(clube);
}


// ============================================================
// ENQUETES
// ============================================================

function configurarFormularioEnquete() {

    const formulario =
        document.getElementById(
            "formEnquete"
        );


    formulario.addEventListener(
        "submit",
        evento => {

            evento.preventDefault();


            const clube =
                encontrarClube(
                    clubeAtualId
                );


            if (!clube) {
                return;
            }


            const pergunta =
                document.getElementById(
                    "perguntaEnquete"
                ).value.trim();


            const opcoes =
                [...document.querySelectorAll(
                    ".opcao-enquete"
                )]
                .map(campo =>
                    campo.value.trim()
                )
                .filter(Boolean);


            if (
                !pergunta ||
                opcoes.length < 2
            ) {

                alert(
                    "A enquete precisa de pelo menos duas opções."
                );

                return;
            }


            clube.enquetes.push({

                id:
                    gerarIdComunidade(),

                pergunta,

                opcoes:
                    opcoes.map(texto => ({

                        id:
                            gerarIdComunidade(),

                        texto,

                        votos: 0

                    })),

                votantes: []

            });


            salvarDadosComunidade();


            formulario.reset();

            fecharModal("modalEnquete");

            renderizarEnquetes(clube);

        }
    );
}


function renderizarEnquetes(clube) {

    const container =
        document.getElementById(
            "listaEnquetes"
        );


    container.innerHTML = "";


    if (!clube.enquetes.length) {

        container.innerHTML = `

            <div class="estado-vazio-comunidade">

                <div class="vazio-icone">
                    📊
                </div>

                <h3>
                    Nenhuma enquete
                </h3>

                <p>
                    Crie uma enquete para decidir
                    algo com o clube.
                </p>

            </div>

        `;

        return;
    }


    clube.enquetes.forEach(enquete => {

        const totalVotos =
            enquete.opcoes.reduce(
                (total, opcao) =>
                    total + opcao.votos,
                0
            );


        const elemento =
            document.createElement("article");


        elemento.className =
            "cartao-enquete";


        let opcoesHTML = "";


        enquete.opcoes.forEach(opcao => {

            const porcentagem =
                totalVotos > 0
                    ? Math.round(
                        (
                            opcao.votos /
                            totalVotos
                        ) * 100
                    )
                    : 0;


            opcoesHTML += `

                <div class="opcao-enquete-item">

                    <button
                        type="button"
                        data-enquete-id="${enquete.id}"
                        data-opcao-id="${opcao.id}"
                    >
                        ${escaparHTML(
                            opcao.texto
                        )}

                        — ${opcao.votos} voto(s)

                    </button>

                    <div class="resultado-enquete">

                        ${porcentagem}%

                    </div>

                </div>

            `;

        });


        elemento.innerHTML = `

            <h4>
                ${escaparHTML(
                    enquete.pergunta
                )}
            </h4>

            ${opcoesHTML}

            <button
                type="button"
                class="botao-excluir-pequeno"
                data-excluir-enquete="${enquete.id}"
            >
                Excluir enquete
            </button>

        `;


        elemento
            .querySelectorAll(
                "[data-enquete-id]"
            )
            .forEach(botao => {

                botao.addEventListener(
                    "click",
                    () => votarEnquete(
                        botao.dataset.enqueteId,
                        botao.dataset.opcaoId
                    )
                );

            });


        elemento
            .querySelector(
                "[data-excluir-enquete]"
            )
            .addEventListener(
                "click",
                () =>
                    excluirEnquete(
                        enquete.id
                    )
            );


        container.appendChild(
            elemento
        );

    });
}


function votarEnquete(
    enqueteId,
    opcaoId
) {

    const clube =
        encontrarClube(
            clubeAtualId
        );


    if (!clube) {
        return;
    }


    const enquete =
        clube.enquetes.find(
            item =>
                item.id === enqueteId
        );


    if (!enquete) {
        return;
    }


    const usuario =
        obterNomeUsuario();


    if (
        enquete.votantes.includes(
            usuario
        )
    ) {

        alert(
            "Você já votou nesta enquete."
        );

        return;
    }


    const opcao =
        enquete.opcoes.find(
            item =>
                item.id === opcaoId
        );


    if (!opcao) {
        return;
    }


    opcao.votos += 1;


    enquete.votantes.push(
        usuario
    );


    salvarDadosComunidade();


    renderizarEnquetes(clube);
}


function excluirEnquete(id) {

    const clube =
        encontrarClube(
            clubeAtualId
        );


    if (!clube) {
        return;
    }


    if (
        !confirm(
            "Excluir esta enquete?"
        )
    ) {

        return;
    }


    clube.enquetes =
        clube.enquetes.filter(
            enquete =>
                enquete.id !== id
        );


    salvarDadosComunidade();

    renderizarEnquetes(clube);
}


// ============================================================
// MEMBROS
// ============================================================

function renderizarMembros(clube) {

    const container =
        document.getElementById(
            "listaMembros"
        );


    container.innerHTML = "";


    clube.membros.forEach(
        membro => {

            const elemento =
                document.createElement(
                    "article"
                );


            elemento.className =
                "cartao-membro";


            elemento.innerHTML = `

                <div class="avatar-membro">
                    ${escaparHTML(
                        membro.avatar ||
                        "👤"
                    )}
                </div>

                <div>

                    <div class="nome-membro">
                        ${escaparHTML(
                            membro.nome
                        )}
                    </div>

                    <span class="tipo-membro">
                        ${escaparHTML(
                            membro.tipo
                        )}
                    </span>

                </div>

            `;


            container.appendChild(
                elemento
            );

        }
    );
}


// ============================================================
// CONFIGURAÇÕES DO CLUBE
// ============================================================

function configurarFormularioEdicaoClube() {

    const formulario =
        document.getElementById(
            "formEditarClube"
        );


    formulario.addEventListener(
        "submit",
        evento => {

            evento.preventDefault();


            const clube =
                encontrarClube(
                    clubeAtualId
                );


            if (!clube) {
                return;
            }


            clube.nome =
                document
                    .getElementById(
                        "editarNomeClube"
                    )
                    .value
                    .trim();


            clube.descricao =
                document
                    .getElementById(
                        "editarDescricaoClube"
                    )
                    .value
                    .trim();


            clube.icone =
                document
                    .getElementById(
                        "editarIconeClube"
                    )
                    .value;


            clube.privacidade =
                document
                    .getElementById(
                        "editarPrivacidadeClube"
                    )
                    .value;


            if (!clube.nome) {

                alert(
                    "O clube precisa ter um nome."
                );

                return;
            }


            salvarDadosComunidade();


            preencherCabecalhoClube(
                clube
            );


            renderizarClubes();

            renderizarClubesDescobrir();


            alert(
                "Clube atualizado com sucesso."
            );

        }
    );
}


function preencherFormularioEdicao(clube) {

    document
        .getElementById(
            "editarNomeClube"
        )
        .value =
        clube.nome;


    document
        .getElementById(
            "editarDescricaoClube"
        )
        .value =
        clube.descricao || "";


    document
        .getElementById(
            "editarIconeClube"
        )
        .value =
        clube.icone;


    document
        .getElementById(
            "editarPrivacidadeClube"
        )
        .value =
        clube.privacidade;
}


// ============================================================
// EXCLUIR CLUBE
// ============================================================

function configurarExclusaoClube() {

    const botao =
        document.getElementById(
            "botaoExcluirClube"
        );


    botao.addEventListener(
        "click",
        () => {

            if (!clubeAtualId) {
                return;
            }


            const clube =
                encontrarClube(
                    clubeAtualId
                );


            if (!clube) {
                return;
            }


            const confirmou =
                confirm(
                    `Excluir o clube "${clube.nome}"?`
                );


            if (!confirmou) {
                return;
            }


            dadosComunidade.clubes =
                dadosComunidade.clubes.filter(
                    item =>
                        item.id !== clubeAtualId
                );


            salvarDadosComunidade();


            clubeAtualId = null;


            fecharPainelClube();

            renderizarClubes();

            renderizarClubesDescobrir();

        }
    );
}


// ============================================================
// CONVITES
// ============================================================

function gerarCodigoConvite() {

    return (
        "BIB-" +
        Math.random()
            .toString(36)
            .substring(2, 7)
            .toUpperCase() +
        "-" +
        Math.random()
            .toString(36)
            .substring(2, 7)
            .toUpperCase()
    );
}


function mostrarConvite() {

    const clube =
        encontrarClube(
            clubeAtualId
        );


    if (!clube) {
        return;
    }


    document
        .getElementById(
            "codigoConvite"
        )
        .textContent =
        clube.codigo;


    abrirModal(
        "modalConvite"
    );
}


function configurarConvite() {

    const copiar =
        document.getElementById(
            "botaoCopiarConvite"
        );


    copiar.addEventListener(
        "click",
        async () => {

            const codigo =
                document
                    .getElementById(
                        "codigoConvite"
                    )
                    .textContent;


            try {

                await navigator.clipboard.writeText(
                    codigo
                );

                copiar.textContent =
                    "Copiado!";

                setTimeout(
                    () => {
                        copiar.textContent =
                            "Copiar";
                    },
                    1500
                );

            } catch (erro) {

                alert(
                    `Código do convite: ${codigo}`
                );
            }

        }
    );


    const entrar =
        document.getElementById(
            "botaoEntrarCodigo"
        );


    entrar.addEventListener(
        "click",
        entrarComCodigo
    );
}


function entrarComCodigo() {

    const campo =
        document.getElementById(
            "codigoEntrada"
        );


    const codigo =
        campo.value
            .trim()
            .toUpperCase();


    if (!codigo) {

        alert(
            "Digite um código de convite."
        );

        return;
    }


    const clube =
        dadosComunidade.clubes.find(
            item =>
                item.codigo === codigo
        );


    if (!clube) {

        alert(
            "Esse código não foi encontrado neste navegador."
        );

        return;
    }


    if (
        clube.membros.length >=
        LIMITE_MEMBROS
    ) {

        alert(
            "Este clube já atingiu o limite de 100 membros."
        );

        return;
    }


    const nome =
        prompt(
            "Digite seu nome para entrar no clube:"
        );


    if (!nome || !nome.trim()) {
        return;
    }


    clube.membros.push({

        id:
            gerarIdComunidade(),

        nome:
            nome.trim(),

        tipo:
            "Membro",

        avatar:
            "👤"

    });


    salvarDadosComunidade();


    fecharModal(
        "modalConvite"
    );


    renderizarClubes();

    renderizarClubesDescobrir();


    abrirClube(clube.id);


    alert(
        "Você entrou no clube!"
    );
}


// ============================================================
// COMUNIDADES DE LIVROS
// ============================================================

function renderizarComunidadesLivros() {

    const container =
        document.getElementById(
            "listaComunidadesLivros"
        );


    const vazio =
        document.getElementById(
            "livrosComunidadeVazio"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    const livros =
        obterLivrosDaBiblioteca();


    if (!livros.length) {

        vazio.style.display =
            "block";

        return;
    }


    vazio.style.display =
        "none";


    livros.forEach(livro => {

        const elemento =
            document.createElement(
                "article"
            );


        elemento.className =
            "cartao-comunidade-livro";


        let capaHTML;


        if (livro.capa) {

            capaHTML = `

                <img
                    class="capa-comunidade-livro"
                    src="${livro.capa}"
                    alt="Capa de ${escaparHTML(
                        livro.titulo
                    )}"
                >

            `;

        } else {

            capaHTML = `

                <div class="capa-comunidade-placeholder">
                    📖
                </div>

            `;

        }


        elemento.innerHTML = `

            ${capaHTML}

            <div>

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

                <p>
                    ${
                        livro.genero
                            ? escaparHTML(
                                livro.genero
                            )
                            : "Sem gênero"
                    }
                </p>

                <button
                    type="button"
                    class="botao-secundario"
                    style="margin-top:10px;"
                >
                    Abrir comunidade
                </button>

            </div>

        `;


        elemento
            .querySelector(
                "button"
            )
            .addEventListener(
                "click",
                () =>
                    abrirComunidadeLivro(
                        livro
                    )
            );


        container.appendChild(
            elemento
        );

    });
}


function abrirComunidadeLivro(livro) {

    const nome =
        `Comunidade: ${livro.titulo}`;


    const comunidadeExistente =
        dadosComunidade.comunidadesLivros.find(
            item =>
                item.livroId === livro.id
        );


    if (!comunidadeExistente) {

        dadosComunidade.comunidadesLivros.push({

            id:
                gerarIdComunidade(),

            livroId:
                livro.id,

            titulo:
                livro.titulo,

            autor:
                livro.autor,

            criadoEm:
                new Date().toISOString(),

            secoes: {

                discussoes: [],

                comentarios: [],

                fanarts: [],

                teorias: [],

                autor: []

            }

        });


        salvarDadosComunidade();

    }


    alert(
        `${nome}\n\nA comunidade foi criada para este livro.\n\nAs áreas de Discussões, Comentários, Fanarts, Teorias e Autor estão associadas ao livro.`
    );
}


// ============================================================
// LIVROS DA BIBLIOTECA
// ============================================================

function obterLivrosDaBiblioteca() {

    try {

        if (
            typeof obterLivros ===
            "function"
        ) {

            return obterLivros();

        }


        const dados =
            localStorage.getItem(
                "livros"
            );


        return dados
            ? JSON.parse(dados)
            : [];

    } catch (erro) {

        console.error(
            "Erro ao obter livros:",
            erro
        );

        return [];
    }
}


// ============================================================
// ATUALIZAR RESUMO
// ============================================================

function atualizarResumoClube(clube) {

    document
        .getElementById(
            "resumoMembros"
        )
        .textContent =
        clube.membros.length;


    document
        .getElementById(
            "resumoMetas"
        )
        .textContent =
        clube.metas.length;
}


// ============================================================
// NOME DO USUÁRIO
// ============================================================

function obterNomeUsuario() {

    const configuracao =
        localStorage.getItem(
            "configuracaoBiblioteca"
        );


    if (configuracao) {

        try {

            const dados =
                JSON.parse(
                    configuracao
                );


            if (
                dados.nome &&
                dados.nome.trim()
            ) {

                return dados.nome.trim();
            }


            if (
                dados.nomeBiblioteca &&
                dados.nomeBiblioteca.trim()
            ) {

                return dados.nomeBiblioteca.trim();
            }

        } catch (erro) {

            console.warn(
                "Não foi possível ler configuração:",
                erro
            );
        }
    }


    return "Leitor";
}


// ============================================================
// FORMATAÇÃO
// ============================================================

function formatarData(data) {

    if (!data) {
        return "Data não informada";
    }


    const partes =
        data.split("-");


    if (partes.length !== 3) {
        return data;
    }


    return (
        `${partes[2]}/` +
        `${partes[1]}/` +
        `${partes[0]}`
    );
}


function formatarDataHora(data) {

    if (!data) {
        return "";
    }


    const dataObj =
        new Date(data);


    if (
        Number.isNaN(
            dataObj.getTime()
        )
    ) {

        return "";
    }


    return dataObj.toLocaleString(
        "pt-BR",
        {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


// ============================================================
// CAPITALIZAR
// ============================================================

function capitalizar(texto) {

    if (!texto) {
        return "";
    }


    return (
        texto.charAt(0).toUpperCase() +
        texto.slice(1)
    );
}


// ============================================================
// SEGURANÇA
// ============================================================

function escaparHTML(texto) {

    if (texto === null ||
        texto === undefined) {

        return "";
    }


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