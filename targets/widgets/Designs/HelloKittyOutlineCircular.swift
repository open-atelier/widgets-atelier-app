import SwiftUI
import WidgetKit

struct HelloKittyOutlineCircular: Widget {
    let kind = "HelloKittyOutlineCircular"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: StaticProvider()) { _ in
            // padding 2 rather than the usual 8: the line work is thin
            // (median run barely 3pt at this size) and needs every point of
            // frame it can get. Furthest drawn point is 33.2pt from the slot
            // centre, still inside the 36pt radius.
            AccessoryArt(imageName: "hello-kitty-outline", padding: 2)
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
            AccessoryArt(imageName: "hello-kitty-outline", padding: 2, showsBackground: true)
        }
        .configurationDisplayName("Hello Kitty outline, plate")
        .description("Hello Kitty, line art, on a backing plate.")
        .supportedFamilies([.accessoryCircular])
        .contentMarginsDisabled()
    }
}
