(function () {
  var CASES = [
    {
      id: "VN-FIN-2026-001",
      cat: "multi_tier_amortization_and_citation",
      src: "CSBH-VH-2026-Q4",
      ctx: "Khách hàng thanh toán sớm bằng vốn tự có trong vòng 15 ngày kể từ ngày ký HĐMB được hưởng mức chiết khấu 9.5% trên giá gốc trước VAT và KPBT, cộng thêm chiết khấu dòng tiền 11%/năm tính trên số tiền và số ngày thanh toán trước hạn. Phương án vay ngân hàng hỗ trợ lãi suất 0% và ân hạn nợ gốc trong 24 tháng cho tối đa 70% giá trị căn hộ.",
      query: "Tính số tiền thanh toán thực tế (chưa gồm VAT & KPBT) cho sản phẩm có giá gốc 10 tỷ VNĐ nếu khách chọn phương án thanh toán sớm trong 15 ngày (giả sử thanh toán sớm trung bình 300 ngày trên 70% giá trị), và trích dẫn chính xác điều khoản áp dụng.",
      json: {
        base_price_vnd: 10000000000,
        upfront_discount_rate: 0.095,
        price_after_upfront_vnd: 9050000000,
        early_cashflow_annual_rate: 0.11,
        early_payment_days: 300,
        early_payment_ratio: 0.70,
        early_cashflow_discount_vnd: 632876712,
        net_payable_pre_vat_vnd: 8417123288,
        required_citations: [
          "chiết khấu 9.5% trên giá gốc trước VAT và KPBT",
          "chiết khấu dòng tiền 11%/năm tính trên số tiền và số ngày thanh toán trước hạn"
        ],
        forbidden_hallucinations: [
          "hưởng đồng thời hỗ trợ lãi suất 0% và chiết khấu thanh toán sớm 9.5%"
        ]
      }
    },
    {
      id: "VN-FIN-2026-002",
      cat: "deferred_construction_cashflow",
      src: "CSBH-LOWRISE-GIANXAY-2026",
      ctx: "Đối với sản phẩm thấp tầng áp dụng tiến độ giãn xây 24 tháng: Giá bán trước VAT gồm Giá đất trước VAT (75%) và Giá xây dựng trước VAT (25%). Chiết khấu thanh toán chuẩn 6.5% chỉ tính trên phần Giá đất trước VAT. Kinh phí bảo trì (KPBT) bằng 0.5% tổng giá bán sau ưu đãi trước VAT.",
      query: "Cho căn thấp tầng có tổng giá gốc trước VAT là 20 tỷ VNĐ (đất 15 tỷ, xây 5 tỷ). Tính tổng giá sau ưu đãi trước VAT và khoản KPBT 0.5% khi chọn tiến độ giãn xây hưởng chiết khấu 6.5% trên giá đất.",
      json: {
        land_price_pre_vat_vnd: 15000000000,
        construction_price_pre_vat_vnd: 5000000000,
        land_discount_rate: 0.065,
        land_discount_amount_vnd: 975000000,
        net_price_pre_vat_vnd: 19025000000,
        kpbt_rate_lowrise: 0.005,
        kpbt_amount_vnd: 95125000,
        required_citations: [
          "Chiết khấu thanh toán chuẩn 6.5% chỉ tính trên phần Giá đất trước VAT",
          "Kinh phí bảo trì (KPBT) bằng 0.5% tổng giá bán sau ưu đãi trước VAT"
        ],
        forbidden_hallucinations: [
          "áp dụng chiết khấu 6.5% trên toàn bộ 20 tỷ bao gồm cả giá xây dựng",
          "tính KPBT 2% cho sản phẩm thấp tầng"
        ]
      }
    },
    {
      id: "VN-FIN-2026-003",
      cat: "maintenance_fee_calculation",
      src: "CSBH-HIGHRISE-KPBT-2026",
      ctx: "Kinh phí bảo trì (KPBT) đối với căn hộ cao tầng và shophouse khối đế bằng 2.0% giá bán sau ưu đãi trước VAT. Đối với nhà phố, biệt thự, dinh thự thấp tầng, KPBT bằng 0.5% giá bán sau ưu đãi trước VAT. Thuế GTGT (VAT) 10% áp dụng theo quy định pháp luật hiện hành.",
      query: "So sánh số tiền KPBT phải đóng của một căn hộ cao tầng và một căn nhà phố thấp tầng có cùng mức giá sau ưu đãi trước VAT là 8 tỷ VNĐ.",
      json: {
        net_price_pre_vat_vnd: 8000000000,
        highrise_kpbt_rate: 0.02,
        highrise_kpbt_vnd: 160000000,
        lowrise_kpbt_rate: 0.005,
        lowrise_kpbt_vnd: 40000000,
        kpbt_delta_vnd: 120000000,
        required_citations: [
          "căn hộ cao tầng và shophouse khối đế bằng 2.0% giá bán sau ưu đãi trước VAT",
          "nhà phố, biệt thự, dinh thự thấp tầng, KPBT bằng 0.5% giá bán sau ưu đãi trước VAT"
        ],
        forbidden_hallucinations: [
          "tính KPBT trên giá đã bao gồm VAT"
        ]
      }
    },
    {
      id: "VN-LAW-2026-006",
      cat: "statutory_citation_grounding",
      src: "LAW-KDBDS-2023-ART23",
      ctx: "Theo Khoản 5 Điều 23 Luật Kinh doanh bất động sản 2023 (có hiệu lực từ 01/08/2024): Chủ đầu tư dự án bất động sản chỉ được thu tiền đặt cọc không quá 5% giá bán, giá cho thuê mua nhà ở, công trình xây dựng hình thành trong tương lai khi đã có đủ điều kiện đưa vào kinh doanh.",
      query: "Theo Luật Kinh doanh bất động sản hiện hành, mức trần tiền đặt cọc đối với nhà ở hình thành trong tương lai là bao nhiêu phần trăm và căn cứ vào điều khoản nào?",
      json: {
        max_deposit_rate: 0.05,
        statutory_article: "Khoản 5 Điều 23 Luật Kinh doanh bất động sản 2023",
        effective_date: "2024-08-01",
        required_citations: [
          "Khoản 5 Điều 23 Luật Kinh doanh bất động sản 2023",
          "thu tiền đặt cọc không quá 5% giá bán, giá cho thuê mua"
        ],
        forbidden_hallucinations: [
          "đặt cọc tối đa 10% hoặc 15% trước khi ký HĐMB",
          "Luật Kinh doanh bất động sản 2014 quy định trần đặt cọc 5%"
        ]
      }
    }
  ];

  var tabs = document.querySelectorAll(".tab-btn");
  var elId = document.getElementById("cv-id");
  var elCat = document.getElementById("cv-cat");
  var elSrc = document.getElementById("cv-src");
  var elCtx = document.getElementById("cv-ctx");
  var elQuery = document.getElementById("cv-query");
  var elJson = document.getElementById("cv-json");

  function selectCase(idx) {
    var item = CASES[idx];
    if (!item) return;
    for (var i = 0; i < tabs.length; i++) {
      var active = i === idx;
      tabs[i].classList.toggle("active", active);
      tabs[i].setAttribute("aria-selected", active ? "true" : "false");
    }
    if (elId) elId.textContent = item.id;
    if (elCat) elCat.textContent = item.cat;
    if (elSrc) elSrc.textContent = item.src;
    if (elCtx) elCtx.textContent = item.ctx;
    if (elQuery) elQuery.textContent = item.query;
    if (elJson) elJson.textContent = JSON.stringify(item.json, null, 2);
  }

  for (var i = 0; i < tabs.length; i++) {
    (function (index) {
      tabs[index].addEventListener("click", function () {
        selectCase(index);
      });
    })(i);
  }

  var copyBtns = document.querySelectorAll(".copy-btn");
  for (var j = 0; j < copyBtns.length; j++) {
    copyBtns[j].addEventListener("click", function () {
      var btn = this;
      var text = btn.getAttribute("data-copy") || "";
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          var prev = btn.textContent;
          btn.textContent = "Copied ✓";
          setTimeout(function () {
            btn.textContent = prev;
          }, 1800);
        });
      }
    });
  }
})();
