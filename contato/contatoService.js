/**
 * Serviço de Integração com a API de Contato (Services / Integration Layer)
 * Responsável apenas pela comunicação I/O com a API Flask do Backend.
 */

const URL_API = 'http://localhost:5000/api/contato';

/**
 * Envia os dados do formulário de contato para o backend.
 * @param {Object} dados - O objeto contendo nome, email e mensagem do formulário.
 * @returns {Promise<Object>} Resposta da API parseada em JSON.
 */
export async function enviarMensagem(dados) {
    const response = await fetch(URL_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(dados)
    });

    if (!response.ok) {
        // Tenta capturar mensagem detalhada do backend
        let mensagemErro = 'Erro na resposta do servidor';
        try {
            const dataErro = await response.json();
            if (dataErro && dataErro.erro) {
                mensagemErro = dataErro.erro;
            }
        } catch (_) {
            // Ignora se não conseguir parsear JSON do erro
        }
        throw new Error(mensagemErro);
    }

    return await response.json();
}
