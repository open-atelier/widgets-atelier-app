import SwiftUI
import WidgetKit

struct HelloKittyOutlineCircular: Widget {
    let kind = "HelloKittyOutlineCircular"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: StaticProvider()) { _ in
            // padding 6: the source line work is stroked 1.2 units thicker so
            // it matches cat-outline's weight (median run 4.3pt, 6% under the
            // 3pt vibrancy threshold). Furthest drawn point is 30.0pt from
            // the slot centre, inside the 36pt radius.
            AccessoryArt(imageName: "hello-kitty-outline", padding: 6)
        }
        .configurationDisplayName("Hello Kitty outline")
        .description("Hello Kitty, line art.")
        .supportedFamilies([.accessoryCircular])
        .contentMarginsDisabled()
    }
}

struct HelloKittyOutlineCircularPlate: Widget {
    let kind = "HelloKittyOutlineCircularPlate"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: StaticProvider()) { _ in
            AccessoryArt(imageName: "hello-kitty-outline", padding: 6, showsBackground: true)
        }
        .configurationDisplayName("Hello Kitty outline, plate")
        .description("Hello Kitty, line art, on a backing plate.")
        .supportedFamilies([.accessoryCircular])
        .contentMarginsDisabled()
    }
}
