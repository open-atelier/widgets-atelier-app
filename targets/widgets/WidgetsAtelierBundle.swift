import SwiftUI
import WidgetKit

/// Each entry here is a separate row in the iOS widget picker.
///
/// Every design ships twice: plain, where the artwork alone becomes the vibrant
/// material, and "plate", which puts `AccessoryWidgetBackground()` behind it.
/// The plate helps line art hold up over busy wallpaper and hurts bold fills,
/// and which one reads better depends on the wallpaper -- so it is a choice
/// rather than a per-design decision.
@main
struct WidgetsAtelierBundle: WidgetBundle {
    var body: some Widget {
        CatCircular()
        CatCircularPlate()
        HelloKittyFilledCircular()
        HelloKittyFilledCircularPlate()
        HelloKittyOutlineCircular()
        HelloKittyOutlineCircularPlate()
        KuromiFilledCircular()
        KuromiFilledCircularPlate()
        MyMelodyFilledCircular()
        MyMelodyFilledCircularPlate()
        MyMelodyOutlineCircular()
        MyMelodyOutlineCircularPlate()
        SparkleCircular()
        SparkleCircularPlate()
        SparklesFilledCircular()
        SparklesFilledCircularPlate()
    }
}
