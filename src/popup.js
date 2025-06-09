document.addEventListener('DOMContentLoaded', function() {
  const argumentsList = document.getElementById('argumentsList');
  const newArgumentInput = document.getElementById('newArgument');
  const addButton = document.getElementById('addButton');
  const udmToggle = document.getElementById('udmToggle');

  // Load and display arguments
  function loadArguments() {
    browser.storage.local.get('arguments').then((result) => {
      const args = result.arguments || [];
      displayArguments(args);
    });
  }

  // Load UDM toggle state
  function loadUdmState() {
    browser.storage.local.get('udmEnabled').then((result) => {
      udmToggle.checked = result.udmEnabled || false;
    });
  }

  // Toggle UDM parameter
  function toggleUdm(enabled) {
    browser.storage.local.set({ udmEnabled: enabled });
  }

  // Display arguments in the list
  function displayArguments(args) {
    const explanationBox = document.getElementById('explanationBox');
    
    // Clear existing content
    while (argumentsList.firstChild) {
      argumentsList.removeChild(argumentsList.firstChild);
    }
    
    if (args.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'empty-state';
      emptyState.textContent = 'No arguments added yet';
      argumentsList.appendChild(emptyState);
      explanationBox.classList.add('visible');
    } else {
      args.forEach((arg, index) => {
        const argumentItem = document.createElement('div');
        argumentItem.className = 'argument-item';
        argumentItem.dataset.index = index;

        const argumentText = document.createElement('span');
        argumentText.className = 'argument-text';
        argumentText.textContent = arg.text;

        const switchLabel = document.createElement('label');
        switchLabel.className = 'switch';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = arg.enabled;
        checkbox.addEventListener('change', () => toggleArgument(index, checkbox.checked));

        const slider = document.createElement('span');
        slider.className = 'slider';

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.title = 'Remove argument';
        deleteButton.textContent = 'X';
        deleteButton.addEventListener('click', () => deleteArgument(index));

        switchLabel.appendChild(checkbox);
        switchLabel.appendChild(slider);
        argumentItem.appendChild(argumentText);
        argumentItem.appendChild(switchLabel);
        argumentItem.appendChild(deleteButton);
        argumentsList.appendChild(argumentItem);
      });
      explanationBox.classList.remove('visible');
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
  udmToggle.addEventListener('change', (e) => {
    toggleUdm(e.target.checked);
  });

  // Initial load
  loadArguments();
  loadUdmState();
});

