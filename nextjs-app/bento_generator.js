function generateBentoBox(title, items) {
  // items = array of { title, desc, icon, colorC }
  
  return `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 policy-slides">
      <!-- Title Hero Box -->
      <div class="md:col-span-2 bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-[2rem] text-white shadow-lg relative overflow-hidden group">
        <span class="material-symbols-outlined absolute -right-4 -bottom-4 text-[100px] text-white/10 group-hover:scale-110 transition-transform pointer-events-none">policy</span>
        <div class="relative z-10 w-full md:w-3/4">
           <div class="inline-block px-3 py-1 bg-white/20 rounded-full text-[10px] font-black tracking-widest uppercase border border-white/20 mb-3 backdrop-blur-sm">Chính sách chung</div>
           <h3 class="text-2xl font-black mb-2 leading-tight tracking-tight">${title}</h3>
           <p class="text-blue-100 text-sm font-medium leading-relaxed">Tổng hợp những lợi ích và quy tắc then chốt bạn cần lưu ý.</p>
        </div>
      </div>
      
      ${items.map(item => `
        <div class="bg-${item.colorC}-50 border border-${item.colorC}-100 p-5 rounded-[2rem] shadow-sm hover:-translate-y-1 transition-transform cursor-default">
           <div class="bg-${item.colorC}-100 w-10 h-10 rounded-2xl flex items-center justify-center text-${item.colorC}-600 mb-3 shadow-sm">
             <span class="material-symbols-outlined text-[20px]">${item.icon}</span>
           </div>
           <h3 class="text-sm font-black text-slate-800 mb-2">${item.title}</h3>
           <p class="text-xs text-slate-600 font-medium leading-relaxed">${item.desc}</p>
        </div>
      `).join('')}
    </div>
  `;
}

module.exports = { generateBentoBox };
