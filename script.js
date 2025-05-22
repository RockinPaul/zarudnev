// Start immediately without waiting for DOMContentLoaded
(function () {
  const content = [
    { text: "whoami", type: "command" },
    {
      text: "\nHello! I'm Paul, a software developer with a passion for creating efficient and elegant solutions.",
      delay: 1,
    },
    { text: "\n\n", delay: 25 },

    { text: "cat contacts.txt", type: "command" },
    { text: "\nGet in touch:", delay: 5 },
    { text: "\n\n", delay: 10 },

    {
      text: "email",
      type: "contact",
      value: "pzarudnev93@gmail.com",
      url: "mailto:pzarudnev93@gmail.com",
    },
    {
      text: "github",
      type: "contact",
      value: "github.com/RockinPaul",
      url: "https://github.com/RockinPaul",
    },
    {
      text: "linkedin",
      type: "contact",
      value: "linkedin.com/in/zarudnev",
      url: "https://www.linkedin.com/in/zarudnev/",
    },
    { text: "\n\n", delay: 10 },

    { text: "ls -la projects/", type: "command" },
    { text: "My Projects:", type: "sectionTitle", delay: 5 },
    { text: "\n\n", delay: 10 },

    {
      text: "wrapped",
      type: "project",
      title: "Wrapped",
      desc: "Mobile application for finding the best doner kebab or shawarma spots based on the user's location.\nAvailable on https://play.google.com/store/apps/details?id=com.zarudnev.wrapped",
    },
    {
      text: "flattener",
      type: "project",
      title: "Flattener",
      desc: "Dart CLI tool that flattens a directory structure.\nGitHub: https://github.com/RockinPaul/Flattener",
    },
    {
      text: "pitchperfect",
      type: "project",
      title: "PitchPerfect: Musical Notes",
      desc: "Mobile application for mastering musical notation.\nAvailable on https://play.google.com/store/apps/details?id=com.zarudnev.music",
    },
    {
      text: "radioactivity",
      type: "project",
      title: "Radioactivity",
      desc: "Internet radio browser.\nAvailable on https://play.google.com/store/apps/details?id=com.zarudnev.radioactivity",
    },
    {
      text: "propup",
      type: "project",
      title: "PropUp",
      desc: "Mobile app for real estate property management platform. Available on https://apps.apple.com/us/app/propup/id1609091570",
    },
    { text: "\n\n", delay: 10 },
  ];

  const typedText = document.getElementById("typed-text");
  const contentDiv = document.getElementById("content");
  let currentIndex = 0;
  let currentLine = "";
  let isTyping = false;

  function typeWriter() {
    if (currentIndex >= content.length) {
      // Typing complete, no cursor needed
      return;
    }

    const item = content[currentIndex];

    if (item.clear) {
      contentDiv.innerHTML = "";
      currentIndex++;
      typeWriter();
      return;
    }

    if (item.type === "command") {
      const command = document.createElement("div");
      command.className = "prompt";
      command.innerHTML = `zarudnev:~$ <span class="command">${item.text}</span><span class="cursor">█</span>`;
      contentDiv.appendChild(command);
      currentIndex++;

      // Remove cursor after a short delay to simulate typing the next command
      // Minimal delay between commands
      setTimeout(() => {
        const cursor = command.querySelector(".cursor");
        if (cursor) cursor.remove();
        requestAnimationFrame(typeWriter);
      }, 25);
      return;
    }

    if (item.type === "project") {
      const project = document.createElement("div");
      project.className = "project";

      // Process description to make links clickable and format app store links
      const processLinks = (text) => {
        // Replace Google Play URLs with 'Google Play' text
        text = text.replace(
          /(https?:\/\/play\.google\.com\/store\/apps\/details\?id=[^\s)]+)/g,
          (url) =>
            `<a href="${url}" target="_blank" rel="noopener noreferrer">Google Play</a>`
        );
        // Replace App Store URLs with 'App Store' text
        text = text.replace(
          /(https?:\/\/apps\.apple\.com\/us\/app\/[^\s)]+)/g,
          (url) =>
            `<a href="${url}" target="_blank" rel="noopener noreferrer">App Store</a>`
        );
        // Handle other URLs (like GitHub)
        return text.replace(
          /(https?:\/\/(?!(play\.google\.com|apps\.apple\.com))[^\s)]+)/g,
          (url) =>
            `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
        );
      };

      const processedDesc = processLinks(item.desc);

      project.innerHTML = `
                <div class="project-title">${item.title}</div>
                <div class="project-desc">${processedDesc.replace(
                  /\n/g,
                  "<br>"
                )}</div>
            `;
      contentDiv.appendChild(project);
      currentIndex++;
      setTimeout(typeWriter, 50);
      return;
    }

    if (item.type === "contact") {
      const contact = document.createElement("div");
      contact.className = "contact-item";
      contact.innerHTML = `
                <span class="arg">${item.text}:</span> <a href="${item.url}" target="_blank">${item.value}</a>
            `;
      contentDiv.appendChild(contact);
      currentIndex++;
      setTimeout(typeWriter, 25);
      return;
    }

    if (item.type === "sectionTitle") {
      const sectionDiv = document.createElement("div");
      sectionDiv.className = "section"; // This div gets the 6em top margin from styles.css

      const textNode = document.createTextNode("");
      sectionDiv.appendChild(textNode);
      contentDiv.appendChild(sectionDiv);

      let charIndexLocal = 0;
      const textToType = item.text.trim(); // Trim newlines for display

      function typeSectionTitleChar() {
        if (charIndexLocal < textToType.length) {
          textNode.nodeValue += textToType.charAt(charIndexLocal);
          charIndexLocal++;
          const typingDelay = item.delay || 25; // Use item.delay, fallback
          if (typingDelay > 10) { // Consistent with existing animation logic
            setTimeout(typeSectionTitleChar, typingDelay);
          } else {
            requestAnimationFrame(typeSectionTitleChar);
          }
        } else {
          currentIndex++; // Move to the next content item
          setTimeout(typeWriter, 150); // Call typeWriter for the next item
        }
      }
      typeSectionTitleChar(); // Initiate typing for the section title
      return; // Ensure this item is fully handled
    }

    // Regular text typing
    if (!isTyping) {
      isTyping = true;
      let charIndex = 0;
      const textNode = document.createTextNode("");
      contentDiv.appendChild(textNode);

      function typeChar() {
        if (charIndex < item.text.length) {
          const charsPerFrame = (item.delay <= 10 && item.delay > 0) ? 2 : 1; // Type 2 chars if RAF & delay > 0
          for (let i = 0; i < charsPerFrame && charIndex < item.text.length; i++) {
            textNode.nodeValue += item.text.charAt(charIndex);
            charIndex++;
          }

          // Use requestAnimationFrame for smoother animation
          if (item.delay > 10) {
            setTimeout(typeChar, item.delay);
          } else {
            requestAnimationFrame(typeChar);
          }
        } else {
          isTyping = false;
          currentIndex++;
          setTimeout(typeWriter, 150);
        }
      }

      typeChar();
    }
  }

  // Start the typing effect immediately
  window.requestAnimationFrame(typeWriter);
})();
