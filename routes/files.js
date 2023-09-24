const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const { v4: uuid4 } = require("uuid");
const File = require("../models/File");
const sendMail = require("../services/emailService");
const emailTemplate = require("../services/emailTemplate");
const base_url = require("../base_url");
const cloudinary = require("../cloudinary");
let email_url = "";

const storage = multer.diskStorage({
  //destination: (req, file, cd) => cd(null, "uploads/"),
  filename: (req, file, cd) => {
    // const uniqName = `${Date.now()}-${Math.round(
    //   Math.random() * 1e9
    // )}${path.extname(file.originalname)}`;

    cd(null, file.originalname);
  },
});

const upload = multer({
  storage,
  //limit: { fileSize: 1000000 * 100 },
}).single("myfile");

router.post("/", upload, function (req, res) {
  if (!req.file) {
    return res.status(404).json({ error: "All fild are require!" });
  }

  cloudinary.uploader.upload(req.file.path, async function (err, result) {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Error",
      });
    }

    const file = new File({
      filename: req.file.filename,
      uuid: uuid4(),
      path: result.secure_url,
      size: req.file.size,
    });
    email_url = result.secure_url;
    try {
      const response = await file.save();
      return res
        .status(200)
        .json({ file: result.secure_url, uuid: response.uuid });
      //http://localhost:3000/files/23hb34bh-sf4h4bm234
    } catch (error) {
      res.status(500).json({ error: "File not save" });
    }
  });
});

router.post("/send", async (req, res) => {
  const { uuid, emailTo, emailFrom } = req.body;
  console.log(req.body);
  // valid request
  if (!uuid || !emailTo || !emailFrom) {
    res.status(422).send({ error: "All field are required !" });
  }

  // get data from database
  try {
    console.log("1");
    const file = await File.findOne({ uuid: uuid });
    console.log("2");
    console.log(file);
    if (file.sender) {
      res.status(422).send({ error: "Email alredy sent !" });
    }

    file.sender = emailFrom;
    file.receiver = emailTo;
    const response = await file.save();
    console.log("sfsd");
    console.log(email_url);
    // send mail
    sendMail({
      from: emailFrom,
      to: emailTo,
      subject: "InShare image sharing",
      text: `$${emailFrom} shared a file with you!`,
      html: emailTemplate({
        emailFrom,
        downloadLink: email_url,
        size: parseInt(file.size / 1000) + "KB",
        expires: "24 hours",
      }),
    });

    res.status(200).send({ succuss: "Email Send!" });
  } catch (error) {
    res.status(500).send({ error: "Internal server error !" });
  }
});

module.exports = router;
