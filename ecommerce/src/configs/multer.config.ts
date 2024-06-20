"use strict";

import multer from "multer";

const multerMemory = multer({
  storage: multer.memoryStorage(),
});

export { multerMemory };
