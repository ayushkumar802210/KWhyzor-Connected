const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const cfg=window.KWHYZOR_CONFIG||{};
const supabaseReady=cfg.SUPABASE_URL && !cfg.SUPABASE_URL.startsWith("YOUR_") &&
  cfg.SUPABASE_ANON_KEY && !cfg.SUPABASE_ANON_KEY.startsWith("YOUR_");
const sb=supabaseReady ? window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY) : null;

const state={name:localStorage.getItem("kwhyzor_name")||"User",email:"",userId:null,page:"dashboard",
  bills:[{month:"August 2026",amount:3140,units:412},{month:"July 2026",amount:2020,units:331},
         {month:"June 2026",amount:1850,units:305},{month:"May 2026",amount:1760,units:292}],
  appliances:[]};

function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2400)}
function showAuth(type="signin"){
  $("#signinForm").classList.toggle("hidden",type!=="signin");
  $("#signupForm").classList.toggle("hidden",type!=="signup");
  $$(".tab").forEach(x=>x.classList.toggle("active",x.dataset.auth===type));
}
function setUserUI(){const n=state.name||"User";$("#userName").textContent=n;$("#avatar").textContent=n[0].toUpperCase()}
function enterApp(){$("#authScreen").classList.add("hidden");$("#appScreen").classList.remove("hidden");setUserUI();render(state.page)}
async function logout(){if(sb)await sb.auth.signOut();localStorage.removeItem("kwhyzor_session");$("#appScreen").classList.add("hidden");$("#authScreen").classList.remove("hidden");showAuth("signin");toast("Signed out successfully")}

async function loadUserData(){
  if(!sb||!state.userId)return;
  const [{data:p},{data:b},{data:a}]=await Promise.all([
    sb.from("profiles").select("*").eq("id",state.userId).maybeSingle(),
    sb.from("bills").select("*").eq("user_id",state.userId).order("billing_date",{ascending:false}).limit(24),
    sb.from("appliances").select("*").eq("user_id",state.userId).order("created_at",{ascending:false})
  ]);
  if(p?.full_name)state.name=p.full_name;
  if(b?.length)state.bills=b.map(x=>({month:new Date(x.billing_date).toLocaleDateString("en-US",{month:"long",year:"numeric"}),amount:Number(x.amount),units:Number(x.units_kwh)}));
  state.appliances=a||[];
  localStorage.setItem("kwhyzor_name",state.name);
}
async function init(){
  if(!sb){if(cfg.DEMO_MODE&&localStorage.getItem("kwhyzor_session"))enterApp();return}
  const {data:{session}}=await sb.auth.getSession();
  if(session){state.userId=session.user.id;state.email=session.user.email||"";await loadUserData();enterApp()}
  sb.auth.onAuthStateChange(async(_event,session)=>{
    if(session){state.userId=session.user.id;state.email=session.user.email||"";await loadUserData();enterApp()}
  });
}
init();

$$(".tab").forEach(b=>b.onclick=()=>showAuth(b.dataset.auth));
$$(".switchAuth").forEach(b=>b.onclick=()=>showAuth($("#signinForm").classList.contains("hidden")?"signin":"signup"));

$("#signinForm").onsubmit=async e=>{
  e.preventDefault();const email=$("#signinEmail").value.trim(),password=$("#signinPassword").value;
  if(!sb){localStorage.setItem("kwhyzor_session","demo");state.name=localStorage.getItem("kwhyzor_name")||"User";enterApp();toast("Demo sign-in. Add Supabase keys for real accounts.");return}
  const {error}=await sb.auth.signInWithPassword({email,password});if(error){toast(error.message);return}toast("Welcome back!")
};
$("#signupForm").onsubmit=async e=>{
  e.preventDefault();const name=$("#signupName").value.trim(),email=$("#signupEmail").value.trim(),password=$("#signupPassword").value;
  if(!sb){localStorage.setItem("kwhyzor_name",name);localStorage.setItem("kwhyzor_session","demo");state.name=name;enterApp();toast("Demo account created.");return}
  const {data,error}=await sb.auth.signUp({email,password,options:{data:{full_name:name}}});
  if(error){toast(error.message);return}
  if(data.user)await sb.from("profiles").upsert({id:data.user.id,full_name:name});
  if(!data.session)toast("Account created. Check your email to confirm, then sign in.");else{state.userId=data.user.id;state.name=name;await loadUserData();enterApp();toast("Account created!")}
};
$("#logoutBtn").onclick=logout;
$("#forgotBtn").onclick=async()=>{
  const email=$("#signinEmail").value.trim();if(!email){toast("Enter your email first.");return}
  if(!sb){toast("Connect Supabase to enable password reset.");return}
  const {error}=await sb.auth.resetPasswordForEmail(email,{redirectTo:location.href});toast(error?error.message:"Password reset email sent.")
};
$$("[data-social]").forEach(b=>b.onclick=()=>toast("Enable social providers in Supabase Auth to use this button."));
$("#themeBtn").onclick=()=>document.body.classList.toggle("light");
$("#menuBtn").onclick=()=>$(".sidebar").classList.toggle("open");
$("#notifyBtn").onclick=()=>toast("3 energy alerts need your attention.");
$("#upgradeBtn").onclick=()=>toast("Connect a payment provider/server checkout to enable Pro.");
$$(".nav-item[data-page]").forEach(b=>b.onclick=()=>{state.page=b.dataset.page;$(".sidebar").classList.remove("open");render(state.page)});

async function addBill(){
  if(!sb||!state.userId){toast("Connect Supabase first to save bills.");return}
  const amount=Number(prompt("Bill amount (₹)","3140")),units=Number(prompt("Units consumed (kWh)","412"));
  if(!amount||!units){toast("Enter valid values.");return}
  const {error}=await sb.from("bills").insert({user_id:state.userId,billing_date:new Date().toISOString().slice(0,10),amount,units_kwh:units});
  if(error)toast(error.message);else{await loadUserData();render("bills");toast("Bill saved.")}
}
async function addAppliance(){
  if(!sb||!state.userId){toast("Connect Supabase first to save appliances.");return}
  const name=prompt("Appliance name","Air Conditioner"),wattage=Number(prompt("Power (watts)","1500")),hours=Number(prompt("Hours/day","5"));
  if(!name||!wattage||hours<0){toast("Enter valid values.");return}
  const {error}=await sb.from("appliances").insert({user_id:state.userId,name,wattage,hours_per_day:hours,quantity:1});
  if(error)toast(error.message);else{await loadUserData();render("appliances");toast("Appliance saved.")}
}
function dashboard(){
return `<div class="cards">
<div class="metric"><div class="metric-head"><span>Current Month Bill (Est.)</span><i class="metric-icon">▤</i></div><strong>₹3,140</strong><small class="up">↗ 35% vs last month</small></div>
<div class="metric"><div class="metric-head"><span>Units Consumed</span><i class="metric-icon">∿</i></div><strong>412 kWh</strong><small class="up">↗ 24% vs last month</small></div>
<div class="metric"><div class="metric-head"><span>Energy Score</span><i class="metric-icon">★</i></div><strong>72 / 100</strong><small class="warn">Needs Improvement</small></div>
<div class="metric"><div class="metric-head"><span>Potential Saving</span><i class="metric-icon">₹</i></div><strong>₹450–₹600</strong><small>Per month</small></div>
</div>
<div class="grid2">
<section class="panel"><div class="panel-head"><div><h3>Bill Detective</h3><div class="panel-sub">AI is investigating why your bill increased.</div></div><button class="select" onclick="state.page='detective';render('detective')">Full Report →</button></div>
<div class="detective-box"><div class="investigation"><div class="detective-icon">🕵️‍♂️</div><b>Investigation Complete</b><p>We found the most likely reasons for your bill increase.</p></div><div>
${cause("❄️","Increased Cooling Load","AC usage increased by approx. 5–6 hrs/day compared to last month.","High","up")}
${cause("💧","Water Pump Usage","Pump usage increased by about 8% this month.","Medium","warn")}
${cause("▣","Other Appliances","Slight increase in refrigerator & other devices.","Low","good")}
</div></div>
<div class="question">Help us improve accuracy. Did anything change this month?</div><div class="choices"><button class="choice" onclick="toast('Thanks — investigation updated.')">New AC used</button><button class="choice" onclick="toast('Thanks — investigation updated.')">More family members</button><button class="choice" onclick="toast('Thanks — investigation updated.')">Pump used more</button><button class="choice" onclick="toast('Thanks — investigation updated.')">Nothing changed</button></div></section>
<section class="panel"><div class="panel-head"><div><h3>Consumption Overview</h3><div class="panel-sub">Units (kWh) · Last 6 months</div></div><select class="select"><option>Last 6 Months</option><option>Last Year</option></select></div><div class="chart">${[55,63,70,58,73,92].map((h,i)=>`<div class="bar" style="height:${h}%"><span>${[245,281,305,267,331,412][i]}</span></div>`).join("")}</div><div class="months"><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span></div></section></div>
<div class="grid3">
${simCard()}${twinCard()}${evCard()}
</div>
<div class="grid2">${billsCard()}${insightCard()}</div>`;
}
function cause(icon,title,desc,impact,cls){return `<div class="cause"><div class="cause-icon">${icon}</div><div><h4>${title}</h4><p>${desc}</p></div><div class="impact"><span>Impact</span><b class="${cls}">${impact}</b></div></div>`}
function simCard(){return `<section class="panel"><h3>What-If Simulator</h3><div class="panel-sub">See how changes can impact your bill.</div><div class="list">${[['Reduce AC by 2 hrs/day','-₹350'],['Use 5-Star Refrigerator','-₹220'],['Install 3kW Solar System','-₹1,100']].map(x=>`<div class="list-row"><div><b>${x[0]}</b></div><span class="value good">${x[1]}</span></div>`).join("")}</div><button class="primary full" onclick="state.page='simulator';render('simulator')">Open Simulator</button></section>`}
function twinCard(){return `<section class="panel"><h3>Electricity Twin</h3><div class="panel-sub">Your digital energy model.</div><div class="twin"><div class="house">🏠</div><span class="chip ac">❄️ AC<br>1.5 kW</span><span class="chip fan">🌀 Fan<br>75 W</span><span class="chip ev">🚗 EV</span><span class="chip solar">☀️ Solar</span></div><button class="primary full" onclick="state.page='twin';render('twin')">Manage Twin</button></section>`}
function evCard(){return `<section class="panel"><h3>EV Analysis</h3><div class="panel-sub">See EV charging impact.</div><div style="font-size:70px;text-align:center;padding:12px">🚗⚡</div><small style="color:var(--muted)">Monthly Charging Cost (Est.)</small><h3 class="good" style="margin:4px 0 14px">₹620</h3><button class="primary full" onclick="state.page='ev';render('ev')">Check EV Impact</button></section>`}
function billsCard(){return `<section class="panel"><h3>Recent Bills</h3><div class="list">${state.bills.slice(0,4).map(b=>`<div class="list-row"><div><b>${b.month}</b><small>${b.units} kWh</small></div><span class="value">₹${b.amount.toLocaleString()}</span></div>`).join("")}</div><button class="primary full" onclick="state.page='bills';render('bills')">View All Bills</button></section>`}
function insightCard(){return `<section class="panel"><h3>Today's Energy Insight</h3><div class="result"><b>🔎 Cooling load is your strongest signal.</b><p style="color:var(--muted);font-size:11px;line-height:1.6;margin-top:7px">Your current pattern suggests cooling-related usage may be the biggest contributor to this month's increase. Verify your AC usage before making changes.</p></div><div class="button-row"><button class="choice" onclick="toast('Report saved.')">Save Insight</button><button class="choice" onclick="state.page='detective';render('detective')">Investigate</button></div></section>`}

function detective(){return `<div><h1 class="page-title">Bill Detective 🔎</h1><p class="page-copy">Investigate changes between billing periods and identify likely contributors.</p><section class="panel"><div class="cards"><div class="metric"><span>June</span><strong>₹1,850</strong><small>305 kWh</small></div><div class="metric"><span>July</span><strong>₹2,020</strong><small>331 kWh</small></div><div class="metric"><span>August</span><strong>₹3,140</strong><small>412 kWh</small></div><div class="metric"><span>Change</span><strong class="up">+55.4%</strong><small>vs June</small></div></div><div class="result"><h3>🔎 Likely cause detected: Increased cooling load</h3><p style="color:var(--muted);font-size:12px;margin-top:8px">The current data points toward cooling usage as the strongest contributor. This is an estimate, not a utility diagnosis.</p></div></section><section class="panel" style="margin-top:15px"><h3>Investigation questions</h3><div class="form-grid" style="margin-top:15px">${["Did you start using a new AC?","Did AC usage hours increase?","Was the water pump used more?","Did the number of occupants change?"].map(q=>`<button class="choice" style="text-align:left;padding:15px" onclick="toast('Answer recorded: ${q}')">${q}<br><span style="color:var(--cyan)">Tap to answer →</span></button>`).join("")}</div></section></div>`}
function simulator(){return `<div><h1 class="page-title">What-If Simulator</h1><p class="page-copy">Change one variable and see the estimated monthly impact.</p><section class="panel"><div class="form-grid">${field("AC hours/day","acHours","4", "number",0,24)}${field("AC power (kW)","acPower","1.5","number",0,10)}${field("Electricity rate (₹/kWh)","rate","8","number",0,100)}${field("Current bill (₹)","currentBill","3140","number",0,100000)}</div><button class="primary" style="margin-top:15px" onclick="simulate()">Run Simulation</button><div id="simResult"></div></section></div>`}
function field(label,id,value,type="text",min="",max=""){return `<div class="field"><label>${label}</label><input id="${id}" type="${type}" value="${value}" ${min!==""?`min="${min}"`:''} ${max!==""?`max="${max}"`:''}></div>`}
function simulate(){let h=+$("#acHours").value,p=+$("#acPower").value,r=+$("#rate").value,b=+$("#currentBill").value;let saving=Math.max(0,(6-h)*p*30*r);$("#simResult").innerHTML=`<div class="result"><span>Estimated bill impact</span><strong> -₹${Math.round(saving).toLocaleString()}</strong><p style="color:var(--muted);font-size:10px;margin-top:6px">Based on ${h} hrs/day, ${p} kW AC power and ₹${r}/kWh. Actual bills can differ because tariffs, slabs and other loads vary.</p></div>`}
function twin(){return `<div><h1 class="page-title">Electricity Twin 🏠</h1><p class="page-copy">Create a simple digital model of your home and experiment with usage.</p><section class="panel"><div class="twin" style="min-height:360px"><div class="house">🏠</div><span class="chip ac">❄️ AC · 1.5 kW · 4h/day</span><span class="chip fan">🌀 Fans · 75W</span><span class="chip ev">🚗 EV · 40 kWh</span><span class="chip solar">☀️ Solar · 3 kW</span></div><div class="button-row"><button class="primary" onclick="toast('Appliance editor opened.')">+ Add Appliance</button><button class="choice" onclick="toast('Twin scenario reset.')">Reset Scenario</button></div></section></div>`}
function bills(){return `<div><h1 class="page-title">Bills</h1><p class="page-copy">Your electricity history and consumption trend.</p><section class="panel"><div class="list">${state.bills.map(b=>`<div class="list-row"><div><b>${b.month}</b><small>${b.units} kWh · Energy report available</small></div><span class="value">₹${b.amount.toLocaleString()}</span></div>`).join("")}</div><button class="primary" style="margin-top:15px" onclick="addBill()">+ Add New Bill</button></section></div>`}
function appliances(){return `<div><h1 class="page-title">Appliances</h1><p class="page-copy">Estimate which appliances contribute most to your electricity usage.</p><section class="panel"><div class="list">${[["❄️","Air Conditioner","1.5 kW · 5h/day","42%"],["💧","Water Pump","0.75 kW · 1h/day","18%"],["🧊","Refrigerator","0.15 kW · 24h/day","12%"],["🌀","Fans","0.075 kW · 8h/day","9%"],["📺","TV & Devices","0.12 kW · 5h/day","7%"]].map(a=>`<div class="list-row"><div><b>${a[0]} ${a[1]}</b><small>${a[2]}</small></div><span class="value">${a[3]}</span></div>`).join("")}</div><button class="primary" style="margin-top:15px" onclick="addAppliance()">+ Add Appliance</button></section></div>`}
function ev(){return `<div><h1 class="page-title">EV Analysis 🚗</h1><p class="page-copy">Estimate how home EV charging could affect your electricity usage.</p><section class="panel"><div class="form-grid">${field("Battery capacity (kWh)","battery","40","number",1,200)}${field("Current charge (%)","soc","20","number",0,100)}${field("Target charge (%)","target","90","number",1,100)}${field("Electricity rate (₹/kWh)","evrate","8","number",0,100)}</div><button class="primary" style="margin-top:15px" onclick="evCalc()">Calculate Charging Cost</button><div id="evResult"></div></section></div>`}
function evCalc(){let b=+$("#battery").value,s=+$("#soc").value,t=+$("#target").value,r=+$("#evrate").value;let k=Math.max(0,b*(t-s)/100)/.9;$("#evResult").innerHTML=`<div class="result"><span>Estimated charging energy</span><strong>${k.toFixed(1)} kWh</strong><p style="color:var(--muted);font-size:11px;margin-top:5px">Estimated cost: <b class="good">₹${Math.round(k*r)}</b>. Includes a 10% charging-loss assumption.</p></div>`}
function solar(){return `<div><h1 class="page-title">Solar Planner ☀️</h1><p class="page-copy">Explore a simple solar scenario for your home.</p><section class="panel"><div class="form-grid">${field("Monthly consumption (kWh)","solarKwh","412","number",0,100000)}${field("Solar capacity (kW)","solarKw","3","number",0,100)}${field("Estimated generation per kW/month","gen","110","number",1,500)}${field("Electricity rate (₹/kWh)","solarRate","8","number",0,100)}</div><button class="primary" style="margin-top:15px" onclick="solarCalc()">Estimate Scenario</button><div id="solarResult"></div></section></div>`}
function solarCalc(){let k=+$("#solarKwh").value,kw=+$("#solarKw").value,g=+$("#gen").value,r=+$("#solarRate").value;let gen=kw*g,offset=Math.min(k,gen)*r;$("#solarResult").innerHTML=`<div class="result"><span>Estimated monthly generation</span><strong>${gen} kWh</strong><p style="color:var(--muted);font-size:11px;margin-top:5px">Illustrative bill-offset potential: <b class="good">₹${Math.round(offset).toLocaleString()}/month</b>. Actual generation and savings depend on location, system design, tariff and export rules.</p></div>`}
function reports(){return `<div><h1 class="page-title">Reports</h1><p class="page-copy">Your generated energy investigations.</p><section class="panel">${["August 2026 · Bill Investigation","July 2026 · Monthly Energy Report","June 2026 · Appliance Analysis"].map((x,i)=>`<div class="list-row"><div><b>📄 ${x}</b><small>AI-assisted report · ${i+1} findings</small></div><button class="choice" onclick="toast('Report preview opened.')">View</button></div>`).join("")}</section></div>`}
function alerts(){return `<div><h1 class="page-title">Alerts</h1><p class="page-copy">Energy events that may deserve attention.</p><section class="panel">${[["⚠️","Bill increase detected","August estimated bill is 35% higher than July.","up"],["💡","Cooling load increased","Review AC usage and operating hours.","warn"],["✓","Monthly report ready","Your latest energy investigation is ready.","good"]].map(a=>`<div class="cause"><div class="cause-icon">${a[0]}</div><div><h4>${a[1]}</h4><p>${a[2]}</p></div><div class="impact"><b class="${a[3]}">New</b></div></div>`).join("")}</section></div>`}
function settings(){return `<div><h1 class="page-title">Settings</h1><p class="page-copy">Manage your KWhyzor experience.</p><section class="panel"><div class="form-grid">${field("Display name","setName",state.name)}${field("Email","setEmail","you@example.com")}</div><button class="primary" style="margin-top:15px" onclick="state.name=$('#setName').value;localStorage.setItem('kwhyzor_name',state.name);$('#userName').textContent=state.name;$('#avatar').textContent=state.name[0].toUpperCase();toast('Settings saved.')">Save Changes</button></section></div>`}

function render(page){const titles={dashboard:"Dashboard",detective:"Bill Detective",simulator:"What-If Simulator",twin:"Electricity Twin",bills:"Bills",appliances:"Appliances",ev:"EV Analysis",solar:"Solar Planner",reports:"Reports",alerts:"Alerts",settings:"Settings"};$("#pageTitle").textContent=titles[page]||"Dashboard";$$(".nav-item[data-page]").forEach(b=>b.classList.toggle("active",b.dataset.page===page));const pages={dashboard,detective,simulator,twin,bills,appliances,ev,solar,reports,alerts,settings};$("#pageContent").innerHTML=(pages[page]||dashboard)()}
