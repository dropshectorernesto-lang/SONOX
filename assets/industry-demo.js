const PUBLIC_KEY = "c6c682a7-d151-470a-bee5-6818d2f13176";
const ASSISTANT_ID = "c50dd38e-dcb2-4ca3-b696-f489d99b0cca";

let vapiInstance = null;
let activeCall = false;

const demoConfig = window.VOICES_DEMO_CONFIG || {};

function showError(message) {
  document.getElementById('status-msg').innerText = message;
  document.getElementById('status-text').innerText = 'Voice demo unavailable';
  document.getElementById('status-dot').style.backgroundColor = '#ef4444';
}

function attachVapiEvents() {
  vapiInstance.on('call-start', () => {
    activeCall = true;
    document.getElementById('status-msg').innerText = '';
    setButtonState('connected');
  });

  vapiInstance.on('call-end', () => {
    activeCall = false;
    setButtonState('disconnected');
  });

  vapiInstance.on('error', (error) => {
    console.error('Vapi Error:', error);
    activeCall = false;
    setButtonState('disconnected');
    showError('The demo call could not connect. Please check microphone permission and try again.');
  });
}

function initVapi() {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js';
  script.async = true;
  script.defer = true;

  script.onload = () => {
    try {
      if (!window.vapiSDK || typeof window.vapiSDK.run !== 'function') {
        throw new Error('Vapi browser SDK did not expose window.vapiSDK.run');
      }

      const assistantOverrides = demoConfig.firstMessage
        ? { firstMessage: demoConfig.firstMessage }
        : undefined;

      vapiInstance = window.vapiSDK.run({
        apiKey: PUBLIC_KEY,
        assistant: ASSISTANT_ID,
        assistantOverrides,
        config: {
          position: 'bottom-right',
          offset: '0px',
          width: '1px',
          height: '1px'
        }
      });

      if (!vapiInstance) throw new Error('Vapi failed to initialize');

      attachVapiEvents();
      document.getElementById('call-btn').disabled = false;
      document.getElementById('status-text').innerText = demoConfig.readyText || 'AI Receptionist Ready to Speak';
      document.getElementById('status-dot').style.backgroundColor = '#34d399';
      document.getElementById('status-msg').innerText = '';
    } catch (error) {
      console.error('Vapi init failure:', error);
      showError('Voice engine could not initialize.');
    }
  };

  script.onerror = () => {
    showError('Voice engine failed to load. Please check network or content-blocker settings.');
  };

  document.head.appendChild(script);
}

async function handleCallClick() {
  const msg = document.getElementById('status-msg');
  msg.innerText = '';

  if (!vapiInstance) {
    showError('Voice engine is not ready yet.');
    return;
  }

  if (!activeCall) {
    setButtonState('connecting');
    try {
      const assistantOverrides = demoConfig.firstMessage
        ? { firstMessage: demoConfig.firstMessage }
        : undefined;
      await vapiInstance.start(ASSISTANT_ID, assistantOverrides);
    } catch (error) {
      console.error('Call start failure:', error);
      activeCall = false;
      setButtonState('disconnected');
      showError('Call could not start. Please allow microphone access and try again.');
    }
  } else {
    try {
      await vapiInstance.stop();
    } catch (error) {
      console.error('Call stop failure:', error);
    }
  }
}

function setButtonState(state) {
  const btn = document.getElementById('call-btn');
  const statusText = document.getElementById('status-text');
  const statusDot = document.getElementById('status-dot');

  btn.disabled = false;

  if (state === 'connecting') {
    btn.innerText = 'Connecting…';
    btn.className = 'connecting';
    statusText.innerText = 'Connecting to AI Receptionist…';
    statusDot.style.backgroundColor = '#f59e0b';
  } else if (state === 'connected') {
    btn.innerText = 'End Call';
    btn.className = 'connected';
    statusText.innerText = 'Call Connected — Speak Now';
    statusDot.style.backgroundColor = '#ef4444';
  } else {
    btn.innerText = 'Start Demo Call';
    btn.className = '';
    statusText.innerText = demoConfig.readyText || 'AI Receptionist Ready to Speak';
    statusDot.style.backgroundColor = '#34d399';
  }
}

window.handleCallClick = handleCallClick;
window.addEventListener('load', initVapi);