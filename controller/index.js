import { decompressData } from "../utils/Decompression.js";
import { injectHeadAndCSS } from "../utils/InjectionFunction.js";
const fetchLandingPage = (con, domain, res) => {
  const checkDomain = `SELECT * from page_settings where domain = '${domain}'`;
  //   const query = `SELECT pt.*, ps.*
  //   FROM page_templates pt
  //   JOIN page_settings ps ON pt.id = ps.page_id
  //   WHERE pt.id = 52;
  // `;
  con.query(checkDomain, function (err, result) {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: err, message: "Internal server error" });
    }
    if (result.length > 0) {
      console.log("domain found:: ", result);

      const fetchLandingPage = `SELECT ps.*, pt.*
         FROM page_settings ps
         JOIN page_templates pt ON ps.page_id = pt.id
         WHERE domain = ?; `;
      con.query(fetchLandingPage, [domain], function (err, dataResult) {
        if (err) {
          console.error(err);
          return res.status(500).json({
            error: err,
            message: "Error occured while fetching landing page.",
          });
        }

        console.log("landing page found:: ", dataResult);
        const html = decompressData(dataResult[0]?.html);
        const css = decompressData(dataResult[0]?.css);

        const renderHTML = injectHeadAndCSS(html, css);
        return res.status(200).send(renderHTML);
      });
    } else {
      console.log("no domains found: ", result);
      res
        .status(404)
        .json({
          data: result,
          domain: domain,
          message: "No data found with this domain",
        });
    }
  });
};

export default fetchLandingPage;
