const PRESETS = [
  { name: 'Random Chaos', id: 'chaos' },
  { name: 'NPC Energy', id: 'npc' },
  { name: 'Plot Twist', id: 'twist' },
  { name: 'Impossible Challenge', id: 'challenge' },
  { name: 'Absurd Story', id: 'absurd' },
  { name: 'AI vs Human', id: 'aivshuman' }
];

const TIME_BLOCKS = {
  hook: { start: 0, end: 2, label: 'Hook (0–2s)' },
  setup: { start: 2, end: 8, label: 'Setup (2–8s)' },
  escalation: { start: 8, end: 20, label: 'Escalation (8–20s)' },
  payoff: { start: 20, end: 27, label: 'Payoff (20–27s)' },
  loop: { start: 27, end: 30, label: 'Loop (27–30s)' }
};

let currentPreset = null;
let currentStoryboard = null;

function init() {
  renderPresets();
  attachEventListeners();
}

function renderPresets() {
  const container = document.getElementById('presets');
  container.innerHTML = PRESETS.map(p => `
    <button class="chip" data-preset="${p.id}">${p.name}</button>
  `).join('');
  
  container.addEventListener('click', e => {
    if (e.target.classList.contains('chip')) {
      document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      e.target.classList.add('active');
      currentPreset = e.target.dataset.preset;
    }
  });
}

function attachEventListeners() {
  document.getElementById('generate').addEventListener('click', generateShort);
  document.getElementById('randomTop').addEventListener('click', generateRandom);
  document.getElementById('another').addEventListener('click', generateShort);
  document.getElementById('copyAll').addEventListener('click', copyComplete);
  document.getElementById('topic').addEventListener('keypress', e => {
    if (e.key === 'Enter') generateShort();
  });
}

function generateRandom() {
  const topicInput = document.getElementById('topic');
  if (!topicInput.value.trim()) {
    showToast('Please enter a topic first');
    return;
  }
  const randomPreset = PRESETS[Math.floor(Math.random() * PRESETS.length)];
  currentPreset = randomPreset.id;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  document.querySelector(`[data-preset="${randomPreset.id}"]`).classList.add('active');
  generateShort();
}

function generateShort() {
  const topic = document.getElementById('topic').value.trim();
  
  if (!topic) {
    showToast('Enter a topic first');
    return;
  }
  
  if (!currentPreset) {
    showToast('Pick a preset');
    return;
  }
  
  currentStoryboard = generateStoryboard(topic, currentPreset);
  renderStoryboard(currentStoryboard);
  document.getElementById('result').classList.remove('hidden');
  document.getElementById('empty').classList.add('hidden');
}

function generateStoryboard(topic, presetId) {
  const presetName = PRESETS.find(p => p.id === presetId).name;
  const title = generateTitle(topic, presetId);
  
  const scenes = {
    hook: generateScene(topic, presetId, 'hook'),
    setup: generateScene(topic, presetId, 'setup'),
    escalation: generateScene(topic, presetId, 'escalation'),
    payoff: generateScene(topic, presetId, 'payoff'),
    loop: generateScene(topic, presetId, 'loop')
  };
  
  const captions = Object.keys(scenes).reduce((acc, key) => {
    acc[key] = generateCaption(topic, presetId, key, scenes[key]);
    return acc;
  }, {});
  
  return {
    title,
    presetName,
    scenes,
    captions,
    hashtags: generateHashtags(topic, presetId)
  };
}

function generateTitle(topic, presetId) {
  const prefixes = ['🚀', '⚡', '🔥', '💥', '🎬'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  return `${prefix} ${topic.charAt(0).toUpperCase() + topic.slice(1)}`;
}

function generateScene(topic, presetId, timeBlock) {
  const scenarios = {
    chaos: {
      hook: `Something impossible is about to happen with ${topic}`,
      setup: `Nobody expected this. ${topic} is about to go completely off the rails.`,
      escalation: `It keeps getting more absurd. The chaos is escalating.`,
      payoff: `Peak chaos. Everything collides.`,
      loop: `It loops back to the beginning, but weirder.`
    },
    npc: {
      hook: `${topic} has NPC energy`,
      setup: `The dialogue is robotic. Repetitive. Totally unhinged.`,
      escalation: `The NPC script breaks. Glitching dialogue. Looping responses.`,
      payoff: `Full NPC meltdown. The simulation breaks.`,
      loop: `resets to the starting dialogue`
    },
    twist: {
      hook: `${topic} seems normal`,
      setup: `Everything looks fine. Business as usual.`,
      escalation: `Wait... something's off.`,
      payoff: `PLOT TWIST. Nothing was what it seemed.`,
      loop: `Shows the real ending, loops to the fake start`
    },
    challenge: {
      hook: `Can ${topic} do the impossible?`,
      setup: `They try. It's not working.`,
      escalation: `Still failing. But they keep going.`,
      payoff: `Against all odds... they actually do it.`,
      loop: `Shows the moment of victory, loops back to the attempt`
    },
    absurd: {
      hook: `Once upon a time, ${topic}`,
      setup: `A ridiculous situation unfolds.`,
      escalation: `It gets worse. Then better. Then worse again.`,
      payoff: `Peak absurdity. Complete nonsense.`,
      loop: `The ending loops back to the start with a twist`
    },
    aivshuman: {
      hook: `AI vs Human: ${topic}`,
      setup: `AI does it one way. Human does it their way.`,
      escalation: `AI is more efficient. Human is more creative.`,
      payoff: `They team up and absolutely destroy it.`,
      loop: `Shows the combined result, loops to the initial split`
    }
  };
  
  return scenarios[presetId]?.[timeBlock] || 'Something happens';
}

function generateCaption(topic, presetId, timeBlock, scene) {
  const captions = {
    hook: ['wait...', 'hold up', 'bruh', '💀', 'nah'],
    setup: ['this is', 'so this', 'basically', 'ok so'],
    escalation: ['WAIT', 'HOLD ON', 'THIS IS', 'NO WAY'],
    payoff: ['SHEESH', 'BRO', '🔥', 'CRAZY'],
    loop: ['full circle', 'here we go again', 'restart', 'begin']
  };
  
  const pool = captions[timeBlock] || ['...'];
  return pool[Math.floor(Math.random() * pool.length)];
}

function generateHashtags(topic, presetId) {
  const bases = ['Shorts', 'Viral', 'FYP', 'ForYou'];
  return `#${bases.join('  #')} #${topic.split(' ')[0]}`;
}

function renderStoryboard(storyboard) {
  document.getElementById('conceptTitle').textContent = storyboard.title;
  document.getElementById('previewPreset').textContent = storyboard.presetName;
  
  const sceneList = document.getElementById('previewScenes');
  sceneList.innerHTML = Object.entries(TIME_BLOCKS).map(([key, block]) => `
    <div class="scene">
      <div class="time">${block.label}</div>
      <h4>${storyboard.scenes[key]}</h4>
      <p>${storyboard.captions[key]}</p>
      <div class="caption">${storyboard.captions[key].toUpperCase()}</div>
    </div>
  `).join('');
  
  const scriptLines = Object.entries(TIME_BLOCKS).map(([key]) => `
    <div class="line">
      <b>${TIME_BLOCKS[key].label}</b>
      ${storyboard.scenes[key]}
    </div>
  `).join('');
  document.getElementById('script').innerHTML = scriptLines;
  
  const captionLines = Object.entries(TIME_BLOCKS).map(([key]) => `
    <div class="line">
      <b>${TIME_BLOCKS[key].label}</b>
      "${storyboard.captions[key]}"
    </div>
  `).join('');
  document.getElementById('captions').innerHTML = captionLines;
  
  const audioLines = Object.entries(TIME_BLOCKS).map(([key]) => `
    <div class="line">
      <b>${TIME_BLOCKS[key].label}</b>
      [Music beat / SFX: impact sound] [Voiceover or text-to-speech]
    </div>
  `).join('');
  document.getElementById('audio').innerHTML = audioLines;
  
  document.getElementById('videoTitle').textContent = storyboard.title;
  document.getElementById('hashtags').textContent = storyboard.hashtags;
}

function copyComplete() {
  if (!currentStoryboard) return;
  
  const text = `
🎬 BRAINROT SHORTS LAB - COMPLETE PACKAGE

Title: ${currentStoryboard.title}
Preset: ${currentStoryboard.presetName}

--- SCRIPT ---
${Object.entries(TIME_BLOCKS).map(([key]) => `${TIME_BLOCKS[key].label}: ${currentStoryboard.scenes[key]}`).join('\n')}

--- CAPTIONS ---
${Object.entries(TIME_BLOCKS).map(([key]) => `${TIME_BLOCKS[key].label}: "${currentStoryboard.captions[key]}"`).join('\n')}

--- UPLOAD PACK ---
Title: ${currentStoryboard.title}
Hashtags: ${currentStoryboard.hashtags}
  `.trim();
  
  navigator.clipboard.writeText(text).then(() => {
    showToast('✅ Copied to clipboard!');
  }).catch(() => {
    showToast('Failed to copy');
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

init();