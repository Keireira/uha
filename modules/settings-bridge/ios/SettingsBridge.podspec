Pod::Spec.new do |s|
  s.name           = 'SettingsBridge'
  s.version        = '1.0.0'
  s.summary        = 'Expo module for accessing iOS system settings'
  s.description    = 'Provides native bridge to access iOS system settings and listen for changes from UserDefaults'
  s.author         = 'Alena Dzhukich'
  s.homepage       = 'https://github.com/Keireira/uha/tree/master/modules/settings-bridge'
  s.platforms      = {
    :ios => '15.1',
    :tvos => '15.1'
  }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
