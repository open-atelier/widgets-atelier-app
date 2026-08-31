import WidgetKit

/// The widgets are decorative and never change, so the timeline carries no
/// data beyond the date `TimelineEntry` requires.
struct StaticEntry: TimelineEntry {
    let date: Date = .now
}

struct StaticProvider: TimelineProvider {
    func placeholder(in context: Context) -> StaticEntry { StaticEntry() }

    func getSnapshot(in context: Context, completion: @escaping (StaticEntry) -> Void) {
        completion(StaticEntry())
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<StaticEntry>) -> Void) {
        // Static art: render once, never refresh. `.never` keeps the widget out
        // of the system's refresh budget entirely.
        completion(Timeline(entries: [StaticEntry()], policy: .never))
    }
}
