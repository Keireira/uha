Pod::Spec.new do |s|
  s.name           = 'TabContextMenu'
  s.version        = '1.0.0'
  s.summary        = 'Module so we can use longPress on navbar'
  s.description    = 'Module so we can use longPress on navbar'
  s.author         = 'Alena Dzhukich'
  s.homepage       = 'https://github.com/Keireira/uha/tree/master/modules/tab-context-menu'
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
