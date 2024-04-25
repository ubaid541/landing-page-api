import express from "express";
import axios from "axios";
import { decompressData } from "./utils/Decompression.js";

const app = express();

// Function to inject `<head>` tag and CSS (replace if using a templating engine)
function injectHeadAndCSS(content, cssContent) {
  const headStart = content.indexOf("<body");
  if (headStart !== -1) {
    const styledHTML =
      content.slice(0, headStart) +
      "<head><style>" +
      cssContent +
      "</style></head>" +
      content.slice(headStart);
    return styledHTML;
  } else {
    // Handle case where no `<body>` tag is found
    console.warn("`<body>` tag not found in HTML content.");
    return content; // Fallback to unstyled content
  }
}

app.get("/api/domain", async (req, res) => {
  // Make the function async
  console.log("req :::", req);
  //   console.log("req headers:::", req.headers);
  console.log("domain:::", req.hostname);
  console.log("ip address", req.ip);

  const ipAddress = req.ip;
  const domain = req.hostname;

  if (ipAddress === "::1" || ipAddress === "127.0.0.1") {
    try {
      const getHTMLCSS = await axios.get(
        `https://testing.hikalcrm.com/api/page-templates/48
        `,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer " + "58|lh59e3Ec9gHgAvpmnRVTworRSNChA1ZoGLPaetgL8557c82d",
          },
        }
      );

      const html = decompressData(getHTMLCSS?.data?.data?.page_template?.html);
      const css = decompressData(getHTMLCSS?.data?.data?.page_template?.css);

      console.log("html returned :: ", html);
      console.log("css returned :: ", css);

      const renderHTML = injectHeadAndCSS(html, css);

      const data = {
        htmlCSS: getHTMLCSS.data,
        domain: domain,
        ipAddress: ipAddress,
      };

      //   console.log("data returned, ", getHTMLCSS.data);
      //   return res
      //     .status(200)
      //     .json({ data: data, message: "Landing page retrieved." });
      return res.status(200).send(renderHTML);
    } catch (error) {
      console.log("Error: ", error);
      return res
        .status(500)
        .json({ data: error, message: "An error occurred." }); // Send only the error message
    }
  } else {
    return res.status(500).json({ error: "IP address does not match" }); // Corrected typo
  }
});

app.listen(2000, () => {
  console.log("server running on port 2000.");
});
