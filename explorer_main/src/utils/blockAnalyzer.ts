import { Block, db, State } from "@/db/db";
import { error } from "console";

export const sortBlocks = async () : Promise<Block[]> => {
    const data = db.blocks
        .toArray()
        .then((blocks) => {
            const sortedBlocks = blocks.sort((a, b) => {
                const aCreatedAt = a?.overview?.createdAt;
                const bCreatedAt = b?.overview?.createdAt;
                if (aCreatedAt == null && bCreatedAt == null) return 0;
                if (aCreatedAt == null) return 1;
                if (bCreatedAt == null) return -1;
                return bCreatedAt - aCreatedAt;
            });
            return sortedBlocks;
        }).catch((error) => {
            console.error("Error loading blocks from DB:", error);
            return [];
        })
    return data;
}

export const sortStates = async () : Promise<State[]>  => {
    const data =  await db.states
        .toArray()
        .then((states) => {
            const sortedStates = states.sort((a, b) => {
                const aCreatedAt = a?.overview?.createdAt;
                const bCreatedAt = b?.overview?.createdAt;
                if (aCreatedAt == null && bCreatedAt == null) return 0;
                if (aCreatedAt == null) return 1;
                if (bCreatedAt == null) return -1;
                return bCreatedAt - aCreatedAt;
            });
            return sortedStates;
        })
        .catch((error) => {
            console.error("Error loading states from DB:", error);
            return [];
        });

    return data;
}

export const filterBlocks = async(count: number) : Promise<Block[]> => {
    const sortedBlocks = await sortBlocks();
    return sortedBlocks.slice(0, count);
}

export const filterStates = async(count: number) : Promise<State[]> => {
    const sortedStates = await sortStates();
    return sortedStates.slice(0, count);
}
