const db = require('../database/connection');

module.exports = {
    // Função para listar todas as relações entre veículos e usuários
    async listarVeiculosUsuario(request, response) {
        try {
            // Definindo a consulta SQL para selecionar todas as colunas da tabela veiculo_usuario
            const sql = `SELECT 
                veic_usu_id, 
                veic_id, 
                usu_id, 
                ehproprietario, 
                data_inicial, 
                data_final
                FROM veiculo_usuario`;

            // Executando a consulta e armazenando os resultados
            const [veiculosUsuarios] = await db.query(sql);
            const nItens = veiculosUsuarios.length;

            // Retornando a lista de veículos-usuários em formato JSON
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de veículos e usuários.',
                dados: veiculosUsuarios,
                nItens
            });
        } catch (error) {
            // Tratamento de erro
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    // Função para cadastrar uma nova relação entre veículo e usuário
    async cadastrarVeiculoUsuario(request, response) {
        try {
            // Extraindo os dados do corpo da requisição
            const {
                veic_id,
                usu_id,
                data_inicial,
                data_final
            } = request.body;

            // Determinando o valor de ehproprietario com base na data_final
            const ehproprietario = (data_final === null || data_final === '0' || data_final === 0) ? 1 : 0;

            // Definindo a consulta SQL para inserir os novos dados
            const sql = `INSERT INTO veiculo_usuario 
                (veic_id, usu_id, ehproprietario, data_inicial, data_final) 
                VALUES (?, ?, ?, ?, ?)`;

            // Definindo os valores para a consulta, garantindo que data_final seja null se não fornecida
            const values = [
                veic_id,
                usu_id,
                ehproprietario,
                data_inicial,
                data_final ? data_final : null
            ];

            // Executando a consulta e armazenando o ID do novo registro
            const [execSql] = await db.query(sql, values);
            const veic_usu_id = execSql.insertId;

            // Retornando uma resposta JSON confirmando o sucesso do cadastro
            return response.status(200).json({
                sucesso: true,
                mensagem: 'Cadastro de veículo e usuário efetuado com sucesso.',
                dados: veic_usu_id
            });
        } catch (error) {
            // Tratamento de erro
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    // Função para editar uma relação existente entre veículo e usuário
    async editarVeiculoUsuario(request, response) {
        try {
            // Extraindo os dados do corpo da requisição
            const {
                veic_id,
                usu_id,
                data_inicial,
                data_final
            } = request.body;

            // Pegando o veic_usu_id dos parâmetros da URL
            const { veic_usu_id } = request.params;

            // Determinando o valor de ehproprietario com base na data_final
            const ehproprietario = (data_final === null || data_final === '0' || data_final === 0) ? 1 : 0;

            // Definindo a consulta SQL para atualizar os dados existentes
            const sql = `UPDATE veiculo_usuario SET 
                veic_id = ?, 
                usu_id = ?, 
                ehproprietario = ?, 
                data_inicial = ?, 
                data_final = ? 
                WHERE veic_usu_id = ?`;

            // Definindo os valores para a consulta, garantindo que data_final seja null se não fornecida
            const values = [
                veic_id,
                usu_id,
                ehproprietario,
                data_inicial,
                data_final ? data_final : null,
                veic_usu_id
            ];

            // Executando a consulta e armazenando o número de linhas afetadas
            const [atualizaDados] = await db.query(sql, values);

            // Retornando uma resposta JSON confirmando o sucesso da atualização
            return response.status(200).json({
                sucesso: true,
                mensagem: `Veículo e usuário ${veic_usu_id} atualizado com sucesso!`,
                dados: atualizaDados.affectedRows
            });
        } catch (error) {
            // Tratamento de erro
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    // Função para excluir uma relação existente entre veículo e usuário
    async excluirVeiculoUsuario(request, response) {
        try {
            // Pegando o veic_usu_id dos parâmetros da URL
            const { veic_usu_id } = request.params;

            // Definindo a consulta SQL para deletar a relação
            const sql = `DELETE FROM veiculo_usuario WHERE veic_usu_id = ?`;
            const values = [veic_usu_id];

            // Executando a consulta e armazenando o número de linhas afetadas
            const [excluir] = await db.query(sql, values);

            // Retornando uma resposta JSON confirmando o sucesso da exclusão
            return response.status(200).json({
                sucesso: true,
                mensagem: `Relação veículo-usuário ${veic_usu_id} excluída com sucesso`,
                dados: excluir.affectedRows
            });
        } catch (error) {
            // Tratamento de erro
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    }
}
