import { Router } from "express";
const router = Router();

import { signUp, signIn, profile,getAllUser,getOneUser,setUserRole} from "../../controllers/user";
import { tokenValidate } from "../../helpers/user"

router.post("/signUp", signUp);
router.post("/signIn", signIn);
router.get("/:idUser", getOneUser);
router.get("/", getAllUser);
router.put("/", setUserRole);
router.get("/profile", tokenValidate, profile);

export default router;