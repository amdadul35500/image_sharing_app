const router = require("express").Router();
const base_url = require("../base_url");
const File = require("../models/File");

router.get("/:uuid", async (req, res) => {
  try {
    const file = await File.findOne({ uuid: req.params.uuid });
    console.log(base_url);
    if (!file) {
      res.render("download", { error: "Link has been expired!" });
    }

    res.render("download", {
      uuid: file.uuid,
      fileName: file.filename,
      fileSize: file.size,
      downloadLink: `${base_url}/files/download/${file.uuid}`,
    });
  } catch (error) {
    res.render("download", { error: "Something went wrong!" });
  }
});

module.exports = router;
