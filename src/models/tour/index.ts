import mongoose from "mongoose";
import tourSchema from "./schema";
import type { Tour } from "../../types";
export default mongoose.model<Tour>("Tour", tourSchema);
