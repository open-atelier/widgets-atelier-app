import SwiftUI
import WidgetKit

struct MyMelodyOutlineCircular: Widget {
    let kind = "MyMelodyOutlineCircular"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: StaticProvider()) { _ in
            // padding 11: the source line work is stroked 0.8 units thicker
            // so it matches cat-outline's weight (median run 4.4pt, 3% under
            // the 3pt vibrancy threshold), which also pushes the furthest
            // drawn point out -- 30.4pt from the slot centre at this size.
            AccessoryArt(imageName: "my-melody-outline", padding: 11)
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
            AccessoryArt(imageName: "my-melody-outline", padding: 11, showsBackground: true)
        }
        .configurationDisplayName("My Melody outline, plate")
        .description("My Melody, line art, on a backing plate.")
        .supportedFamilies([.accessoryCircular])
        .contentMarginsDisabled()
    }
}
