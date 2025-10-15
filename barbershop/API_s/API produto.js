// JavaScript Example: Reading Entities
// Filterable fields: nome, descricao, preco, estoque, imagem_url, categoria, ativo
async function fetchProdutoEntities() {
    const response = await fetch(`https://app.base44.com/api/apps/68ee8614f60355e19d2a31bc/entities/Produto`, {
        headers: {
            'api_key': 'c298f2de29964e378cc999252e1f0c68', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);
}

// JavaScript Example: Updating an Entity
// Filterable fields: nome, descricao, preco, estoque, imagem_url, categoria, ativo
async function updateProdutoEntity(entityId, updateData) {
    const response = await fetch(`https://app.base44.com/api/apps/68ee8614f60355e19d2a31bc/entities/Produto/${entityId}`, {
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