import { Request, Response } from "express";
import { BandBusiness } from "../business/BandBusiness";
import { BandInputDTO } from "../business/entities/Band";
import { Authenticator } from "../business/services/Authenticator";
import { IdGenerator } from "../business/services/IdGenerator";
import { BandDatabase } from "../data/BandDatabase";

const bandBusiness = new BandBusiness(
    new IdGenerator(),
    new Authenticator(),
    new BandDatabase()
)

export class BandController {
    async createBand(req: Request, res: Response) {
        try {

            const input: BandInputDTO = {
                name: req.body.name,
                musicGenre: req.body.musicGenre,
                responsible: req.body.responsible,
                userToken: req.headers.authorization as string
            }
            
            const createdBandName = await bandBusiness.createBand(input)

            res.status(200).send(`${createdBandName} registered`)
   
        } catch (error) {
            res
            .status(error.statusCode || 400)
            .send({ error: error.message })
        }
    }
}