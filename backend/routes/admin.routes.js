import { Router } from "express"
import { activeCheck, deleteUser, editUser, getUsers } from "../controllers/admin.controller.js"
import verifyToken from "../middleware/authMiddleware.js"



const router = Router()

router.route("/").get(activeCheck)
router.route("/get_users").get(verifyToken,getUsers)
router.route("/edit_user/:id").put(verifyToken,editUser);
router.route("/delete_user/:id").delete(verifyToken,deleteUser)

export default router;