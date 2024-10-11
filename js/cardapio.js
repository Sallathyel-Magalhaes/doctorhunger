document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');

    fetch('produtos.json')
        .then(response => response.json())
        .then(data => {
            const menuContainer = document.getElementById('menu-container');
            data.forEach(produto => {
                const card = document.createElement('div');
                card.classList.add('card');
                card.innerHTML = `
                    <div class="menu-item">
                        <img src="${produto.imagem}" alt="${produto.nome}">
                        <div>
                            <h2>${produto.nome}</h2>
                            <p>${produto.descricao}</p>
                            <div class="price-container">
                                <span class="price">${produto.preco}</span>
                            </div>
                        </div>
                        <button class="add-to-cart-btn">Adicionar ao Pedido</button>
                    </div>
                `;
                card.querySelector('.add-to-cart-btn').addEventListener('click', () => {
                    adicionarAoCarrinho(produto);
                });
                menuContainer.appendChild(card);
            });

            // Aqui, depois de adicionar os cards ao DOM, vamos obter todos os cards novamente
            const cards = document.querySelectorAll('.card');

            // Adicionando o evento de input ao campo de pesquisa
            searchInput.addEventListener('input', function() {
                const searchTerm = searchInput.value.trim().toLowerCase();

                // Iterando sobre cada card
                cards.forEach(card => {
                    const productName = card.querySelector('.menu-item h2').innerText.trim().toLowerCase();

                    // Verificando se o nome do produto contém o termo de pesquisa
                    if (productName.includes(searchTerm) || searchTerm === '') {
                        card.style.display = 'block'; // Exibindo o card se houver correspondência
                    } else {
                        card.style.display = 'none'; // Ocultando o card se não houver correspondência
                    }
                });
            });
        })
        .catch(error => console.error('Erro ao carregar os produtos:', error));
});

let carrinho = [];
const empresaInfo = {
    pix: '12345678900',
    whatsapp: '5511999999999'
};

function adicionarAoCarrinho(item) {
    const itemExistente = carrinho.find(produto => produto.nome === item.nome);
    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({...item, quantidade: 1});
    }
    atualizarTotal();
}

function atualizarTotal() {
    let total = 0;
    carrinho.forEach(item => {
        const itemTotal = item.quantidade * parseFloat(item.preco.replace('R$', '').replace(',', '.'));
        total += itemTotal;
    });
    document.getElementById('total-pedido').innerText = `Total do Pedido: R$ ${total.toFixed(2)}`;
}

function abrirCarrinho() {
    const carrinhoModal = document.getElementById('carrinho-modal');
    const carrinhoModalBackdrop = document.getElementById('carrinho-modal-backdrop');
    const carrinhoItens = document.getElementById('carrinho-itens');

    carrinhoItens.innerHTML = '';

    carrinho.forEach(item => {
        const itemTotal = item.quantidade * parseFloat(item.preco.replace('R$', '').replace(',', '.'));
        carrinhoItens.innerHTML += `
            <div>
                <h3>${item.nome}</h3>
                <p>${item.descricao}</p>
                <p>Preço: ${item.preco}</p>
                <p>Quantidade: ${item.quantidade}</p>
                <p>Total: R$ ${itemTotal.toFixed(2)}</p>
            </div>
        `;
    });

    carrinhoModal.style.display = 'block';
    carrinhoModalBackdrop.style.display = 'block';
}

function fecharCarrinho() {
    const carrinhoModal = document.getElementById('carrinho-modal');
    const carrinhoModalBackdrop = document.getElementById('carrinho-modal-backdrop');
    carrinhoModal.style.display = 'none';
    carrinhoModalBackdrop.style.display = 'none';
}

function gerarPDF() {
    const nomeCliente = document.getElementById('nome-cliente').value;
    const localEntrega = document.getElementById('local-entrega').value;
    const metodoPagamento = document.getElementById('metodo-pagamento').value;
    const whatsappCliente = document.getElementById('whatsapp-cliente').value;
    const observacaoCliente = document.getElementById('obs').value;

    if (!nomeCliente || !localEntrega || !metodoPagamento || !whatsappCliente) {
        alert('Por favor, preencha todas as informações obrigatórias.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Adiciona imagem de logo
    const imgData = '/components/img/logo_grande.png'; // Certifique-se de que o caminho da imagem está correto
    doc.addImage(imgData, 'PNG', 10, 10, 30, 30);

    // Título
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text('Doctor Hunger', 70, 20);

    // Informações de contato
    doc.setFontSize(12);
    doc.text('Contato: (88) 9 1111-8888', 70, 30);
    doc.text('PIX: (22) 2 2222-2222', 70, 40);

    // Tabelas
    doc.setFontSize(12);
    doc.setFillColor(255, 160, 131);
    doc.rect(10, 50, 190, 10, 'F');
    doc.setTextColor(0, 0, 0);
    doc.text('Cliente:', 12, 58);
    doc.text(nomeCliente, 50, 58);

    doc.setFillColor(233, 127, 95);
    doc.rect(10, 60, 190, 10, 'F');
    doc.setTextColor(0, 0, 0);
    doc.text('Fone:', 12, 68);
    doc.text(whatsappCliente, 50, 68);

    doc.setFillColor(255, 160, 131);
    doc.rect(10, 70, 190, 10, 'F');
    doc.setTextColor(0, 0, 0);
    doc.text('Endereço:', 12, 78);
    doc.text(localEntrega, 50, 78);

    // Cabeçalho da tabela de produtos
    doc.setFillColor(255, 153, 51);
    doc.rect(10, 90, 190, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('Qtd.', 12, 98);
    doc.text('Produto', 50, 98);
    doc.text('R$ un.', 140, 98);
    doc.text('Total', 180, 98);

    let y = 108;
    let total = 0;

    carrinho.forEach(item => {
        const itemTotal = item.quantidade * parseFloat(item.preco.replace('R$', '').replace(',', '.'));
        total += itemTotal;

        // Adicionando quebra de página se necessário
        if (y > doc.internal.pageSize.height - 20) {
            doc.addPage();
            y = 20; // Redefine y para a nova página
        }

        doc.setTextColor(0, 0, 0);
        doc.text(item.quantidade.toString(), 12, y);
        doc.text(item.nome, 50, y);
        doc.text(item.preco, 140, y);
        doc.text(`R$ ${itemTotal.toFixed(2)}`, 180, y);
        y += 10;
    });

    // Adicionando a seção de pagamento e total
    if (y > doc.internal.pageSize.height - 20) {
        doc.addPage();
        y = 20;
    }

    doc.setFillColor(255, 153, 51);
    doc.rect(10, y, 190, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('Pagamento', 12, y + 8);
    doc.text('Total', 180, y + 8);
    y += 10;

    doc.setFillColor(255, 255, 255);
    doc.rect(10, y, 190, 10, 'F');
    doc.setTextColor(0, 0, 0);
    doc.text(metodoPagamento, 12, y + 8);
    doc.text(`R$ ${total.toFixed(2)}`, 180, y + 8);
    y += 10;

    // Adicionando observações
    if (y > doc.internal.pageSize.height - 20) {
        doc.addPage();
        y = 20;
    }

    doc.setFillColor(255, 255, 255);
    doc.rect(10, y, 190, 20, 'F');
    doc.setTextColor(0, 0, 0);
    doc.text('OBSERVAÇÕES:', 12, y + 8);
    doc.text(observacaoCliente, 12, y + 18);

    doc.save('pedido.pdf');
}

