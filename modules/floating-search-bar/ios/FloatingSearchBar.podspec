Pod::Spec.new do |s|
  s.name           = 'FloatingSearchBar'
  s.version        = '1.0.0'
  s.summary        = 'Floating overlay search bar using native SwiftUI TextField'
  s.description    = 'Renders a SwiftUI TextField via UIHostingController on the key window for overlay search'
  s.author         = 'Alena Dzhukich'
  s.homepage       = 'https://github.com/Keireira/uha/tree/master/modules/floating-search-bar'
  s.platforms      = {
    :ios => '15.1',
    :tvos => '15.1'
  }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
