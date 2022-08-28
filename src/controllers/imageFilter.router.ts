import { Router, Request, Response } from "express";
import { filterImageFromURL, deleteLocalFiles } from "../util/util";

const router: Router = Router();

// GET /filteredimage?image_url={{URL}}
router.get("/", async (req: Request, res: Response) => {
  const image_url = req.query.image_url as string;
  if (!image_url) {
    return res.status(400).send({ message: "image_url is required." });
  }

  try {
    const filteredImage = await filterImageFromURL(image_url);

    res.status(200).sendFile(filteredImage, (err) => {
      if (err) {
        res.status(500).send("Something went wrong");
      } else {
        deleteLocalFiles([filteredImage]);
      }
    });
  } catch (error) {
    let message = "Unknown Error";
    if (error instanceof Error) message = error.message;
    res.status(400).send(message);
  }
});

export const ImageFilterRouter: Router = router;
