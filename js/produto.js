/* =========================================================
   RIZE — Página de produto
   ========================================================= */

(function () {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id") || RIZE_PRODUCTS[0]?.id;
  const product = RIZE_PRODUCTS.find((p) => p.id === productId);
  const root = document.getElementById("product-root");

  if (!product) {
    root.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <p>Não encontramos essa peça. Ela pode ter saído de coleção.</p>
        <a href="index.html#colecao" class="btn btn-primary">Voltar para a coleção</a>
      </div>`;
    return;
  }

  document.title = `${product.name} — Rize`;
  document.getElementById("bc-name").textContent = product.name;

  // Estado local desta página
  const state = {
    activeImage: 0,
    size: null,
    qty: 1,
    cepOk: false,
    cepValue: "",
    coupon: null, // { code, type, value }
  };

  root.innerHTML = `
    <div class="product-gallery">
      <div class="gallery-main" id="gallery-main" role="button" tabindex="0" aria-label="Clique para ampliar a imagem">
        <img id="gallery-img" src="${product.images[0]}" alt="${product.name}">
      </div>
      <div class="gallery-thumbs" id="gallery-thumbs">
        ${product.images
          .map(
            (img, i) => `
          <button data-i="${i}" class="${i === 0 ? "is-active" : ""}" aria-label="Ver imagem ${i + 1}">
            <img src="${img}" alt="">
          </button>`
          )
          .join("")}
      </div>
    </div>

    <div class="product-info">
      <p class="eyebrow">${product.category}</p>
      <h1>${product.name}</h1>
      <p class="product-price">R$ ${product.price.toFixed(2).replace(".", ",")}</p>
      <p class="product-installments">ou ${product.installments.count}x de R$ ${product.installments.value
        .toFixed(2)
        .replace(".", ",")} (informativo — combinado no fechamento)</p>
      <p class="product-desc">${product.description}</p>

      <!-- CEP -->
      <div class="cep-block">
        <label for="cep-input">Consultar entrega</label>
        <div class="cep-row">
          <input type="text" id="cep-input" inputmode="numeric" placeholder="00000-000" maxlength="9" aria-describedby="cep-feedback">
          <button class="btn btn-outline" id="cep-btn" type="button">Consultar</button>
        </div>
        <div class="cep-feedback" id="cep-feedback" role="status"></div>
      </div>

      <!-- Tamanho -->
      <div class="select-group">
        <label>Tamanho</label>
        <div class="size-options" id="size-options">
          ${product.sizes
            .map((s) => {
              const outOfStock = (product.stock?.[s] ?? 1) <= 0;
              return `<button type="button" class="size-btn" data-size="${s}" ${outOfStock ? "disabled" : ""}>${s}</button>`;
            })
            .join("")}
        </div>
      </div>

      <!-- Quantidade -->
      <div class="select-group">
        <label for="qty-input">Quantidade</label>
        <div class="qty-row">
          <button type="button" id="qty-minus" aria-label="Diminuir quantidade">–</button>
          <input type="text" id="qty-input" value="1" inputmode="numeric" aria-live="polite" readonly>
          <button type="button" id="qty-plus" aria-label="Aumentar quantidade">+</button>
        </div>
      </div>

      <!-- Cupom -->
      <div class="coupon-block">
        <label for="coupon-input" style="display:block; font-size:0.8rem; font-weight:500; margin-bottom:0.6rem;">Cupom de desconto</label>
        <div class="coupon-row">
          <input type="text" id="coupon-input" placeholder="Digite seu cupom">
          <button class="btn btn-outline" id="coupon-btn" type="button">Aplicar</button>
        </div>
        <div class="coupon-feedback" id="coupon-feedback"></div>
      </div>

      <!-- Informações extras -->
      <details class="info-block">
        <summary>Tecido &amp; composição <span class="chev">⌄</span></summary>
        <div class="info-body">
          <p><strong>Tecido:</strong> ${product.fabric}</p>
          <p><strong>Composição:</strong> ${product.composition}</p>
        </div>
      </details>
      <details class="info-block">
        <summary>Instruções de lavagem <span class="chev">⌄</span></summary>
        <div class="info-body"><p>${product.care}</p></div>
      </details>
      <details class="info-block">
        <summary>Tabela de medidas <span class="chev">⌄</span></summary>
        <div class="info-body">
          <table class="measure-table">
            <thead><tr>${product.measurements.headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
            <tbody>${product.measurements.rows
              .map((row) => `<tr>${row.map((c) => `<td>${c}</td>`).join("")}</tr>`)
              .join("")}</tbody>
          </table>
        </div>
      </details>

      <!-- Resumo do pedido -->
      <div class="summary-card" id="summary-card" style="margin-top:2rem;">
        <h3>Resumo do pedido</h3>
        <div class="summary-row"><span>Produto</span><span class="value" id="sum-product">${product.name}</span></div>
        <div class="summary-row"><span>Tamanho</span><span class="value" id="sum-size">—</span></div>
        <div class="summary-row"><span>Preço unitário</span><span class="value" id="sum-unit">R$ ${product.price.toFixed(2).replace(".", ",")}</span></div>
        <div class="summary-row"><span>Quantidade</span><span class="value" id="sum-qty">1</span></div>
        <div class="summary-row"><span>Desconto</span><span class="value" id="sum-discount">R$ 0,00</span></div>
        <div class="summary-row"><span>Frete</span><span class="value" id="sum-shipping">A combinar</span></div>
        <div class="summary-row total"><span>Total</span><span class="value" id="sum-total">R$ ${product.price.toFixed(2).replace(".", ",")}</span></div>
        <button class="btn btn-primary btn-block" id="continue-btn" style="margin-top:1.25rem;" disabled>Continuar pedido</button>
        <p id="continue-hint" style="font-size:0.75rem; color:var(--grey-500); margin-top:0.75rem;">Consulte seu CEP e escolha um tamanho para continuar.</p>
      </div>
    </div>
  `;

  /* ---------- Galeria ---------- */
  const galleryImg = document.getElementById("gallery-img");
  const galleryMain = document.getElementById("gallery-main");
  document.querySelectorAll("#gallery-thumbs button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = Number(btn.dataset.i);
      state.activeImage = i;
      galleryImg.src = product.images[i];
      document.querySelectorAll("#gallery-thumbs button").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      galleryMain.classList.remove("is-zoomed");
    });
  });
  const toggleZoom = () => galleryMain.classList.toggle("is-zoomed");
  galleryMain.addEventListener("click", toggleZoom);
  galleryMain.addEventListener("keypress", (e) => { if (e.key === "Enter") toggleZoom(); });

  /* ---------- CEP ---------- */
  const cepInput = document.getElementById("cep-input");
  const cepBtn = document.getElementById("cep-btn");
  const cepFeedback = document.getElementById("cep-feedback");

  cepInput.addEventListener("input", () => {
    let v = cepInput.value.replace(/\D/g, "").slice(0, 8);
    if (v.length > 5) v = v.slice(0, 5) + "-" + v.slice(5);
    cepInput.value = v;
  });

  function checkCep() {
    const raw = cepInput.value.replace(/\D/g, "");
    if (raw.length !== 8) {
      cepFeedback.className = "cep-feedback show fail";
      cepFeedback.textContent = "Digite um CEP válido com 8 dígitos.";
      state.cepOk = false;
      updateSummary();
      return;
    }
    const normalized = raw;
    const allowed = RIZE_DELIVERY_CEPS.map((c) => c.replace(/\D/g, ""));
    const ok = allowed.includes(normalized);
    state.cepOk = ok;
    state.cepValue = cepInput.value;
    cepFeedback.className = `cep-feedback show ${ok ? "ok" : "fail"}`;
    cepFeedback.textContent = ok
      ? "✓ Entregamos na sua região."
      : "No momento ainda não realizamos entregas para essa localidade. Fale com a gente pelo WhatsApp para verificar alternativas.";
    updateSummary();
  }
  cepBtn.addEventListener("click", checkCep);
  cepInput.addEventListener("keypress", (e) => { if (e.key === "Enter") { e.preventDefault(); checkCep(); } });

  /* ---------- Tamanho ---------- */
  document.querySelectorAll(".size-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".size-btn").forEach((b) => b.classList.remove("is-selected"));
      btn.classList.add("is-selected");
      state.size = btn.dataset.size;
      updateSummary();
    });
  });

  /* ---------- Quantidade ---------- */
  const qtyInput = document.getElementById("qty-input");
  document.getElementById("qty-minus").addEventListener("click", () => {
    state.qty = Math.max(1, state.qty - 1);
    qtyInput.value = state.qty;
    updateSummary();
  });
  document.getElementById("qty-plus").addEventListener("click", () => {
    state.qty = Math.min(10, state.qty + 1);
    qtyInput.value = state.qty;
    updateSummary();
  });

  /* ---------- Cupom ---------- */
  const couponInput = document.getElementById("coupon-input");
  const couponBtn = document.getElementById("coupon-btn");
  const couponFeedback = document.getElementById("coupon-feedback");

  couponBtn.addEventListener("click", () => {
    const code = couponInput.value.trim().toUpperCase();
    if (!code) return;
    const found = RIZE_COUPONS[code];
    if (!found) {
      state.coupon = null;
      couponFeedback.className = "coupon-feedback show fail";
      couponFeedback.textContent = "Este cupom não existe.";
    } else {
      state.coupon = { code, ...found };
      couponFeedback.className = "coupon-feedback show ok";
      couponFeedback.textContent =
        found.type === "percent"
          ? `Cupom aplicado: ${found.value}% de desconto.`
          : `Cupom aplicado: R$ ${found.value.toFixed(2).replace(".", ",")} de desconto.`;
    }
    updateSummary();
  });

  /* ---------- Resumo ---------- */
  function calcTotals() {
    const unit = product.price;
    const subtotal = unit * state.qty;
    let discount = 0;
    if (state.coupon) {
      discount = state.coupon.type === "percent" ? subtotal * (state.coupon.value / 100) : state.coupon.value;
      discount = Math.min(discount, subtotal);
    }
    const total = Math.max(0, subtotal - discount);
    return { unit, subtotal, discount, total };
  }

  function updateSummary() {
    const { unit, discount, total } = calcTotals();
    document.getElementById("sum-size").textContent = state.size || "—";
    document.getElementById("sum-unit").textContent = `R$ ${unit.toFixed(2).replace(".", ",")}`;
    document.getElementById("sum-qty").textContent = state.qty;
    document.getElementById("sum-discount").textContent = `R$ ${discount.toFixed(2).replace(".", ",")}`;
    document.getElementById("sum-total").textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;

    const continueBtn = document.getElementById("continue-btn");
    const hint = document.getElementById("continue-hint");
    const ready = state.cepOk && !!state.size;
    continueBtn.disabled = !ready;
    hint.style.display = ready ? "none" : "block";
  }

  document.getElementById("continue-btn").addEventListener("click", () => {
    const { unit, discount, total } = calcTotals();
    const order = {
      productId: product.id,
      productName: product.name,
      size: state.size,
      qty: state.qty,
      unitPrice: unit,
      discount,
      total,
      coupon: state.coupon?.code || null,
      cep: state.cepValue,
    };
    localStorage.setItem("rizeOrder", JSON.stringify(order));
    window.location.href = "checkout.html";
  });

  updateSummary();
})();
