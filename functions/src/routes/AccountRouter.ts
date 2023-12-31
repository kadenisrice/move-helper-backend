import express from "express";
import { ObjectId } from "mongodb";
import { getClient } from "../db";
import Account, { Task } from "../models/Account";

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

// update users task list: (patch)
accountRouter.patch("/accounts/add-task/:uid", async (req, res) => {
  try {
    const uid: string = req.params.uid;
    const task: Task = req.body;

    if (!task.name || !task.content || !task.deadline) {
      res.status(400).json({ message: "Incomplete task details" });
    }

    const client = await getClient();
    const result = await client
      .db()
      .collection<Account>("accounts")
      .updateOne({ uid }, { $push: { tasks: task } });

    if (result.modifiedCount) {
      res.status(200).json(task);
    } else {
      res.status(404).json({ message: "Account not found" });
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

// remove a task from users account: (patch)
accountRouter.patch("/accounts/delete-task/:uuid/:uid", async (req, res) => {
  try {
    const uuid: string = req.params.uuid;
    const uid: string = req.params.uid;

    const client = await getClient();
    const result = await client
      .db()
      .collection<Account>("accounts")
      .updateOne({ uid }, { $pull: { tasks: { uuid } } });

    if (result.modifiedCount) {
      res.sendStatus(204);
    } else {
      res.status(404).json({ message: "Error deleting task" });
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

// ????????????
accountRouter.patch("/accounts/update-task/:uuid/:uid", async (req, res) => {
  try {
    const uuid: string = req.params.uuid;
    const uid: string = req.params.uid;
    const updatedTask: Task = req.body;
    console.log(updatedTask);

    if (!updatedTask.name || !updatedTask.content || !updatedTask.deadline) {
      res.status(400).json({ message: "Incomplete task details" });
    }

    const client = await getClient();
    const result = await client
      .db()
      .collection<Account>("accounts")
      .updateOne(
        { uid, "tasks.uuid": uuid }, // Match the account and the specific task
        { $set: { "tasks.$": updatedTask } } // Update the matched task
      );

    if (result.modifiedCount) {
      res.status(200).json(updatedTask);
    } else {
      res.status(404).json({ message: "Error deleting task" });
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

// updating specific box quantity: (patch)
accountRouter.patch("/accounts/update-box-quantity/:uuid", async (req, res) => {
  try {
    const uuid: string = req.params.uuid;
    const newQuantity: number = req.body.quantity;

    const client = await getClient();
    const result = await client
      .db()
      .collection<Account>("accounts")
      .updateOne(
        { "boxes.uuid": uuid },
        { $inc: { "boxes.$.quantity": newQuantity } }
      );

    if (result.modifiedCount) {
      res.status(200).json({ message: "Quantity has been updated!!" });
    } else {
      res.status(404).json({ message: "Error deleting task" });
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

// delete box from users account: (patch)
accountRouter.patch("/accounts/delete-box/:uuid/:uid", async (req, res) => {
  try {
    const uuid: string = req.params.uuid;
    const uid: string = req.params.uid;

    const client = await getClient();
    const result = await client
      .db()
      .collection<Account>("accounts")
      .updateOne({ uid }, { $pull: { boxes: { uuid } } });

    if (result.modifiedCount) {
      res.sendStatus(204);
    } else {
      res.status(404).json({ message: "Error deleting box" });
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

export default accountRouter;
