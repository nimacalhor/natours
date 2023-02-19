import User from "../models/user";
import AppError from "../modules/errors/app-error";
import { escortAsync } from "../modules/errors";
import { getFailedJsend, getSuccessJsend } from "../modules/general/utils";
import { filterUserUpdateFields } from "../modules/users";
import { createOne, deleteOne, updateOne } from "./handlerFactory";

import type { UpdateMeData, User as IUser } from "./../types/users-types";
import type { RequestHandler } from "express";

const getAllUsers: RequestHandler = (req, res) => {
  res.status(500).json(getFailedJsend("error", null, ["not yet ready"]));
};

const createUser = createOne<IUser>(User);

const getUser: RequestHandler = (req, res) => {
  res.status(500).json(getFailedJsend("error", null, ["not yet ready"]));
};

const updateUser = updateOne<IUser>(User);

const deleteUser = deleteOne<IUser>(User);

const updateMe = escortAsync<RequestHandler<any, any, UpdateMeData>>(
  async function (req, res, next) {
    const receivedBody = req.body;
    if (receivedBody.password || receivedBody.confirmPassword)
      return next(
        new AppError(
          "this route is not for password updating. \n use : '/update-my-password'",
          400
        )
      );

    const fieldsToUpdate = filterUserUpdateFields(req.body, "email", "name");

    const updatedUser = await User.findByIdAndUpdate(
      (req as unknown as { user: { id: string } }).user.id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    );

    res.status(200).json(getSuccessJsend({ user: updatedUser }));
  }
);

// ________________________________________________________________________________

const deleteMe = escortAsync<RequestHandler>(async function (req, res, next) {
  await User.findByIdAndUpdate((req as any).user.id, { active: false });

  res.status(204).json(getSuccessJsend(null));
});

export {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
};
