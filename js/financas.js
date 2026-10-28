// ============================================================
// BIBLIOTECA PESSOAL
// Arquivo: js/financas.js
//
// Responsável por:
// - registrar compras
// - editar compras
// - excluir compras
// - filtros
// - totais
// - gráficos
// ============================================================


const CHAVE_FINANCAS =
    "biblioteca_financas";


let financas = [];


// ============================================================
// INICIAR
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    iniciarFinancas
);


function iniciarFinancas() {

    financas =
        carregarFinancas();


    definirDataAtual();


    configurarEventos();


    atualizarFiltros();


    atualizarTela();

}


// ============================================================
// CARREGAR
// ============================================================

function carregarFinancas() {

    const dados =
        localStorage.getItem(
            CHAVE_FINANCAS
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
            "Erro ao carregar finanças:",
            erro
        );


        return [];

    }

}


// ============================================================
// SALVAR
// ============================================================

function salvarFinancas() {

    localStorage.setItem(
        CHAVE_FINANCAS,
        JSON.stringify(financas)
    );

}


// ============================================================
// DATA ATUAL
// ============================================================

function definirDataAtual() {

    const campo =
        document.getElementById(
            "dataCompra"
        );


    if (
        campo &&
        !campo.value
    ) {

        const hoje =
            new Date();


        const ano =
            hoje.getFullYear();


        const mes =
            String(
                hoje.getMonth() + 1
            ).padStart(2, "0");


        const dia =
            String(
                hoje.getDate()
            ).padStart(2, "0");


        campo.value =
            `${ano}-${mes}-${dia}`;

    }

}


// ============================================================
// EVENTOS
// ============================================================

function configurarEventos() {

    document
        .getElementById("formFinanca")
        .addEventListener(
            "submit",
            salvarCompra
        );


    document
        .getElementById("cancelarEdicao")
        .addEventListener(
            "click",
            limparFormulario
        );


    document
        .getElementById("filtroAno")
        .addEventListener(
            "change",
            atualizarTela
        );


    document
        .getElementById("filtroMes")
        .addEventListener(
            "change",
            atualizarTela
        );


    document
        .getElementById("filtroLoja")
        .addEventListener(
            "change",
            atualizarTela
        );


    document
        .getElementById("filtroBusca")
        .addEventListener(
            "input",
            atualizarTela
        );

}


// ============================================================
// SALVAR COMPRA
// ============================================================

function salvarCompra(evento) {

    evento.preventDefault();


    const id =
        valor("financaId");


    const livro =
        valor("livroNome");


    const autor =
        valor("autorNome");


    const loja =
        valor("lojaNome");


    const pagamento =
        valor("formaPagamento");


    const data =
        valor("dataCompra");


    const valorCompra =
        Number(
            valor("valorCompra")
        );


    const observacoes =
        valor("observacoesCompra");


    if (!livro) {

        alert(
            "Informe o nome do livro."
        );

        return;

    }


    if (!data) {

        alert(
            "Informe a data da compra."
        );

        return;

    }


    if (
        !valorCompra ||
        valorCompra < 0
    ) {

        alert(
            "Informe um valor válido."
        );

        return;

    }


    // ========================================================
    // EDIÇÃO
    // ========================================================

    if (id) {

        const item =
            financas.find(
                function (financa) {

                    return String(financa.id) ===
                        String(id);

                }
            );


        if (!item) {

            alert(
                "Compra não encontrada."
            );

            return;

        }


        item.livro =
            livro;

        item.autor =
            autor;

        item.loja =
            loja;

        item.pagamento =
            pagamento;

        item.data =
            data;

        item.valor =
            valorCompra;

        item.observacoes =
            observacoes;

        item.atualizadoEm =
            new Date().toISOString();


        alert(
            "Compra atualizada com sucesso! ✨"
        );

    }

    // ========================================================
    // NOVA COMPRA
    // ========================================================

    else {

        financas.push({

            id:
                gerarId(),

            livro:
                livro,

            autor:
                autor,

            loja:
                loja,

            pagamento:
                pagamento,

            data:
                data,

            valor:
                valorCompra,

            observacoes:
                observacoes,

            criadoEm:
                new Date().toISOString(),

            atualizadoEm:
                new Date().toISOString()

        });


        alert(
            "Compra registrada com sucesso! 💰"
        );

    }


    salvarFinancas();


    limparFormulario();


    atualizarFiltros();


    atualizarTela();

}


// ============================================================
// ATUALIZAR TELA
// ============================================================

function atualizarTela() {

    const itens =
        obterItensFiltrados();


    atualizarResumo(
        itens
    );


    renderizarHistorico(
        itens
    );


    renderizarGraficoMeses(
        itens
    );


    renderizarRanking(
        "graficoLojas",
        agruparPor(
            itens,
            "loja"
        )
    );


    renderizarRanking(
        "graficoAutores",
        agruparPor(
            itens,
            "autor"
        )
    );

}


// ============================================================
// FILTROS
// ============================================================

function obterItensFiltrados() {

    const ano =
        valor("filtroAno");


    const mes =
        valor("filtroMes");


    const loja =
        valor("filtroLoja");


    const busca =
        valor("filtroBusca")
            .toLowerCase();


    return financas.filter(
        function (item) {

            const partes =
                item.data
                    ? item.data.split("-")
                    : [];


            const itemAno =
                partes[0] || "";


            const itemMes =
                partes[1]
                    ? String(
                        Number(partes[1])
                    )
                    : "";


            const texto =
                (
                    item.livro +
                    " " +
                    (item.autor || "")
                )
                    .toLowerCase();


            return (

                (!ano ||
                    itemAno === ano)

                &&

                (!mes ||
                    itemMes === mes)

                &&

                (!loja ||
                    item.loja === loja)

                &&

                (!busca ||
                    texto.includes(busca))

            );

        }
    );

}


// ============================================================
// ATUALIZAR FILTROS
// ============================================================

function atualizarFiltros() {

    const anoSelect =
        document.getElementById(
            "filtroAno"
        );


    const lojaSelect =
        document.getElementById(
            "filtroLoja"
        );


    const anoAtual =
        anoSelect.value;


    const lojaAtual =
        lojaSelect.value;


    const anos =
        new Set();


    const lojas =
        new Set();


    financas.forEach(
        function (item) {

            if (item.data) {

                anos.add(
                    item.data.split("-")[0]
                );

            }


            if (item.loja) {

                lojas.add(
                    item.loja
                );

            }

        }
    );


    anoSelect.innerHTML = `

        <option value="">
            Todos
        </option>

    `;


    Array.from(anos)
        .sort()
        .reverse()
        .forEach(
            function (ano) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    ano;


                option.textContent =
                    ano;


                anoSelect.appendChild(
                    option
                );

            }
        );


    lojaSelect.innerHTML = `

        <option value="">
            Todas
        </option>

    `;


    Array.from(lojas)
        .sort(
            function (a, b) {

                return a.localeCompare(
                    b,
                    "pt-BR"
                );

            }
        )
        .forEach(
            function (loja) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    loja;


                option.textContent =
                    loja;


                lojaSelect.appendChild(
                    option
                );

            }
        );


    anoSelect.value =
        anoAtual;


    lojaSelect.value =
        lojaAtual;

}


// ============================================================
// RESUMO
// ============================================================

function atualizarResumo(
    itens
) {

    const total =
        itens.reduce(
            function (soma, item) {

                return (
                    soma +
                    Number(item.valor || 0)
                );

            },
            0
        );


    const quantidade =
        itens.length;


    const media =
        quantidade
            ? total / quantidade
            : 0;


    const lojas =
        agruparPor(
            itens,
            "loja"
        );


    const lojaMaisUsada =
        obterMaior(
            lojas
        );


    document.getElementById(
        "totalGasto"
    ).textContent =
        formatarMoeda(total);


    document.getElementById(
        "totalCompras"
    ).textContent =
        quantidade;


    document.getElementById(
        "mediaCompra"
    ).textContent =
        formatarMoeda(media);


    document.getElementById(
        "lojaMaisUsada"
    ).textContent =
        lojaMaisUsada
            ? lojaMaisUsada.nome
            : "—";

}


// ============================================================
// HISTÓRICO
// ============================================================

function renderizarHistorico(
    itens
) {

    const container =
        document.getElementById(
            "listaFinancas"
        );


    const vazio =
        document.getElementById(
            "financasVazio"
        );


    container.innerHTML =
        "";


    if (!itens.length) {

        vazio.style.display =
            "block";


        return;

    }


    vazio.style.display =
        "none";


    itens
        .slice()
        .sort(
            function (a, b) {

                return (
                    new Date(b.data) -
                    new Date(a.data)
                );

            }
        )
        .forEach(
            function (item) {

                container.appendChild(
                    criarItemHistorico(item)
                );

            }
        );

}


// ============================================================
// ITEM DO HISTÓRICO
// ============================================================

function criarItemHistorico(
    item
) {

    const elemento =
        document.createElement(
            "article"
        );


    elemento.className =
        "financa-item";


    elemento.innerHTML = `

        <div class="financa-livro">

            <strong>
                ${escaparHTML(item.livro)}
            </strong>

            <span>
                ${
                    item.autor
                        ? escaparHTML(item.autor)
                        : "Autor não informado"
                }
                ${item.loja
                    ? " • " + escaparHTML(item.loja)
                    : ""}
            </span>

        </div>


        <div class="financa-detalhes">

            <strong>
                ${formatarMoeda(item.valor)}
            </strong>

            <span>
                ${formatarData(item.data)}
                •
                ${nomePagamento(item.pagamento)}
            </span>

        </div>


        <div class="financa-acoes">

            <button
                class="botao-card botao-editar"
                type="button"
            >
                ✏️
            </button>

            <button
                class="botao-card botao-excluir"
                type="button"
            >
                🗑️
            </button>

        </div>

    `;


    elemento
        .querySelector(".botao-editar")
        .addEventListener(
            "click",
            function () {

                editarCompra(
                    item.id
                );

            }
        );


    elemento
        .querySelector(".botao-excluir")
        .addEventListener(
            "click",
            function () {

                excluirCompra(
                    item.id
                );

            }
        );


    return elemento;

}


// ============================================================
// EDITAR
// ============================================================

function editarCompra(
    id
) {

    const item =
        financas.find(
            function (financa) {

                return String(financa.id) ===
                    String(id);

            }
        );


    if (!item) {
        return;
    }


    document.getElementById(
        "financaId"
    ).value =
        item.id;


    document.getElementById(
        "livroNome"
    ).value =
        item.livro || "";


    document.getElementById(
        "autorNome"
    ).value =
        item.autor || "";


    document.getElementById(
        "lojaNome"
    ).value =
        item.loja || "";


    document.getElementById(
        "formaPagamento"
    ).value =
        item.pagamento || "pix";


    document.getElementById(
        "dataCompra"
    ).value =
        item.data || "";


    document.getElementById(
        "valorCompra"
    ).value =
        item.valor || "";


    document.getElementById(
        "observacoesCompra"
    ).value =
        item.observacoes || "";


    document.getElementById(
        "tituloFormulario"
    ).textContent =
        "Editar compra";


    document.getElementById(
        "botaoSalvarFinanca"
    ).textContent =
        "💾 Salvar alterações";


    document.getElementById(
        "cancelarEdicao"
    ).hidden =
        false;


    document
        .querySelector(".financas-formulario")
        .scrollIntoView({
            behavior: "smooth"
        });

}


// ============================================================
// LIMPAR
// ============================================================

function limparFormulario() {

    document
        .getElementById(
            "formFinanca"
        )
        .reset();


    document.getElementById(
        "financaId"
    ).value =
        "";


    document.getElementById(
        "tituloFormulario"
    ).textContent =
        "Registrar compra";


    document.getElementById(
        "botaoSalvarFinanca"
    ).textContent =
        "💰 Registrar compra";


    document.getElementById(
        "cancelarEdicao"
    ).hidden =
        true;


    definirDataAtual();

}


// ============================================================
// EXCLUIR
// ============================================================

function excluirCompra(
    id
) {

    const item =
        financas.find(
            function (financa) {

                return String(financa.id) ===
                    String(id);

            }
        );


    if (!item) {
        return;
    }


    const confirmar =
        confirm(
            `Excluir a compra de "${item.livro}"?`
        );


    if (!confirmar) {
        return;
    }


    financas =
        financas.filter(
            function (financa) {

                return String(financa.id) !==
                    String(id);

            }
        );


    salvarFinancas();


    atualizarFiltros();


    atualizarTela();

}


// ============================================================
// GRÁFICO DE MESES
// ============================================================

function renderizarGraficoMeses(
    itens
) {

    const container =
        document.getElementById(
            "graficoMeses"
        );


    container.innerHTML =
        "";


    const meses = [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez"
    ];


    const valores =
        new Array(12)
            .fill(0);


    itens.forEach(
        function (item) {

            if (!item.data) {
                return;
            }


            const partes =
                item.data.split("-");


            const mes =
                Number(partes[1]) - 1;


            if (
                mes >= 0 &&
                mes < 12
            ) {

                valores[mes] +=
                    Number(
                        item.valor || 0
                    );

            }

        }
    );


    const maior =
        Math.max(
            ...valores,
            1
        );


    valores.forEach(
        function (valorMes, indice) {

            const coluna =
                document.createElement(
                    "div"
                );


            coluna.className =
                "barra-mes";


            const altura =
                valorMes
                    ? Math.max(
                        5,
                        (valorMes / maior) * 170
                    )
                    : 3;


            coluna.innerHTML = `

                <span class="barra-valor">
                    ${
                        valorMes
                            ? formatarMoeda(valorMes)
                            : ""
                    }
                </span>

                <div
                    class="barra"
                    style="height:${altura}px"
                    title="${formatarMoeda(valorMes)}"
                ></div>

                <span class="barra-label">
                    ${meses[indice]}
                </span>

            `;


            container.appendChild(
                coluna
            );

        }
    );

}


// ============================================================
// AGRUPAR
// ============================================================

function agruparPor(
    itens,
    propriedade
) {

    const mapa =
        {};


    itens.forEach(
        function (item) {

            const nome =
                item[propriedade] ||
                "Não informado";


            if (!mapa[nome]) {

                mapa[nome] =
                    0;

            }


            mapa[nome] +=
                Number(
                    item.valor || 0
                );

        }
    );


    return mapa;

}


// ============================================================
// RANKINGS
// ============================================================

function renderizarRanking(
    id,
    dados
) {

    const container =
        document.getElementById(id);


    container.innerHTML =
        "";


    const lista =
        Object.entries(dados)
            .sort(
                function (a, b) {

                    return b[1] - a[1];

                }
            )
            .slice(0, 5);


    if (!lista.length) {

        container.innerHTML = `

            <p>
                Ainda não existem dados.
            </p>

        `;

        return;

    }


    const maior =
        lista[0][1] || 1;


    lista.forEach(
        function (item, indice) {

            const nome =
                item[0];


            const valor =
                item[1];


            const elemento =
                document.createElement(
                    "div"
                );


            elemento.className =
                "ranking-item";


            const porcentagem =
                (valor / maior) * 100;


            elemento.innerHTML = `

                <span class="ranking-posicao">
                    ${indice + 1}
                </span>


                <div class="ranking-nome">

                    <strong title="${escaparHTML(nome)}">
                        ${escaparHTML(nome)}
                    </strong>

                    <div class="ranking-barra">

                        <span
                            style="width:${porcentagem}%"
                        ></span>

                    </div>

                </div>


                <span class="ranking-valor">
                    ${formatarMoeda(valor)}
                </span>

            `;


            container.appendChild(
                elemento
            );

        }
    );

}


// ============================================================
// MAIOR
// ============================================================

function obterMaior(
    dados
) {

    const lista =
        Object.entries(dados);


    if (!lista.length) {
        return null;
    }


    lista.sort(
        function (a, b) {

            return b[1] - a[1];

        }
    );


    return {

        nome:
            lista[0][0],

        valor:
            lista[0][1]

    };

}


// ============================================================
// PAGAMENTO
// ============================================================

function nomePagamento(
    pagamento
) {

    const nomes = {

        pix:
            "PIX",

        cartao:
            "Cartão",

        dinheiro:
            "Dinheiro",

        boleto:
            "Boleto",

        outro:
            "Outro"

    };


    return nomes[pagamento] ||
        "Outro";

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
        return "—";
    }


    const partes =
        data.split("-");


    if (
        partes.length !== 3
    ) {

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
// VALOR
// ============================================================

function valor(id) {

    const campo =
        document.getElementById(id);


    return campo
        ? campo.value.trim()
        : "";

}


// ============================================================
// ID
// ============================================================

function gerarId() {

    return (
        Date.now().toString() +
        Math.random()
            .toString(16)
            .slice(2)
    );

}


// ============================================================
// SEGURANÇA
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