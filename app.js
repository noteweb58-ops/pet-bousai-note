const $ = (id) => document.getElementById(id);

const products = [
  {
    id: "petFood",
    icon: "食",
    name: "普段のペットフード",
    description: "災害時に急な切り替えをしないため、食べ慣れたフードを多めに保管。"
  },
  {
    id: "petWater",
    icon: "水",
    name: "保存水・飲み水",
    description: "家族用とは別にペット分も確保。ウェットフードと組み合わせると水分補給を助けます。"
  },
  {
    id: "sheets",
    icon: "敷",
    name: "ペットシーツ",
    description: "犬、小動物、避難先の床保護に使いやすい消耗品。厚型も候補に。"
  },
  {
    id: "litter",
    icon: "砂",
    name: "猫砂・トイレ砂",
    description: "猫は使い慣れた砂を優先。小分け保管で持ち出しやすくします。"
  },
  {
    id: "carrier",
    icon: "箱",
    name: "キャリー・ケージ",
    description: "同行避難の基本用品。普段から入る練習をしておくと安心です。"
  },
  {
    id: "deodorant",
    icon: "袋",
    name: "防臭袋・処理袋",
    description: "排泄物や使用済みシーツの臭い対策。避難所や車内で重要です。"
  }
];

const checklistBase = [
  ["フード", "普段食べているものを、日数分より少し多めにローリングストック。"],
  ["水", "ペット専用分を人間用と別に計算。暑さや体調で増える前提に。"],
  ["薬・療法食", "代替しにくいものは、かかりつけ医と相談し余裕分を確保。"],
  ["キャリー・ケージ", "避難所や車内で落ち着けるよう、普段から慣らしておく。"],
  ["トイレ用品", "ペットシーツ、猫砂、処理袋、防臭袋、ウェットティッシュ。"],
  ["身元表示", "迷子札、マイクロチップ情報、写真、ワクチン証明の控え。"],
  ["リード・ハーネス", "犬は予備リード、猫は洗濯ネットや脱走対策も確認。"],
  ["安心用品", "匂いのついたタオル、おもちゃ、ブランケットなど。"],
  ["避難先メモ", "ペット同行可の避難先、預け先、動物病院の連絡先。"]
];

function numberValue(id, fallback = 0) {
  const value = Number($(id).value);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function estimateFoodGrams(species, weight) {
  if (species === "cat") return Math.max(35, Math.round(weight * 14));
  if (species === "small") return Math.max(20, Math.round(weight * 45));
  if (weight <= 5) return Math.round(weight * 24);
  if (weight <= 15) return Math.round(weight * 20);
  return Math.round(weight * 16);
}

function speciesLabel(species) {
  return { dog: "犬", cat: "猫", small: "小動物" }[species] || "ペット";
}

function calculate() {
  const species = $("species").value;
  const count = numberValue("count", 1);
  const weight = numberValue("weight", 5);
  const days = numberValue("days", 7);
  const dailyFoodInput = Number($("daily-food").value);
  const dailyFood = dailyFoodInput > 0 ? dailyFoodInput : estimateFoodGrams(species, weight);
  const toiletStyle = $("toilet-style").value;
  const medicine = $("medicine").checked;
  const evacuation = $("evacuation").checked;
  const senior = $("senior").checked;

  const waterPerKg = senior ? 70 : 60;
  const waterMl = Math.ceil(weight * waterPerKg * count * days);
  const foodGrams = Math.ceil(dailyFood * count * days * (evacuation ? 1.15 : 1.1));
  const medicineDays = medicine ? Math.ceil(days + 7) : 0;
  const sheets = toiletStyle === "litter" ? Math.ceil(count * days) : Math.ceil(count * days * 3);
  const litterKg = toiletStyle === "sheets" ? 0 : Math.ceil(count * days * 0.45);
  const bags = Math.ceil(count * days * 3.5);

  return {
    species,
    count,
    weight,
    days,
    dailyFood,
    waterMl,
    foodGrams,
    medicine,
    medicineDays,
    evacuation,
    senior,
    toiletStyle,
    sheets,
    litterKg,
    bags
  };
}

function formatWater(ml) {
  const liters = ml / 1000;
  if (liters < 10) return `${liters.toFixed(1)}L`;
  return `${Math.ceil(liters)}L`;
}

function formatFood(grams) {
  if (grams >= 1000) return `${(grams / 1000).toFixed(1)}kg`;
  return `${grams}g`;
}

function renderSummary(data) {
  $("result-title").textContent = `${speciesLabel(data.species)} ${data.count}頭・${data.days}日分の目安`;
  const metrics = [
    ["フード", formatFood(data.foodGrams), `1頭${data.dailyFood}g/日で計算`],
    ["水", formatWater(data.waterMl), `${data.weight}kg x ${data.count}頭`],
    ["トイレ用品", `${data.sheets}枚`, data.litterKg ? `砂は約${data.litterKg}kg` : "シーツ中心"],
    ["処理袋", `${data.bags}枚`, "排泄物・使用済み用品"]
  ];

  $("summary-grid").innerHTML = metrics
    .map(
      ([label, value, note]) => `
        <div class="metric">
          <span>${label}</span>
          <strong>${value}</strong>
          <p>${note}</p>
        </div>
      `
    )
    .join("");
}

function renderPriority(data) {
  const items = [
    `フードは最低 ${formatFood(data.foodGrams)}。普段の銘柄を小分けにして賞味期限順に回す。`,
    `水は ${formatWater(data.waterMl)} 以上。暑い時期やドライフード中心なら余裕を追加。`,
    `トイレ用品はシーツ ${data.sheets}枚${data.litterKg ? `、砂 約${data.litterKg}kg` : ""} を目安にする。`,
    `防臭袋・処理袋は ${data.bags}枚 ほど。避難先では臭い対策が大事。`
  ];

  if (data.medicine) {
    items.push(`薬・療法食は通常備蓄と別に ${data.medicineDays}日分を目標に確認。`);
  }
  if (data.evacuation) {
    items.push("避難所や車中避難を想定するなら、キャリー・ケージ・身元表示・証明書控えを優先。");
  }
  if (data.species === "cat") {
    items.push("猫は洗濯ネット、使い慣れた猫砂、脱走対策用ハーネスも候補。");
  }
  if (data.species === "dog") {
    items.push("犬は予備リード、足拭き、マナー袋、普段使うハーネスをセットで確認。");
  }

  $("priority-list").innerHTML = items.map((item) => `<li>${item}</li>`).join("");
}

function renderChecklist() {
  $("checklist-grid").innerHTML = checklistBase
    .map(
      ([title, body]) => `
        <label class="check-item">
          <input type="checkbox" />
          <span>
            <strong>${title}</strong>
            <p>${body}</p>
          </span>
        </label>
      `
    )
    .join("");
}

function renderProducts() {
  const links = window.AFFILIATE_LINKS || {};
  $("product-grid").innerHTML = products
    .map((product) => {
      const productLinks = links[product.id] || {};
      const shopLinks = [
        ["Amazon", productLinks.amazon],
        ["楽天", productLinks.rakuten],
        ["公式", productLinks.official]
      ].filter(([, url]) => Boolean(url));
      return `
        <article class="product-card">
          <div class="product-icon" aria-hidden="true">${product.icon}</div>
          <div>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
          </div>
          <div class="product-links" aria-label="${product.name}の購入リンク">
            ${shopLinks
              .map(
                ([label, url]) =>
                  `<button class="product-link-button" type="button" data-url="${url}" aria-label="${product.name}を${label}で探す">${label}</button>`
              )
              .join("")}
          </div>
        </article>
      `;
    })
    .join("");
}

function renderResultProducts() {
  $("result-shop-box").innerHTML = `
    <h3>足りない用品を確認</h3>
    <p>計算結果を見ながら、必要なカテゴリだけ下の購入候補リンクで確認できます。</p>
    <a class="button dark result-shop-scroll" href="#products">不足分の購入はこちら</a>
  `;
}

document.addEventListener("click", (event) => {
  const button = event.target.closest(".product-link-button");
  if (!button) return;
  const url = button.dataset.url;
  if (!url) return;
  window.open(url, "_blank", "noopener");
});

function update() {
  const data = calculate();
  renderSummary(data);
  renderPriority(data);
  renderResultProducts();
}

document.querySelectorAll("input, select").forEach((element) => {
  element.addEventListener("input", update);
  element.addEventListener("change", update);
});

renderChecklist();
renderProducts();
update();
