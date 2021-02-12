import { BandInputDTO } from "./entities/Band";
import { BandDatabase } from "../data/BandDatabase";
import { IdGenerator } from "./services/IdGenerator";
import { Authenticator } from "./services/Authenticator";
import { CustomError } from "./error/CustomError";

export class BandBusiness {

    constructor(
        private idGenerator: IdGenerator,
        private authenticator: Authenticator,
        private bandDatabase: BandDatabase
    ) {}

    async createBand(band: BandInputDTO) {

        const userToken = this.authenticator.getData(band.userToken)

        if (!userToken) {
            throw new CustomError(401, "Please log in")
        }

        if (userToken.role !== "ADMIN") {
            throw new CustomError(401, "Admin only")
        }

        const id = this.idGenerator.generate()

        await this.bandDatabase.createBand(
            id,
            band.name,
            band.musicGenre,
            band.responsible
        )

        return band.name

    }
}