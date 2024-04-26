import express from "express";
import axios from "axios";
import { decompressData } from "./utils/Decompression.js";
import mysql from "mysql";
import dotenv from "dotenv";
import fetchLandingPage from "./controller/index.js";

dotenv.config();

const app = express();

// mysql connection
var con = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
});

const cred = [
  {
    host: process.env.MYSQL_HOST,
  },
  {
    user: process.env.MYSQL_USER,
  },
  {
    password: process.env.MYSQL_PASSWORD,
  },
  {
    database: process.env.MYSQL_DB,
  },
];

console.table(cred);

if (con.state !== "connected" && con.state === "disconnected") {
  // con.connect(function (err) {
  //   if (err) console.log("mysql connection error:: ", err);
  // });

  con.connect(function (err) {
    if (err) {
      if (err.code === "PROTOCOL_CONNECTION_LOST") {
        console.error("Database connection was closed.");
      }
      if (err.code === "ER_CON_COUNT_ERROR") {
        console.error("Database has too many connections.");
      }
      if (err.code === "ECONNREFUSED") {
        console.error("Database connection was refused.");
      }
      console.error("Error connecting to database:", err);
      console.error("Affected credential:", err);
    } else {
      console.log("Connected to MySQL database!");
    }
  });
}

// Function to inject `<head>` tag and CSS (replace if using a templating engine)
// function injectHeadAndCSS(content, cssContent) {
//   const headStart = content.indexOf("<body");
//   if (headStart !== -1) {
//     const styledHTML =
//       content.slice(0, headStart) +
//       "<head><style>" +
//       cssContent +
//       "</style></head>" +
//       content.slice(headStart);
//     return styledHTML;
//   } else {
//     // Handle case where no `<body>` tag is found
//     console.warn("`<body>` tag not found in HTML content.");
//     return content; // Fallback to unstyled content
//   }
// }

// app.get("/api/domain", async (req, res) => {
//   // Make the function async
//   console.log("req :::", req);
//   console.log("domain:::", req.hostname);
//   console.log("ip address", req.ip);

//   const domain = req.hostname;

//   try {
//     const getHTMLCSS = await axios.get(
//       `https://testing.hikalcrm.com/api/page-templates/48
//         `,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization:
//             "Bearer " + "58|lh59e3Ec9gHgAvpmnRVTworRSNChA1ZoGLPaetgL8557c82d",
//         },
//       }
//     );

//     const html = decompressData(getHTMLCSS?.data?.data?.page_template?.html);
//     const css = decompressData(getHTMLCSS?.data?.data?.page_template?.css);

//     // console.log("html returned :: ", html);
//     // console.log("css returned :: ", css);

//     const renderHTML = injectHeadAndCSS(html, css);

//     const data = {
//       htmlCSS: getHTMLCSS.data,
//       domain: domain,
//     };

//     return res.status(200).send(renderHTML);
//   } catch (error) {
//     console.log("Error: ", error);
//     return res.status(500).json({ data: error, message: "An error occurred." });
//   }
// });

app.get("/api/landingPage", (req, res) => {
  const domain = req.hostname;
  console.log("domain:: ", domain);

  fetchLandingPage(con, domain, res);
});

app.listen(2000, () => {
  console.log("server running on port 2000.");
});
