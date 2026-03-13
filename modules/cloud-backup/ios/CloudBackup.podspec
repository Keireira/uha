Pod::Spec.new do |s|
  s.name           = 'CloudBackup'
  s.version        = '1.0.0'
  s.summary        = 'Expo module for syncing uha data'
  s.description    = 'Syncs uha data with iCloud'
  s.author         = 'Alena Dzhukich'
  s.homepage       = 'https://github.com/Keireira/uha/tree/master/modules/cloud-backup'
  s.platforms      = {
    :ios => '17.0'
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
