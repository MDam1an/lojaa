/* =========================================================
   RIZE — Checkout em etapas
   ========================================================= */

(function () {
  const panel = document.getElementById("checkout-panel");
  const progressBarEl = document.getElementById("progress-bar");

  const order = JSON.parse(localStorage.getItem("rizeOrder") || "null");

  if (!order) {
    panel.innerHTML = `
      <div class="empty-state">
        <p>Ainda não encontramos nenhum pedido em andamento.</p>
        <a href="index.html#colecao" class="btn btn-primary">Ver coleção</a>
      </div>`;
    progressBarEl.style.display = "none";
    return;
  }

  const STEPS = [
    { key: "resumo", label: "Resumo" },
    { key: "dados", label: "Dados" },
    { key: "endereco", label: "Endereço" },
    { key: "obs", label: "Observações" },
    { key: "revisao", label: "Revisão" },
  ];

  const form = {
    nome: "",
    telefone: "",
    email: "",
    cpf: "",
    cep: order.cep || "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    observacoes: "",
  };

  let currentStep = 0;

  function money(v) {
    return `R$ ${v.toFixed(2).replace(".", ",")}`;
  }

  function renderProgress() {
    progressBarEl.innerHTML = STEPS.map((s, i) => {
      const stateClass = i === currentStep ? "is-active" : i < currentStep ? "is-done" : "";
      const dotContent = i < currentStep ? "✓" : i + 1;
      const line = i < STEPS.length - 1 ? `<div class="progress-line ${i < currentStep ? "is-done" : ""}"></div>` : "";
      return `
        <div class="progress-step ${stateClass}">
          <div class="dot">${dotContent}</div>
          <div class="label">${s.label}</div>
        </div>${line}`;
    }).join("");
  }

  function renderStep() {
    renderProgress();
    const key = STEPS[currentStep].key;
    panel.innerHTML = STEP_RENDERERS[key]();
    bindStepEvents(key);
    panel.querySelector(".checkout-step")?.classList.add("is-active");
  }

  const STEP_RENDERERS = {
    resumo: () => `
      <div class="checkout-step">
        <div class="summary-card">
          <h3>Resumo do pedido</h3>
          <div class="summary-row"><span>Produto</span><span class="value">${order.productName}</span></div>
          <div class="summary-row"><span>Tamanho</span><span class="value">${order.size}</span></div>
          <div class="summary-row"><span>Preço unitário</span><span class="value">${money(order.unitPrice)}</span></div>
          <div class="summary-row"><span>Quantidade</span><span class="value">${order.qty}</span></div>
          <div class="summary-row"><span>Desconto</span><span class="value">${money(order.discount)}</span></div>
          <div class="summary-row"><span>Cupom</span><span class="value">${order.coupon || "—"}</span></div>
          <div class="summary-row"><span>Frete</span><span class="value">A combinar</span></div>
          <div class="summary-row total"><span>Total</span><span class="value">${money(order.total)}</span></div>
        </div>
        <div class="step-actions">
          <a href="produto.html?id=${order.productId}" class="btn btn-outline">Editar pedido</a>
          <button class="btn btn-primary" id="next-btn">Continuar</button>
        </div>
      </div>`,

    dados: () => `
      <div class="checkout-step">
        <div class="form-field full">
          <label for="f-nome">Nome completo</label>
          <input id="f-nome" value="${form.nome}" autocomplete="name">
          <span class="field-error">Informe seu nome completo.</span>
        </div>
        <div class="form-grid">
          <div class="form-field">
            <label for="f-telefone">Telefone (WhatsApp)</label>
            <input id="f-telefone" value="${form.telefone}" inputmode="tel" placeholder="(48) 90000-0000" autocomplete="tel">
            <span class="field-error">Informe um telefone válido.</span>
          </div>
          <div class="form-field">
            <label for="f-email">Email</label>
            <input id="f-email" type="email" value="${form.email}" autocomplete="email">
            <span class="field-error">Informe um email válido.</span>
          </div>
        </div>
        <div class="form-field">
          <label for="f-cpf">CPF <span class="optional">(opcional)</span></label>
          <input id="f-cpf" value="${form.cpf}" inputmode="numeric" placeholder="000.000.000-00">
        </div>
        <div class="step-actions">
          <button class="btn btn-outline" id="back-btn">Voltar</button>
          <button class="btn btn-primary" id="next-btn">Continuar</button>
        </div>
      </div>`,

    endereco: () => `
      <div class="checkout-step">
        <div class="form-grid">
          <div class="form-field">
            <label for="f-cep">CEP</label>
            <input id="f-cep" value="${form.cep}" inputmode="numeric" placeholder="00000-000">
            <span class="field-error">Informe um CEP válido.</span>
          </div>
          <div class="form-field">
            <label for="f-numero">Número</label>
            <input id="f-numero" value="${form.numero}" inputmode="numeric">
            <span class="field-error">Informe o número.</span>
          </div>
          <div class="form-field full">
            <label for="f-rua">Rua</label>
            <input id="f-rua" value="${form.rua}" autocomplete="address-line1">
            <span class="field-error">Informe a rua.</span>
          </div>
          <div class="form-field full">
            <label for="f-complemento">Complemento <span class="optional">(opcional)</span></label>
            <input id="f-complemento" value="${form.complemento}">
          </div>
          <div class="form-field">
            <label for="f-bairro">Bairro</label>
            <input id="f-bairro" value="${form.bairro}">
            <span class="field-error">Informe o bairro.</span>
          </div>
          <div class="form-field">
            <label for="f-cidade">Cidade</label>
            <input id="f-cidade" value="${form.cidade}">
            <span class="field-error">Informe a cidade.</span>
          </div>
          <div class="form-field">
            <label for="f-estado">Estado</label>
            <input id="f-estado" value="${form.estado}" maxlength="2" placeholder="SC" style="text-transform:uppercase;">
            <span class="field-error">Informe o estado (UF).</span>
          </div>
        </div>
        <div class="step-actions">
          <button class="btn btn-outline" id="back-btn">Voltar</button>
          <button class="btn btn-primary" id="next-btn">Continuar</button>
        </div>
      </div>`,

    obs: () => `
      <div class="checkout-step">
        <div class="form-field full">
          <label for="f-obs">Observações <span class="optional">(opcional)</span></label>
          <textarea id="f-obs" placeholder="Alguma preferência ou informação adicional para o pedido?">${form.observacoes}</textarea>
        </div>
        <div class="step-actions">
          <button class="btn btn-outline" id="back-btn">Voltar</button>
          <button class="btn btn-primary" id="next-btn">Continuar</button>
        </div>
      </div>`,

    revisao: () => `
      <div class="checkout-step">
        <div class="review-section">
          <h4>Produto</h4>
          <div class="review-grid">
            <div><span>Produto</span>${order.productName}</div>
            <div><span>Tamanho</span>${order.size}</div>
            <div><span>Quantidade</span>${order.qty}</div>
            <div><span>Total</span>${money(order.total)}</div>
          </div>
        </div>
        <div class="review-section">
          <h4>Dados pessoais</h4>
          <div class="review-grid">
            <div><span>Nome</span>${form.nome}</div>
            <div><span>Telefone</span>${form.telefone}</div>
            <div><span>Email</span>${form.email}</div>
            <div><span>CPF</span>${form.cpf || "—"}</div>
          </div>
        </div>
        <div class="review-section">
          <h4>Entrega</h4>
          <div class="review-grid">
            <div><span>CEP</span>${form.cep}</div>
            <div><span>Rua</span>${form.rua}, ${form.numero}</div>
            <div><span>Complemento</span>${form.complemento || "—"}</div>
            <div><span>Bairro</span>${form.bairro}</div>
            <div><span>Cidade</span>${form.cidade}</div>
            <div><span>Estado</span>${form.estado}</div>
          </div>
        </div>
        ${form.observacoes ? `<div class="review-section"><h4>Observações</h4><p>${form.observacoes}</p></div>` : ""}
        <div class="step-actions">
          <button class="btn btn-outline" id="back-btn">Voltar</button>
          <button class="btn btn-whatsapp" id="send-btn">Enviar pedido pelo WhatsApp</button>
        </div>
      </div>`,
  };

  function setFieldError(input, hasError) {
    const field = input.closest(".form-field");
    field?.classList.toggle("has-error", hasError);
  }

  function validateStep(key) {
    let valid = true;
    if (key === "dados") {
      const nome = document.getElementById("f-nome");
      const telefone = document.getElementById("f-telefone");
      const email = document.getElementById("f-email");
      const nomeOk = nome.value.trim().split(" ").filter(Boolean).length >= 2;
      const telOk = telefone.value.replace(/\D/g, "").length >= 10;
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      setFieldError(nome, !nomeOk);
      setFieldError(telefone, !telOk);
      setFieldError(email, !emailOk);
      valid = nomeOk && telOk && emailOk;
      if (valid) {
        form.nome = nome.value.trim();
        form.telefone = telefone.value.trim();
        form.email = email.value.trim();
        form.cpf = document.getElementById("f-cpf").value.trim();
      }
    }
    if (key === "endereco") {
      const cep = document.getElementById("f-cep");
      const rua = document.getElementById("f-rua");
      const numero = document.getElementById("f-numero");
      const bairro = document.getElementById("f-bairro");
      const cidade = document.getElementById("f-cidade");
      const estado = document.getElementById("f-estado");
      const cepOk = cep.value.replace(/\D/g, "").length === 8;
      const ruaOk = rua.value.trim().length > 2;
      const numeroOk = numero.value.trim().length > 0;
      const bairroOk = bairro.value.trim().length > 1;
      const cidadeOk = cidade.value.trim().length > 1;
      const estadoOk = estado.value.trim().length === 2;
      setFieldError(cep, !cepOk);
      setFieldError(rua, !ruaOk);
      setFieldError(numero, !numeroOk);
      setFieldError(bairro, !bairroOk);
      setFieldError(cidade, !cidadeOk);
      setFieldError(estado, !estadoOk);
      valid = cepOk && ruaOk && numeroOk && bairroOk && cidadeOk && estadoOk;
      if (valid) {
        form.cep = cep.value.trim();
        form.rua = rua.value.trim();
        form.numero = numero.value.trim();
        form.complemento = document.getElementById("f-complemento").value.trim();
        form.bairro = bairro.value.trim();
        form.cidade = cidade.value.trim();
        form.estado = estado.value.trim().toUpperCase();
      }
    }
    if (key === "obs") {
      form.observacoes = document.getElementById("f-obs").value.trim();
    }
    return valid;
  }

  function bindStepEvents(key) {
    document.getElementById("back-btn")?.addEventListener("click", () => {
      currentStep = Math.max(0, currentStep - 1);
      renderStep();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    document.getElementById("next-btn")?.addEventListener("click", () => {
      if (!validateStep(key)) return;
      currentStep = Math.min(STEPS.length - 1, currentStep + 1);
      renderStep();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    document.getElementById("send-btn")?.addEventListener("click", sendToWhatsApp);
  }

  function sendToWhatsApp() {
    const lines = [
      "Olá!",
      "Gostaria de realizar um pedido na Rize.",
      "────────────",
      "📦 PRODUTO",
      `Produto: ${order.productName}`,
      `Tamanho: ${order.size}`,
      `Quantidade: ${order.qty}`,
      `Valor: ${money(order.total)}`,
      `Cupom aplicado: ${order.coupon || "Nenhum"}`,
      "────────────",
      "👤 DADOS",
      `Nome: ${form.nome}`,
      `Telefone: ${form.telefone}`,
      `Email: ${form.email}`,
      `CPF: ${form.cpf || "Não informado"}`,
      "────────────",
      "📍 ENTREGA",
      `CEP: ${form.cep}`,
      `Rua: ${form.rua}`,
      `Número: ${form.numero}`,
      `Complemento: ${form.complemento || "—"}`,
      `Bairro: ${form.bairro}`,
      `Cidade: ${form.cidade}`,
      `Estado: ${form.estado}`,
      "────────────",
      "📝 OBSERVAÇÕES",
      form.observacoes || "Nenhuma",
      "",
      "Aguardo confirmação do pedido.",
    ];
    const url = `https://wa.me/${RIZE_WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    localStorage.removeItem("rizeOrder");
    window.open(url, "_blank", "noopener");
  }

  renderStep();
})();
