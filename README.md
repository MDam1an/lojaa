# Rize — Site institucional com fechamento via WhatsApp

Site estático (HTML/CSS/JS puro, sem build) pronto para publicar no GitHub Pages, Netlify, Vercel ou qualquer hospedagem estática.

## Estrutura
```
index.html              Home (hero, benefícios, coleção, sobre, avaliações, FAQ, CTA)
produto.html             Página de produto (galeria, CEP, tamanho, cupom, resumo)
checkout.html            Checkout em 5 etapas + geração da mensagem de WhatsApp
politica-privacidade.html / politica-trocas.html / termos-de-uso.html
css/style.css            Design system completo (tokens, componentes, responsivo)
js/data.js               Produtos, CEPs atendidos, cupons e nº do WhatsApp
js/main.js               Header dinâmico, menu mobile, FAQ, reveal on scroll
js/produto.js            Lógica da página de produto
js/checkout.js           Lógica do checkout em etapas
```

## Como rodar localmente
Basta abrir `index.html` num servidor local (o `fetch`/localStorage exige `http://`, não `file://`):
```
python3 -m http.server 8000
```
Depois acesse `http://localhost:8000`.

## Como publicar no GitHub Pages
1. Suba esta pasta para um repositório no GitHub.
2. Em *Settings → Pages*, selecione a branch `main` e a pasta raiz.
3. Pronto — o site fica em `https://seuusuario.github.io/seurepo`.

## Onde editar cada coisa

- **Número de WhatsApp:** `js/data.js`, constante `RIZE_WHATSAPP_NUMBER` (e também nos links `wa.me` do `index.html`/`produto.html`).
- **Produtos:** `js/data.js`, array `RIZE_PRODUCTS`. Cada produto já tem imagens, preço, tecido, composição, lavagem, tamanhos, estoque por tamanho e tabela de medidas. Para adicionar uma peça nova, basta copiar um item existente e trocar os valores — nenhuma outra alteração de código é necessária.
- **Categorias novas:** cada produto já tem `category`. Hoje só existe "camisetas"; para lançar uma nova categoria, adicione produtos com outra categoria e, se quiser, crie filtros na grade da coleção usando esse campo.
- **CEPs atendidos:** `js/data.js`, array `RIZE_DELIVERY_CEPS`. Basta adicionar o CEP novo (com ou sem hífen).
- **Cupons:** `js/data.js`, objeto `RIZE_COUPONS`. Hoje está vazio de propósito (nenhum cupom ativo). Para cadastrar um cupom, adicione uma entrada como `"RIZE10": { type: "percent", value: 10 }` ou `"FRETE20": { type: "fixed", value: 20 }`.
- **Frete:** a estrutura de resumo do pedido e da mensagem de WhatsApp já reserva o campo "Frete" (hoje como "a combinar"). Quando houver uma tabela de frete, basta calcular o valor em `produto.js`/`checkout.js` e somá-lo ao total.
- **Imagens:** hoje usamos imagens de placeholder (picsum.photos, em preto e branco) só para ilustrar o layout. Troque pelas fotos reais dos produtos e do hero mantendo a mesma proporção (4:5 para produtos, paisagem para o hero).

## Fluxo do usuário implementado
Hero → Coleção → Produto → Consultar CEP → Tamanho → Quantidade → Cupom → Resumo → Dados pessoais → Endereço → Observações → Revisão → Envio pelo WhatsApp.

O pedido é guardado temporariamente no `localStorage` do navegador (chave `rizeOrder`) só para levar os dados da página de produto até o checkout — nenhum dado é enviado a um servidor. Ao enviar o pedido pelo WhatsApp, esse dado local é limpo.

## Acessibilidade e performance
- Contraste alto entre texto e fundo, foco visível em todos os elementos interativos.
- `prefers-reduced-motion` respeitado (desliga animações para quem pede menos movimento).
- Imagens com `loading="lazy"` fora do hero.
- Sem dependências externas além das fontes do Google Fonts.
