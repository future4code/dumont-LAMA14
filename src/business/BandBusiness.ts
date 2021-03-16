import { BandInputDTO, BandSearchInputDTO } from "./entities/Band";
import { BandDatabase } from "../data/BandDatabase";
import { IdGenerator } from "./services/IdGenerator";
import { Authenticator } from "./services/Authenticator";
import { CustomError } from "./error/CustomError";

export class BandBusiness {

    constructor(
        private idGenerator: IdGenerator,
        private authenticator: Authenticator,
        private bandDatabase: BandDatabase
    ) { }

    async createBand(band: BandInputDTO) {

        const userToken = this.authenticator.getData(band.userToken)

        if (!userToken) {
            throw new CustomError(401, "Please log in")
        }

        if (userToken.role !== "ADMIN") {
            throw new CustomError(401, "Admin only")
        }

        if (!band.name || !band.musicGenre || !band.responsible) {
            throw new CustomError(422, "Missing input")
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

    async getBandDetails(searchInput: BandSearchInputDTO) {

        if (!searchInput.id && !searchInput.name) {
            throw new CustomError(422, "Must have a search parameter: 'id' or 'name'")
        }

        if (searchInput.id) {
            if (searchInput.name) {
                throw new CustomError(400, "Pass only one search parameter")
            }

            const bandFromDB = await this.bandDatabase.getBandById(searchInput.id)

            if (!bandFromDB) {
                throw new CustomError(422, "Band not registered")
            }

            return bandFromDB
        }

        if (searchInput.name) {
            if (searchInput.id) {
                throw new CustomError(400, "Pass only one search parameter")
            }

            const bandFromDB = await this.bandDatabase.getBandByName(searchInput.name)

            if (!bandFromDB) {
                throw new CustomError(422, "Band not registered")
            }

            return bandFromDB
        }
    }
}