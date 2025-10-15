// JavaScript Example: Reading Entities
// Filterable fields: cliente_email, cliente_nome, barbeiro_id, barbeiro_nome, servico_id, servico_nome, servico_preco, data_hora, status, observacoes, cortesia
async function fetchAgendamentoEntities() {
    const response = await fetch(`https://app.base44.com/api/apps/68ee8614f60355e19d2a31bc/entities/Agendamento`, {
        headers: {
            'api_key': 'c298f2de29964e378cc999252e1f0c68', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);
}

// JavaScript Example: Updating an Entity
// Filterable fields: cliente_email, cliente_nome, barbeiro_id, barbeiro_nome, servico_id, servico_nome, servico_preco, data_hora, status, observacoes, cortesia
async function updateAgendamentoEntity(entityId, updateData) {
    const response = await fetch(`https://app.base44.com/api/apps/68ee8614f60355e19d2a31bc/entities/Agendamento/${entityId}`, {
        method: 'PUT',
        headers: {
            'api_key': 'c298f2de29964e378cc999252e1f0c68', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    console.log(data);
}