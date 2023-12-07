import express from "express";
import { ObjectId } from "mongodb";
import { getClient } from "../db";
import Account from "../models/Account";

const accountRouter = express.Router();

const errorResponse = (error: any, res: any) => {
  console.error("FAIL", error);
  res.status(500).json({ message: "Internal Server Error" });
};

// get account by id:
accountRouter.get("/accounts/:uid", async (req, res) => {
  try {
    const uid: string = req.params.uid;
    const client = await getClient();
    const account = await client
      .db()
      .collection<Account>("accounts")
      .findOne({ uid });
    if (account) {
      res.status(200).json(account);
    } else {
      res.status(404).json({ message: "Account Does Not Exist" });
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

// create new Account:
accountRouter.post("/accounts", async (req, res) => {
  try {
    const account: Account = req.body;
    const client = await getClient();
    await client.db().collection<Account>("accounts").insertOne(account);
    res.status(201).json(account);
  } catch (err) {
    errorResponse(err, res);
  }
});

// delete Account by ID:
accountRouter.delete("/accounts/:id", async (req, res) => {
  try {
    const _id: ObjectId = new ObjectId(req.params.id);
    const client = await getClient();
    const result = await client
      .db()
      .collection<Account>("accounts")
      .deleteOne({ _id });
    if (result.deletedCount) {
      res.sendStatus(204);
    } else {
      res.status(404).json({ message: "Not Found" });
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

// replace / update Account by ID:
accountRouter.put("/accounts/:id", async (req, res) => {
  try {
    const _id: ObjectId = new ObjectId(req.params.id);
    const updatedAccount: Account = req.body;
    delete updatedAccount._id; // remove _id from body so we only have one.
    const client = await getClient();
    const result = await client
      .db()
      .collection<Account>("accounts")
      .replaceOne({ _id }, updatedAccount);
    if (result.modifiedCount) {
      updatedAccount._id = _id;
      res.status(200).json(updatedAccount);
    } else {
      res.status(404).json({ message: "Not Found" });
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

export default accountRouter;
