(function() {
    const terminal = document.getElementById('terminal');
    const controls = document.createElement('div');
    controls.className = 'terminal-controls';
    terminal.parentNode.insertBefore(controls, terminal);
    
    // Save original console methods
    const originalLog = console.log;
    const originalError = console.error;
    
    // Override console methods
    function overrideConsole() {
        console.log = function(...args) {
            originalLog.apply(console, args);
            outputToTerminal(args);
        };
        
        console.error = function(...args) {
            originalError.apply(console, args);
            outputToTerminal(args, 'error');
        };
    }
    
    function outputToTerminal(args, type = 'log') {
        args.forEach(arg => {
            const div = document.createElement('div');
            div.className = `terminal-line ${type}`;
            
            // Handle objects and arrays nicely
            if (typeof arg === 'object') {
                div.textContent = JSON.stringify(arg, null, 2);
            } else {
                div.textContent = arg;
            }
            
            terminal.appendChild(div);
            terminal.scrollTop = terminal.scrollHeight;
        });
    }
    
    // Create demo buttons
    function createDemoButton(label, command) {
        const btn = document.createElement('button');
        btn.textContent = label;
        btn.addEventListener('click', () => {
            // Add the command to terminal
            const inputLine = document.createElement('div');
            inputLine.className = 'terminal-input';
            inputLine.textContent = `> ${command}`;
            terminal.appendChild(inputLine);
            
            // Execute the command
            try {
                const result = eval(command);
                if (result !== undefined) {
                    outputToTerminal([result]);
                }
            } catch (e) {
                outputToTerminal([e.message], 'error');
            }
        });
        controls.appendChild(btn);
    }
    
    // Add demo buttons
    createDemoButton('Array.map()', `[1, 2, 3].map(x => x * 2)`);
    createDemoButton('Custom Function', `// Your custom implementation here
function doubleAll(arr) {
    return arr.map(x => x * 2);
}
doubleAll([1, 2, 3]);`);
    createDemoButton('Error Demo', `throw new Error('This is a demo error')`);
    
    // Add command input
    const inputContainer = document.createElement('div');
    inputContainer.className = 'terminal-input-container';
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter JavaScript command...';
    
    const runButton = document.createElement('button');
    runButton.textContent = 'Run';
    
    input.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            executeCommand(input.value);
            input.value = '';
        }
    });
    
    runButton.addEventListener('click', () => {
        executeCommand(input.value);
        input.value = '';
    });
    
    inputContainer.appendChild(input);
    inputContainer.appendChild(runButton);
    terminal.parentNode.insertBefore(inputContainer, terminal.nextSibling);
    
    function executeCommand(command) {
        if (!command.trim()) return;
        
        // Display the command
        const inputLine = document.createElement('div');
        inputLine.className = 'terminal-input';
        inputLine.textContent = `> ${command}`;
        terminal.appendChild(inputLine);
        
        // Execute and display result
        try {
            const result = eval(command);
            if (result !== undefined) {
                outputToTerminal([result]);
            }
        } catch (e) {
            outputToTerminal([e.message], 'error');
        }
    }
    
    // Initialize
    overrideConsole();
    console.log("JavaScript sandbox initialized. Try the demo buttons or enter commands below.");
})();