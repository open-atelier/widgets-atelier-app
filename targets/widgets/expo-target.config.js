/** @type {import('@bacons/apple-targets/app.plugin').Config} */
module.exports = {
  type: "widget",
  name: "WidgetsAtelierWidgets",
  displayName: "Widgets Atelier",

  // A leading dot means "append to the host app's bundle identifier", resolved
  // by the plugin at prebuild time, giving openatelier.widgets.widgets. The
  // repetition is only cosmetic; what matters is that an app extension's id
  // MUST be a prefixed child of its host app's, and CI rewrites app.json to
  // namespace the app id (gh.openatelier.widgets) so its builds install
  // alongside local ones. Deriving keeps the pair in sync; hardcoding
  // desynchronises them and the widget then silently never appears in the
  // picker.
  bundleIdentifier: ".widgets",

  // Match the host app. The plugin otherwise defaults targets to iOS 18.
  deploymentTarget: "17.0",

  frameworks: ["SwiftUI", "WidgetKit"],

  // NO entitlements block, and no *.entitlements file in this directory.
  // Free personal teams cannot provision App Groups, push, or associated
  // domains, and any entitlement here breaks re-signing at sideload time.
  // The widgets are fully static, so nothing needs to cross the process
  // boundary and no entitlement is required.
};
