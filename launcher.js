// launcher.js v1.0.18

let pipWindow = null;

async function startPiP() {
  const btn = document.getElementById('go');
  
  if (!('documentPictureInPicture' in window)) {
    alert("Document PiP API not supported.");
    return;
  }

  try {
    btn.innerText = "OPENING...";
    
    // 1. 请求 PiP 窗口
    pipWindow = await window.documentPictureInPicture.requestWindow({
      width: 340,
      height: 450,
    });

    // 2. 获取 pip.html 内容
    const response = await fetch(chrome.runtime.getURL('pip.html'));
    const html = await response.text();

    // 3. 同步注入内容
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    pipWindow.document.body.innerHTML = doc.body.innerHTML;
    
    // 4. 注入样式
    const link = pipWindow.document.createElement('link');
    link.rel = 'stylesheet';
    link.href = chrome.runtime.getURL('style.css');
    pipWindow.document.head.append(link);

    // 5. 注入脚本
    const script = pipWindow.document.createElement('script');
    script.src = chrome.runtime.getURL('pip.js');
    pipWindow.document.body.append(script);

    // 6. 状态反馈
    btn.innerText = "FLOAT STARTED";
    btn.style.background = "#111";
    btn.disabled = true;

  } catch (err) {
    console.error("PiP Error:", err);
    btn.innerText = "ERROR: " + err.message;
    alert("Error: " + err.message);
  }
}

document.getElementById('go').addEventListener('click', startPiP);

// 处理来自 PiP 窗口的 postMessage 请求
window.addEventListener('message', async (event) => {
  // 处理保存请求
  if (event.data && event.data.type === 'SAVE_NOTE') {
    try {
      const content = event.data.content;
      chrome.storage.local.set({ zenNoteContent: content }, () => {
        if (pipWindow) {
          pipWindow.postMessage({
            type: 'SAVE_RESPONSE',
            success: true
          }, '*');
        }
      });
    } catch (err) {
      console.error('Save error:', err);
      if (pipWindow) {
        pipWindow.postMessage({
          type: 'SAVE_RESPONSE',
          success: false,
          error: err.message
        }, '*');
      }
    }
  }
  
  // 处理加载请求
  if (event.data && event.data.type === 'LOAD_NOTE') {
    try {
      chrome.storage.local.get(['zenNoteContent'], (result) => {
        if (pipWindow) {
          pipWindow.postMessage({
            type: 'LOAD_RESPONSE',
            content: result && result.zenNoteContent ? result.zenNoteContent : ''
          }, '*');
        }
      });
    } catch (err) {
      console.error('Load error:', err);
      if (pipWindow) {
        pipWindow.postMessage({
          type: 'LOAD_RESPONSE',
          content: ''
        }, '*');
      }
    }
  }
});
