# LinkedIn Auto Connect Script

This repository contains an automation script for sending connection requests on LinkedIn with custom messages. The script automatically scrolls through the LinkedIn search results, clicks "Connect" on profiles, and sends personalized connection requests. You can configure the message to include the recipient's name dynamically or fallback to a default message.

## Features

- Automated scrolling: The script scrolls through LinkedIn search results to load more profiles.
- Custom message: Sends a personalized message to each connection request.
- Configurable delays: Adjust the delays for scrolling, sending requests, and moving to the next page.
- Dynamic name extraction: Automatically inserts the name of the person in the connection message. If the name cannot be extracted, it defaults to "there."
- Request counter: Tracks and logs the total number of connection requests sent.
- Easy to use: Just add the script to your browser console.

## Prerequisites

- A LinkedIn account with a good amount of search results to send connection requests to.
- A modern browser like Google Chrome or Mozilla Firefox.

## How to Use

### Manual Usage

1. Open LinkedIn and navigate to the People Search section.
2. Open the browser's Developer Console (Right-click on the page -> Inspect -> Console).
3. Paste the entire script from `linkedin-auto-connect.js` into the console.
4. Press Enter to run the script.

## Configuration

You can modify the following parameters in the script to customize the behavior:

```javascript
Linkedin.config = {
  scrollDelay: 1000, // Delay for scrolling to bottom/top
  actionDelay: 3000, // Delay between sending each connection request
  nextPageDelay: 4000, // Delay for moving to the next page of search results
  maxRequests: -1, // Number of connection requests to send. Set to -1 for unlimited
  totalRequestsSent: 0, // Tracks how many requests have been sent
  addNote: true, // Whether to add a note with each connection request
  note: `Hi {{name}},

I admire the work you’ve done in the industry and would be honored to connect with you. I’m always looking to expand my network with like-minded professionals, and I believe we could share valuable insights.

Looking forward to connecting!

Best regards,  
Mohd Shayan Khan`
};
