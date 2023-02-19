import { User } from "../../types";
/**
 * filter User Object with specific paths
 * @param obj User
 * @param fields keys of User
 * @returns User object with specific keys
 */
const filterUserUpdateFields = (obj: User, ...fields: (keyof User)[]) => {
  let resultObj: any = {};
  fields.forEach((field) => (resultObj[field] = obj[field]));
  return resultObj;
};

export { filterUserUpdateFields };
