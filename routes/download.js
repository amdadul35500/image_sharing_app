const router = require("express").Router();
const File = require("../models/File");

router.get("/:uuid", async (req, res) => {
  try {
    const file = await File.findOne({ uuid: req.params.uuid });

    if (!file) {
      res.render("download", {
        error: "Link has been expired!",
      });
    }
    console.log(file.path);
    const filePath = file.path;

    res.download(
      `https://res.cloudinary.com/amdadul/image/upload/v1695553060/au1vjkrmhgq9bxaq3fmw.jpg`
    );
  } catch (error) {
    res.render("download", {
      error: "Link has been expired!",
    });
  }
});

module.exports = router;
