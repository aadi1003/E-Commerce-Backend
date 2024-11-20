import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";
//middleware to make sure only admin is allowed
export const adminOnly = TryCatch(async (req, res, next) => {
    const { id } = req.query;
    if (!id)
        return next(new ErrorHandler("Bro Login kar Pehle", 401));
    const user = await User.findById(id);
    if (!user)
        return next(new ErrorHandler("Bro Fake Id deta he", 401));
    if (user.role != "admin")
        return next(new ErrorHandler("Bro Aukat nahi he teri", 401));
    next();
});
