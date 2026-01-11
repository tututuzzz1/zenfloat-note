// pip.js v1.0.19

(function() {
  const editor = document.getElementById('editor');
  const status = document.getElementById('status');
  const charCount = document.getElementById('char-count');
  const clearFormatBtn = document.getElementById('clear-format-btn');
  const themeBtn = document.getElementById('capture-btn');
  const exportBtn = document.getElementById('export-btn');
  const foldBtn = document.getElementById('fold-btn');

  if (!editor) return;

  let saveTimeout;
  let isFolded = false;
  let isDarkTheme = true;
  const NORMAL_HEIGHT = 450;
  const FOLDED_HEIGHT = 40;

  // 自动聚焦
  setTimeout(() => {
    editor.focus();
  }, 300);

  // 加载内容 - 通过 postMessage 向 launcher 请求
  function loadContent() {
    if (window.opener) {
      window.opener.postMessage({ type: 'LOAD_NOTE' }, '*');
    }
  }

  // 监听来自 launcher 的消息
  window.addEventListener('message', (event) => {
    // 处理加载响应
    if (event.data && event.data.type === 'LOAD_RESPONSE') {
      if (event.data.content) {
        editor.innerText = event.data.content;
        updateCharCount();
      }
    }
    
    // 处理保存响应
    if (event.data && event.data.type === 'SAVE_RESPONSE') {
      if (event.data.success) {
        if (status) {
          status.innerText = 'SAVED';
        }
      } else {
        if (status) {
          status.innerText = 'SAVE FAILED';
        }
      }
    }
  });

  // 加载初始内容
  loadContent();

  // 加载保存的主题偏好
  const savedTheme = localStorage.getItem('zenTheme');
  if (savedTheme === 'light') {
    isDarkTheme = false;
    document.body.classList.add('light-theme');
  }

  // 更新字符统计
  function updateCharCount() {
    const text = editor.innerText || '';
    const count = text.length;
    if (charCount) {
      charCount.innerText = `${count} CHARS`;
    }
  }

  // 保存内容 - 通过 postMessage 向 launcher 请求
  function saveContent() {
    const content = editor.innerText || '';
    if (window.opener) {
      window.opener.postMessage({ 
        type: 'SAVE_NOTE',
        content: content
      }, '*');
    }
  }

  // 保存逻辑：输入时自动保存
  editor.addEventListener('input', () => {
    updateCharCount();
    if (status) status.innerText = 'TYPING...';
    
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      saveContent();
    }, 500);
  });

  // 定期自动保存（每 10 秒）
  setInterval(() => {
    saveContent();
  }, 10000);

  // 页面卸载前保存
  window.addEventListener('beforeunload', () => {
    saveContent();
  });

  // 一键去格式按钮（转换为纯文本）
  if (clearFormatBtn) {
    clearFormatBtn.onclick = (e) => {
      e.preventDefault();
      // 获取当前内容的纯文本
      const plainText = editor.innerText;
      // 清空并设置为纯文本（移除所有 HTML 格式）
      editor.innerHTML = '';
      editor.innerText = plainText;
      // 触发保存
      editor.dispatchEvent(new Event('input'));
      if (status) status.innerText = 'FORMAT CLEARED';
      setTimeout(() => {
        if (status) status.innerText = 'SAVED';
      }, 1500);
    };
  }

  // 折叠/展开逻辑
  if (foldBtn) {
    foldBtn.onclick = (e) => {
      e.preventDefault();
      isFolded = !isFolded;
      if (isFolded) {
        window.resizeTo(window.innerWidth, FOLDED_HEIGHT);
        document.body.classList.add('folded');
      } else {
        window.resizeTo(window.innerWidth, NORMAL_HEIGHT);
        document.body.classList.remove('folded');
      }
    };
  }

  // 主题切换按钮（白底黑字 ↔ 黑底白字）
  if (themeBtn) {
    themeBtn.title = 'Toggle Theme';
    themeBtn.onclick = (e) => {
      e.preventDefault();
      isDarkTheme = !isDarkTheme;
      if (isDarkTheme) {
        document.body.classList.remove('light-theme');
        if (status) status.innerText = 'DARK THEME';
      } else {
        document.body.classList.add('light-theme');
        if (status) status.innerText = 'LIGHT THEME';
      }
      // 保存主题偏好
      localStorage.setItem('zenTheme', isDarkTheme ? 'dark' : 'light');
    };
  }

  // 导出为文件（下载按钮）
  if (exportBtn) {
    exportBtn.onclick = async (e) => {
      e.preventDefault();
      try {
        if (window.showSaveFilePicker) {
          const handle = await window.showSaveFilePicker({
            suggestedName: `zen-note-${new Date().toISOString().slice(0, 10)}.md`,
            types: [{ description: 'Markdown', accept: { 'text/markdown': ['.md'] } }],
          });
          const writable = await handle.createWritable();
          await writable.write(editor.innerText);
          await writable.close();
          if (status) {
            status.innerText = 'EXPORTED';
            setTimeout(() => status.innerText = 'SAVED', 2000);
          }
        } else {
          if (status) status.innerText = 'FILE API UNAVAILABLE';
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Export error:', err);
          if (status) status.innerText = 'EXPORT FAILED';
        }
      }
    };
  }
})();
