import ExpoModulesCore
import WidgetKit

public class PlacedWidgetsModule: Module {
  public func definition() -> ModuleDefinition {
    Name("PlacedWidgets")

    // Resolves to [{ kind, family }] for every widget of ours the user has
    // placed, across the Lock Screen and Home Screen. `kind` matches the
    // `kind` strings in targets/widgets/Designs/.
    AsyncFunction("getPlacedWidgets") { (promise: Promise) in
      WidgetCenter.shared.getCurrentConfigurations { result in
        switch result {
        case .success(let infos):
          promise.resolve(infos.map {
            ["kind": $0.kind, "family": String(describing: $0.family)]
          })
        case .failure(let error):
          promise.reject("ERR_WIDGET_CENTER", error.localizedDescription)
        }
      }
    }
  }
}
