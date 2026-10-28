// ============================================================
// BIBLIOTECA PESSOAL
// Arquivo: js/storage.js
// ============================================================

const CHAVE_LIVROS = "livros";

// ------------------------------------------------------------
// Gera um ID único para cada livro
// ------------------------------------------------------------

function gerarId() {
    return Date.now().toString() + Math.random().toString(16);
}


// ------------------------------------------------------------
// Busca todos os livros salvos
// ------------------------------------------------------------

function obterLivros() {

    const dados = localStorage.getItem(CHAVE_LIVROS);

    if (!dados) {
        return [];
    }

    try {
        return JSON.parse(dados);
    } catch (erro) {

        console.error(
            "Erro ao ler os livros:",
            erro
        );

        return [];
    }
}


// ------------------------------------------------------------
// Salva todos os livros
// ------------------------------------------------------------

function salvarLivros(livros) {

    try {

        localStorage.setItem(
            CHAVE_LIVROS,
            JSON.stringify(livros)
        );

        return true;

    } catch (erro) {

        console.error(
            "Erro ao salvar livros:",
            erro
        );

        return false;
    }
}


// ------------------------------------------------------------
// Adiciona UM livro
// ------------------------------------------------------------

function adicionarLivro(livro) {

    const livros = obterLivros();

    livros.push(livro);

    const resultado = salvarLivros(livros);

    console.log(
        "Resultado do salvamento:",
        resultado
    );

    console.log(
        "Livros atualmente salvos:",
        obterLivros()
    );

    return resultado;
}