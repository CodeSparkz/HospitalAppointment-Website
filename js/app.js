const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const specialties=[...new Set(doctors.map(d=>d.specialty))];
const city="Lahore";
const specialtyFilter=$("#specialtyFilter"), doctorSearch=$("#doctorSearch"), doctorGrid=$("#doctorGrid"), resultCount=$("#resultCount"), emptyState=$("#emptyState");

specialties.forEach(name=>{let o=document.createElement("option");o.value=name;o.textContent=name;specialtyFilter.appendChild(o);let o2=o.cloneNode(true);$("#appointmentSpecialty").appendChild(o2);});

function card(d){return `<article class="doctor-card"><div class="doctor-top"><div class="doctor-avatar ${d.color}">${d.avatar}</div><div class="doctor-name"><small>VERIFIED PROFILE</small><h3>${d.name}</h3><p>${d.specialty}</p></div><button class="more-btn" data-id="${d.id}">•••</button></div><div class="doctor-info"><span>★ ${d.rating}</span><span>${d.experience} yrs</span><span>PKR ${d.fee.toLocaleString()}</span></div><div class="clinic">${d.hospital}<br><small>${d.timings}</small></div><div class="doctor-action"><span><b>${d.availability}</b><small>next availability</small></span><button data-book="${d.id}">Book appointment →</button></div></article>`}
function render(){let q=doctorSearch.value.toLowerCase().trim(),s=specialtyFilter.value;let arr=doctors.filter(d=>(s==="All"||d.specialty===s)&&(!q||`${d.name} ${d.specialty} ${d.hospital}`.toLowerCase().includes(q)));doctorGrid.innerHTML=arr.map(card).join("");resultCount.textContent=`${arr.length} specialists available in Lahore`;emptyState.classList.toggle("hidden",arr.length>0);$$(".more-btn").forEach(b=>b.onclick=()=>openDoctor(+b.dataset.id));$$("[data-book]").forEach(b=>b.onclick=()=>book(+b.dataset.book))}
function openDoctor(id){let d=doctors.find(x=>x.id===id);$("#modalContent").innerHTML=`<div class="modal-profile"><div class="doctor-avatar large ${d.color}">${d.avatar}</div><div><small>VERIFIED SPECIALIST</small><h2>${d.name}</h2><p>${d.specialty} · Lahore</p></div></div><div class="modal-stats"><div><small>Experience</small><strong>${d.experience} years</strong></div><div><small>Rating</small><strong>★ ${d.rating}</strong></div><div><small>Fee</small><strong>PKR ${d.fee.toLocaleString()}</strong></div></div><div class="modal-body"><h4>About</h4><p>${d.about}</p><h4>Qualifications</h4><p>${d.education}</p><h4>Languages</h4><p>${d.languages}</p><h4>Clinic & timings</h4><p>${d.hospital}<br>${d.timings}</p></div><button class="submit-btn" id="modalBook">Book this doctor →</button>`;$("#doctorModal").classList.remove("hidden");$("#modalBook").onclick=()=>{closeModal();book(id)}}
function closeModal(){$("#doctorModal").classList.add("hidden")}$("#modalClose").onclick=closeModal;$(".modal-backdrop").onclick=closeModal;
let selectedDoctorId = "";

function book(id){
  const d=doctors.find(x=>String(x.id)===String(id));
  if(!d) return;
  selectedDoctorId=String(d.id);
  $("#appointmentSpecialty").value=d.specialty;
  updateDoctors(selectedDoctorId);
  $("#appointmentDoctor").value=String(d.id);
  selectedDoctorId=String(d.id);
  $("#appointment").scrollIntoView({behavior:"smooth",block:"start"});
}

function updateDoctors(preferredId=""){
  const s=$("#appointmentSpecialty").value;
  const select=$("#appointmentDoctor");
  const matches=doctors.filter(d=>!s||d.specialty===s);
  select.innerHTML='<option value="">Choose a doctor</option>'+matches.map(d=>`<option value="${d.id}">${d.name} — ${d.hospital}</option>`).join("");
  if(preferredId && matches.some(d=>String(d.id)===String(preferredId))){
    select.value=String(preferredId);
    selectedDoctorId=String(preferredId);
  }else{
    select.value="";
    selectedDoctorId="";
  }
}

$("#appointmentSpecialty").onchange=()=>{selectedDoctorId="";updateDoctors();};
$("#appointmentDoctor").onchange=e=>{selectedDoctorId=e.target.value;};

const dt=$("#appointmentDate");dt.min=new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().split("T")[0];

const confirmationModal = document.getElementById("confirmationModal");
const confirmationTitle = document.getElementById("confirmationTitle");
const confirmationClose = document.getElementById("confirmationClose");
const confirmationDone = document.getElementById("confirmationDone");
const confirmationPatientId = document.getElementById("confirmationPatientId");
const confirmationPatientName = document.getElementById("confirmationPatientName");
const confirmationDoctor = document.getElementById("confirmationDoctor");
const confirmationDepartment = document.getElementById("confirmationDepartment");
const confirmationDate = document.getElementById("confirmationDate");
const confirmationTime = document.getElementById("confirmationTime");

function generatePatientId(){
  const now=new Date();
  const stamp=`${now.getFullYear()}${String(now.getMonth()+1).padStart(2,"0")}${String(now.getDate()).padStart(2,"0")}`;
  return `LC-${stamp}-${Math.floor(1000+Math.random()*9000)}`;
}

function openConfirmation(a){
  confirmationPatientId.textContent=a.patientId;
  confirmationPatientName.textContent=a.patient;
  confirmationDoctor.textContent=a.doctor;
  confirmationDepartment.textContent=a.specialty;
  confirmationDate.textContent=new Date(`${a.date}T00:00:00`).toLocaleDateString("en-PK",{day:"numeric",month:"long",year:"numeric"});
  confirmationTime.textContent=a.time||"To be confirmed";
  confirmationModal.querySelector(".confirmation-eyebrow").textContent = "Success";
  confirmationTitle.textContent = "Appointment Request Submitted Successfully";
  confirmationModal.classList.add("is-open");
  confirmationModal.setAttribute("aria-hidden","false");
  document.body.classList.add("modal-open");
}
function closeConfirmation(){
  confirmationModal.classList.remove("is-open");
  confirmationModal.setAttribute("aria-hidden","true");
  document.body.classList.remove("modal-open");
}

$("#appointmentForm").onsubmit=e=>{
  e.preventDefault();
  const doctorId=$("#appointmentDoctor").value||selectedDoctorId;
  const d=doctors.find(x=>String(x.id)===String(doctorId));
  if(!d){toast("Please choose a doctor.");return;}
  const r={id:"LAH-"+Date.now().toString().slice(-6),patientId:generatePatientId(),patient:$("#patientName").value.trim(),phone:$("#patientPhone").value.trim(),specialty:d.specialty,doctor:d.name,doctorId:d.id,hospital:d.hospital,date:$("#appointmentDate").value,time:$("#appointmentTime").value,created:new Date().toISOString()};
  const old=JSON.parse(localStorage.getItem("lahoreHospitalAppointments")||"[]");
  old.push(r);localStorage.setItem("lahoreHospitalAppointments",JSON.stringify(old));
  e.target.reset();selectedDoctorId="";updateDoctors();openConfirmation(r);
};
function toast(m){let t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(window.__t);window.__t=setTimeout(()=>t.classList.remove("show"),4500)}
$("#navToggle").onclick=()=>$("#mainNav").classList.toggle("open");$$("#mainNav a").forEach(a=>a.onclick=()=>$("#mainNav").classList.remove("open"));
render();updateDoctors();

if (confirmationClose) confirmationClose.addEventListener("click", closeConfirmation);
if (confirmationDone) confirmationDone.addEventListener("click", closeConfirmation);
if (confirmationModal) {
  confirmationModal.addEventListener("click", (event) => {
    if (event.target === confirmationModal) closeConfirmation();
  });
}
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && confirmationModal?.classList.contains("is-open")) {
    closeConfirmation();
  }
});
