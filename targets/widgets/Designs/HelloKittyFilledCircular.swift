import SwiftUI
import WidgetKit

struct HelloKittyFilledCircular: Widget {
    let kind = "HelloKittyFilledCircular"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: StaticProvider()) { _ in
            // padding 4: the head is wide but round-cornered -- the furthest
            // drawn point sits 31.5pt from the slot centre at this size,
            // inside the 36pt radius.
            AccessoryArt(imageName: "hello-kitty-filled", padding: 4)
        }
        .configurationDisplayName("Hello Kitty filled")
        .description("Hello Kitty, solid fill.")
        .supportedFamilies([.accessoryCircular])
        .contentMarginsDisabled()
    }
}

struct HelloKittyFilledCircularPlate: Widget {
    let kind = "HelloKittyFilledCircularPlate"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: StaticProvider()) { _ in
            AccessoryArt(imageName: "hello-kitty-filled", padding: 4, showsBackground: true)
        }
        .configurationDisplayName("Hello Kitty filled, plate")
        .description("Hello Kitty, solid fill, on a backing plate.")
        .supportedFamilies([.accessoryCircular])
        .contentMarginsDisabled()
    }
}
