import SwiftUI
import WidgetKit

struct MyMelodyFilledCircular: Widget {
    let kind = "MyMelodyFilledCircular"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: StaticProvider()) { _ in
            // padding 10: the hood is tightly cropped in its viewBox -- the
            // furthest drawn point is 30.7pt from the slot centre at this
            // size, inside the 36pt radius.
            AccessoryArt(imageName: "my-melody-filled", padding: 10)
        }
        .configurationDisplayName("My Melody filled")
        .description("My Melody, solid fill.")
        .supportedFamilies([.accessoryCircular])
        .contentMarginsDisabled()
    }
}

struct MyMelodyFilledCircularPlate: Widget {
    let kind = "MyMelodyFilledCircularPlate"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: StaticProvider()) { _ in
            AccessoryArt(imageName: "my-melody-filled", padding: 10, showsBackground: true)
        }
        .configurationDisplayName("My Melody filled, plate")
        .description("My Melody, solid fill, on a backing plate.")
        .supportedFamilies([.accessoryCircular])
        .contentMarginsDisabled()
    }
}
