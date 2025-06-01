document.addEventListener('DOMContentLoaded', function() {
  const argumentsList = document.getElementById('argumentsList');
  const newArgumentInput = document.getElementById('newArgument');
  const addButton = document.getElementById('addButton');

  // Load and display arguments
  function loadArguments() {
    browser.storage.local.get('arguments').then((result) => {
      const args = result.arguments || [];
      displayArguments(args);
    });
  }

  // Display arguments in the list
  function displayArguments(args) {
    const explanationBox = document.getElementById('explanationBox');
    
    if (args.length === 0) {
      argumentsList.innerHTML = '<div class="empty-state">No arguments added yet</div>';
      explanationBox.classList.add('visible');
    } else {
      argumentsList.innerHTML = args.map((arg, index) => `
        <div class="argument-item" data-index="${index}">
          <span class="argument-text">${arg.text}</span>
          <label class="switch">
            <input type="checkbox" ${arg.enabled ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
          <button class="delete-button" title="Remove argument">X</button>
        </div>
      `).join('');
      explanationBox.classList.remove('visible');

      // Add event listeners for toggles and delete buttons
      argumentsList.querySelectorAll('.switch input').forEach((toggle, index) => {
        toggle.addEventListener('change', () => toggleArgument(index, toggle.checked));
      });

      argumentsList.querySelectorAll('.delete-button').forEach((button, index) => {
        button.addEventListener('click', () => deleteArgument(index));
      });
    }
  }

  // Toggle an argument's enabled state
  function toggleArgument(index, enabled) {
    browser.storage.local.get('arguments').then((result) => {
      const args = result.arguments || [];
      if (args[index]) {
        args[index].enabled = enabled;
        browser.storage.local.set({ arguments: args });
      }
    });
  }

  // Delete an argument
  function deleteArgument(index) {
    browser.storage.local.get('arguments').then((result) => {
      const args = result.arguments || [];
      args.splice(index, 1);
      browser.storage.local.set({ arguments: args }, () => {
        displayArguments(args);
      });
    });
  }

  // Add a new argument
  function addArgument() {
    const text = newArgumentInput.value.trim();
    if (!text) return;

    browser.storage.local.get('arguments').then((result) => {
      const args = result.arguments || [];
      // Check if argument already exists
      if (args.some(arg => arg.text === text)) {
        alert('This argument already exists');
        return;
      }
      
      args.push({ text, enabled: true });
      browser.storage.local.set({ arguments: args }, () => {
        newArgumentInput.value = '';
        displayArguments(args);
      });
    });
  }

  // Event listeners
  addButton.addEventListener('click', addArgument);
  newArgumentInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addArgument();
  });

  // Initial load
  loadArguments();
});

