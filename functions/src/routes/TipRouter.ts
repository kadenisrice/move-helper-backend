import express from "express";

import { getClient } from "../db";
import { ObjectId } from "mongodb";
import Tip from "../models/Tip";

const tipsRouter = express.Router();

const errorResponse = (error: any, res: any) => {
  console.error("FAIL", error);
  res.status(500).json({ message: "Internal Server Error" });
};

// Get all tips: (can add query string parameters here)
tipsRouter.get("/community/tips", async (req, res) => {
  try {
    const client = await getClient();

    // mongo command to get all shoutouts:
    const getsAllTips = client.db().collection<Tip>("tips").find();

    // displays all shoutouts:
    const results = await getsAllTips.toArray();
    res.status(200).json(results);
  } catch (err) {
    errorResponse(err, res);
  }
});

// Make a new tip:
tipsRouter.post("/community/tips", async (req, res) => {
  console.log("anoything");

  try {
    const newTip: Tip = req.body;
    console.log(newTip.uuid);

    const client = await getClient();

    // mongo command to get tip:
    await client.db().collection<Tip>("tips").insertOne(newTip);
    res.status(201).json(newTip);
  } catch (err) {
    errorResponse(err, res);
  }
});

// Delete tip by ID:
tipsRouter.delete("/community/tips/:uuid", async (req, res) => {
  try {
    const uuid = req.params.uuid;
    const client = await getClient();
    const result = await client
      .db()
      .collection<Tip>("tips")
      .deleteOne({ uuid });
    if (result.deletedCount) {
      res.sendStatus(204);
    } else {
      res.status(404).json({ message: "Not Found" });
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

// replace / update Shoutout by ID
tipsRouter.put("/community/tips/:uuid", async (req, res) => {
  try {
    const uuid = req.params.uuid;

    const updatedTip: Tip = req.body;
    const _id: ObjectId | undefined = updatedTip._id;

    delete updatedTip._id; // remove _id from body so we only have one.
    const client = await getClient();

    // mongoCMD:
    const result = await client
      .db()
      .collection<Tip>("tips")
      .replaceOne({ uuid }, updatedTip);

    // Status messsage:
    if (result.modifiedCount) {
      updatedTip._id = _id;
      res.status(200).json(updatedTip);
    } else {
      res.status(404).json({ message: "Not Found" });
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

export default tipsRouter;
