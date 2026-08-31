import SwiftUI
import WidgetKit

struct SparkleCircular: Widget {
    let kind = "SparkleCircular"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: StaticProvider()) { _ in
            AccessoryArt(imageName: "sparkle", padding: 10)
        }
        .configurationDisplayName("Sparkle")
        .description("A four-point sparkle.")
        .supportedFamilies([.accessoryCircular])
        .contentMarginsDisabled()
    }
}

struct SparkleCircularPlate: Widget {
    let kind = "SparkleCircularPlate"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: StaticProvider()) { _ in
            AccessoryArt(imageName: "sparkle", padding: 10, showsBackground: true)
        }
        .configurationDisplayName("Sparkle, plate")
        .description("A four-point sparkle, on a backing plate.")
        .supportedFamilies([.accessoryCircular])
        .contentMarginsDisabled()
    }
}
