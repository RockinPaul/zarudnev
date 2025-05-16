// Start immediately without waiting for DOMContentLoaded
(function() {
    const content = [
        { text: 'whoami', type: 'command' },
        { text: '\nHello! I\'m Pavel Zarudnev, a software developer with a passion for creating efficient and elegant solutions.', delay: 1 },
        { text: '\n\n', delay: 50 },
        
        { text: 'cat contacts.txt', type: 'command' },
        { text: '\nGet in touch:', delay: 5 },
        { text: '\n\n', delay: 20 },
        
        { text: 'email', type: 'contact', value: 'pzarudnev93@gmail.com', url: 'mailto:pzarudnev93@gmail.com' },
        { text: 'github', type: 'contact', value: 'github.com/RockinPaul', url: 'https://github.com/RockinPaul' },
        { text: 'linkedin', type: 'contact', value: 'linkedin.com/in/zarudnev', url: 'https://www.linkedin.com/in/zarudnev/' },
        { text: '\n\n', delay: 50 },
        
        { text: 'ls -la projects/', type: 'command' },
        { text: '\nMy Projects:', delay: 5 },
        { text: '\n\n', delay: 20 },
        
        { text: 'wrapped', type: 'project', title: 'Wrapped', 
          desc: 'Mobile application for finding the best doner kebab or shawarma spots based on the user\'s location.\nAvailable on Google Play: https://play.google.com/store/apps/details?id=com.zarudnev.wrapped' },
        { text: 'flattener', type: 'project', title: 'Flattener', 
          desc: 'Dart CLI tool that flattens a directory structure.\nGitHub: https://github.com/RockinPaul/Flattener' },
        { text: 'pitchperfect', type: 'project', title: 'PitchPerfect: Musical Notes', 
          desc: 'Mobile application for mastering musical notation.\nAvailable on Google Play: https://play.google.com/store/apps/details?id=com.zarudnev.music' },
        { text: '\n\n', delay: 20 }
    ];

    const typedText = document.getElementById('typed-text');
    const contentDiv = document.getElementById('content');
    let currentIndex = 0;
    let currentLine = '';
    let isTyping = false;

    function typeWriter() {
        if (currentIndex >= content.length) {
            // Typing complete, no cursor needed
            return;
        }

        const item = content[currentIndex];
        
        if (item.clear) {
            contentDiv.innerHTML = '';
            currentIndex++;
            typeWriter();
            return;
        }

        if (item.type === 'command') {
            const command = document.createElement('div');
            command.className = 'prompt';
            command.innerHTML = `zarudnev:~$ <span class="command">${item.text}</span><span class="cursor">█</span>`;
            contentDiv.appendChild(command);
            currentIndex++;
            
            // Remove cursor after a short delay to simulate typing the next command
            // Minimal delay between commands
            setTimeout(() => {
                const cursor = command.querySelector('.cursor');
                if (cursor) cursor.remove();
                requestAnimationFrame(typeWriter);
            }, 50);
            return;
        }

        if (item.type === 'project') {
            const project = document.createElement('div');
            project.className = 'project';
            project.innerHTML = `
                <div class="project-title">${item.title}</div>
                <div class="project-desc">${item.desc}</div>
            `;
            contentDiv.appendChild(project);
            currentIndex++;
            setTimeout(typeWriter, 100);
            return;
        }

        if (item.type === 'contact') {
            const contact = document.createElement('div');
            contact.className = 'contact-item';
            contact.innerHTML = `
                <span class="arg">${item.text}:</span> <a href="${item.url}" target="_blank">${item.value}</a>
            `;
            contentDiv.appendChild(contact);
            currentIndex++;
            setTimeout(typeWriter, 50);
            return;
        }

        // Regular text typing
        if (!isTyping) {
            isTyping = true;
            let charIndex = 0;
            const textNode = document.createTextNode('');
            contentDiv.appendChild(textNode);
            
            function typeChar() {
                if (charIndex < item.text.length) {
                    textNode.nodeValue += item.text.charAt(charIndex);
                    charIndex++;
                    // Use requestAnimationFrame for smoother animation
                    if (item.delay > 10) {
                        setTimeout(typeChar, item.delay);
                    } else {
                        requestAnimationFrame(typeChar);
                    }
                } else {
                    isTyping = false;
                    currentIndex++;
                    setTimeout(typeWriter, 300);
                }
            }
            
            typeChar();
        }
    }

    // Start the typing effect immediately
    window.requestAnimationFrame(typeWriter);
})();
