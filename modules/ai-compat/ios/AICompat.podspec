Pod::Spec.new do |s|
  s.name           = 'AICompat'
  s.version        = '1.0.0'
  s.summary        = 'Expo module for checking Apple Intelligence compatibility'
  s.description    = 'Checks if the device supports Apple Intelligence (iOS 18.1+)'
  s.author         = 'Alena Dzhukich'
  s.homepage       = 'https://github.com/Keireira/uha/tree/master/modules/ai-compat'
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
