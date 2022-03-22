import { Router } from "express";
const router = Router();

import { signUp, signIn, profile,getAllUser} from "../../controllers/user";
import { tokenValidate } from "../../helpers/user"

router.post("/signUp", signUp);
router.post("/signIn", signIn);
router.get("/", getAllUser);
router.get("/profile", tokenValidate, profile);

export default router;