import SwiftUI
import WidgetKit

struct SparklesFilledCircular: Widget {
    let kind = "SparklesFilledCircular"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: StaticProvider()) { _ in
            // padding 10: the small companion stars sit near the viewBox
            // corners -- the furthest reaches 31.4pt from the slot centre at
            // this size, inside the 36pt radius.
            AccessoryArt(imageName: "sparkles-filled", padding: 10)
        }
        .configurationDisplayName("Sparkles")
        .description("Three rounded sparkles.")
        .supportedFamilies([.accessoryCircular])
        .contentMarginsDisabled()
    }
}

struct SparklesFilledCircularPlate: Widget {
    let kind = "SparklesFilledCircularPlate"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: StaticProvider()) { _ in
            AccessoryArt(imageName: "sparkles-filled", padding: 10, showsBackground: true)
        }
        .configurationDisplayName("Sparkles, plate")
        .description("Three rounded sparkles, on a backing plate.")
        .supportedFamilies([.accessoryCircular])
        .contentMarginsDisabled()
    }
}
