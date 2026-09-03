import SwiftUI
import WidgetKit

// Two variants of the same artwork: without the backing plate, and with it.
// Which one reads better depends on the wallpaper, so it is the user's choice.

struct CatCircular: Widget {
    let kind = "CatCircular"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: StaticProvider()) { _ in
            // padding 4 rather than the usual 8: the art is a centred face
            // whose furthest drawn point sits 30.4pt from the slot centre,
            // well inside the 36pt radius, so nothing clips. Rendering it
            // larger buys legibility this line art needs -- the thinnest
            // strokes are only a few points across.
            AccessoryArt(imageName: "cat-outline", padding: 4)
        }
        .configurationDisplayName("Cat outline")
        .description("A cat looking back at you.")
        .supportedFamilies([.accessoryCircular])
        .contentMarginsDisabled()
    }
}

struct CatCircularPlate: Widget {
    let kind = "CatCircularPlate"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: StaticProvider()) { _ in
            AccessoryArt(imageName: "cat-outline", padding: 4, showsBackground: true)
        }
        .configurationDisplayName("Cat outline, plate")
        .description("A cat looking back at you, on a backing plate.")
        .supportedFamilies([.accessoryCircular])
        .contentMarginsDisabled()
    }
}
