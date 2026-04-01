import ExpoModulesCore
import UIKit

struct MenuActionRecord: Record {
    @Field var id: String = ""
    @Field var title: String = ""
    @Field var icon: String?
    @Field var destructive: Bool?
}

struct TabMenuConfigRecord: Record {
    @Field var tabIndex: Int = 0
    @Field var actions: [MenuActionRecord] = []
}

public class TabContextMenuModule: Module {
    private var menuDelegates: [MenuDelegate] = []
    private var addedInteractions: [UIContextMenuInteraction] = []

    public func definition() -> ModuleDefinition {
        Name("TabContextMenu")

        Events("onAction")

        Function("configure") { (configs: [TabMenuConfigRecord]) in
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                self.setupMenus(configs)
            }
        }
    }

    private func setupMenus(_ configs: [TabMenuConfigRecord]) {
        cleanup()

        guard let tabBar = findTabBar() else { return }

        // Build ordered list of all tab targets:
        // 1. Regular tabs from the main platter's ContentView
        // 2. Auxiliary view (the "+" button with role="search")
        var allTabTargets: [UIView] = []

        // Find the main platter (widest PlatterView = the one holding regular tabs)
        if let mainPlatter = tabBar.subviews
            .filter({ String(describing: type(of: $0)).contains("PlatterView") })
            .max(by: { $0.frame.width < $1.frame.width }),
           let contentView = mainPlatter.subviews
            .first(where: { String(describing: type(of: $0)).hasSuffix("ContentView") &&
                            !String(describing: type(of: $0)).contains("Selected") }) {
            allTabTargets.append(contentsOf: contentView.subviews
                .sorted { $0.frame.origin.x < $1.frame.origin.x })
        }

        // Auxiliary view (role="search" tab, rendered separately)
        if let auxiliaryView = tabBar.subviews
            .first(where: { String(describing: type(of: $0)).contains("AuxiliaryView") }) {
            allTabTargets.append(auxiliaryView)
        }

        for config in configs {
            guard config.tabIndex < allTabTargets.count else { continue }

            let target = allTabTargets[config.tabIndex]
            let actions = config.actions

            let delegate = MenuDelegate { [weak self] in
                let menuActions = actions.map { action in
                    UIAction(
                        title: action.title,
                        image: action.icon.flatMap { UIImage(systemName: $0) },
                        attributes: action.destructive == true ? .destructive : []
                    ) { _ in
                        self?.sendEvent("onAction", [
                            "actionId": action.id,
                            "tabIndex": config.tabIndex
                        ])
                    }
                }
                return UIMenu(children: menuActions)
            }

            menuDelegates.append(delegate)

            let interaction = UIContextMenuInteraction(delegate: delegate)
            target.addInteraction(interaction)
            addedInteractions.append(interaction)

            // Reduce long press duration
            if let gestureRecognizers = target.gestureRecognizers {
                for gr in gestureRecognizers {
                    if let longPress = gr as? UILongPressGestureRecognizer {
                        longPress.minimumPressDuration = 0.25
                    }
                }
            }

        }
    }

    private func cleanup() {
        for interaction in addedInteractions {
            interaction.view?.removeInteraction(interaction)
        }
        addedInteractions.removeAll()
        menuDelegates.removeAll()
    }

    private func findTabBar() -> UITabBar? {
        guard let scene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
              let window = scene.windows.first else { return nil }
        return findInView(window)
    }

    private func findInView(_ view: UIView) -> UITabBar? {
        if let tabBar = view as? UITabBar { return tabBar }
        for sub in view.subviews {
            if let found = findInView(sub) { return found }
        }
        return nil
    }


}

private class MenuDelegate: NSObject, UIContextMenuInteractionDelegate {
    let menuProvider: () -> UIMenu

    init(menuProvider: @escaping () -> UIMenu) {
        self.menuProvider = menuProvider
    }

    func contextMenuInteraction(
        _ interaction: UIContextMenuInteraction,
        configurationForMenuAtLocation location: CGPoint
    ) -> UIContextMenuConfiguration? {
        UIContextMenuConfiguration(identifier: nil, previewProvider: nil) { [weak self] _ in
            self?.menuProvider()
        }
    }

    private func makeInvisiblePreview(for interaction: UIContextMenuInteraction) -> UITargetedPreview? {
        guard let view = interaction.view, let window = view.window else { return nil }
        let center = view.superview?.convert(view.center, to: window) ?? view.center

        let dummy = UIView(frame: CGRect(x: 0, y: 0, width: 1, height: 1))
        dummy.backgroundColor = .clear
        dummy.center = center
        window.addSubview(dummy)

        let target = UIPreviewTarget(container: window, center: center)
        let params = UIPreviewParameters()
        params.backgroundColor = .clear
        return UITargetedPreview(view: dummy, parameters: params, target: target)
    }

    func contextMenuInteraction(
        _ interaction: UIContextMenuInteraction,
        previewForHighlightingMenuWithConfiguration configuration: UIContextMenuConfiguration
    ) -> UITargetedPreview? {
        makeInvisiblePreview(for: interaction)
    }

    func contextMenuInteraction(
        _ interaction: UIContextMenuInteraction,
        previewForDismissingMenuWithConfiguration configuration: UIContextMenuConfiguration
    ) -> UITargetedPreview? {
        makeInvisiblePreview(for: interaction)
    }

}
