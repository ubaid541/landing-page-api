import express from "express";
import axios from "axios"; // Make sure to import axios

const app = express();

app.get("/api/domain", async (req, res) => {
  // Make the function async
  console.log("req :::", req);
  console.log("req headers:::", req.headers);
  console.log("domain:::", req.hostname);
  console.log("ip address", req.ip);

  const ipAddress = req.ip;
  const domain = req.hostname;

  if (ipAddress === "::1" || ipAddress === "127.0.0.1") {
    // Handle both IPv6 and IPv4 localhost
    try {
      // Use await and include the protocol in the URL
      const getHTMLCSS = await axios.get(
        `http://testing.hikalcrm.com/${domain}`
      );

      const data = {
        htmlCSS: getHTMLCSS,
        domain: domain,
        ipAddress: ipAddress,
      };

      console.log("html and css, ", getHTMLCSS.data);
      return res
        .status(200)
        .json({ data: data, message: "Landing page retrieved." });
    } catch (error) {
      console.log("Error: ", error);
      return res
        .status(500)
        .json({ data: error.message, message: "An error occurred." }); // Send only the error message
    }
  } else {
    return res.status(500).json({ error: "IP address does not match" }); // Corrected typo
  }
});

app.listen(2000, () => {
  console.log("server running on port 2000.");
});
