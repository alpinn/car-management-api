const cloudinary = require("../../../../config/cloudinary");
const multer = require("multer");
const path = require("path");
const storage = multer.memoryStorage();

const getPublicId = (imageURL) => {
  if (!imageURL) return "";

  const CLOUDINARY_REGEX =
    /^.+\.cloudinary\.com\/(?:[^\/]+\/)(?:(image|video|raw)\/)?(?:(upload|fetch|private|authenticated|sprite|facebook|twitter|youtube|vimeo)\/)?(?:(?:[^_/]+_[^,/]+,?)*\/)?(?:v(\d+|\w{1,2})\/)?([^\.^\s]+)(?:\.(.+))?$/;

  const parts = CLOUDINARY_REGEX.exec(imageURL);

  return parts && parts.length > 2 ? parts[parts.length - 2] : imageURL;
};

const imgFilter = (req, file, callback) => {
  let extFile = path.extname(file.originalname);
  if (extFile === ".png" || extFile === ".jpg" || extFile === ".jpeg")
    return callback(null, true);
  callback(null, false);
  callback(new Error("Filetype must be PNG/JPG/JPEG"));
};

const upload = multer({
  storage: storage,
  fileFilter: imgFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
}).single("image");

exports.imgUploader = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      res.status(400).json({
        message: err.message,
        err_msg: err.code,
      });
      return;
    } else if (err) {
      // An unknown error occurred when uploading.
      res.status(400).json({
        message: err.message,
        err_msg: err.code,
      });
      return;
    }
    next();
  });
};

exports.cloudinaryUpload = async (req, res, next) => {
  try {
    if (req.car?.id) {
      // skipping while empty file input
      if (!req.file) {
        next();
        return;
      }
      const public_id = getPublicId(req.car.image);
      await cloudinary.uploader.destroy(public_id); //delete old pict
    }

    const fileBase64 = req.file.buffer.toString("base64"); //convert buffer to base64
    const file = `data:${req.file.mimetype};base64,${fileBase64}`;
    // console.log(file);
    const folderCloudinary = "car-api-challenge"; //folder in cloudinary console

    const uploadImg = await cloudinary.uploader.upload(file, {
      folder: folderCloudinary,
    });

    req.image = uploadImg.secure_url; //generated url
    console.log(req.image);
    next();
  } catch (error) {
    res.status(400).json({
      message: "Gagal Upload file!",
      err_msg: error.message,
    });
  }
};

exports.cloudinaryDelete = async (req, res, next) => {
  try {
    const public_id = getPublicId(req.car.image);
    await cloudinary.uploader.destroy(public_id);

    next();
  } catch (error) {
    res.status(400).json({
      message: "Gagal Hapus file!",
      err_msg: error.message,
    });
  }
};
