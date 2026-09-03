import SwiftUI
import WidgetKit

struct KuromiFilledCircular: Widget {
    let kind = "KuromiFilledCircular"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: StaticProvider()) { _ in
            // padding 8: the jester ears reach 31.9pt from the slot centre
            // at this size, inside the 36pt radius.
            AccessoryArt(imageName: "kuromi-filled", padding: 8)
        }
        .configurationDisplayName("Kuromi")
        .description("Kuromi, solid fill.")
        .supportedFamilies([.accessoryCircular])
        .contentMarginsDisabled()
    }
}

struct KuromiFilledCircularPlate: Widget {
    let kind = "KuromiFilledCircularPlate"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: StaticProvider()) { _ in
            AccessoryArt(imageName: "kuromi-filled", padding: 8, showsBackground: true)
        }
        .configurationDisplayName("Kuromi, plate")
        .description("Kuromi, solid fill, on a backing plate.")
        .supportedFamilies([.accessoryCircular])
        .contentMarginsDisabled()
    }
}
