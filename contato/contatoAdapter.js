/**
 * Adaptador de Interface de Usuário (Adapters / Interface Layer)
 * Responsável por lidar com manipulação direta do DOM, estados visuais e formatação de UI.
 */

/**
 * Obtém os valores dos campos de formulário e limpa espaços vazios.
 * @returns {Object} Dados do formulário limpos.
 */
export function obterDadosFormulario() {
    return {
        nome: document.getElementById('nome').value.trim(),
        email: document.getElementById('email').value.trim(),
        mensagem: document.getElementById('mensagem').value.trim()
    };
}

/**
 * Limpa todos os campos do formulário fornecido.
 * @param {HTMLFormElement} formElement
 */
export function limparFormulario(formElement) {
    if (formElement && typeof formElement.reset === 'function') {
        formElement.reset();
    }
}

/**
 * Controla os estados de carregamento (Spinner) e ativa/desativa botões e inputs do formulário.
 * @param {HTMLFormElement} formElement - O formulário pai contendo os campos.
 * @param {HTMLButtonElement} btnElement - O botão de envio.
 * @param {boolean} carregando - Define se está no estado de envio (loading).
 */
export function definirEstadoCarregamento(formElement, btnElement, carregando) {
    if (!btnElement) return;
    
    const btnTexto = btnElement.querySelector('.btn-texto');
    const btnLoader = btnElement.querySelector('.btn-loader');
    
    // Desabilitar/Habilitar inputs para evitar alterações no meio do envio
    if (formElement) {
        const inputs = formElement.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.disabled = carregando;
        });
    }

    btnElement.disabled = carregando;

    if (carregando) {
        if (btnTexto) btnTexto.style.display = 'none';
        if (btnLoader) {
            btnLoader.style.display = 'inline-flex';
            btnLoader.style.alignItems = 'center';
            btnLoader.style.justifyContent = 'center';
            btnLoader.style.gap = '8px';
        }
    } else {
        if (btnTexto) btnTexto.style.display = 'inline-block';
        if (btnLoader) btnLoader.style.display = 'none';
    }
}

/**
 * Exibe a caixa de feedback ao usuário de forma fluida e elegante.
 * @param {HTMLElement} feedbackElement - O container do feedback.
 * @param {'sucesso' | 'erro' | 'limpar'} tipo - O tipo do feedback.
 * @param {string} mensagem - Texto explicativo em pt-BR.
 */
export function exibirFeedback(feedbackElement, tipo, mensagem) {
    if (!feedbackElement) return;

    // Remove classes anteriores mantendo a classe base
    feedbackElement.className = 'form-feedback';
    feedbackElement.textContent = mensagem;

    if (tipo === 'sucesso') {
        feedbackElement.classList.add('sucesso');
        feedbackElement.style.display = 'block';
    } else if (tipo === 'erro') {
        feedbackElement.classList.add('erro');
        feedbackElement.style.display = 'block';
    } else {
        feedbackElement.style.display = 'none';
    }
}
