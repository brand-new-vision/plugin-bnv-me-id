import { Plugin } from "@elizaos/core";
import { startupClient } from "./clients/startupClient";

export const webBnvPlugin: Plugin = {
    name: "webBnv",
    description: "A plugin for ElizaOS that generates and manages 3D avatars with customizable outfits for agent characters.",
    actions: [],
    evaluators: [],
    providers: [],
    clients: [startupClient],
};

export default webBnvPlugin;
