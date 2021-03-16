import { CustomError } from "../business/error/CustomError"
import { BaseDatabase } from "./BaseDatabase"

export class BandDatabase extends BaseDatabase {

    private static TABLE_NAME = "LAMA_BANDS"

    public async createBand(
        id: string,
        name: string,
        music_genre: string,
        responsible: string
    ): Promise<void> {
        try {
            await BaseDatabase.connection
                .insert({
                    id,
                    name,
                    music_genre,
                    responsible
                })
                .into(BandDatabase.TABLE_NAME)
        } catch (error) {
            throw new CustomError(500, "An unexpected error ocurred")
        }
    }

    public async getBandById(id: string) {
        try {
            const result = await BaseDatabase.connection
                .select("*")
                .from(BandDatabase.TABLE_NAME)
                .where({ id })
            return result[0]
        } catch (error) {
            throw new CustomError(500, "An unexpected error ocurred")
        }
    }

    public async getBandByName(name: string) {
        try {
            const result = await BaseDatabase.connection
                .select("*")
                .from(BandDatabase.TABLE_NAME)
                .where({ name })
            return result[0]
        } catch (error) {
            throw new CustomError(500, "An unexpected error ocurred")
        }
    }
}