import SwiftUI
import WidgetKit

/// Every design renders the same way: a template-rendered vector scaled to fit
/// the accessory slot, over a clear container background.
///
/// `.containerBackground(.clear, for: .widget)` is mandatory against the iOS 17+
/// SDK — omitting it yields a blank or letterboxed widget rather than a build
/// error, so it lives here once instead of being repeated per design.
struct AccessoryArt: View {
    let imageName: String

    /// Insets the art inside the slot. Circular slots clip to a circle, so
    /// they need more breathing room than rectangular ones.
    var padding: CGFloat = 0

    /// Draws a faint backing plate behind the art. Reads well for circular
    /// designs over busy wallpaper; usually noise behind rectangular ones.
    var showsBackground: Bool = false

    @Environment(\.isLuminanceReduced) private var isLuminanceReduced

    var body: some View {
        ZStack {
            if showsBackground {
                AccessoryWidgetBackground()
            }
            Image(imageName)
                .renderingMode(.template)
                .resizable()
                .scaledToFit()
                .padding(padding)
                // Always-on display dims the screen and burns in static pixels,
                // so large solid fills are both illegible and unkind to the
                // panel. Fading the art is the cheap, family-agnostic answer.
                .opacity(isLuminanceReduced ? 0.6 : 1)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .containerBackground(.clear, for: .widget)
    }
}
