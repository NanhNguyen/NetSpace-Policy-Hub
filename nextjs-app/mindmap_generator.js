function generateMindMapHtml(title, leftNodes, rightNodes) {
    return `
      <div class="py-8 px-2 overflow-x-auto bg-slate-50/50 rounded-3xl border border-slate-100">
        <h3 class="text-xl font-black text-slate-800 text-center mb-8 flex items-center justify-center gap-2">
           <span class="material-symbols-outlined text-primary">schema</span> Sơ đồ ý chính: ${title}
        </h3>
        <div class="flex items-center justify-center gap-6 sm:gap-12 min-w-[700px] mb-8 relative pb-4">
          
          <!-- Trục kết nối ngang nền -->
          <div class="absolute left-[20%] right-[20%] h-[2px] bg-indigo-100 top-1/2 -translate-y-1/2 z-0 hidden sm:block"></div>

          <!-- Nhánh trái -->
          <div class="flex flex-col gap-6 w-48 sm:w-56 z-10 text-right">
            ${leftNodes.map((node, i) => `
              <div class="bg-white border-l-4 ${['border-cyan-400', 'border-teal-400', 'border-sky-500', 'border-blue-500'][i % 4]} rounded-xl p-3 shadow-md hover:shadow-lg relative hover:-translate-x-1 transition-all">
                <div class="absolute top-1/2 -right-6 sm:-right-12 w-6 sm:w-12 h-[2px] bg-slate-300 -translate-y-1/2 hidden sm:block">
                  <div class="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-slate-400"></div>
                </div>
                <h4 class="font-black text-slate-800 text-sm mb-1">${node.title}</h4>
                <p class="text-[11px] text-slate-600 leading-tight">${node.desc}</p>
              </div>
            `).join('')}
          </div>
          
          <!-- Nút trung tâm -->
          <div class="w-36 h-36 sm:w-48 sm:h-48 bg-gradient-to-br from-primary to-blue-800 text-white rounded-full flex flex-col items-center justify-center text-center font-black shadow-xl z-20 border-[6px] border-white/50 px-4 hover:scale-105 transition-transform flex-shrink-0">
            <span class="material-symbols-outlined text-4xl mb-2 opacity-50">hub</span>
            <span class="text-sm sm:text-base leading-tight">${title}</span>
          </div>
          
          <!-- Nhánh phải -->
          <div class="flex flex-col gap-6 w-48 sm:w-56 z-10 text-left">
            ${rightNodes.map((node, i) => `
              <div class="bg-white border-r-4 ${['border-cyan-400', 'border-teal-400', 'border-sky-500', 'border-blue-500'][i % 4]} rounded-xl p-3 shadow-md hover:shadow-lg relative hover:translate-x-1 transition-all">
                <div class="absolute top-1/2 -left-6 sm:-left-12 w-6 sm:w-12 h-[2px] bg-slate-300 -translate-y-1/2 hidden sm:block">
                  <div class="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-slate-400 rotate-180"></div>
                </div>
                <h4 class="font-black text-slate-800 text-sm mb-1">${node.title}</h4>
                <p class="text-[11px] text-slate-600 leading-tight">${node.desc}</p>
              </div>
            `).join('')}
          </div>

        </div>
      </div>
    `;
}

module.exports = { generateMindMapHtml };
