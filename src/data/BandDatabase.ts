import { CustomError } from "../business/error/CustomError";
import { BaseDatabase } from "./BaseDatabase";

export class BandDatabase extends BaseDatabase {

    private static TABLE_NAME = "LAMA_BANDS"

    public async createBand(
        id: string,
        name: string,
        musicGenre: string,
        responsible: string
    ): Promise<void> {
        try {
            await BaseDatabase.connection
                .insert({
                    id,
                    name,
                    musicGenre,
                    responsible
                })
                .into(BandDatabase.TABLE_NAME)
        } catch (error) {
            throw new CustomError(500, "An unexpected error ocurred")
        }
    }
}