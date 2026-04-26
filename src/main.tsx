import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Force cleanup any old service workers
if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
    }
  }).catch(err => console.log('SW unregistration failed:', err));
}

window.addEventListener('error', (event) => {
  const root = document.getElementById('root');
  if (root && root.innerHTML === '') {
    root.innerHTML = `
      <div style="padding: 20px; font-family: sans-serif; color: red;">
        <h2>앱 초기화 오류 (App Load Error)</h2>
        <p><strong>${event.message}</strong></p>
        <pre style="background: #f8e8e8; padding: 10px; font-size: 11px; overflow-x: auto;">${event.error?.stack || event.filename + ':' + event.lineno}</pre>
        <p>이 화면을 캡처해서 개발자에게 알려주세요.</p>
      </div>
    `;
  }
});

window.addEventListener('unhandledrejection', (event) => {
  const root = document.getElementById('root');
  if (root && root.innerHTML === '') {
    root.innerHTML = `
      <div style="padding: 20px; font-family: sans-serif; color: red;">
        <h2>비동기 앱 렌더 오류 (Promise Error)</h2>
        <p><strong>${event.reason?.message || event.reason}</strong></p>
        <pre style="background: #f8e8e8; padding: 10px; font-size: 11px; overflow-x: auto;">${event.reason?.stack || 'No stack'}</pre>
        <p>이 화면을 캡처해서 개발자에게 알려주세요.</p>
      </div>
    `;
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
