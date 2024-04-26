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

app.get("/", (req, res) => {
  const createPageSettingsTableQuery = `
  CREATE TABLE page_settings (
    id BIGINT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    page_id INT(11) NOT NULL,
    domain VARCHAR(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    path_url VARCHAR(191) COLLATE utf8mb4_unicode_ci,
    header_code VARCHAR(191) COLLATE utf8mb4_unicode_ci,
    body_code VARCHAR(191) COLLATE utf8mb4_unicode_ci,
    footer_code VARCHAR(191) COLLATE utf8mb4_unicode_ci,
    added_by INT(11) NOT NULL,
    added_by_name VARCHAR(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    updated_by INT(11),
    updated_by_name VARCHAR(191) COLLATE utf8mb4_unicode_ci,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`;

  con.query(createPageSettingsTableQuery, function (err, results) {
    if (err) {
      console.error("Error creating page_settings table:", err);
      return res.status(400).json({
        error: err,
        message: "Error occured while creating page settings table.",
      });
    } else {
      console.log("Page_settings table created successfully");
      return res.status(200).json({ message: "Page settings table created" });
    }
  });

  // Run the query to create the page_templates table
  const createPageTemplatesTableQuery = `
  CREATE TABLE page_templates (
    id BIGINT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    template_name VARCHAR(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    template_type VARCHAR(191) COLLATE utf8mb4_unicode_ci NOT NULL,
    html LONGTEXT COLLATE utf8mb4_general_ci,
    css LONGTEXT COLLATE utf8mb4_general_ci,
    added_by INT(11),
    added_by_name VARCHAR(191) COLLATE utf8mb4_unicode_ci,
    updated_by INT(11),
    updated_by_name VARCHAR(191) COLLATE utf8mb4_unicode_ci,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`;

  con.query(createPageTemplatesTableQuery, function (err, results) {
    if (err) {
      console.error("Error creating page_templates table:", err);
      return res.status(400).json({
        error: err,
        message: "Error occured while creating page templates table.",
      });
    } else {
      console.log("Page_templates table created successfully");
    }
  });
});

app.listen(2000, () => {
  console.log("server running on port 2000.");
});
