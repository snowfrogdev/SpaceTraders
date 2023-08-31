import { ScriptMap } from "./tools";

/**
 * Defines the interface that exposes all exported scripts in this project.
 */
export interface ISceneScriptMap {
	"src/scenes/scene/camera.ts": ScriptMap;
	"src/scenes/scene/load-systems.ts": ScriptMap;
}

/**
 * Defines the map of all available scripts in the project.
 */
export const scriptsMap: ISceneScriptMap = {
	"src/scenes/scene/camera.ts": require("./scene/camera"),
	"src/scenes/scene/load-systems.ts": require("./scene/load-systems"),
}
