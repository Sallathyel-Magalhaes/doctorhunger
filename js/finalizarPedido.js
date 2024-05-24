// Função para criar um pedido
function createOrder() {
    // Aqui você pode fazer o que desejar com os itens do carrinho
    // Por exemplo, você pode enviar os itens para um servidor ou processar localmente
    // Neste exemplo, vamos apenas exibir os itens no console
    console.log('Itens do Pedido:');
    cartItems.forEach(item => {
        console.log(`${item.name} - ${item.price}`);
    });
}