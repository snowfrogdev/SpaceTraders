export function createObjectLabel(text, targetMesh) {
  const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

  const label = new BABYLON.GUI.Rectangle("label for " + text);
  label.background = "black";
  label.height = "30px";
  label.alpha = 0.5;
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
}
