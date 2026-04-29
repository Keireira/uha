Pod::Spec.new do |s|
  s.name           = 'AltIcon'
  s.version        = '1.0.0'
  s.summary        = 'Expo module for switching between alternate iOS app icons'
  s.description    = 'Thin wrapper around UIApplication.setAlternateIconName'
  s.author         = 'Alena Dzhukich'
  s.homepage       = 'https://github.com/Keireira/uha/tree/master/modules/alt-icon'
  s.platforms      = {
    :ios => '18.0'
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
