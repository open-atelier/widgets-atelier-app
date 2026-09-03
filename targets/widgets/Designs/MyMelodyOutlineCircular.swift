import SwiftUI
import WidgetKit

struct MyMelodyOutlineCircular: Widget {
    let kind = "MyMelodyOutlineCircular"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: StaticProvider()) { _ in
            // padding 7 rather than 10 like the filled variant: the line work
            // is thin and needs the extra frame. 8 would match the house
            // style, but the furthest drawn point already sits 34.3pt from
            // the slot centre here -- 6 would clip past the 36pt radius.
            AccessoryArt(imageName: "my-melody-outline", padding: 7)
        }
        .configurationDisplayName("My Melody outline")
        .description("My Melody, line art.")
        .supportedFamilies([.accessoryCircular])
        .contentMarginsDisabled()
    }
}

struct MyMelodyOutlineCircularPlate: Widget {
    let kind = "MyMelodyOutlineCircularPlate"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: StaticProvider()) { _ in
            AccessoryArt(imageName: "my-melody-outline", padding: 7, showsBackground: true)
        }
        .configurationDisplayName("My Melody outline, plate")
        .description("My Melody, line art, on a backing plate.")
        .supportedFamilies([.accessoryCircular])
        .contentMarginsDisabled()
    }
}
