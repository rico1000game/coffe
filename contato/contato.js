/**
 * Orquestrador / Controlador Principal do Módulo de Contato (Core Controller)
 * Conecta a ação do usuário (Adapter) com o fluxo de serviço correspondente (Services)
 * seguindo os princípios de Clean Architecture e SRP.
 */

import { enviarMensagem } from './contatoService.js';
import {
    obterDadosFormulario,
    limparFormulario,
    definirEstadoCarregamento,
    exibirFeedback
} from './contatoAdapter.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-contato');
    const btnEnviar = document.getElementById('btn-enviar');
    const feedback = document.getElementById('form-feedback');

    if (!form || !btnEnviar || !feedback) {
        console.warn('Elementos do formulário de contato não encontrados no DOM.');
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita recarregamento de página padrão

        // 1. Obter os dados devidamente higienizados e validados
        const dados = obterDadosFormulario();

        // 2. Colocar formulário no estado de envio (Desabilitar campos e rodar spinner)
        definirEstadoCarregamento(form, btnEnviar, true);
        exibirFeedback(feedback, 'limpar', '');

        try {
            // 3. Disparar chamada assíncrona ao serviço de e-mail Flask do backend
            await enviarMensagem(dados);

            // 4. Exibir feedback premium de Sucesso
            exibirFeedback(
                feedback,
                'sucesso',
                'Sua mensagem foi enviada com sucesso! Um e-mail de confirmação foi encaminhado.'
            );

            // 5. Limpar os campos do formulário para permitir novos envios
            limparFormulario(form);

        } catch (error) {
            console.error('Erro na integração do e-mail:', error);

            // 6. Exibir feedback premium de Erro em pt-BR
            const msgErro = error.message || 'Não foi possível enviar sua mensagem agora. Por favor, tente novamente.';
            exibirFeedback(
                feedback,
                'erro',
                `Falha no envio: ${msgErro}`
            );
        } finally {
            // 7. Retornar botões e inputs ao estado ativo padrão
            definirEstadoCarregamento(form, btnEnviar, false);
        }
    });
});