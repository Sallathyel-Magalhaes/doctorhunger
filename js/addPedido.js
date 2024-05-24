 // Selecione todos os botões "Adicionar ao Pedido"
 const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
        
 // Crie um array vazio para armazenar os produtos selecionados
 const cartItems = [];

 // Adicione um manipulador de eventos de clique para cada botão "Adicionar ao Pedido"
 addToCartButtons.forEach(button => {
     button.addEventListener('click', () => {
         // Obtenha as informações do produto a partir do card
         const menuItem = button.closest('.menu-item');
         const productName = menuItem.querySelector('h2').textContent;
         const price = menuItem.querySelector('.price').textContent;
         
         // Crie um objeto de produto com as informações obtidas
         const product = {
             name: productName,
             price: price
         };
         
         // Adicione o produto ao array de itens do carrinho
         cartItems.push(product);
         
         // Exiba uma mensagem de confirmação ou faça outra ação desejada
         alert('Produto adicionado ao pedido!');
     });
 });