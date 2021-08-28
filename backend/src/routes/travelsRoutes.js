const express = require("express");
const router = express.Router();

const controller = require("../controllers/travelsControllers");

router.get("/travels", controller.getAllTravels);
router.get("/travels/:id", controller.getTravelById);

router.post("/travels/:id/passenger/create", controller.createPeople);
router.delete("/passenger/:id/delete", controller.deletePeople);
router.put("/passenger/:id/update", controller.updatePeople);
router.patch("/passenger/:id/updateName", controller.updateName);
router.delete("/travels/:id/delete", controller.deleteTravel);



module.exports = router