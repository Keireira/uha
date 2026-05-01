Pod::Spec.new do |s|
  s.name           = 'SwipeActions'
  s.version        = '1.0.0'
  s.summary        = 'Custom @expo/ui/swift-ui modifier for SwiftUI swipeActions'
  s.description    = 'Registers a swipeActions ViewModifier in ExpoUI ViewModifierRegistry, exposing iconOnly swipe action buttons.'
  s.author         = 'Alena Dzhukich'
  s.homepage       = 'https://github.com/Keireira/uha/tree/master/modules/swipe-actions'
  s.platforms      = {
    :ios => '18.0'
  }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'
  s.dependency 'ExpoUI'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
