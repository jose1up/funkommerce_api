import { Router } from "express";
import productRoute from "./product";
import brandRoute from "./brand";
import categoryRouter from "./category"
import orderRouter from "./order";
// import userRoute from "./user";
import licenseRoute from "./license"
import checkoutRoute from "./checkout"

const router = Router();

router.use("/product", productRoute);
router.use("/brand", brandRoute);
router.use("/category", categoryRouter);
router.use("/order", orderRouter);
// router.use("/user", userRoute);
router.use("/license", licenseRoute)
router.use("/checkout", checkoutRoute)


export default router;
