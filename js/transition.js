// Adicione o código JavaScript para a transição suave

        // Detecta quando um link é clicado
        document.addEventListener('click', function (event) {
            var target = event.target;

            // Verifica se o link foi clicado
            if (target.tagName === 'A') {
                // Impede o comportamento padrão do link
                event.preventDefault();

                // Adiciona a classe fade-out ao body
                document.body.classList.add('fade-out');

                // Aguarda um pequeno intervalo para permitir a animação acontecer
                setTimeout(function () {
                    // Redireciona para a URL do link
                    window.location.href = target.href;
                }, 500); // Tempo da animação, ajuste se necessário
            }
        });