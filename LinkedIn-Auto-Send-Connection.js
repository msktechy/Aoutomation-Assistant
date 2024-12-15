Linkedin = {
  config: {
    scrollDelay: 10000, // Delay for scrolling
    actionDelay: 10000, // Delay for actions like clicking buttons
    nextPageDelay: 10000, // Delay for moving to the next page
    maxRequests: -1, // Set to -1 for no limit
    totalRequestsSent: 0, // Count of total sent requests
    addNote: true, // Add a note with each connection request
    note: `Hi {{name}},

I admire the work you’ve done in the industry and would be honored to connect with you.

I’m always looking to expand my network with like-minded professionals, and I believe we could share valuable insights.

Looking forward to connecting!

Best regards,  
Mohd Shayan Khan`,
  },
  init: function (data, config) {
    console.info("INFO: Script initialized on the page...");
    console.debug(
      "DEBUG: Scrolling to bottom in " + config.scrollDelay + " ms"
    );
    this.scrollBottom(data, config);
    this.startBackgroundProcess(data, config);  // Start background process to keep the script running
  },
  startBackgroundProcess: function (data, config) {
    // Start background task to ensure script runs in the background
    setInterval(() => {
      if (!document.hidden) {
        console.log("Tab is active, continuing to run the script.");
        this.scrollBottom(data, config);
        this.inspect(data, config);  // Add more functions to execute periodically
      } else {
        console.log("Tab is inactive, waiting for activity.");
      }
    }, config.scrollDelay); // Adjust the interval based on your scrollDelay
  },
  scrollBottom: function (data, config) {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    console.debug("DEBUG: Scrolling to top in " + config.scrollDelay + " ms");
    setTimeout(() => this.scrollTop(data, config), config.scrollDelay);
  },
  scrollTop: function (data, config) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    console.debug(
      "DEBUG: Inspecting elements in " + config.scrollDelay + " ms"
    );
    setTimeout(() => this.inspect(data, config), config.scrollDelay);
  },
  inspect: function (data, config) {
    var totalRows = this.totalRows();
    console.debug("DEBUG: Total search results found on page: " + totalRows);
    if (totalRows >= 0) {
      this.compile(data, config);
    } else {
      console.warn("WARN: End of search results!");
      this.complete(config);
    }
  },
  compile: function (data, config) {
    var elements = document.querySelectorAll("button");
    data.pageButtons = [...elements].filter(function (element) {
      return element.textContent.trim() === "Connect";
    });
    if (!data.pageButtons || data.pageButtons.length === 0) {
      console.warn("WARN: No connect buttons found on page!");
      console.info("INFO: Moving to next page...");
      setTimeout(() => {
        this.nextPage(config);
      }, config.nextPageDelay);
    } else {
      data.pageButtonTotal = data.pageButtons.length;
      console.info("INFO: " + data.pageButtonTotal + " connect buttons found");
      data.pageButtonIndex = 0;
      var names = document.querySelectorAll(".entity-result__title-text a span[aria-hidden]");
      data.connectNames = [...names].map(function (element) {
        return element.textContent.trim();
      });
      console.debug(
        "DEBUG: Starting to send invites in " + config.actionDelay + " ms"
      );
      setTimeout(() => {
        this.sendInvites(data, config);
      }, config.actionDelay);
    }
  },
  sendInvites: function (data, config) {
    console.debug("Remaining requests: " + config.maxRequests);
    if (config.maxRequests == 0) {
      console.info("INFO: Max requests reached for the script run!");
      this.complete(config);
    } else {
      console.debug(
        "DEBUG: Sending invite to " +
          (data.pageButtonIndex + 1) +
          " out of " +
          data.pageButtonTotal
      );
      var button = data.pageButtons[data.pageButtonIndex];
      button.click();
      if (config.addNote && config.note) {
        console.debug(
          "DEBUG: Clicking 'Add a note' in popup, if present, in " +
            config.actionDelay +
            " ms"
        );
        setTimeout(() => this.clickAddNote(data, config), config.actionDelay);
      } else {
        console.debug(
          "DEBUG: Clicking 'Done' in popup, if present, in " +
            config.actionDelay +
            " ms"
        );
        setTimeout(() => this.clickDone(data, config), config.actionDelay);
      }
    }
  },
  clickAddNote: function (data, config) {
    var buttons = document.querySelectorAll("button");
    var addNoteButton = Array.prototype.filter.call(buttons, function (el) {
      return el.textContent.trim() === "Add a note";
    });
    if (addNoteButton && addNoteButton[0]) {
      console.debug("DEBUG: Clicking 'Add a note' button to paste note");
      addNoteButton[0].click();
      console.debug("DEBUG: Pasting note in " + config.actionDelay);
      setTimeout(() => this.pasteNote(data, config), config.actionDelay);
    } else {
      console.debug(
        "DEBUG: 'Add a note' button not found, clicking 'Send' in popup in " +
          config.actionDelay
      );
      setTimeout(() => this.clickDone(data, config), config.actionDelay);
    }
  },
  pasteNote: function (data, config) {
    noteTextBox = document.getElementById("custom-message");
    var name = data.connectNames[data.pageButtonIndex] || "there"; // Fallback to "there"
    noteTextBox.value = config.note.replace("{{name}}", name);
    noteTextBox.dispatchEvent(
      new Event("input", {
        bubbles: true,
      })
    );
    console.debug(
      "DEBUG: Clicking 'Send' in popup, if present, in " +
        config.actionDelay +
        " ms"
    );
    setTimeout(() => this.clickDone(data, config), config.actionDelay);
  },
  clickDone: function (data, config) {
    var buttons = document.querySelectorAll("button");
    var doneButton = Array.prototype.filter.call(buttons, function (el) {
      return el.textContent.trim() === "Send";
    });
    if (doneButton && doneButton[0]) {
      console.debug("DEBUG: Clicking 'Send' button to close popup");
      doneButton[0].click();
    } else {
      console.debug(
        "DEBUG: 'Send' button not found, clicking 'Close' in the popup in " +
          config.actionDelay
      );
    }
    setTimeout(() => this.clickClose(data, config), config.actionDelay);
  },
  clickClose: function (data, config) {
    var closeButton = document.getElementsByClassName(
      "artdeco-modal__dismiss artdeco-button artdeco-button--circle artdeco-button--muted artdeco-button--2 artdeco-button--tertiary ember-view"
    );
    if (closeButton && closeButton[0]) {
      closeButton[0].click();
    }
    config.totalRequestsSent++;
    console.info(
      `INFO: Invite sent to ${
        data.connectNames[data.pageButtonIndex] || "there"
      }. Total sent: ${config.totalRequestsSent}`
    );
    if (data.pageButtonIndex === data.pageButtonTotal - 1) {
      console.debug(
        "DEBUG: All connections for the page done, going to next page in " +
          config.actionDelay +
          " ms"
      );
      setTimeout(() => this.nextPage(config), config.actionDelay);
    } else {
      data.pageButtonIndex++;
      console.debug(
        "DEBUG: Sending next invite in " + config.actionDelay + " ms"
      );
      setTimeout(() => this.sendInvites(data, config), config.actionDelay);
    }
  },
  nextPage: function (config) {
    var pagerButton = document.getElementsByClassName(
      "artdeco-pagination__button--next"
    );
    if (
      !pagerButton ||
      pagerButton.length === 0 ||
      pagerButton[0].hasAttribute("disabled")
    ) {
      console.info("INFO: No next page button found!");
      return this.complete(config);
    }
    console.info("INFO: Going to next page...");
    pagerButton[0].click();
    setTimeout(() => this.init({}, config), config.nextPageDelay);
  },
  complete: function (config) {
    console.info(
      "INFO: Script completed after sending " +
        config.totalRequestsSent +
        " connection requests"
    );
  },
  totalRows: function () {
    var search_results = document.getElementsByClassName("search-result");
    return search_results ? search_results.length : 0;
  },
};

Linkedin.init({}, Linkedin.config);
