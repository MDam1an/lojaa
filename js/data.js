/* =========================================================
   RIZE — Base de dados do front-end
   Estrutura pensada para crescer: novos produtos, categorias,
   CEPs atendidos, cupons e (futuramente) integração com estoque.
   ========================================================= */

// ---------- PRODUTOS ----------
// category está aqui de propósito: hoje só "camisetas", amanhã
// pode virar filtro de categoria na coleção sem mudar a estrutura.
const RIZE_PRODUCTS = [
  {
    id: "rz-essential-preta",
    category: "camisetas",
    name: "Camiseta Essential Preta",
    price: 129.9,
    installments: { count: 3, value: 43.3 },
    images: [
      "https://picsum.photos/id/1027/1000/1250?grayscale",
      "https://picsum.photos/id/1005/1000/1250?grayscale",
      "https://picsum.photos/id/1012/1000/1250?grayscale",
    ],
    description:
      "Peça-base do guarda-roupa Rize. Corte reto, caimento pensado para o dia a dia e acabamento premium em cada costura. Uma camiseta que não pede desculpas por ser simples.",
    fabric: "Algodão penteado 30.1, 180g/m².",
    composition: "100% algodão.",
    care: "Lavar à máquina com água fria. Não usar alvejante. Secar à sombra. Passar em temperatura baixa, pelo avesso.",
    sizes: ["P", "M", "G", "GG"],
    measurements: {
      headers: ["Tamanho", "Largura (cm)", "Comprimento (cm)", "Manga (cm)"],
      rows: [
        ["P", "48", "68", "20"],
        ["M", "51", "70", "21"],
        ["G", "54", "72", "22"],
        ["GG", "57", "74", "23"],
      ],
    },
    stock: { P: 8, M: 14, G: 12, GG: 5 },
  },
  {
    id: "rz-essential-branca",
    category: "camisetas",
    name: "Camiseta Essential Branca",
    price: 129.9,
    installments: { count: 3, value: 43.3 },
    images: [
      "https://picsum.photos/id/1011/1000/1250?grayscale",
      "https://picsum.photos/id/1013/1000/1250?grayscale",
      "https://picsum.photos/id/1025/1000/1250?grayscale",
    ],
    description:
      "A versão branca do nosso essencial. Tecido encorpado o suficiente para não marcar, corte reto que veste bem em qualquer tipo de corpo.",
    fabric: "Algodão penteado 30.1, 180g/m².",
    composition: "100% algodão.",
    care: "Lavar à máquina com água fria, separado de peças escuras. Não usar alvejante. Secar à sombra.",
    sizes: ["P", "M", "G", "GG"],
    measurements: {
      headers: ["Tamanho", "Largura (cm)", "Comprimento (cm)", "Manga (cm)"],
      rows: [
        ["P", "48", "68", "20"],
        ["M", "51", "70", "21"],
        ["G", "54", "72", "22"],
        ["GG", "57", "74", "23"],
      ],
    },
    stock: { P: 6, M: 10, G: 9, GG: 3 },
  },
  {
    id: "rz-oversized-grafite",
    category: "camisetas",
    name: "Camiseta Oversized Grafite",
    price: 149.9,
    installments: { count: 3, value: 49.97 },
    images: [
      "https://picsum.photos/id/1074/1000/1250?grayscale",
      "https://picsum.photos/id/1076/1000/1250?grayscale",
      "https://picsum.photos/id/1081/1000/1250?grayscale",
    ],
    description:
      "Modelagem oversized com ombro caído e comprimento estendido. Feita para quem gosta de espaço e estrutura sem perder a elegância.",
    fabric: "Malha peruana 24.1 penteada, 220g/m².",
    composition: "100% algodão.",
    care: "Lavar à máquina com água fria. Não torcer. Secar à sombra, estendida.",
    sizes: ["P", "M", "G", "GG"],
    measurements: {
      headers: ["Tamanho", "Largura (cm)", "Comprimento (cm)", "Manga (cm)"],
      rows: [
        ["P", "56", "72", "24"],
        ["M", "59", "74", "25"],
        ["G", "62", "76", "26"],
        ["GG", "65", "78", "27"],
      ],
    },
    stock: { P: 4, M: 11, G: 13, GG: 6 },
  },
  {
    id: "rz-classic-off-white",
    category: "camisetas",
    name: "Camiseta Classic Off-White",
    price: 119.9,
    installments: { count: 3, value: 39.97 },
    images: [
      "https://picsum.photos/id/1062/1000/1250?grayscale",
      "https://picsum.photos/id/1066/1000/1250?grayscale",
      "https://picsum.photos/id/1069/1000/1250?grayscale",
    ],
    description:
      "Tom neutro, corte tradicional. A camiseta que combina com tudo e não sai de moda — a base silenciosa de qualquer produção.",
    fabric: "Algodão penteado 30.1, 170g/m².",
    composition: "100% algodão.",
    care: "Lavar à máquina com água fria. Não usar alvejante. Secar à sombra.",
    sizes: ["P", "M", "G", "GG"],
    measurements: {
      headers: ["Tamanho", "Largura (cm)", "Comprimento (cm)", "Manga (cm)"],
      rows: [
        ["P", "48", "68", "20"],
        ["M", "51", "70", "21"],
        ["G", "54", "72", "22"],
        ["GG", "57", "74", "23"],
      ],
    },
    stock: { P: 7, M: 9, G: 8, GG: 0 },
  },
];

// ---------- CEPs ATENDIDOS ----------
// Formato sem hífen para facilitar comparação. Para adicionar uma
// nova região, basta incluir o CEP (com ou sem hífen) neste array.
const RIZE_DELIVERY_CEPS = ["88730-000", "88750-000", "88870-000"];

// ---------- CUPONS ----------
// Nenhum cupom ativo no momento — a estrutura já está pronta.
// Para cadastrar um cupom novo, basta adicionar uma entrada assim:
// "RIZE10": { type: "percent", value: 10 },   // 10% de desconto
// "FRETE20": { type: "fixed", value: 20 },    // R$20 de desconto
const RIZE_COUPONS = {
  // exemplo (desativado): "BEMVINDORIZE": { type: "percent", value: 10 },
};

// ---------- CONTATO ----------
const RIZE_WHATSAPP_NUMBER = "5548999999999"; // formato: 55 + DDD + número
