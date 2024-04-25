import { injectHeadAndCSS } from "../utils/InjectionFunction";
const fetchLandingPage = (con, domain) => {
  const query = `SELECT pt.*, ps.*
  FROM page_templates pt
  JOIN page_settings ps ON pt.id = ps.page_id
  WHERE pt.id = 52;
`;
  con.query(query, function (err, result, fields) {
    if (err) throw err;
    console.log("landing pages :: ", result);
  });
};

export default fetchLandingPage;
