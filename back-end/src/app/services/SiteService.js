const db = require("../../configs/DatabaseConfig.js");
const HandleCode = require("../../utilities/HandleCode.js");

module.exports.getDocument = async (docType = HandleCode.DOC_TYPE_ABOUT) => {
  const [privacyPolicy] = await db.query(
    "SELECT content FROM documents where docType = ?",
    [docType]
  );

  const content = privacyPolicy[0].content;
  return content;
};

module.exports.updateDocument = async (
  docType = HandleCode.DOC_TYPE_ABOUT,
  content = ""
) => {
  const [privacyPolicy] = await db.query(
    "UPDATE documents SET content = ? where docType = ?",
    [content, docType]
  );
  return privacyPolicy;
};
