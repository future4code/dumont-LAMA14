import express from "express"
import { BandController } from "../BandController"

export const bandRouter = express.Router()

const bandController = new BandController()

bandRouter.post("/register", bandController.createBand)
bandRouter.get("/detail", bandController.getBandDetails)