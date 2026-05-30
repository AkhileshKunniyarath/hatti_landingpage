document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("mobile-active");
      const icon = menuToggle.querySelector("i");
      if (icon) {
        icon.setAttribute("data-lucide", navMenu.classList.contains("mobile-active") ? "x" : "menu");
        lucide.createIcons();
      }
    });
  }

  const chatFeed = document.getElementById("chatFeed");
  const promptOptions = document.getElementById("promptOptions");

  const chatSequences = {
    services: [
      {
        sender: "User",
        text: "Hatti, what services does Touchpointe offer?"
      },
      {
        sender: "Hatti",
        text: "Touchpointe Digital designs high-performance digital experiences and custom software systems. Here are their core services:",
        widget: `
          <div class="card-widget">
            <div class="widget-title">
              <i data-lucide="sparkles" class="check-icon" style="color:#7C3AED"></i> Touchpointe Services
            </div>
            <div class="widget-row">
              <span>Web Engineering</span>
              <strong>Enterprise React/Next.js</strong>
            </div>
            <div class="widget-row">
              <span>Mobile Apps</span>
              <strong>iOS & Android Native</strong>
            </div>
            <div class="widget-row">
              <span>AI Implementation</span>
              <strong>Custom trained models (like me!)</strong>
            </div>
            <div class="widget-row">
              <span>SaaS Incubation</span>
              <strong>Startup co-building</strong>
            </div>
          </div>
        `
      },
      {
        sender: "Hatti",
        text: "They focus on engineering fast, reliable, and intelligent tools that directly drive sales. Would you like me to open their contact form for a free consultation?"
      }
    ],
    installation: [
      {
        sender: "User",
        text: "How do I install you on my website?"
      },
      {
        sender: "Hatti",
        text: "It is extremely simple! You can go live in under 5 minutes with three steps:",
        widget: `
          <div class="checklist-widget">
            <div class="checklist-item">
              <i data-lucide="check-circle-2" class="check-icon"></i>
              <span>1. Enter your website domain (I will auto-crawl all public text)</span>
            </div>
            <div class="checklist-item">
              <i data-lucide="check-circle-2" class="check-icon"></i>
              <span>2. Customize colors and greetings in the Touchpointe console</span>
            </div>
            <div class="checklist-item">
              <i data-lucide="code-2" class="check-icon" style="color:#0ea5e9"></i>
              <span>3. Copy and paste the 1-line script tag into your HTML template</span>
            </div>
          </div>
        `
      },
      {
        sender: "Hatti",
        text: "Once the code is embedded, the widget appears instantly on your site. Any updates to your website content will be synced automatically."
      }
    ],
    pricing: [
      {
        sender: "User",
        text: "Is there a free trial for Hatti?"
      },
      {
        sender: "Hatti",
        text: "Yes, absolutely! Touchpointe offers a fully functional free sandbox trial for 14 days so you can test Hatti on your own pages.",
        widget: `
          <div class="card-widget">
            <div class="widget-title">
              <i data-lucide="shield-alert" class="check-icon" style="color:#10b981"></i> Sandbox Trial Details
            </div>
            <div class="widget-row">
              <span>Trial Period</span>
              <span>14 Days</span>
            </div>
            <div class="widget-row">
              <span>Setup Fee</span>
              <strong>$0 (Free)</strong>
            </div>
            <div class="widget-row">
              <span>Context Scanning</span>
              <span>Up to 100 pages</span>
            </div>
            <div class="widget-row highlight">
              <span>Widget Script</span>
              <span style="color:#10b981">Instantly Available</span>
            </div>
          </div>
        `
      },
      {
        sender: "Hatti",
        text: "You can request access and get your custom script snippet by filling out the Touchpointe Request Form."
      }
    ]
  };

  const scrollToBottom = () => {
    if (chatFeed) {
      chatFeed.scrollTop = chatFeed.scrollHeight;
    }
  };

  const renderMessageBubble = (sender, contentText, widgetHtml = null) => {
    if (!chatFeed) {
      return;
    }

    const isAssistant = sender === "Hatti";
    const msgDiv = document.createElement("div");
    msgDiv.className = `chat-message ${isAssistant ? "assistant" : "user"}`;

    const avatarHtml = isAssistant
      ? `
        <div class="avatar-wrapper">
          <img src="hattie.png" alt="Hatti AI" />
        </div>
      `
      : "";

    msgDiv.innerHTML = `
      ${avatarHtml}
      <div class="message-bubble">
        <span class="message-sender">${sender}</span>
        <p>${contentText}</p>
        ${widgetHtml ? widgetHtml : ""}
      </div>
    `;

    chatFeed.appendChild(msgDiv);
    lucide.createIcons();
    scrollToBottom();
  };

  const renderTypingIndicator = () => {
    if (!chatFeed) {
      return;
    }

    const indDiv = document.createElement("div");
    indDiv.className = "chat-message assistant typing-indicator-wrapper";
    indDiv.id = "typingIndicator";
    indDiv.innerHTML = `
      <div class="avatar-wrapper">
        <img src="hattie.png" alt="Hatti" />
      </div>
      <div class="message-bubble typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    chatFeed.appendChild(indDiv);
    scrollToBottom();
  };

  const removeTypingIndicator = () => {
    const ind = document.getElementById("typingIndicator");
    if (ind) {
      ind.remove();
    }
  };

  let isSequenceRunning = false;

  if (promptOptions && chatFeed) {
    promptOptions.addEventListener("click", (e) => {
      const chip = e.target.closest(".prompt-chip");
      if (!chip || isSequenceRunning) {
        return;
      }

      const key = chip.getAttribute("data-prompt");
      const sequence = chatSequences[key];
      if (!sequence) {
        return;
      }

      isSequenceRunning = true;
      const chips = promptOptions.querySelectorAll(".prompt-chip");
      chips.forEach((c) => {
        c.style.opacity = "0.5";
      });

      const userMsg = sequence[0];
      renderMessageBubble(userMsg.sender, userMsg.text);

      let stepIndex = 1;

      const runNextAssistantStep = () => {
        if (stepIndex >= sequence.length) {
          isSequenceRunning = false;
          chips.forEach((c) => {
            c.style.opacity = "1";
          });
          return;
        }

        renderTypingIndicator();

        setTimeout(() => {
          removeTypingIndicator();
          const step = sequence[stepIndex];
          renderMessageBubble(step.sender, step.text, step.widget);
          stepIndex += 1;

          setTimeout(runNextAssistantStep, 1500);
        }, 1200);
      };

      setTimeout(runNextAssistantStep, 800);
    });

    setTimeout(() => {
      renderMessageBubble(
        "Hatti",
        "Hi! I am Hatti, a custom AI model built to help visitors. Paste me into your website, and I will answer questions about your services, products, and articles instantly. Click a quick command below to see how I function!"
      );
    }, 1000);
  }

  const tabItems = document.querySelectorAll(".tab-item");
  const visualDisplay = document.getElementById("visualDisplay");

  const tabVisuals = {
    crawl: {
      indicator: "globe",
      title: "Step 1: Website URL Scanning",
      content: `
        <div style="text-align:left; background:rgba(255,255,255,0.01); border:1px solid rgba(255,255,255,0.05); border-radius:10px; padding:20px;">
          <label style="display:block; font-size:0.75rem; color:var(--text-secondary); margin-bottom:8px; font-weight:600;">Enter your domain name:</label>
          <div style="display:flex; gap:8px; margin-bottom:16px;">
            <input type="text" value="https://touchpointe.digital" readonly style="flex-grow:1; background:#030712; border:1px solid rgba(124, 58, 237, 0.3); border-radius:6px; color:#fff; padding:10px; font-size:0.8rem;" />
            <button style="background:var(--primary); border:none; border-radius:6px; color:#fff; padding:0 16px; font-size:0.8rem; font-weight:600; cursor:default;">Crawl Site</button>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-secondary); margin-bottom:6px;">
            <span>Indexing Pages...</span>
            <span style="color:var(--accent); font-weight:700;">85% Completed</span>
          </div>
          <div style="height:6px; background:rgba(255,255,255,0.05); border-radius:10px; overflow:hidden;">
            <div style="width:85%; height:100%; background:linear-gradient(90deg, var(--accent), var(--primary)); border-radius:10px;"></div>
          </div>
        </div>
      `
    },
    widget: {
      indicator: "palette",
      title: "Step 2: Theme & Widget Customizer",
      content: `
        <div style="text-align:left; display:flex; flex-direction:column; gap:12px; background:rgba(255,255,255,0.01); border:1px solid rgba(255,255,255,0.05); border-radius:10px; padding:20px; font-size:0.8rem;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span>Widget Accents:</span>
            <div style="display:flex; gap:8px;">
              <span style="width:18px; height:18px; border-radius:50%; background:#7C3AED; border:2px solid #fff; cursor:default;"></span>
              <span style="width:18px; height:18px; border-radius:50%; background:#0ea5e9; cursor:default;"></span>
              <span style="width:18px; height:18px; border-radius:50%; background:#10b981; cursor:default;"></span>
            </div>
          </div>
          <div style="display:flex; flex-direction:column; gap:6px;">
            <span>Initial Greeting Prompt:</span>
            <input type="text" value="Hi! Ask me anything about our services..." readonly style="background:#030712; border:1px solid rgba(255,255,255,0.1); border-radius:6px; color:var(--text-secondary); padding:8px;" />
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span>Widget Alignment:</span>
            <span style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); padding:4px 10px; border-radius:4px; font-weight:600; font-size:0.75rem;">Bottom Right</span>
          </div>
        </div>
      `
    },
    embed: {
      indicator: "code-2",
      title: "Step 3: HTML Script Installation",
      content: `
        <div class="code-editor-mock">
          <pre><code><span class="comment">&lt;!-- Copy this script to your &lt;head&gt; --&gt;</span>
&lt;<span class="tag">script</span>
  <span class="attr">src</span>=<span class="val">"https://cdn.touchpointe.digital/hatti.js"</span>
  <span class="attr">data-client-id</span>=<span class="val">"tp_84a1bc9"</span>
  <span class="attr">data-theme</span>=<span class="val">"violet"</span>
  <span class="attr">async</span>
&gt;&lt;/<span class="tag">script</span>&gt;</code></pre>
        </div>
      `
    }
  };

  if (tabItems.length > 0 && visualDisplay) {
    tabItems.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabItems.forEach((t) => {
          t.classList.remove("active");
        });
        tab.classList.add("active");

        const tabKey = tab.getAttribute("data-tab");
        const visualData = tabVisuals[tabKey];

        if (visualData) {
          visualDisplay.querySelector(".visual-indicator").setAttribute("data-lucide", visualData.indicator);
          visualDisplay.querySelector(".visual-title").textContent = visualData.title;
          visualDisplay.querySelector(".visual-body").innerHTML = visualData.content;
          lucide.createIcons();
        }
      });
    });
  }
});
