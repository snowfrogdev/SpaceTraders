export function createObjectLabel(text, targetMesh, color, scene, onClickCallback) {
  const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

  const label = new BABYLON.GUI.Rectangle("label for " + text);
  label.background = color ?? "black";
  label.height = "30px";
  label.alpha = 0.9;
  label.width = "200px";
  label.cornerRadius = 4;
  label.thickness = 1;
  label.linkOffsetY = -30;
  advancedTexture.addControl(label);

  const labelText = new BABYLON.GUI.TextBlock();
  labelText.text = text;
  labelText.color = "white";
  label.addControl(labelText);

  label.linkWithMesh(targetMesh);

  // Attach shared click handler to the label
  label.onPointerClickObservable.add(() => {
    onClickCallback(label);
  });

  // Attach shared click handler to the targetMesh
  targetMesh.actionManager = new BABYLON.ActionManager(scene);
  targetMesh.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => {
      onClickCallback(label);
    })
  );
}
