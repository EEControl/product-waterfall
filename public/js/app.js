let currentSource = "alibaba";
let currentDate = null;
let allProducts = [];
let videoOnly = false;

function switchSource(source, btn) {
  if (source === currentSource) return;
  document.querySelectorAll(".source-btn").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");

  currentSource = source;
  currentDate = null;
  allProducts = [];
  videoOnly = false;
  document.getElementById("grid").innerHTML = "";
  document.getElementById("dateSelect").innerHTML = "<option value=''>Select Date</option>";
  document.getElementById("statsBar").style.display = "none";
  document.getElementById("videoOnlyBtn").textContent = "Show Video Products Only";

  loadDates();
}

async function loadDates() {
  const res = await fetch(`/api/dates?source=${currentSource}`);
  const data = await res.json();
  if (!data.success) return;
  const sel = document.getElementById("dateSelect");
  data.dates.forEach(d=>{
    const opt = document.createElement("option");
    opt.value=d; opt.textContent=d;
    sel.appendChild(opt);
  });
}

async function loadProducts(date) {
  if(!date) return;
  currentDate = date;
  const res = await fetch(`/api/products?date=${date}&source=${currentSource}`);
  if(!res.ok) return alert("No data for this date");
  const data = await res.json();
  allProducts = data.products || [];
  updateStats();
  renderProductList();
}

function updateStats(){
  const total = allProducts.length;
  const videoCount = allProducts.filter(p=>p.video_url && p.video_url.trim()!=="").length;
  const percent = total?((videoCount/total)*100).toFixed(1):0;
  const statsBar=document.getElementById("statsBar");
  const statsText=document.getElementById("statsText");
  statsText.innerHTML=`🔥 Source:<b>www.${currentSource.toUpperCase()}.com</b> | 📅 Date:<b>${currentDate}</b> | 📦 Products:<b>${total}</b> | 🎬 Video Products:<b>${videoCount}</b> | 📊 Video Ratio:<b>${percent}%</b>`;
  statsBar.style.display="block";
}

function renderProductList(){
  const grid=document.getElementById("grid");
  grid.innerHTML="";
  const list = videoOnly?allProducts.filter(p=>p.video_url && p.video_url.trim()!==""):allProducts;
  list.forEach(renderCard);
}

function toggleVideoOnly(){
  videoOnly=!videoOnly;
  document.getElementById("videoOnlyBtn").textContent = videoOnly?"Show All Products":"Show Video Products Only";
  renderProductList();
}

async function renderCard(p){
  const card=document.createElement("div"); card.className="card";
  const link = (p.link && p.link.includes("alibaba.com"))?p.link:`https://detail.1688.com/offer/${p.offerId}.html`;
  const title=document.createElement("div"); title.className="title";
  const displayTitle=p.title||p.offerId||"Unnamed Product";
  title.innerHTML=`<a href="${link}" target="_blank" title="${displayTitle}">${displayTitle}</a>`;
  card.appendChild(title);

  const media=document.createElement("div"); media.className="media";
  if(p.video_url){
    const v=document.createElement("video"); v.src=p.video_url; v.controls=true; v.muted=true; v.preload="metadata"; v.playsInline=true; media.appendChild(v);
  }
  if(p.images && p.images.length){
    p.images.forEach(url=>{ const img=document.createElement("img"); img.src=`/image-proxy?url=${encodeURIComponent(url)}`; media.appendChild(img); });
  }
  card.appendChild(media);

  const actions=document.createElement("div"); actions.className="actions";
  const btn=document.createElement("button"); btn.textContent="Download ZIP"; btn.onclick=()=>window.location.href=`/download-zip?source=${currentSource}&date=${currentDate}&id=${p.offerId}`;
  const countEl=document.createElement("div"); countEl.className="count";
  fetch(`/api/download-count?source=${currentSource}&id=${p.offerId}`).then(r=>r.json()).then(d=>countEl.textContent=`Downloaded ${d.count} times`);
  actions.appendChild(btn); actions.appendChild(countEl); card.appendChild(actions);

  document.getElementById("grid").appendChild(card);
}

loadDates();
