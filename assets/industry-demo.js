const PUBLIC_KEY = "c6c682a7-d151-470a-bee5-6818d2f13176";
const FALLBACK_ASSISTANT_ID = "c50dd38e-dcb2-4ca3-b696-f489d99b0cca";

let vapiInstance = null;
let activeCall = false;

const demoConfig = window.VOICES_DEMO_CONFIG || {};
const assistantMap = window.VOICES_ASSISTANTS || {};
const industryAssistantId = demoConfig.industryKey ? assistantMap[demoConfig.industryKey] : '';
const ACTIVE_ASSISTANT_ID = industryAssistantId || FALLBACK_ASSISTANT_ID;

function label(key, fallback) {
  return (demoConfig.labels && demoConfig.labels[key]) || fallback;
}

function showError(message) {
  document.getElementById('status-msg').innerText = message;
  document.getElementById('status-text').innerText = label('unavailable', 'Voice demo unavailable');
  document.getElementById('status-dot').style.backgroundColor = '#ef4444';
}

function getIndustryContext() {
  const main = document.querySelector('main');
  const pageContext = main ? main.innerText.replace(/\s+/g, ' ').trim() : '';
  const language = document.documentElement.lang || 'en';

  return [
    `You are demonstrating an AI receptionist for the business sector described on this page. Respond in the page language (${language}) unless the caller changes language.`,
    'Act like a professional, friendly receptionist for that sector and use the page context below to understand the types of calls this demo should handle.',
    'Keep responses concise and conversational.',
    'This is a demonstration: do not claim that a real booking, appointment, reservation, viewing, service visit, consultation, inventory check, price quote, or other action has been confirmed unless an actual connected tool confirms it.',
    'For medical, dental, aesthetic or treatment-related topics, do not diagnose, recommend treatment, or provide emergency guidance beyond directing the caller to appropriate professional or emergency care.',
    'For legal topics, do not provide legal advice; focus on intake, routing and consultation scheduling.',
    `Page context: ${pageContext}`
  ].join(' ');
}

function injectIndustryContext() {
  const message = { role: 'system', content: getIndustryContext() };

  try {
    if (typeof vapiInstance.addMessage === 'function') {
      vapiInstance.addMessage(message);
    } else if (typeof vapiInstance.send === 'function') {
      vapiInstance.send({ type: 'add-message', message });
    }
  } catch (error) {
    console.warn('Could not inject industry demo context:', error);
  }
}

function attachVapiEvents() {
  vapiInstance.on('call-start', () => {
    activeCall = true;
    injectIndustryContext();
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
    showError(label('callError', 'The demo call could not connect. Please check microphone permission and try again.'));
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
        assistant: ACTIVE_ASSISTANT_ID,
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
      document.getElementById('call-btn').innerText = label('start', 'Start Demo Call');
      document.getElementById('status-text').innerText = demoConfig.readyText || label('ready', 'AI Receptionist Ready to Speak');
      document.getElementById('status-dot').style.backgroundColor = '#34d399';
      document.getElementById('status-msg').innerText = '';
    } catch (error) {
      console.error('Vapi init failure:', error);
      showError(label('engineError', 'Voice engine could not initialize.'));
    }
  };

  script.onerror = () => {
    showError(label('loadError', 'Voice engine failed to load. Please check network or content-blocker settings.'));
  };

  document.head.appendChild(script);
}

async function handleCallClick() {
  const msg = document.getElementById('status-msg');
  msg.innerText = '';

  if (!vapiInstance) {
    showError(label('notReady', 'Voice engine is not ready yet.'));
    return;
  }

  if (!activeCall) {
    setButtonState('connecting');
    try {
      const assistantOverrides = demoConfig.firstMessage
        ? { firstMessage: demoConfig.firstMessage }
        : undefined;
      await vapiInstance.start(ACTIVE_ASSISTANT_ID, assistantOverrides);
    } catch (error) {
      console.error('Call start failure:', error);
      activeCall = false;
      setButtonState('disconnected');
      showError(label('startError', 'Call could not start. Please allow microphone access and try again.'));
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
    btn.innerText = label('connectingButton', 'Connecting…');
    btn.className = 'connecting';
    statusText.innerText = label('connectingStatus', 'Connecting to AI Receptionist…');
    statusDot.style.backgroundColor = '#f59e0b';
  } else if (state === 'connected') {
    btn.innerText = label('end', 'End Call');
    btn.className = 'connected';
    statusText.innerText = label('connected', 'Call Connected — Speak Now');
    statusDot.style.backgroundColor = '#ef4444';
  } else {
    btn.innerText = label('start', 'Start Demo Call');
    btn.className = '';
    statusText.innerText = demoConfig.readyText || label('ready', 'AI Receptionist Ready to Speak');
    statusDot.style.backgroundColor = '#34d399';
  }
}

window.handleCallClick = handleCallClick;
window.addEventListener('load', initVapi);