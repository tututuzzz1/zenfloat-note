// popup.js v1.0.9

document.getElementById('launch').addEventListener('click', async () => {
  if (!('documentPictureInPicture' in window)) {
    alert("PiP not supported");
    return;
  }

  try {
    // 1. 请求 PiP 窗口
    const pipWindow = await window.documentPictureInPicture.requestWindow({
      width: 340,
      height: 450,
    });

    // 2. 核心修复：直接导航到扩展页面 URL
    // 只有这样，浏览器才会将该窗口识别为扩展程序的一部分，从而提供 chrome.* API
    const pipUrl = chrome.runtime.getURL('pip.html');
    pipWindow.location.href = pipUrl;

    // 3. 成功后关闭 popup
    // 延迟一小会儿确保导航已开始
    setTimeout(() => window.close(), 100);
    
  } catch (err) {
    console.error("Launch failed:", err);
    alert("Launch failed: " + err.message);
  }
});
