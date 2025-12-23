import ActitoKit

class ActitoGeoPluginEventBroker {

    typealias Consumer = (_ event: Event) -> Void

    private static var eventQueue = [Event]()
    private static var consumer: Consumer?
    private static var canEmitEvents = false

    @MainActor
    static func startListening(holdEventsUntilReady: Bool, _ consumer: @escaping Consumer) {
        self.consumer = consumer
        canEmitEvents = !holdEventsUntilReady || Actito.shared.isReady

        if (!canEmitEvents) {
            NotificationCenter.default.addObserver(self, selector: #selector(self.onActitoReady), name: Notification.Name("com.actito.cordova.on_ready"), object: nil)
            return
        }

        processQueue()
    }

    static func dispatchEvent(name: String, payload: Any?) {
        let event = Event(name: name, payload: payload)

        if let consumer = consumer, canEmitEvents {
            consumer(event)
            return
        }

        eventQueue.append(event)
    }

    static private func processQueue() {
        guard let consumer = consumer else {
            logger.debug("Cannot process event queue without a consumer.")
            return
        }

        guard !eventQueue.isEmpty else { return }

        logger.debug("Processing event queue with ${eventQueue.size} items.")
        eventQueue.forEach { consumer($0) }
        eventQueue.removeAll()
    }

    @objc static func onActitoReady() {
        NotificationCenter.default.removeObserver(self)

        canEmitEvents = true
        processQueue()
    }

    private init() {}

    struct Event {
        let name: String
        let payload: Any?
    }
}
